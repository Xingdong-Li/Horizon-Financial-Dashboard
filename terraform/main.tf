provider "aws" {
  region     = var.REGION
  # access_key = var.AWS_ACCESS_KEY_ID
  # secret_key = var.AWS_SECRET_KEY
}

#---------------------------------------------
# IAM Role for Lambda
resource "aws_iam_role" "lambda_execution_role" {
  name = "plaid_lambda_execution_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

#---------------------------------------------
# IAM Policy for Lambda
resource "aws_iam_policy" "lambda_policy" {
  name        = "plaid_lambda_policy"
  description = "IAM policy for Lambda function to access necessary AWS services"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Effect   = "Allow"
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

# Attach IAM Policy to Role
resource "aws_iam_role_policy_attachment" "lambda_policy_attachment" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = aws_iam_policy.lambda_policy.arn
}

#---------------------------------------------
# IAM Policy for lambda function to access DynamoDB and KMS
resource "aws_iam_policy" "bank_account_lambda_policy" {
  name        = "bank_account_lambda_policy"
  description = "IAM policy for Lambda function to access DynamoDB and KMS"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Effect   = "Allow"
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Action = [
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:GetItem"
        ]
        Effect   = "Allow"
        Resource = "arn:aws:dynamodb:${var.REGION}:*:table/${var.DYNAMODB_TABLE_NAME_BANK_ACCOUNT}"
      },
      {
        Action = [
          "kms:Encrypt",
          "kms:Decrypt"
        ]
        Effect   = "Allow"
        Resource = aws_kms_key.bank_account_key.arn
      }
    ]
  })
}

# Attach the new policy to the existing Lambda execution role
resource "aws_iam_role_policy_attachment" "bank_account_lambda_policy_attachment" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = aws_iam_policy.bank_account_lambda_policy.arn
}

#---------------------------------------------
resource "aws_kms_key" "bank_account_key" {
  description = "KMS key for encrypting bank account data"
}

resource "aws_kms_alias" "bank_account_alias" {
  name          = "alias/bankAccountKey"
  target_key_id = aws_kms_key.bank_account_key.id
}

#---------------------------------------------
# New BankAccountOperation Lambda function
module "bank_account_lambda_function" {
  source        = "./modules/lambda_bank_account"
  function_name = "BankAccountOperationLambda"
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  role_arn      = aws_iam_role.lambda_execution_role.arn
  filename      = "bankAccountOperationLambda.zip"
  environment_variables = {
    REGION              = var.REGION
    DYNAMODB_TABLE_NAME = aws_dynamodb_table.bank_accounts.name
    KMS_KEY_ARN         = aws_kms_key.bank_account_key.id
  }
}
# BankAccountOperation API Gateway with save route
module "bank_account_api_gateway" {
  source     = "./modules/api_gateway"
  api_name   = "BankAccountOperationAPI"
  lambda_arn = module.bank_account_lambda_function.lambda_arn
  stage_name = "dev"
  region     = "us-east-1"
  routes = [
    {
      route_key = "GET /retrieve"
    },
    {
      route_key = "POST /save"
    }
  ]
}

#---------------------------------------------
# Lambda function for Plaid Link Token
module "plaid_lambda_function" {
  source        = "./modules/lambda"
  function_name = "PlaidLinkTokenFunction"
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  role_arn      = aws_iam_role.lambda_execution_role.arn
  filename      = "createLinkTokenLambda.zip"
  environment_variables = {
    PLAID_CLIENT_ID = var.PLAID_CLIENT_ID
    PLAID_SECRET    = var.PLAID_SECRET
  }
}

# PlaidLinkToken API Gateway with create-link-token and exchange-public-token routes
module "plaid_api_gateway" {
  source     = "./modules/api_gateway"
  api_name   = "PlaidLinkTokenAPI"
  lambda_arn = module.plaid_lambda_function.lambda_arn
  stage_name = "dev"
  region     = "us-east-1"
  routes = [
    {
      route_key = "POST /create-link-token"
    },
    {
      route_key = "POST /exchange-public-token"
    }
  ]
}

#---------------------------------------------
# DynamoDB Table for Bank Account Data
resource "aws_dynamodb_table" "bank_accounts" {
  name         = var.DYNAMODB_TABLE_NAME_BANK_ACCOUNT
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "userId"

  attribute {
    name = "userId"
    type = "S"
  }

  tags = {
    Environment = "dev"
  }
}

resource "local_file" "env_file" {
  filename = "../.env"
  content  = "${fileexists("../.env") ? file("../.env") : ""}\n\nVITE_PLAID_LINK_TOKEN_URL=${module.plaid_api_gateway.api_url}\nVITE_BANK_ACCOUNT_OPERATION_URL=${module.bank_account_api_gateway.api_url}\n"
}







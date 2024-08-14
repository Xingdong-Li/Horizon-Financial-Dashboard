variable "DYNAMODB_TABLE_NAME_BANK_ACCOUNT" {
  description = "The name of the DynamoDB table"
  type        = string
}

variable "PLAID_CLIENT_ID" {
  description = "The client id for Plaid API"
  type        = string
}

variable "PLAID_SECRET" {
  description = "The secret key for Plaid API"
  type        = string
}

variable "REGION" {
  description = "The AWS region"
  type        = string
}

variable "AWS_ACCESS_KEY_ID" {
  description = "The AWS access key id"
  type        = string
}

variable "AWS_SECRET_KEY" {
  description = "The AWS secret key"
  type        = string
}

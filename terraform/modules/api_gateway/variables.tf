variable "api_name" {
  description = "The name of the API Gateway"
  type        = string
}

variable "routes" {
  description = "List of routes to create in the API Gateway"
  type = list(object({
    route_key = string
  }))
}

variable "lambda_arn" {
  description = "The ARN of the Lambda function to integrate with the API Gateway"
  type        = string
}

variable "stage_name" {
  description = "The name of the deployment stage"
  type        = string
}

variable "region" {
  description = "The AWS region"
  type        = string
}

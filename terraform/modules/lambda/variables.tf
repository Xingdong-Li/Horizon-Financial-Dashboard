variable "function_name" {
  description = "The name of the Lambda function"
  type        = string
}

variable "handler" {
  description = "The function entrypoint in the code"
  type        = string
}

variable "runtime" {
  description = "The runtime environment for the Lambda function"
  type        = string
}

variable "role_arn" {
  description = "The ARN of the IAM role that the Lambda function will use"
  type        = string
}

variable "filename" {
  description = "Path to the deployment package"
  type        = string
}

variable "environment_variables" {
  description = "Environment variables to pass to the Lambda function"
  type        = map(string)
  default     = {}
}

variable "api_gateway_source_arn" {
  description = "The ARN of the API Gateway that can invoke the Lambda function"
  type        = string
  default     = null
}





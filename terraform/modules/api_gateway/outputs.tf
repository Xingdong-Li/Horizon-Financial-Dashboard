output "api_url" {
  description = "The URL of the deployed API Gateway"
  value       = aws_apigatewayv2_stage.stage.invoke_url
}

output "api_id" {
  description = "The ID of the API Gateway"
  value       = aws_apigatewayv2_api.this.id
}


resource "aws_apigatewayv2_api" "this" {
  name          = var.api_name
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]            # Allow all origins
    allow_methods = ["GET", "POST", "OPTIONS", "PUT", "DELETE"]  # Allowed HTTP methods
    allow_headers = ["*"]            # Allow all headers
    expose_headers = ["*"]           # Expose all headers
    max_age       = 3600             # Cache the preflight response for 1 hour
  }
}


resource "aws_apigatewayv2_stage" "stage" {
  api_id      = aws_apigatewayv2_api.this.id
  name        = var.stage_name
  auto_deploy = true
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id           = aws_apigatewayv2_api.this.id
  integration_type = "AWS_PROXY"
  integration_uri  = "arn:aws:apigateway:${var.region}:lambda:path/2015-03-31/functions/${var.lambda_arn}/invocations"
  payload_format_version = "2.0"
}

# Conditionally create routes based on the provided route configuration
resource "aws_apigatewayv2_route" "routes" {
  count     = length(var.routes)
  api_id    = aws_apigatewayv2_api.this.id
  route_key = var.routes[count.index].route_key

  target = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

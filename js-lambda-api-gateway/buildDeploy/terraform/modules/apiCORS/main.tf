variable "enable_CORS" {
  type = bool
}

variable "allowed_methods" {
  type    = list(string)
  default = ["GET"]
}

variable "api_id" {
  type = string
}

variable "resource_id" {
  type = string
}

variable "allowed_headers" {
  type    = list(string)
  default = []
}

resource "aws_api_gateway_method" "options" {
  count         = var.enable_CORS ? 1 : 0
  rest_api_id   = var.api_id
  resource_id   = var.resource_id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "options" {
  count       = var.enable_CORS ? 1 : 0
  rest_api_id = var.api_id
  resource_id = var.resource_id
  http_method = aws_api_gateway_method.options[0].http_method
  type        = "MOCK"
  request_templates = {
    "application/json" = "{\"statusCode\":200}"
  }
  passthrough_behavior = "NEVER"
}

resource "aws_api_gateway_method_response" "options" {
  count       = var.enable_CORS ? 1 : 0
  rest_api_id = var.api_id
  resource_id = var.resource_id
  http_method = aws_api_gateway_method.options[0].http_method
  status_code = 200
  response_models = {
    "application/json" = "Empty"
  }
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "options" {
  count       = var.enable_CORS ? 1 : 0
  rest_api_id = var.api_id
  resource_id = var.resource_id
  http_method = aws_api_gateway_method.options[0].http_method
  status_code = aws_api_gateway_method_response.options[0].status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token%{for header in var.allowed_headers},${header}%{endfor}'"
    "method.response.header.Access-Control-Allow-Methods" = "'OPTIONS%{for method in var.allowed_methods},${method}%{endfor}'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
}

output "cors_method" {
  value = {
    id          = var.enable_CORS ? aws_api_gateway_method.options.id : ""
    http_method = var.enable_CORS ? aws_api_gateway_method.options.http_method : ""
  }
}

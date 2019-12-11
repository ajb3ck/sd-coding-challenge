variable "api_id" {
  type = string
}

variable "resource_path" {
  type = string
}

variable "http_methods" {
  type    = list(string)
  default = ["GET"]
}

variable "enable_cors" {
  type    = bool
  default = true
}

variable "lambda_function_name" {
  type = string
}

data "aws_lambda_function" "lambda" {
  function_name = var.lambda_function_name
}

data "aws_caller_identity" "current" {

}

data "aws_region" "current" {

}

data "aws_api_gateway_resource" "resource" {
  rest_api_id = var.api_id
  path        = var.resource_path
}

resource "aws_api_gateway_method" "method" {
  count         = length(var.http_methods)
  rest_api_id   = var.api_id
  resource_id   = data.aws_api_gateway_resource.resource.id
  http_method   = var.http_methods[count.index]
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "integration" {
  count                   = length(var.http_methods)
  rest_api_id             = var.api_id
  resource_id             = data.aws_api_gateway_resource.resource.id
  http_method             = aws_api_gateway_method.method[count.index].http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = data.aws_lambda_function.lambda.invoke_arn
}

resource "aws_lambda_permission" "apigw_permission" {
  count         = length(var.http_methods)
  function_name = data.aws_lambda_function.lambda.function_name
  statement_id  = "Allow${aws_api_gateway_method.method[count.index].http_method}"
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:${var.api_id}/*/${aws_api_gateway_method.method[count.index].http_method}${data.aws_api_gateway_resource.resource.path}"
}

module "CORS" {
  source          = "../apiCORS"
  api_id          = var.api_id
  resource_id     = data.aws_api_gateway_resource.resource.id
  enable_CORS     = var.enable_cors
  allowed_methods = var.http_methods
}

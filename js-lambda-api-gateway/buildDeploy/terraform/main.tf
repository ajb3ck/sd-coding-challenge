provider "aws" {
  version = "~> 2.41"
  region  = "us-east-1"
}

locals {
  launchpadsLambda = {
    filename = "../lambdaPackages/launchpads/dist.zip"
  }
}

data "aws_caller_identity" "current" {}

data "aws_iam_policy" "lambda_basic_exec" {
  arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

data "aws_iam_policy_document" "lambda_assume_role" {
  version = "2012-10-17"
  statement {
    sid     = ""
    actions = ["sts:AssumeRole"]
    effect  = "Allow"
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "xray_lambda_exec" {
  version = "2012-10-17"
  statement {
    sid       = "BasicXray"
    actions   = ["xray:PutTelemetryRecords", "xray:PutTraceSegments"]
    effect    = "Allow"
    resources = ["*"]
  }
}

resource "aws_iam_policy" "xray_lambda_exec" {
  name   = "LambdaXRayExecution"
  policy = data.aws_iam_policy_document.xray_lambda_exec.json
}

resource "aws_iam_role" "lambda_basic_exec" {
  name               = "LambdaBasicExecution"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

resource "aws_iam_role_policy_attachment" "lambda_basic_exec" {
  role       = aws_iam_role.lambda_basic_exec.name
  policy_arn = data.aws_iam_policy.lambda_basic_exec.arn
}

resource "aws_iam_role_policy_attachment" "lambda_xray" {
  role       = aws_iam_role.lambda_basic_exec.name
  policy_arn = aws_iam_policy.xray_lambda_exec.arn
}

resource "aws_lambda_function" "launchpads" {
  function_name    = "sd_launchpads"
  filename         = local.launchpadsLambda["filename"]
  role             = aws_iam_role.lambda_basic_exec.arn
  handler          = "main.handler"
  source_code_hash = filebase64sha256(local.launchpadsLambda["filename"])
  runtime          = "nodejs12.x"
  memory_size      = "256"
  timeout          = "10"
  tracing_config {
    mode = "Active"
  }
  depends_on = ["aws_iam_role_policy_attachment.lambda_xray"]
}

resource "aws_api_gateway_rest_api" "api" {
  name        = "SpaceXProxy"
  description = "SpaceX Launchpads Proxy API"
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_resource" "launchpads" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "launchpads"
}

module "GET_launchpads" {
  source               = "./modules/apiLambdaProxy"
  api_id               = aws_api_gateway_rest_api.api.id
  resource_path        = aws_api_gateway_resource.launchpads.path
  lambda_function_name = aws_lambda_function.launchpads.function_name
}

resource "random_id" "deployment_id" {
  keepers = {
    date = timestamp()
  }

  byte_length = 4
}

resource "aws_api_gateway_deployment" "auto" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  description = "Auto Deployment ${random_id.deployment_id.hex}"
  depends_on  = ["module.GET_launchpads"]
}

resource "aws_api_gateway_stage" "liveStage" {
  rest_api_id          = aws_api_gateway_rest_api.api.id
  stage_name           = "live"
  deployment_id        = aws_api_gateway_deployment.auto.id
  xray_tracing_enabled = true
  depends_on           = ["aws_cloudwatch_log_group.api_exec_logs"]
}

resource "aws_cloudwatch_log_group" "api_exec_logs" {
  name              = "API-Gateway-Execution-Logs_${aws_api_gateway_rest_api.api.id}/live"
  retention_in_days = 3
}

resource "aws_api_gateway_method_settings" "liveStage" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  stage_name  = aws_api_gateway_stage.liveStage.stage_name
  method_path = "*/*"

  settings {
    metrics_enabled = true
    logging_level   = "INFO"
  }
}

module "custom_domain" {
  source      = "./modules/customDomain"
  enabled     = var.enable_custom_domain
  base_domain = var.base_domain
  sub_domain  = var.sub_domain
  api_id      = aws_api_gateway_rest_api.api.id
}

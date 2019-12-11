variable "enabled" {
  type    = bool
  default = false
}

variable "base_domain" {
  type = string
}

variable "sub_domain" {
  type = string
}

variable "api_id" {
  type = string
}

variable "stage_name" {
  type    = string
  default = "live"
}

data "aws_route53_zone" "base_domain" {
  count = var.enabled ? 1 : 0
  name  = "${var.base_domain}."
}

data "aws_acm_certificate" "wildcard" {
  count  = var.enabled ? 1 : 0
  domain = "*.${var.base_domain}"
}

resource "aws_api_gateway_domain_name" "custom" {
  count                    = var.enabled ? 1 : 0
  regional_certificate_arn = data.aws_acm_certificate.wildcard[0].arn
  domain_name              = "${var.sub_domain}.${var.base_domain}"
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_base_path_mapping" "custom" {
  count       = var.enabled ? 1 : 0
  domain_name = aws_api_gateway_domain_name.custom[0].domain_name
  api_id      = var.api_id
  stage_name  = var.stage_name
}

resource "aws_route53_record" "custom" {
  count   = var.enabled ? 1 : 0
  name    = aws_api_gateway_domain_name.custom[0].domain_name
  type    = "A"
  zone_id = data.aws_route53_zone.base_domain[0].zone_id
  alias {
    evaluate_target_health = true
    name                   = aws_api_gateway_domain_name.custom[0].regional_domain_name
    zone_id                = aws_api_gateway_domain_name.custom[0].regional_zone_id
  }
}

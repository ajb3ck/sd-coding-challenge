# Smile Direct Coding Challenge

Various Solutions for a coding challenge.

# Documentation for Each Solution

## API Gateway -> Lambda Pattern

This pattern uses an API Gateway and sends inbound requests to a single lambda function.

Demo API Base URL: https://sd-demo.616a.systems

### Project Structure

- Base Path: `./js-lambda-api-gateway`
- Terraform Path: `./js-lambda-api-gateway/buildDeploy/terraform`
- Lambda Path: `./js-lambda-api-gateway/lambdas/launchpads`

### API Usage

#### GET /launchpads

**Query Parameters**

Query Parameters can be used to filter the Launchpads returned by the API.

| Key        | Required | Possible Values | Description                                                                               |
| ---------- | -------- | --------------- | ----------------------------------------------------------------------------------------- |
| `match`    | No       | `any` or `all`  | Defaults to `all` is used to determine if one or all of the filter conditions must be met |
| `status`   | No       | Any String      | The Launchpads returned are filtered by Launchpad Status                                  |
| `fullName` | No       | Any String      | The Launchpads returned are filtered by Launchpad Name                                    |
| `id`       | No       | Any String      | The Launchpads are filtered by Launchpad Id                                               |

### Deploy it yourself

**Prerequisites**

- BASH Shell (Scripts Tested on macOS)
- Terraform 0.12.x
- AWS Account Credentials Configured

1. Initialize AWS Credentials for use with Terraform
2. Execute the script `./js-lambda-api-gateway/buildDeploy/buildDeploy.sh`
   - This will execute lambda tests, build the lambda function, and execute Terraform Apply

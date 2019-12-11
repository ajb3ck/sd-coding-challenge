# Smile Direct Coding Challenge

Various Solutions for a coding challenge.

# Documentation for Each Solution

## API Gateway -> Lambda Pattern

This pattern uses an API Gateway and sends inbound requests to a single lambda function. Cloudwatch is used to collect logs. The API Gateway has Execution Logging turned on. It is set to log out INFO level and above messages. By default the Lambda Function will output log messages WARNING and above. An optional header is available to change this for debugging purposes.

Demo API Base URL: https://sd-demo.616a.systems

**Sample Request**

_Note: CLI http tool here: https://httpie.org_

```bash
http GET "https://sd-demo.616a.systems/launchpads?status=active"
```

**Sample Response**

```
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 406
Content-Type: application/json
Date: Wed, 11 Dec 2019 13:54:43 GMT
X-Amzn-Trace-Id: Root=1-5df0f523-92d491c7780655d2572a4565
x-amz-apigw-id: Eis9jH_oIAMFjSQ=
x-amzn-RequestId: 61c5e9ab-5e26-4646-aa8a-55ba286badbb

{
    "Launchpads": [
        {
            "Launchpad Id": "vafb_slc_4e",
            "Launchpad Name": "Vandenberg Air Force Base Space Launch Complex 4E",
            "Launchpad Status": "active"
        },
        {
            "Launchpad Id": "ccafs_slc_40",
            "Launchpad Name": "Cape Canaveral Air Force Station Space Launch Complex 40",
            "Launchpad Status": "active"
        },
        {
            "Launchpad Id": "ksc_lc_39a",
            "Launchpad Name": "Kennedy Space Center Historic Launch Complex 39A",
            "Launchpad Status": "active"
        }
    ]
}
```

### Project Structure

- Base Path: `./js-lambda-api-gateway`
- Terraform Path: `./js-lambda-api-gateway/buildDeploy/terraform`
- Lambda Path: `./js-lambda-api-gateway/lambdas/launchpads`

### API Usage

#### Configuration for Any Request

**Headers**

| Header    | Required | Possible Values | Description                                                                              |
| --------- | -------- | --------------- | ---------------------------------------------------------------------------------------- |
| api-debug | No       | Any String      | When Header is included in the request the output logging level will be DEBUG and higher |

#### GET /launchpads

**Query Parameters**

Query Parameters can be used to filter the Launchpads returned by the API.

| Key        | Required | Possible Values | Description                                                                               |
| ---------- | -------- | --------------- | ----------------------------------------------------------------------------------------- |
| `match`    | No       | `any` or `all`  | Defaults to `all` is used to determine if one or all of the filter conditions must be met |
| `status`   | No       | Any String      | The Launchpads returned are filtered by Launchpad Status                                  |
| `fullName` | No       | Any String      | The Launchpads returned are filtered by Launchpad Name                                    |
| `id`       | No       | Any String      | The Launchpads are filtered by Launchpad Id                                               |

**Sample Request**

```bash
http GET "https://sd-demo.616a.systems/launchpads"
```

**Sample Response**

```
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 762
Content-Type: application/json
Date: Wed, 11 Dec 2019 13:56:19 GMT
X-Amzn-Trace-Id: Root=1-5df0f583-2cf2c4e4d4673426d281302e
x-amz-apigw-id: EitMiGYaoAMFrKA=
x-amzn-RequestId: c068ec69-7f29-4409-bbc2-461327dae46c

{
    "Launchpads": [
        {
            "Launchpad Id": "vafb_slc_4e",
            "Launchpad Name": "Vandenberg Air Force Base Space Launch Complex 4E",
            "Launchpad Status": "active"
        },
        {
            "Launchpad Id": "ccafs_slc_40",
            "Launchpad Name": "Cape Canaveral Air Force Station Space Launch Complex 40",
            "Launchpad Status": "active"
        },
        {
            "Launchpad Id": "stls",
            "Launchpad Name": "SpaceX South Texas Launch Site",
            "Launchpad Status": "under construction"
        },
        {
            "Launchpad Id": "kwajalein_atoll",
            "Launchpad Name": "Kwajalein Atoll Omelek Island",
            "Launchpad Status": "retired"
        },
        {
            "Launchpad Id": "ksc_lc_39a",
            "Launchpad Name": "Kennedy Space Center Historic Launch Complex 39A",
            "Launchpad Status": "active"
        },
        {
            "Launchpad Id": "vafb_slc_3w",
            "Launchpad Name": "Vandenberg Air Force Base Space Launch Complex 3W",
            "Launchpad Status": "retired"
        }
    ]
}
```

### Deploy it yourself

**Prerequisites**

- BASH Shell (Scripts Tested on macOS)
- Terraform 0.12.x
- AWS Account Credentials Configured

1. Initialize AWS Credentials for use with Terraform
2. Execute the script `./js-lambda-api-gateway/buildDeploy/buildDeploy.sh`
   - This will execute lambda tests, build the lambda function, and execute Terraform Apply

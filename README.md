# Smile Direct Coding Challenge

Various Solutions for a coding challenge.

# Documentation for Each Solution

## API Gateway -> Lambda Pattern

This pattern uses an API Gateway and sends inbound requests to a single lambda function.

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

##

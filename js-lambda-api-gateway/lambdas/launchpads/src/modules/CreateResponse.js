import { Logger } from './Logger';

/*
  @function CreateReponse takes in launchPadData and query string params to generate a lambda proxy integration response
  @param {Object} [root]
  @param {number} [root.statusCode] - The Status Code to initialize the response with, defaults to 200
  @param {Launchpads[]} [root.launchPadData] - The LaunchPad data to parse
  @param {string} [root.match=all] - The Matching pattern (all or any), defaults to all
  @param {string} [root.status] - A Status to match
  @param {string} [root.fullName] - A LaunchPad full name to match
  @param {string} [root.id] - A LaunchPad Id to match
*/
export function CreateResponse({
  statusCode = 200, launchPadData = [], match = 'all', status, fullName, id,
} = {}) {
  const Launchpads = launchPadData.map((v) => ({
    'Launchpad Id': v.id,
    'Launchpad Name': v.full_name,
    'Launchpad Status': v.status,
  })).filter((v) => {
    if (match === 'all') {
      return checkValue(v, status, 'Launchpad Status') && checkValue(v, fullName, 'Launchpad Name') && checkValue(v, id, 'Launchpad Id');
    }

    if (match === 'any') {
      return checkValue(v, status, 'Launchpad Status') || checkValue(v, fullName, 'Launchpad Name') || checkValue(v, id, 'Launchpad Id');
    }

    return true;
  });

  if (match === 'all' || match === 'any') {
    Logger.Info('Results Filtered', {
      match,
      status,
      fullName,
      id,
    });
  } else if (match === undefined) {
    Logger.Info('Results are not Filtered');
  } else {
    Logger.Error('match query parameter is invalid', {
      match,
      status,
      fullName,
      id,
    });

    response.statusCode = 400;

    // Response Body is based on RFC 7807 Problem Details for HTTP APIs (https://tools.ietf.org/html/rfc7807)
    response.body = JSON.stringify({
      type: 'VALIDATION_ERROR',
      title: 'Your request parameters did not pass validation',
      invalidParams: [
        {
          name: 'match',
          reason: "must be either 'all', 'any', or not set",
        },
      ],
    });

    return response;
  }

  const response = {
    statusCode,
    body: JSON.stringify({ Launchpads }),
  };

  return response;
}

/*
  @function checkValue compares a desired value against the value of an object's property
    If the desired value is undefined, true is returned
  @returns {boolean}
*/
function checkValue(value, desired, key) {
  if (desired === undefined) {
    return true;
  }

  if (desired === value[key]) {
    return true;
  }

  return false;
}

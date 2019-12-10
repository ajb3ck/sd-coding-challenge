import https from 'https';
import { Logger } from './Logger';

/*
  @typedef LaunchPads
  @type {Object}
*/

/*
  @function GetLaunchPads makes an https call to the Space X LaunchPads API
  @returns {LaunchPads[]}
*/
export async function GetLaunchPads() {
  const launchPadResp = await getHttp('https://api.spacexdata.com/v2/launchpads').catch((err) => {
    const e = err;
    e.code = 'API_CALL_ERROR';
    throw e;
  });

  if (launchPadResp.statusCode !== 200) {
    const err = new Error(`Respone from SpaceX API is ${launchPadResp.statusCode}`);
    err.httpStatusCode = launchPadResp.statusCode;
    err.code = 'API_CALL_ERROR';

    throw err;
  }

  return launchPadResp;
}

/*
  @function getHttp A non exported function to wrap a NodeJs HTTP call in a Promise
  @param {string} url
  @returns {Object} httpResponse
  @property {number} httpResponse.statusCode
  @property {Object.<string, string>} httpResponse.headers
  @property {string} httpResponse.body
*/
function getHttp(url) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { method: 'GET' }, (resp) => {
      const httpResp = {};
      httpResp.rawBody = '';

      httpResp.statusCode = resp.statusCode;
      httpResp.headers = resp.headers;

      resp.on('data', (d) => {
        httpResp.rawBody = `${httpResp.rawBody}${d}`;
      });

      resp.on('end', () => {
        try {
          httpResp.body = JSON.parse(httpResp.rawBody);
        } catch (err) {
          Logger.Warn('Body is not in JSON Syntax', { body: httpResp.rawBody });
        }

        resolve(httpResp);
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

import { GetLaunchPads } from './modules/GetLaunchPads';
import { Logger } from './modules/Logger';
import { CreateResponse } from './modules/CreateResponse';

async function handler(event, context) {
  // Configure Logger ENV Variables, ENV Variables are used instead of Global Variables to ensure thread safety
  process.env.requestId = event.requestContext.requestId;
  process.env.requestTimeEpoch = event.requestContext.requestTimeEpoch;
  process.env.OutputLogLevel = event.headers['api-debug'] ? 'DEBUG' : 'WARNING';

  // Log out the inputted Lambda Event and Context
  Logger.Info('Lambda Event and Context Data', { event, context });

  // Get LaunchPads Data
  Logger.Debug('Start Get Launch Pads Request');
  const launchPadData = await GetLaunchPads().catch((err) => {
    Logger.Error('Error getting LaunchPad Data', err);
  });
  Logger.Debug(JSON.stringify(launchPadData));

  // Create Response
  const {
    match, status, id, fullName,
  } = event.queryStringParameters;

  const response = CreateResponse({
    launchPadData: launchPadData.body, match, status, id, fullName,
  });

  // Send the Lambda Response
  return response;
}

export { handler };

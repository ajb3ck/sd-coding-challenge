import nock from 'nock';
import { launchPadsResp } from './nockRespData';
import { defaultEvent } from './sampleEvents';

import { handler } from '../src/index';

const httpMocks = {};

beforeAll(() => {
  httpMocks.GETLaunchpads = nock('https://api.spacexdata.com')
    .get('/v2/launchpads')
    .delayBody(200)
    .reply(200, launchPadsResp);
});

afterAll(() => {
  nock.cleanAll();
});

describe('Handler Tests', () => {
  test('Happy Path', async () => {
    const event = defaultEvent;
    const context = {};

    const expectedBody = expect.stringContaining('"Launchpad Id":"vafb_slc_4e"');
    const expected = {
      statusCode: 200,
      body: expectedBody,
    };

    await expect(handler(event, context)).resolves.toMatchObject(expected);
  });
});

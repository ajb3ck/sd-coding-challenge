import nock from 'nock';
import { launchPadsResp } from '../nockRespData';

import { GetLaunchPads } from '../../src/modules/GetLaunchPads';

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

describe('getLaunchPads Tests', () => {
  test('Happy Path', async () => {
    await expect(GetLaunchPads()).resolves.toMatchObject({ body: launchPadsResp });
  });
});

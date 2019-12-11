import { CreateResponse } from '../../src/modules/CreateResponse';
import { launchPadsResp } from '../nockRespData';

describe('Handler Tests', () => {
  test('Happy Path', () => {
    const params = { launchPadData: launchPadsResp };
    const expectedBody = expect.stringContaining('"Launchpad Id":"vafb_slc_4e",');

    const expected = {
      statusCode: 200,
      body: expectedBody,
    };

    expect(CreateResponse(params)).toMatchObject(expected);
  });
  test('Happy Sad Path: Invalid Option privded for match param', () => {
    const params = { launchPadData: launchPadsResp, match: 'notvalid' };
    const expectedBody = expect.stringContaining('"type":"VALIDATION_ERROR"');

    const expected = {
      statusCode: 400,
      body: expectedBody,
    };

    expect(CreateResponse(params)).toMatchObject(expected);
  });
});

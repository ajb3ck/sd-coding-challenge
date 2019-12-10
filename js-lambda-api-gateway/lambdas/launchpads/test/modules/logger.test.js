import { Logger } from '../../src/modules/Logger';

beforeEach(() => {
  process.env.requestId = 'event.requestContext.requestId';
  process.env.requestTimeEpoch = 'event.requestContext.requestTimeEpoch';
  process.env.OutputLogLevel = 'WARN';
});

describe('Logger Module Tests', () => {
  test('Happy Path: Logger Info (Default Debug Level)', () => {
    const consoleSpy = jest.spyOn(console, 'log');

    Logger.Info('Info Message', { info: 'data' });

    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
  test('Happy Path: Logger Info (Debug Level set)', () => {
    process.env.OutputLogLevel = 'DEBUG';
    const message = 'INFO Message';
    const expected = {
      startsWith: expect.stringContaining(`{"requestId":"${process.env.requestId}","requestTimeEpoch":"${process.env.requestTimeEpoch}`),
      endsWith: expect.stringContaining(`"level":"INFO","message":"${message}"`),
    };

    const consoleSpy = jest.spyOn(console, 'log');

    Logger.Info(message, { info: 'data' });

    expect(consoleSpy).toHaveBeenCalledWith(expected.startsWith);
    expect(consoleSpy).toHaveBeenCalledWith(expected.endsWith);
    expect(consoleSpy).toHaveBeenCalledTimes(1);

    consoleSpy.mockRestore();
  });
});

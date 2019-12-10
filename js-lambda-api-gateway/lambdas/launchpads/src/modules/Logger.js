/*
  Logger Module
  @module Logger
  The Logger Module is used to standardize logging messages as well as mange configuration implementation
*/

const LogLevel = {
  EMERGENCY: 0,
  ALERT: 1,
  CRITICAL: 2,
  ERROR: 3,
  WARNING: 4,
  NOTICE: 5,
  INFO: 6,
  DEBUG: 7,
};

/*
  Logger is the only exported object. The object has params which are short cut functions which all have the same signature
  @function LoggerShortCut
  @param {string} message The Message to be logged out
  @param {object} data Any Data to be included in the message (this data is parsed to JSON)
*/
export const Logger = {
  Emergency: function Emergency(message, data = {}) {
    baseLog({ message, level: 'EMERGENCY', data });
  },
  Alert: function Alert(message, data = {}) {
    baseLog({ message, level: 'ALERT', data });
  },
  Critical: function Critical(message, data = {}) {
    baseLog({ message, level: 'CRITICAL', data });
  },
  Error: function Error(message, data = {}) {
    baseLog({ message, level: 'ERROR', data });
  },
  Warn: function Warn(message, data = {}) {
    baseLog({ message, level: 'WARNING', data });
  },
  Notice: function Notice(message, data = {}) {
    baseLog({ message, level: 'NOTICE', data });
  },
  Info: function Info(message, data = {}) {
    baseLog({ message, level: 'INFO', data });
  },
  Debug: function Debug(message, data = {}) {
    baseLog({ message, level: 'DEBUG', data });
  },
  LogLevel,
};

/*
  @function baseLog
  @param {object} root
  @property {string} root.message The message to be logged out
  @property {string} root.level The Logging Level for the log event
  @property {object} root.data Any Data to be included in the log event
*/
function baseLog({ message = '', level = 'INFO', data = {} } = {}) {
  const logOut = {
    requestId: process.env.requestId || 'unknown',
    requestTimeEpoch: process.env.requestTimeEpoch || 'unknown',
    timestamp: Date.now(),
    level,
    message,
    data,
  };

  if (process.env.OutputLogLevel) {
    if (LogLevel[process.env.OutputLogLevel] >= LogLevel[level]) {
      console.log(JSON.stringify(logOut));
    }
  }
}

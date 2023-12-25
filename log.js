import { logger } from 'react-native-logs';

const log = logger.createLogger({
  levels: {
    custom: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
    devNotice: 5
  },
  transportOptions: {
    colors: {
      custom: 'white',
      devNotice: 'blue',
      info: 'blueBright',
      warn: 'yellowBright',
      error: 'redBright',
      debug: 'white'
    }
  }
});

const logInfo = (message) => {
  log.info(message);
};

const logError = (error) => {
  log.error(error);
};

export { logInfo, logError };
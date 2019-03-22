
/**
 * Build a log structure to be used for both situations
 * info or error.
 * @param {object} context
 * @param {string} message
 * @return {string}
 */
const logFactory = (context, message) => {
  const connector = context.connector ? `[${context.connector.id}]` : '';
  const timestamp = context.timestamp ? `[${context.timestamp}]` : '';
    const toLog = `[CHECK_DIFFERENCE][${context.type.toUpperCase()}]${timestamp} ${connector} ${message}.`; // eslint-disable-line
  return toLog;
};

/**
   * Log formatted information about handle data.
   * @param {object} context
   * @param {string} message
   * @param {object} obj
   */
const logInfo = (context, message, obj) => {
  const toLog = logFactory(context, message);
  // if (process.env.NODE_ENV !== 'test') {
      obj ? console.info(toLog, obj) : console.info(toLog, context);
  // }
};

/**
   * Log formatted error.
   * @param {object} context
   * @param {string} message
   * @param {object} err
   */
const logError = (context, message, err) => {
  const toLog = logFactory(context, message);
  // if (process.env.NODE_ENV !== 'test') {
      err ? console.error(toLog, err) : console.error(toLog, context);
  // }
};

module.exports = {
  logInfo,
  logError,
};

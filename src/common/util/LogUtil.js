
/**
 * Log formatted information.
 * @param {string} label
 * @param {object} context
 * @param {string} message
 * @param {object} optionalParams
 */
const logInfo = (label, context, message, optionalParams) => {
  const connector = `[${context.connector.id}]`;
  const timestamp = context.timestamp ? `[${context.timestamp}]` : '';
  const token = context.nextQuery ?
    `[Token: ${context.nextQuery.pageToken}]` : '';
  const toLog = `[${label}]${timestamp}${connector}${token} ${message}.`; // eslint-disable-line
  optionalParams ? console.info(toLog, optionalParams) : console.info(toLog);
};

/**
 * Common logs
 * @param  {...any} args
 */
const log = (...args) => {
  console.log(...args);
};

/**
 * Error logs
 * @param  {...any} args
 */
const error = (...args) => {
  console.error(...args);
};


module.exports = {
  logInfo,
  log,
  error,
};

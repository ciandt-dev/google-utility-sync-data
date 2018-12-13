
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
  obj ? console.info(toLog, optionalParams) : console.info(toLog);
};

module.exports = {
  logInfo,
};

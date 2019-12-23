/**
 * Log Util.
 */
class LogUtil {
  /**
   * Constructor logs.
   * @param {string} kind
   * @param {string} logEnvironment
   * @constructor
   */
  constructor(kind, logEnvironment) {
    this.kind = kind;
    this.logEnvironment = logEnvironment;
  }

  /**
 * Build a log structure to be used for both situations
 * info or error.
 * @param {object} context
 * @param {string} message
 * @return {string}
 */
  logFactory(context, message) {
    const connector = context.connector ? `[${context.connector.id}]` : '';
    const timestamp = context.timestamp ? `[${context.timestamp}]` : '';
    const _type = context.type ? context.type.toUpperCase() : 'NONE';
    const toLog = `[${this.kind.toUpperCase()}][${_type}]${timestamp} ${connector} ${message}.`; // eslint-disable-line
    return toLog;
  };

  /**
   * Log formatted information about handle data.
   * @param {object} context
   * @param {string} message
   * @param {object} obj
   */
  logInfo(context, message, obj) {
    const toLog = this.logFactory(context, message);
    if (this.logEnvironment!== 'test') {
      obj ? console.info(toLog, obj) : console.info(toLog, context);
    }
  };

  /**
   * Log formatted error.
   * @param {object} context
   * @param {string} message
   * @param {object} err
   */
  logError(context, message, err) {
    const toLog = this.logFactory(context, message);
    if (this.logEnvironment!== 'test') {
      err ? console.error(toLog, err) : console.error(toLog, context);
    }
  };
}


module.exports = LogUtil;


/**
 * Format Error message
 * @param {string} message
 * @param {number} code
 * @return {object}
 */
const formatErrorMessage = (message, code) => {
  return {
    code: code || 1,
    message: message,
  };
};

module.exports = {
  formatErrorMessage,
};

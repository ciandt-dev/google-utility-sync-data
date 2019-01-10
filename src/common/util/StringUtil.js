
/**
 * Generate a HashCode from a string.
 * @param {string} str
 * @return {string} hash.
 */
const hashCode = (str) => {
  return new Buffer(str, 'utf8').toString('base64');
};

/**
 * Generate Keywords from a object
 * @param {object} object
 * @param {string} keys
 * @return {array} Keywords
 */
const generateKeywords = (object, keys) => {
  const maxKeywordLength = 2;
  const keywords = [];

  keys = keys.split(',');
  keys.forEach((key) => {
    const words = object[key].toString().split(' ');
    words.forEach((word) => {
      for (let index = maxKeywordLength; index < word.length; index++) {
        const element = word.slice(0, index);
        keywords.push(element.toLowerCase());
      }
      keywords.push(word.toLowerCase());
    });
  });

  return keywords;
};

/**
* Parse a PubSub message
* @param {Object} message
* @return {object}
*/
const parsePubSubMessage = (message) => {
  return JSON.parse(
      Buffer.from(message, 'base64')
          .toString());
};

module.exports = {
  hashCode,
  generateKeywords,
  parsePubSubMessage,
};

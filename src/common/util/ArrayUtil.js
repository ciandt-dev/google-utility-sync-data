
/**
 * Split an array in chunks.
 * @param {Array} array Array to be splited;
 * @param {Number} chunkSize Size of a chunck.
 * @return {Array}
 */
const chunckArray = (array, chunkSize) => {
  const result = [];

  for (let index = 0; index < array.length; index+=chunkSize) {
    const chunck = array.slice(index, index + chunkSize);
    result.push(chunck);
  }

  return result;
};

module.exports = {
  chunckArray,
};

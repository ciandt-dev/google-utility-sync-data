const PubSub = require('@google-cloud/pubsub');

/**
 * PubSub Helper.
 */
class PubSubHelper {
  /**
   * Constructor for PubSub Helper.
   * @constructor
   */
  constructor() {}

  /**
   * Publish a message on PubSub topic.
   * @param {string} topic Topic to be published.
   * @param {string} message Message to be published on topic
   * @return {Promise}
   */
  publish(topic, message) {
    const buffer = new Buffer(JSON.stringify(message));

    return new Promise((resolve, reject) => {
      new PubSub()
          .topic(topic)
          .publisher()
          .publish(buffer)
          .then((results) => {
            console.info(
                `Message published: 
                Message: ${topic} 
                Result: ${results}`
            );
            resolve(results);
          }).catch((err) => {
            const errorMessage =
              `Error on trying to publish information on PubSub. 
              Topic: ${topic}, 
              Error: ${err.message}`;

            const error = {
              code: 1,
              message: errorMessage,
            };
            reject(error);
          });
    });
  }

  /**
   * Publish a error message in a topic
   * @param {string} topic
   * @param {object} err
   * @return {Promise}
   */
  publishError(topic, err) {
    if (!err.code) {
      err.code = 1;
    }
    return this.publish(topic, err);
  }
}

module.exports = PubSubHelper;

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
   * @param {String} topic Topic to be published.
   * @param {String} message Message to be published on topic
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
            console.debug(
                `Message published: 
                Message: ${topic} 
                Result: ${results}`
            );
            resolve(results);
          }).catch((err) => {
            const errorMessage =
              `Error on trying to publish information on PubSub. 
              Topic Message: ${message}, 
              Message: ${message}, 
              Error: ${err}`;

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
   * @param {String} topic
   * @param {object} err
   */
  publishError(topic, err) {
    if (!err.code) err.code = 1;
    this.publish(HANDLE_ERRORS_TOPIC_NAME, err);
  }
}

module.exports = PubSubHelper;

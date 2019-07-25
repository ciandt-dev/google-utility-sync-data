const expect = require('chai').expect;
const sinon = require('sinon');
const {PubSub} = require('@google-cloud/pubsub');

const {PubSubHelper} = require('../../../src');

describe('PubSub Helper tests', () => {
  describe('#perform()', () => {
    const consoleLogFake = sinon.fake(function() {});

    beforeEach(() => {
      sinon.restore();
    });

    it('Publish a simple message on PubSub.', (done) => {
      const pubSubStub = sinon.fake.resolves({});
      const topicPublishStub = sinon.stub(PubSub.prototype, 'topic')
        .returns({publish: pubSubStub});
      const message = 'Simple message';

      new PubSubHelper()
          .publish('topic', message);

      expect(topicPublishStub.calledOnce).to.be.true;
      done();
    });

    it('Error on publish a message.', () => {
      const pubSubStub = sinon.fake.rejects();
      const topicPublishStub = sinon.stub(PubSub.prototype, 'topic')
          .returns({publish: pubSubStub});
      const message = 'Simple message';

      return new PubSubHelper()
          .publish('topic', message)
          .catch((err) => {
            expect(topicPublishStub.calledOnce).to.be.true;
            expect(err.message).to.contains(
                'Error on trying to publish information on PubSub'
            );
          });
    });

    it('Publish an error message.', () => {
      const pubSubStub = sinon.fake.resolves({});
      const topicPublishStub = sinon.stub(PubSub.prototype, 'topic')
          .returns({publish: pubSubStub});
      const error = {message: 'An error messages'};

      sinon.replace(console, 'info', consoleLogFake);

      return new PubSubHelper()
          .publishError('topic', error)
          .then(() => {
            expect(topicPublishStub.calledOnce).to.be.true;
            expect(consoleLogFake.lastArg).to.contains(
                'Message published'
            );
          });
    });

    it('Publish an error message with a code.', () => {
      const pubSubStub = sinon.fake.resolves({});
      const topicPublishStub = sinon.stub(PubSub.prototype, 'topic')
          .returns({publish: pubSubStub});
      const error = {code: 5, message: 'An error messages'};

      sinon.replace(console, 'info', consoleLogFake);

      return new PubSubHelper()
          .publishError('topic', error)
          .then(() => {
            expect(topicPublishStub.calledOnce).to.be.true;
            expect(consoleLogFake.lastArg).to.contains(
                'Message published'
            );
          });
    });
  });
});

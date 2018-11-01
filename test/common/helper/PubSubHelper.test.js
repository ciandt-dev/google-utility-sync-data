const expect = require('chai').expect;
const sinon = require('sinon');
const PubSub = require('@google-cloud/pubsub');

const PubSubHelper = require('../../../src').PubSubHelper;

describe('PubSub Helper tests', () => {
  describe('#perform()', () => {
    beforeEach(() => {
      sinon.restore();
    });

    it('Publish a simple message on PubSub.', () => {
      const pubSubStub = sinon.fake.resolves({});
      const topicPublishStub = sinon.stub(PubSub.prototype, 'topic').returns({
        publisher: sinon.fake.returns({
          publish: pubSubStub,
        }),
      });
      const message = 'Simple message';

      new PubSubHelper('project-id', 'topic')
          .publish(message);

      expect(topicPublishStub.calledOnce).to.be.true;
    });

    it('Error on publish a message.', () => {
      const pubSubStub = sinon.fake.rejects();
      const topicPublishStub = sinon.stub(PubSub.prototype, 'topic').returns({
        publisher: sinon.fake.returns({
          publish: pubSubStub,
        }),
      });
      const message = 'Simple message';

      new PubSubHelper('project-id', 'topic')
          .publish(message)
          .catch((err) => {
            expect(topicPublishStub.calledOnce).to.be.true;
            expect(err.message).to.contains(
                'Error on trying to publish information on PubSub'
            );
          });
    });
  });
});

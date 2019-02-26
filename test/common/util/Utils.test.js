const expect = require('chai').expect;
const sinon = require('sinon');
const PubSub = require('@google-cloud/pubsub');

const {ErrorUtil, StringUtil} = require('../../../src');

describe('Utils tests', () => {
  describe('#Error utils', () => {
    beforeEach(() => {
      sinon.restore();
    });

    it('Format Error Messages.', () => {
      const message = 'Format error messages.';
      const code = 1;
      const expected = {
        code: code,
        message: message,
      };

      const errorMessage = ErrorUtil.formatErrorMessage(message, code);
      expect(errorMessage).to.deep.equals(expected);
    });

    it('Format Error message without code.', () => {
      const message = 'Format error messages.';
      const expected = {
        code: 1,
        message: message,
      };

      const errorMessage = ErrorUtil.formatErrorMessage(message, null);
      expect(errorMessage).to.deep.equals(expected);
    });
  });

  describe('#String utils', () => {
    beforeEach(() => {
      sinon.restore();
    });

    it('Generate an hash code.', () => {
      const message = 'Simple message.';
      const hash = StringUtil.hashCode(message);
      expect(hash).to.be.equals('U2ltcGxlIG1lc3NhZ2Uu');
    });

    it('Generate simple keywords.', () => {
      const entity = {
        code: 12,
        name: 'Entity',
        description: 'Description',
      };
      const words = StringUtil.generateKeywords(entity, 'code,name');
      expect(words).to.deep.equals(
          ['12', 'En', 'Ent', 'Enti', 'Entit', 'Entity']
              .map((x) => x.toLowerCase()));
    });
  });
});

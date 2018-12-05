const expect = require('chai').expect;
const sinon = require('sinon');

const {Firestore} = require('@google-cloud/firestore');
const {FirestoreHelper} = require('../../../src');

describe('Firestore Helper tests', () => {
  describe('#perform()', () => {
    beforeEach(() => {
      sinon.restore();
    });

    it('Get a document by id', () => {
      const jobId = '4fcbe3b7-9151-4911-8341-4399d19a1f0b';

      sinon.stub(
          Firestore.prototype, 'doc')
          .returns(
              {id: jobId}
          );

      const document = new FirestoreHelper()
          .document(jobId);
      expect(document.id).to.be.equals(jobId);
    });
  });
});

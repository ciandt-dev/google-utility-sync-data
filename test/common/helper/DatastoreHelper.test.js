/* eslint-disable max-len */
const {expect} = require('chai');
const sinon = require('sinon');

const {Datastore} = require('@google-cloud/datastore');
const {DatastoreHelper} = require('../../../src');

describe('Datastore Helper tests', () => {
  describe('#perform()', () => {
    beforeEach(() => {
      sinon.restore();
    });

    it('Try to save an entity with null object should throw an error.', () => {
      expect(() => new DatastoreHelper().save('Kind', null))
          .to.throw(Error, 'Nothing to be save.');
    });

    it('Try to update an entity with null object should throw an error.', () => {
      expect(() => new DatastoreHelper().update('Kind', null, 1))
          .to.throw(Error, 'All parameters are required.');
    });

    it('Try to save an entities list with null object should throw an error.', () => {
      expect(() => new DatastoreHelper().saveEntities('Kind', null))
          .to.throw(Error, 'Nothing to be save.');
    });

    it('Try to delete an entities list with null object should throw an error.', () => {
      expect(() => new DatastoreHelper().deleteEntities('Kind', null))
          .to.throw(Error, 'Nothing to be delete.');
    });

    it('Saves an entity on datastore.', () => {
      const datastoreStub = sinon.stub(Datastore.prototype, 'upsert').resolves({});

      const entity = {
        name: 'testing',
        description: 'description',
      };

      return new DatastoreHelper('dst-namespace')
          .save('Kind', entity)
          .then(() => {
            expect(datastoreStub.calledOnce).to.be.true;
          });
    });

    it('Try to delete entities using delete entities engine with success.', () => {
      sinon.stub(Datastore.prototype, 'delete').resolves({
        'status': 1,
      });
      const keys = ['1', '2', '3'];

      return new DatastoreHelper('dst-namespace')
          .deleteEntitiesEngine(keys)
          .then((result) => {
            expect(result).to.have.property('status');
            expect(result.keys).to.be.an('array').that.to.have.members(keys);
          });
    });

    it('Try to delete entities using delete entities engine and fail.', () => {
      const keys = ['1', '2', '3'];

      sinon.stub(Datastore.prototype, 'delete')
        .rejects(new Error('The delete failed.'));

      return new DatastoreHelper('dst-namespace')
          .deleteEntitiesEngine(keys)
          .then(() => {})
          .catch((err) => {
            expect(err).to.not.be.null;
            expect(err.message).to.equal('The delete failed.');
          });
    });

    it('Saves an entity on datastore should thrown an error.', () => {
      const datastoreStub = sinon.stub(Datastore.prototype, 'upsert')
        .rejects(new Error('The save failed.'));

      const entity = {
        name: 'testing',
        description: 'description',
      };

      return new DatastoreHelper('dst-namespace')
          .save('Kind', entity)
          .catch((err) => {
            expect(datastoreStub.calledOnce).to.be.true;
            expect(err.message).to.equal('The save failed.');
          });
    });

    it('Update an entity on datastore.', () => {
      const entity = {
        name: 'testing',
        description: 'description',
      };

      const datastoreGetStub = sinon.stub(Datastore.prototype, 'get').resolves([entity]);
      const datastoreSaveStub =sinon.stub(Datastore.prototype, 'save').resolves({});

      return new DatastoreHelper('dst-namespace')
          .update('Kind', entity, 1)
          .then(() => {
            expect(datastoreGetStub.calledOnce).to.be.true;
            expect(datastoreSaveStub.calledOnce).to.be.true;
          });
    });

    it('Save a list of entities on datastore.', () => {
      const entity1 = {
        id: 1,
        name: 'testing',
        description: 'description',
      };

      const entity2 = {
        id: 1,
        name: 'testing',
        description: 'description',
      };

      const datastoreStub = sinon.stub(Datastore.prototype, 'upsert').resolves({});

      return new DatastoreHelper('dst-namespace')
          .saveEntities('Kind', [entity1, entity2], 'name')
          .then(() => {
            expect(datastoreStub.calledOnce).to.be.true;
          });
    });

    it('Delete a list of entities on datastore.', () => {
      const entity1 = {
        id: 1,
        name: 'testing',
        description: 'description',
      };

      const entity2 = {
        id: 1,
        name: 'testing',
        description: 'description',
      };

      const datastoreStub = sinon.stub(Datastore.prototype, 'delete').resolves({});

      return new DatastoreHelper('dst-namespace')
          .deleteEntities('Kind', [entity1, entity2], 'name')
          .then(() => {
            expect(datastoreStub.calledOnce).to.be.true;
          });
    });

    it('Filter an entity.', () => {
      const entity = {
        id: 1,
        name: 'testing',
        description: 'description',
      };

      const datastoreStub = sinon.stub(Datastore.prototype, 'createQuery')
        .returns({filter: sinon.fake.resolves(entity)});

      return new DatastoreHelper('dst-namespace')
          .filter('Kind', 'name', 'testing')
          .then((result) => {
            expect(result).to.be.equals(entity);
            expect(datastoreStub.calledOnce).to.be.true;
          });
    });
  });
});

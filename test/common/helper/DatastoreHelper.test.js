/* eslint-disable max-len */
const expect = require('chai').expect;
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
      const datastoreStub = sinon.fake.resolves({});
      sinon.replace(Datastore.prototype, 'save', datastoreStub);

      const entity = {
        name: 'testing',
        description: 'description',
      };

      new DatastoreHelper('dst-namespace')
          .save('Kind', entity)
          .then(() => {
            expect(datastoreStub.calledOnce).to.be.true;
          });
    });

    it('Try to delete entities using delete entities engine with success.', (done) => {
      const keys = ['1', '2', '3'];

      const datastoreDeleteStub = sinon.fake.resolves({
        'status': 1,
      });

      sinon.replace(Datastore.prototype, 'delete', datastoreDeleteStub);

      new DatastoreHelper('dst-namespace')
          .deleteEntitiesEngine(keys)
          .then((result) => {
            expect(result).to.have.property('status');
            expect(result.keys).to.be.an('array').that.to.have.members(keys);
            done();
          });
    });

    it('Try to delete entities using delete entities engine and fail.', (done) => {
      const keys = ['1', '2', '3'];

      const datastoreDeleteStub = sinon.fake.rejects({});

      sinon.replace(Datastore.prototype, 'delete', datastoreDeleteStub);

      new DatastoreHelper('dst-namespace')
          .deleteEntitiesEngine(keys)
          .then(() => {})
          .catch((err) => {
            expect(err).to.not.be.null;
            done();
          });
    });

    // it('Saves an entity on datastore should thrown an error.', () => {
    //   const datastoreStub = sinon.fake.rejects({});
    //   sinon.replace(Datastore.prototype, 'save', datastoreStub);

    //   const entity = {
    //     name: 'testing',
    //     description: 'description',
    //   };

    //   new DatastoreHelper('dst-namespace')
    //       .save('Kind', entity)
    //       .catch(() => {
    //         expect(datastoreStub.calledOnce).to.be.true;
    //       });
    // });

    it('Update an entity on datastore.', () => {
      const entity = {
        name: 'testing',
        description: 'description',
      };

      const datastoreStub = sinon.fake.resolves({});
      const datastoreGetStub = sinon.fake.resolves([entity]);
      sinon.replace(Datastore.prototype, 'get', datastoreGetStub);
      sinon.replace(Datastore.prototype, 'save', datastoreStub);

      new DatastoreHelper('dst-namespace')
          .update('Kind', entity, 1)
          .then(() => {
            expect(datastoreStub.calledOnce).to.be.true;
            expect(datastoreGetStub.calledOnce).to.be.true;
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

      const datastoreStub = sinon.fake.resolves({});
      sinon.replace(Datastore.prototype, 'upsert', datastoreStub);

      new DatastoreHelper('dst-namespace')
          .saveEntities('Kind', [entity1, entity2], 'name')
          .then();
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

      const datastoreStub = sinon.fake.resolves({});
      sinon.replace(Datastore.prototype, 'delete', datastoreStub);

      new DatastoreHelper('dst-namespace')
          .deleteEntities('Kind', [entity1, entity2], 'name')
          .then();
    });

    it('Filter an entity.', () => {
      const entity = {
        id: 1,
        name: 'testing',
        description: 'description',
      };

      const datastoreStub = sinon.fake.returns({
        filter: sinon.fake.resolves(entity),
      });
      sinon.replace(Datastore.prototype, 'createQuery', datastoreStub);

      new DatastoreHelper('dst-namespace')
          .filter('Kind', 'name', 'testing')
          .then((result) => {
            expect(result).to.be.equals(entity);
            expect(datastoreStub.calledOnce).to.be.true;
          });
    });
  });
});

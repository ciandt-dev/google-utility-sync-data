const expect = require('chai').expect;
const sinon = require('sinon');

const {SyncDataTaskManagerService, SyncDataTaskManager, DatastoreHelper} =
  require('../../src');

describe('SyncDataTaskManagerService tests', () => {
  describe('#perform()', () => {
    beforeEach(() => {
      sinon.restore();
    });

    it('Test update a task', (done) => {
      const jobId = '4fcbe3b7-9151-4911-8341-4399d19a1f0b';
      const token = 'YmlncXVlcnl0b2tlbnRlc3Rz';

      sinon.stub(
          DatastoreHelper.prototype, 'save').resolves({});

      const entity = new SyncDataTaskManager(jobId, token);
      entity.setStatusSuccess();

      new SyncDataTaskManagerService()
          .updateTask(entity)
          .then(() => {
            done();
          });
    });

    it('Test create a task', (done) => {
      const jobId = '4fcbe3b7-9151-4911-8341-4399d19a1f0b';
      const token = 'YmlncXVlcnl0b2tlbnRlc3Rz';

      sinon.stub(
          DatastoreHelper.prototype, 'save').resolves({});

      const entity = new SyncDataTaskManager(jobId, token);
      new SyncDataTaskManagerService()
          .createTask(entity)
          .then(() => done());
    });

    it('Get document with errors', (done) => {
      const jobId = '4fcbe3b7-9151-4911-8341-4399d19a1f0b';

      sinon.stub(
          DatastoreHelper.prototype, 'createQuery')
          .returns(
              {
                filter: sinon.fake.returns({
                  filter: sinon.fake.returns({
                    run: sinon.fake.resolves([
                      [{size: 10}], // Number of items with error.
                    ]),
                  }),
                }),
              }
          );

      new SyncDataTaskManagerService()
          .hasErrorJobs(jobId)
          .then((hasError) => {
            expect(hasError).to.be.true;
            done();
          });
    });

    it('Get document with success', (done) => {
      const jobId = '4fcbe3b7-9151-4911-8341-4399d19a1f0b';
      const expectTotal = 1;

      sinon.stub(
          DatastoreHelper.prototype, 'createQuery')
          .returns(
              {
                filter: sinon.fake.returns({
                  filter: sinon.fake.returns({
                    run: sinon.fake.resolves([
                      [{size: 10}], // Number of items with error.
                    ]),
                  }),
                }),
              }
          );

      new SyncDataTaskManagerService()
          .getTotalSuccessJobs(jobId)
          .then((total) => {
            expect(total).to.be.equal(expectTotal);
            done();
          });
    });
  });
});

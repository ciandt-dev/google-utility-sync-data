const expect = require('chai').expect;
const sinon = require('sinon');

const {BigQuery} = require('@google-cloud/bigquery');
const {BigQueryHelper} = require('../../../src');

describe('BigQuery Helper tests', () => {
  describe('#perform()', () => {
    beforeEach(() => {
      sinon.restore();
    });

    it('Publish a simple message on PubSub.', () => {
      const bigqueryStub = sinon.fake.resolves({});
      const query = 'SELECT * FROM Table1';

      sinon.replace(BigQuery.prototype, 'query', bigqueryStub);

      new BigQueryHelper()
          .query(query, 'US')
          .then(() => {
            expect(bigqueryStub.calledOnce).to.be.true;
          });
    });

    it('Copy a table from a BQ project.', () => {
      const copyStub = sinon.stub(BigQuery.prototype, 'dataset').returns({
        table: sinon.fake.returns({
          copy: sinon.fake.resolves({}),
        }),
      });

      new BigQueryHelper('dst-project-id')
          .copyTable(
              'src-project-id', 'src-dataset-id', 'src-table-id',
              'dst-dataset-id', 'dst-table-id'
          )
          .then(() => {
            expect(copyStub.calledTwice).to.be.true;
          });
    });
  });
});

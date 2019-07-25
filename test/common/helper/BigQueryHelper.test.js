const {expect} = require('chai');
const sinon = require('sinon');

const {BigQuery} = require('@google-cloud/bigquery');
const {BigQueryHelper} = require('../../../src');

describe('BigQuery Helper tests', () => {
  describe('#perform()', () => {
    beforeEach(() => {
      sinon.restore();
    });

    it('Get a job by id', (done) => {
      const expected = {
        id: 'job-id',
      };

      sinon.stub(
          BigQuery.prototype, 'job')
          .returns(expected);

      const job = new BigQueryHelper()
          .getJob('job-id');
      expect(job).to.be.equals(expected);
      done();
    });

    it('Copy a view to a table', () => {
      sinon.stub(
          BigQuery.prototype, 'dataset')
          .returns({
            table: sinon.fake.returns({
              getMetadata: sinon.fake.resolves(
                  [{
                    view: {
                      type: 'VIEW',
                      query: 'SELECT * FROM Table1',
                      useLegacySql: true,
                    },
                  }]
              ),
            }),
          });

      sinon.stub(BigQuery.prototype, 'createQueryJob').resolves('Job 1234 created successfully.');

      return new BigQueryHelper()
          .copyView(
              'marcot', 'vw_user_anime_list_300k_200_watched_episodes',
              'marcot', 'jurema2'
          )
          .then((result) => {
            expect(result).to.equal('Job 1234 created successfully.');
          });
    });

    it('Get BQ table metadada.', () => {
      const getMetadataStub = sinon.stub(
          BigQuery.prototype, 'dataset')
          .returns({
            table: sinon.fake.returns({
              getMetadata: sinon.fake.resolves([{type: 'VIEW'}]),
            }),
          });

      return new BigQueryHelper()
          .isView('marcot', 'vw_user_anime_list_300k_200_watched_episodes')
          .then((result) => {
            expect(getMetadataStub.calledOnce).to.be.true;
            expect(result).to.be.true;
          });
    });

    it('Publish a simple message on PubSub.', () => {
      const bigqueryStub = sinon.fake.resolves({});
      const query = 'SELECT * FROM Table1';

      sinon.replace(BigQuery.prototype, 'query', bigqueryStub);

      return new BigQueryHelper()
          .query(query, 'US')
          .then(() => {
            expect(bigqueryStub.calledOnce).to.be.true;
          });
    });

    it('Copy a table from a BQ project.', () => {
      const copyStub = sinon.stub(BigQuery.prototype, 'dataset').returns({
        table: sinon.fake.returns({
          copy: sinon.fake.resolves([{'id': 'xpto', 'status': {'errors': {}}}]),
        }),
      });

      return new BigQueryHelper('dst-project-id')
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

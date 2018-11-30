const {BigQuery} = require('@google-cloud/bigquery');

/**
 * BigQuery Helper.
 */
class BigQueryHelper {
  /**
   * Constructor for BiqQuery Helper.
   * @param {String} projectId Google Project ID
   * @constructor
   */
  constructor(projectId) {
    const options = projectId ? {projectId: projectId} : {};
    this.bigquery = new BigQuery(options);
  }

  /**
   * Copy table from a dataset.
   * @param {String} srcProjectId Source Project ID.
   * @param {String} srcDatasetId Source table dataset id.
   * @param {String} srcTableId Source table ID.
   * @param {String} dstDatasetId Destination Dataset ID.
   * @param {String} dstTableId Destination Dataset table ID.
   * @return {Promise}
   */
  copyTable(
      srcProjectId, srcDatasetId, srcTableId,
      dstDatasetId, dstTableId) {
    return new Promise((resolve, reject) => {
      return new BigQuery({projectId: srcProjectId})
          .dataset(srcDatasetId)
          .table(srcTableId)
          .copy(
              this.bigquery
                  .dataset(dstDatasetId)
                  .table(dstTableId)
          )
          .then(checkBigQueryCopyErrors)
          .then(resolve)
          .catch(reject);
    });
  }

  /**
   * Executes a query.
   * @param {string} query
   * @param {string} location
   * @return {Promise}
   */
  query(query, location) {
    const options = {
      query: query,
      // Location must match that of the dataset(s) referenced in the query.
      location: location,
    };

    return this.bigquery.query(options);
  };

  /**
   * Create a BQ query job.
   * @param {string} query
   * @return {Promise}
   */
  createQueryJob(query) {
    return this.bigquery.createQueryJob(query);
  };

  /**
   * Get a BQ job.
   * @param {string} jobId
   * @return {object}
   */
  getJob(jobId) {
    return this.bigquery.job(jobId);
  }

  /**
   * Handle copied data from BQ.
   * @param {object} results
   * @return {Promise}
   */
  checkBigQueryCopyErrors(results) {
    return new Promise((resolve, reject) => {
      const job = results[0];

      console.info(`Job ${job.id} completed.`);

      // Check the job's status for errors
      const errors = job.status.errors;
      if (errors && errors.length > 0) {
        reject(errors);
      }

      resolve(job);
    });
  };
};

module.exports = BigQueryHelper;

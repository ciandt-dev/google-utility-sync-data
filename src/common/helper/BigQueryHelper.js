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
    return this.bigquery
        .dataset(dstDatasetId)
        .table(dstTableId)
        .copy(
            new BigQuery({projectId: srcProjectId})
                .dataset(srcDatasetId)
                .table(srcTableId)
        );
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
};

module.exports = BigQueryHelper;

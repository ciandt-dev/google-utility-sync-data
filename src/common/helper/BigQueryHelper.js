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
   * @param {String} dstProjectId Destination Project ID.
   * @param {String} dstDatasetId Destination Dataset ID.
   * @param {String} dstTableId Destination Dataset table ID.
   * @return {Promise}
   */
  copyTable(
      srcProjectId, srcDatasetId, srcTableId,
      dstProjectId, dstDatasetId, dstTableId) {
    return new Promise((resolve, reject) => {
      return new BigQuery({projectId: srcProjectId})
          .dataset(srcDatasetId)
          .table(srcTableId)
          .copy(
              new BigQuery({projectId: dstProjectId})
                  .dataset(dstDatasetId)
                  .table(dstTableId)
          )
          .then(this.checkBigQueryCopyErrors)
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
   * @param {string | object} options
   * @return {Promise}
   */
  createQueryJob(options) {
    return this.bigquery.createQueryJob(options);
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

  /**
   * Get metada from a table
   * @param {String} projectId
   * @param {String} datasetId
   * @param {String} tableId
   * @return {Promise}
   */
  metadata(projectId, datasetId, tableId) {
    return new BigQuery({projectId: projectId})
        .dataset(datasetId)
        .table(tableId)
        .getMetadata();
  };

  /**
   * Get metada from a table
   * @param {String} projectId
   * @param {String} datasetId
   * @param {String} objectId
   * @return {Promise}
   */
  isView(projectId, datasetId, objectId) {
    return new Promise((resolve, reject) => {
      this.metadata(projectId, datasetId, objectId)
          .then((data) => {
            resolve(data[0].type === 'VIEW');
          })
          .catch(reject);
    });
  };

  /**
   * Get metada from a table
   * @param {String} srcProjectId
   * @param {String} srcDatasetId
   * @param {String} srcViewId
   * @param {String} dstProjectId
   * @param {String} dstDatasetId
   * @param {String} dstTableId
   * @return {Promise}
   */
  copyView(srcProjectId, srcDatasetId, srcViewId,
      dstProjectId, dstDatasetId, dstTableId) {
    return new Promise((resolve, reject) => {
      this.metadata(srcProjectId, srcDatasetId, srcViewId)
          .then((data) => {
            const view = data[0].view;

            this.createQueryJob({
              query: view.query,
              useLegacySql: view.useLegacySql,
              destination: new BigQuery({projectId: dstProjectId})
                  .dataset(dstDatasetId)
                  .table(dstTableId),
            }).then(resolve).catch(reject);
          }).catch(reject);
    });
  };

  /**
   * Copy Resource (View or Table) from a dataset.
   * @param {String} srcProjectId Source Project ID.
   * @param {String} srcDatasetId Source table dataset id.
   * @param {String} srcResourceId Source resource ID.
   * @param {String} dstProjectId Destination Project ID.
   * @param {String} dstDatasetId Destination Dataset ID.
   * @param {String} dstTableId Destination Dataset table ID.
   * @return {Promise}
   */
  copyResource(
      srcProjectId, srcDatasetId, srcResourceId,
      dstProjectId, dstDatasetId, dstTableId) {
    return new Promise((resolve, reject) => {
      this.isView(srcProjectId, srcDatasetId, srcResourceId)
          .then((isResourceView) => {
            if (isResourceView) {
              this.copyView(
                  srcProjectId, srcDatasetId, srcResourceId,
                  dstProjectId, dstDatasetId, dstTableId
              ).then(this.checkCopyViewJobStatus)
                  .then(resolve).catch(reject);
            } else {
              this.copyTable(srcProjectId, srcDatasetId, srcResourceId,
                dstProjectId, dstDatasetId, dstTableId
              ).then(resolve).catch(reject);
            }
          }).catch(reject);
    });
  }

  /**
   * Check status of copy view job
   * @param {object} data
   * @return {Promise}
   */
  checkCopyViewJobStatus(data) {
    const job = data[0];
    return job.getQueryResults();
  };
};

module.exports = BigQueryHelper;

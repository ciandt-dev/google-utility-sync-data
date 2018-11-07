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
   * @param {String} originDatasetId Origin table dataset id.
   * @param {String} originTableId Origin table ID.
   * @param {String} destinationDatasetId Destionation Dataset ID.
   * @param {String} destinationTableId Destination Dataset table ID.
   * @return {Promise}
   */
  copyTable(originDatasetId, originTableId,
      destinationDatasetId, destinationTableId) {
    return nbigquery
        .dataset(originDatasetId)
        .table(originTableId)
        .copy(
            bigquery.dataset(destinationDatasetId).table(destinationTableId)
        );
  }
};

module.exports = BigQueryHelper;

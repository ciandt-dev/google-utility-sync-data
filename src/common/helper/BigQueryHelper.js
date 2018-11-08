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
   * @param {String} destinationProjectId Destination Project ID.
   * @param {String} destinationDatasetId Destination Dataset ID.
   * @param {String} destinationTableId Destination Dataset table ID.
   * @return {Promise}
   */
  static copyTable(
      originDatasetId, originTableId,
      destinationProjectId, destinationDatasetId, destinationTableId) {
    return this.bigquery
        .dataset(originDatasetId)
        .table(originTableId)
        .copy(
            new BigQuery({projectId: destinationProjectId})
                .dataset(destinationDatasetId)
                .table(destinationTableId)
        );
  }

  /**
   * Run a query on a BigQuery Project.
   * @param {object} options BigQuery options
   * @return {Promise}
   */
  query(options) {
    return this.bigquery.query(options);
  }
};

module.exports = BigQueryHelper;

/* eslint-disable max-len */
const {google} = require('googleapis');
const dataflow = google.dataflow('v1b3');
const {logInfo, logError} = require('../util/LogUtil');

/**
 * DataFlow Helper.
 */
class DataFlowHelper {
  /**
   * Constructor for DataFlow Helper.
   * @constructor
   */
  constructor() {}

  /**
 * Build a object to request a new pipeline launch.
 * @param {object} context
 * @param {string} template
 * @return {object}
 */
  requestFactory(context, template) {
    const project = context.dstProjectId;
    const bucket = `${project.replace(/\W/g, '-').toLowerCase()}-dataflow`;
    const strContext = this.getContextString(context);

    return {
      projectId: project,
      requestBody: {
        jobName: `${template.toLowerCase()}-${context.connector.id}-${Math.floor(Date.now())}`,
        parameters: {
          readQuery: context.readQuery,
          readIdColumn: 'unique_id',
          datastoreWriteEntityKind: context.connector.sourceKind,
          datastoreWriteNamespace: context.dstDatasetId,
          datastoreProjectId: project,
          errorWritePath: `gs://${bucket}/error`,
          invalidOutputPath: `gs://${bucket}/error`,
          postExecution: strContext,
          idConnector: String(context.connector.id),
          pubSubErrorNotificationTopic: `projects/${project}/topics/handleErrors`,
          pubSubSuccessNotificationTopic: `projects/${project}/topics/postExecution`,
        },
        environment: {
          tempLocation: `gs://${bucket}/temp`,
        },
      },
      gcsPath: `gs://${bucket}/templates/${template}.json`,
    };
  };

  /**
   * Get context in string mode.
   * @param {object} context
   * @return {string}
   */
  getContextString(context) {
    const _context = JSON.parse(JSON.stringify(context));
    delete _context.readQuery;
    return JSON.stringify(_context);
  };

  /**
   * Responsible to launch the flow.
   * @param {object} _request
   * @return {object}
   */
  launchFlow(_request) {
    return dataflow.projects.templates.launch(_request);
  };

  /**
   * Autho Dataflow.
   * @return {object}
   */
  authDataFlow() {
    return google.auth.getClient({
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });
  };

  /**
 * Launch a new pipeline on Google Data Flow.
 * @param {object} context
 * @param {string} template
 * @return {promise}
 */
  sendToDataFlow(context, template) {
    return new Promise((_resolve, _reject) => {
      logInfo(context, '[DATAFLOW] Launching a new pipeline :: template:'
          , template);

      const _request = this.requestFactory(context, template);
      logInfo(context, '[DATAFLOW] REQUEST ::', _request);

      this.authDataFlow()
          .then((auth) => {
            _request.auth = auth;
            this.launchFlow(_request)
                .then((r) => {
                  logInfo(context, '[DATAFLOW] Launched with success!', r);
                  _resolve(context);
                }).catch((err) => {
                  _reject(err);
                });
          })
          .catch((error) => {
            logError(context, 'Err', error);
            _reject(error);
          });
    });
  };
}


module.exports = DataFlowHelper;

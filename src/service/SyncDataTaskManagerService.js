const {SyncDataTaskManagerStatus} =
  require('../domain/SyncDataTaskManager');
const DatastoreHelper = require('../common/helper/DatastoreHelper');

/**
 * Sync Data Task Manager Service.
 */
class SyncDataTaskManagerService {
  /**
   * SyncDataTaskManagerService constructor.
   */
  constructor() {
    this.datastoreHelper = new DatastoreHelper('ExternalSource');
  }

  /**
   * Create a simple task;
   * @param {SyncDataTaskManager} task
   * @return {Promise}
   */
  createTask(task) {
    return this.datastoreHelper
        .save('SyncDataTaskManager', task, `${task.jobId}-${task.token}`);
  }

  /**
   * Update a task;
   * @param {SyncDataTaskManager} task
   * @return {Promise}
   */
  updateTask(task) {
    return this.datastoreHelper
        .update('SyncDataTaskManager', task, `${task.jobId}-${task.token}`);
  }

  /**
   * Verify if error jobs on firestore.
   * @param {string} jobId
   * @return {Promise}
   */
  hasErrorJobs(jobId) {
    const query = this.datastoreHelper
        .createQuery('SyncDataTaskManager');

    return new Promise((resolve, reject) => {
      query
          .filter('jobId', '=', jobId)
          .filter('status', '=', SyncDataTaskManagerStatus.ERROR)
          .run()
          .then((result) => resolve(result[0].length > 0))
          .catch(reject);
    });
  }

  /**
   * Verify if e
   * @param {string} jobId
   * @return {Promise}
   */
  getTotalSuccessJobs(jobId) {
    const query = this.datastoreHelper
        .createQuery('SyncDataTaskManager');

    return new Promise((resolve, reject) => {
      query
          .filter('jobId', '=', jobId)
          .filter('status', '=', SyncDataTaskManagerStatus.SUCCESS)
          .run()
          .then((result) => resolve(result[0].length))
          .catch(reject);
    });
  }
}

module.exports = SyncDataTaskManagerService;


/**
 * Sync Data Task Manager.
 */
class SyncDataTaskManager {
  /**
   * SyncDataTaskManager constructor.
   * @param {sting} jobId
   * @param {string} token
   */
  constructor(jobId, token) {
    this.jobId = jobId;
    this.token = token;
    this.status = SyncDataTaskManagerStatus.PROCESSING;
  }

  /**
   * Set status to sucess
   */
  setStatusProcessing() {
    this.status = SyncDataTaskManagerStatus.PROCESSING;
  }

  /**
   * Set status to sucess
   */
  setStatusSuccess() {
    this.status = SyncDataTaskManagerStatus.SUCCESS;
  }

  /**
   * Set status to sucess
   */
  setStatusError() {
    this.status = SyncDataTaskManagerStatus.ERROR;
  }
}

const SyncDataTaskManagerStatus = Object.freeze({
  PROCESSING: 1,
  SUCCESS: 2,
  ERROR: 3,
});

module.exports = {
  SyncDataTaskManager,
  SyncDataTaskManagerStatus,
};

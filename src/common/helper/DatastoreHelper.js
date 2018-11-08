const Datastore = require('@google-cloud/datastore');
const {chunckArray} = require('../util/ArrayUtil');

const INTERVAL_SAVE_ENTITIES_BATCH = 3000;
const MAX_CHUNK_SIZE = 300;

/**
 * Datastore Helper.
 */
class DatastoreHelper {
  /**
   * Constructor for Datastore Helper.
   * @param {string} namespace Namespace name.
   * @constructor
   */
  constructor(namespace) {
    this.datastore = new Datastore({namespace: namespace});
    this.namespace = namespace;
  }

  /**
   * Save entity.
   * @param {string} kind
   * @param {object} entity
   * @return {Promise}
   */
  save(kind, entity) {
    if (!kind || !entity) {
      throw Error('Nothing to be save.');
    }

    return this.datastore.save(this._prepare(kind, entity));
  }

  /**
   * Update entity.
   * @param {string} kind
   * @param {object} entity
   * @param {string|number} kindId
   * @return {Promise}
   */
  update(kind, entity, kindId) {
    if (kind || entity || kindId) {
      throw Error('All parameters are required');
    }

    return new Promise((resolve, reject) => {
      this.datastore.get(kindId).then((response) => {
        const updatedEntity = Object.assign(response[0], entity);
        const task = this._prepare(kind, updatedEntity, kindId);

        this.datastore.save(task).then(resolve).catch(reject);
      }).catch(reject);
    });
  }

  /**
   * Save many entities.
   * @param {string} kind
   * @param {array} entities
   * @param {string} kindId
   * @return {Promise}
   */
  saveEntities(kind, entities, kindId) {
    if (!entities) {
      throw Error('Nothing to be save.');
    }

    const tasks = this._prepareList(kind, entities, kindId);
    const rows = chunckArray(tasks, MAX_CHUNK_SIZE);

    return new Promise((resolve) => {
      rows.forEach((row) => {
        this._sleep(INTERVAL_SAVE_ENTITIES_BATCH).then(() => {
          this.datastore.insert(row);
        });
      });

      resolve();
    });
  }

  /**
   * Delete many entities.
   * @param {string} kind
   * @param {array} entities
   * @return {Promise}
   */
  deleteEntities(kind, entities) {
    if (!entities) {
      throw Error('Nothing to be delete.');
    }

    const tasks = this._prepareList(kind, entities, kindId);
    const rows = chunckArray(tasks, MAX_CHUNK_SIZE);

    return new Promise((resolve) => {
      rows.forEach((row) => {
        this._sleep(INTERVAL_SAVE_ENTITIES_BATCH).then(() => {
          const key = datastore.key([kindName, row.id]);
          this.datastore.delete(key);
        });
      });

      resolve();
    });
  }

  /**
   * Prepare entity task to be saved.
   * @param {string} kind Kind name.
   * @param {object} entity Entity object to be savedl
   * @param {string|number} kindId Id used to identify entity.
   * @return {object} Datastore task to be saved.
   */
  _prepare(kind, entity, kindId) {
    if (kindId) {
      return {
        key: this.datastore.key([kind, kindId]),
        data: entity,
      };
    }

    return {
      data: entity
    };
  }

  /**
   * Prepare datastore tasks to be saved.
   * @param {string} kind Kind name.
   * @param {object} entities Entities list to be saved.
   * @param {string} kindId Property name to be used for a entity.
   * @return {srray} Datastore tasks to be saved.
   */
  _prepareList(kind, entities, kindId) {
    const tasks = entities.map((entity) => {
      return this._prepare(kind, entity, kindId);
    });
    return tasks;
  }

  /**
   * Sleep
   * @param {number} ms
   * @return {Promise}
   */
  _sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

module.exports = DatastoreHelper;

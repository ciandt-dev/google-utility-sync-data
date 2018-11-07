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
   * @param {String} namespace Namespace name.
   * @constructor
   */
  constructor(namespace) {
    this.datastore = new Datastore({namespace: namespace});
    this.namespace = namespace;
  }

  /**
   * Save entitie.
   * @param {String} kind
   * @param {object} entity
   * @param {String} keyField
   * @return {Promise}
   */
  save(kind, entity, keyField=null) {
    if (!entities) {
      throw Error('Nothing to be save.');
    }

    const task = this._prepare(kind, entities, keyField);
    return datastore.save(task);
  }

  /**
   * Save many entities.
   * @param {String} kind
   * @param {Array} entities
   * @param {String} keyField
   * @return {Promise}
   */
  saveEntities(kind, entities, keyField=null) {
    if (!entities) {
      throw Error('Nothing to be save.');
    }

    const tasks = this._prepareList(kind, entities, keyField);
    const rows = chunckArray(tasks, MAX_CHUNK_SIZE);

    return new Promise((resolve) => {
      rows.forEach((row) => {
        this._sleep(INTERVAL_SAVE_ENTITIES_BATCH).then(() => {
          datastore.insert(row);
        });
      });

      resolve();
    });
  }

  /**
   * Prepare entity task to be saved.
   * @param {String} kind Kind name.
   * @param {object} entity Entity object to be savedl
   * @param {String} keyField Property name to be used for a entity.
   * @return {object} Datastore task to be saved.
   */
  _prepare(kind, entity, keyField=null) {
    if (keyField && !entity.hasOwnProperty(keyField)) {
      throw Error('An entity does not have the key provided.');
    }

    return {
      key: datastore.key({
        namespace: this.namespace,
        path: keyField ? [kind, entity[keyField]] : [kind],
      }),
      data: entity,
    };
  }

  /**
   * Prepare datastore tasks to be saved.
   * @param {String} kind Kind name.
   * @param {object} entities Entities list to be saved.
   * @param {String} keyField Property name to be used for a entity.
   * @return {Array} Datastore tasks to be saved.
   */
  _prepareList(kind, entities, keyField=null) {
    const tasks = entities.map((entity) => {
      return this.prepare(kind, entity, keyField);
    });
    return tasks;
  }

  /**
   * Sleep
   * @param {Number} ms
   * @return {Promise}
   */
  _sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

module.exports = DatastoreHelper;

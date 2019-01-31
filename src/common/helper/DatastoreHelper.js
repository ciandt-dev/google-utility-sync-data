const {Datastore} = require('@google-cloud/datastore');
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
   * @param {string|number} kindId
   * @return {Promise}
   */
  save(kind, entity, kindId) {
    if (!kind || !entity) {
      throw Error('Nothing to be save.');
    }
    return this.datastore.save(this._prepare(kind, entity, kindId));
  }


  /**
   * Update entity.
   * @param {string} kind
   * @param {object} entity
   * @param {string|number} kindId
   * @return {Promise}
   */
  update(kind, entity, kindId) {
    if (!kind || !entity || !kindId) {
      throw Error('All parameters are required.');
    }

    return new Promise((resolve, reject) => {
      const key = this.datastore.key([kind, kindId]);

      console.log('Key: ' + key);
      console.log('Entity: ' + entity);

      this.datastore.get(key).then((response) => {
        const data = response ? response[0] : {};
        const updatedEntity = Object.assign(data, entity);
        const toSave = this._prepare(kind, updatedEntity, kindId);

        this.datastore.save(toSave).then(resolve).catch(reject);
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
    return this.datastore.upsert(tasks);
  }

  /**
   * Delete many entities.
   * @param {string} kind
   * @param {array} rawKeys
   * @return {Promise}
   */
  deleteEntities(kind, rawKeys) {
    if (!rawKeys) {
      throw Error('Nothing to be delete.');
    }

    const rows = chunckArray(rawKeys, MAX_CHUNK_SIZE);

    return new Promise((resolve, reject) => {
      rows.forEach((row) => {
        this._sleep(INTERVAL_SAVE_ENTITIES_BATCH).then(() => {
          row.forEach((rawKey) => {
            const key = this.datastore.key([kind, rawKey]);
            this.datastore.delete(key).catch(reject);
          });
        });
      });

      resolve();
    });
  }

  /**
   * Filter a kind by property;
   * @param {string} kind Kind name
   * @param {string} property Property to be filtered
   * @param {string} value Property value
   * @return {Promise}
   */
  filter(kind, property, value) {
    return this.createQuery(kind)
        .filter(property, '=', value);
  }

  /**
   * Create a datastore query.
   * @param {string} kind
   * @return {Query}
   */
  createQuery(kind) {
    return this.datastore.createQuery(kind);
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
      key: this.datastore.key(kind),
      data: entity,
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
      return this._prepare(kind, entity, entity[kindId]);
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

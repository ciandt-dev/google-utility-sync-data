const {Firestore} = require('@google-cloud/firestore');

/**
 * Firestore Helper.
 */
class FirestoreHelper {
  /**
   * Constructor for BiqQuery Helper.
   * @constructor
   */
  constructor() {
    this.firestore = new Firestore();
  }

  /**
   * Get a document.
   * @param {string} documentPath
   * @return {DocumentReference}
   */
  document(documentPath) {
    return this.firestore.doc(documentPath);
  };

  /**
   * Save a document on Firestore.
   * @param {String} documentPath
   * @param {objec} obj
   * @return {Promise}
   */
  save(documentPath, obj) {
    const document = this.document(documentPath);
    return document.update(obj);
  };
};

module.exports = FirestoreHelper;

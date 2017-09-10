const firebase = require('firebase');
const Logger   = require('logdown')('FIREBASE_SERVICE');
export default {
  async createUser(username, password) {
    Logger.info(`attempting to create user with email ${username}`);
    let firebaseUser;
    try {
      firebaseUser = await firebase.auth().createUserWithEmailAndPassword(username, password);
      return true;
    } catch (e) {
      Logger.error(`error creating user: ${e}`);
      return false;
    }
  },
  async login(username, password) {
    Logger.info(`attempting to log in user ${email}`);
    try {
      await firebase.auth().signInWithEmailAndPassword(username, password);
      return true;
    } catch (err) {
      Logger.error(`error logging in: ${err}`);
      return false;
    }
  }
}

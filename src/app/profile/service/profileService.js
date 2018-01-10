import * as Logger from 'loglevel';
import axios from 'axios';
import firebase from 'firebase';
const backendUrl = require('../../../../config/private').backendURL;
export const addPersonalAddress = async (addressDetails) => {
  Logger.info(`request made to add new address in profile service`);
  Logger.info(`address: ${JSON.stringify(addressDetails)}`);
  Logger.info(`new address: ${JSON.stringify(addressDetails)}`);
  const headers = {Authorization:  `Bearer ${await firebase.auth().currentUser.getIdToken(true)}`};
  const updatedUser = await axios.post(`${backendUrl}user/address`, {address: addressDetails}, {headers});
  Logger.info(`updated user: ${JSON.stringify(updatedUser)}`);
  if(!updatedUser.data){
    return Logger.warn(`updated user is falsey`);
  }
  Logger.info(`updated user is truthy`);
  //firebase.database().ref(`/users/${this.firebaseId}/addresses`).push(updatedUser.data);
};

import firebase from 'firebase';

export const getUserIdToken = ()=>{
  const user = firebase.auth().currentUser;
  if(user){
    return user.getIdToken();
  }
  return false;
};

import axios from 'axios';
export const createAccountWithFirebaseAuth = ({email, firstName, surname, groupName, identifier}) => {
  axios.post()
};

function formatDetails(details) {
  return {
    name: details.groupName,
    users: [{
      email: details.email,
      firstName: details.firstName,
      surname: details.surname
    }],
    auth: {
      authProviders: [{
        name: 'firebase',
        identifier: details.identifier
      }]
    }
  }
}

import * as constants from './Constants'
import Store from './Store/Store'

export default async function CustomFetch(endpoint, requestData){
  const firebaseUser = Store.getState().firebaseUser
  requestData['userId'] = firebaseUser['uid']
  

  return firebaseUser.getIdToken()
  .then((token) => {
    return fetch(constants.url + endpoint, {
      method: "POST",
      headers: { 
        "Content-type": "application/json",
        "authorization" : token
      },
      body: JSON.stringify(requestData)
    })
    .then(response => response.json())
  })
}
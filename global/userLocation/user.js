import firestore from '@react-native-firebase/firestore';

export const updatePetDetails = (userObj) => {
    return new Promise(async function (resolve, reject) {
        try {
            // userObj.docid = userId;
            // userObj.updated_date = new Date().toLocaleString();
            firestore().collection('userLocation').add(userObj).then((response) => {
                console.log('responsed daataaa=>>>>>>>>>>>>>>>>>>>', response)
                return resolve(response);
            }).catch((error) => {
                return reject('errrrrrrrrr', error);
            })
        }
        catch (e) {
            reject(e)
        }
    });
}



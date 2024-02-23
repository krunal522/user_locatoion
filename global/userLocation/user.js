import firestore from '@react-native-firebase/firestore';

export const updatePetDetails = (userObj) => {
    return new Promise(async function (resolve, reject) {
        try {
            firestore().collection('userLocation').add(userObj).then((response) => {
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



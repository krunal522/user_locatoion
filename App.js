//import liraries
import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, PermissionsAndroid, Dimensions, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import firestore from '@react-native-firebase/firestore';


const { height, width } = Dimensions.get('window');

// create a component move marker click after show longitude and latitude details show here 
const LocationUser = (props) => {
  const [marker, setMarker] = useState('')
  const [coordinate, setCoordinate] = useState({
    focusedLocation: {
      latitude: 19.0760,
      longitude: 72.8777,
      latitudeDelta: 0.0022,
      longitudeDelta: width / height * 0.1122
    },
  })

  useEffect(() => {
    requrestLocationPermission()
    UpdateUser()
  }, [])

  const requrestLocationPermission = async () => {
    Geolocation.getCurrentPosition(pos => {
      const coordsEvent = {
        nativeEvent: {
          coordinate: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          }
        }
      };
      animateMarker(coordsEvent);
    },
      err => {
        setTimeout(() => {
          alert("Could not access location");
        }, 1100);
        console.log(err);
      },
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 100000 }
    )
  }


  //10 min after Firbase realtime Database Update Current user latitude and longitude 
  // 60000 milliseconds = 1 minute

  setInterval(() => {
    UpdateUser()
  }, 600000);




  const UpdateUser = () => {
    let obj = {
      location_latitude: coordinate.focusedLocation.latitude,
      location_longitude: coordinate.focusedLocation.longitude,
    }
    try {
      firestore().collection('userLocation').add(obj).then((response) => {
        console.log('responsed daataaa=>>!!!!!', response)
      })
    } catch (error) {
      console.log('error dataaaa=>>>>>>>>>1!!', error)
    }
  }



  const animateMarker = (event) => {
    const coords = event.nativeEvent.coordinate;

    const newCoordinate = {
      latitude: coords.latitude,
      longitude: coords.longitude,
    };
    setCoordinate({
      ...coordinate,
      focusedLocation: {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.0022,
        longitudeDelta: width / height * 0.0022
      }
    })

    // if (marker) {
    //   marker.animateMarkerToCoordinate(newCoordinate,200);
    // }

  };


  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <MapView
            showsUserLocation={true}
            provider={MapView.PROVIDER_GOOGLE}
            followsUserLocation={true}
            onMapReady={requrestLocationPermission}
            style={styles.mapStyle}
            initialRegion={{
              latitude: coordinate.focusedLocation.latitude,
              longitude: coordinate.focusedLocation.longitude,
              latitudeDelta: 0.0004,
              longitudeDelta: 0.0005,
            }}
            onPress={animateMarker}
          >
            <Marker
              // onDragEnd={() => {
              //   const newCoordinate = marker.coordinate();
              //   marker.animateMarkerToCoordinate(newCoordinate, 1000);
              // }}
              pointerEvents={'auto'}
              centerOffset={{ x: 0, y: 0 }}
              anchor={{ x: 0.69, y: 1 }}
              stopPropagation={true}
              draggable
              provider={Platform.OS == 'android' ? PROVIDER_GOOGLE : null}
              ref={marker => {
                setMarker(marker);
              }}
              coordinate={coordinate.focusedLocation}
              tracksViewChanges={false}>
              <Image source={require('./assets/markerIcon/location.png')} style={{ width: 45, height: 45 }} />
            </Marker>
          </MapView>
        </View>
      </SafeAreaView>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  mapStyle: {
    height: height / 1,
    width: width
  },
});

//make this component available to the app
export default LocationUser;

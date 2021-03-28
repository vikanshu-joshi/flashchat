import {useNavigation} from '@react-navigation/core';
import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import firebase from '../config/firebase';
import {DRAWER_NAVIGATOR, LOGIN_SCREEN} from '../config/Routes';

const Splash = ({navigation}) => {
  const navigator = useNavigation();
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        navigator.reset({
          index: 0,
          routes: [{name: DRAWER_NAVIGATOR}],
        });
      } else {
        setTimeout(() => {
          navigator.reset({
            index: 0,
            routes: [{name: LOGIN_SCREEN}],
          });
        }, 1000);
      }
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>FlashChat</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 32,
  },
});

export default Splash;

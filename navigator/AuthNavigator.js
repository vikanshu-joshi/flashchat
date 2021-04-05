import React from 'react';
import * as RouteNames from '../config/Routes';
import {createStackNavigator} from '@react-navigation/stack';
import Signup from '../screens/Signup';
import Login from '../screens/Login';
import Splash from '../screens/Splash';
import DrawerNavigator from './DrawerNavigator';
import {IconButton} from 'react-native-paper';
import Search from '../screens/Search';
import Messages from '../screens/Messages';
import Calling from '../screens/Calling';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native';
import firebase from '../config/firebase';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  const makeCall = async id => {
    const timestamp = firebase.firestore.Timestamp.now();
    const userData = await firebase
      .firestore()
      .collection('users')
      .doc(id)
      .get();
    const myData = await firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .get();
    const user = userData.data();
    const my = myData.data();
    const callData = {
      to: {
        id: user.id,
        uid: user.uid,
        displayName: user.displayName,
        photoUrl: user.photoURL,
      },
      from: {
        id: my.id,
        uid: my.uid,
        displayName: my.displayName,
        photoUrl: my.photoURL,
      },
      timestamp,
    };
    await firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('live')
      .add(callData);
    await firebase
      .firestore()
      .collection('users')
      .doc(id)
      .collection('live')
      .add(callData);
  };
  return (
    <Stack.Navigator initialRouteName={RouteNames.SPLASH_SCREEN}>
      <Stack.Screen
        name={RouteNames.SPLASH_SCREEN}
        component={Splash}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={RouteNames.SIGNUP_SCREEN}
        component={Signup}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={RouteNames.LOGIN_SCREEN}
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={RouteNames.DRAWER_NAVIGATOR}
        component={DrawerNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={RouteNames.SEARCH_SCREEN}
        component={Search}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name={RouteNames.MESSAGES_SCREEN}
        component={Messages}
        options={({route}) => ({
          title: route.params.displayName,
          headerShown: true,
          headerRight: ({tintColor}) => {
            return (
              <TouchableOpacity
                style={{marginEnd: 16}}
                onPress={e => makeCall(route.params.id)}>
                <Ionicons name="ios-call-sharp" color={tintColor} size={20} />
              </TouchableOpacity>
            );
          },
        })}
      />
      <Stack.Screen
        name={RouteNames.CALL_SCREEN}
        component={Calling}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;

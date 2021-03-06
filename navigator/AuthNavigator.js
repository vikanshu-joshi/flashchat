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
import {useNavigation} from '@react-navigation/core';
import OutgoingCall from '../screens/OutgoingCall';

const Stack = createStackNavigator();

const AuthNavigator = () => {
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
        })}
      />
      <Stack.Screen
        name={RouteNames.CALL_SCREEN}
        component={Calling}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={RouteNames.OUTGOING_CALL_SCREEN}
        component={OutgoingCall}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;

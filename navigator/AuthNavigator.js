import React from 'react';
import * as RouteNames from '../config/Routes';
import {createStackNavigator} from '@react-navigation/stack';
import Signup from '../screens/Signup';
import Login from '../screens/Login';
import Splash from '../screens/Splash';
import DrawerNavigator from './DrawerNavigator';
import {IconButton} from 'react-native-paper';

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
    </Stack.Navigator>
  );
};

export default AuthNavigator;

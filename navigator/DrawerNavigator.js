import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import * as RouteNames from '../config/Routes';
import Contacts from '../screens/Contacts';
import Github from '../screens/Github';
import Settings from '../screens/Settings';
import RequestsTabNavigator from './RequestsTabNavigator';
import TabNavigator from './TabNavigator';
import {useNavigation} from '@react-navigation/core';
import {IconButton} from 'react-native-paper';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const navigation = useNavigation();
  return (
    <Drawer.Navigator
      initialRouteName={RouteNames.TAB_NAVIGATOR}
      screenOptions={{
        headerStyle: {
          elevation: 0,
        },
        headerShown: true,
        headerRight: ({tintColor}) => {
          return (
            <IconButton
              style={{marginEnd: 16}}
              icon="magnify"
              onPress={() => navigation.navigate(RouteNames.SEARCH_SCREEN)}
            />
          );
        },
      }}>
      <Drawer.Screen name={RouteNames.TAB_NAVIGATOR} component={TabNavigator} />
      <Drawer.Screen name={RouteNames.SETTINGS_SCREEN} component={Settings} />
      <Drawer.Screen name={RouteNames.CONTACTS_SCREEN} component={Contacts} />
      <Drawer.Screen
        name={RouteNames.REQUESTS_SCREEN}
        component={RequestsTabNavigator}
      />
      <Drawer.Screen name={RouteNames.GITHUB_SCREEN} component={Github} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

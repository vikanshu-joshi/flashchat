import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import * as RouteNames from '../config/Routes';
import Contacts from '../screens/Contacts';
import Github from '../screens/Github';
import Settings from '../screens/Settings';
import TabNavigator from './TabNavigator';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName={RouteNames.TAB_NAVIGATOR}>
      <Drawer.Screen name={RouteNames.TAB_NAVIGATOR} component={TabNavigator} />
      <Drawer.Screen name={RouteNames.SETTINGS_SCREEN} component={Settings} />
      <Drawer.Screen name={RouteNames.CONTACTS_SCREEN} component={Contacts} />
      <Drawer.Screen name={RouteNames.GITHUB_SCREEN} component={Github} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

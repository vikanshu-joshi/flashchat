import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import * as RouteNames from '../config/Routes';
import React from 'react';
import {Badge, Text} from 'react-native-paper';
import {View} from 'react-native';
import SavedUsers from '../screens/SavedUsers';
import BlockedUsers from '../screens/BlockedUsers';

const Tab = createMaterialTopTabNavigator();

function RequestsTabNavigator({navigation}) {
  return (
    <Tab.Navigator
      initialRouteName={RouteNames.SAVED_USERS}
      backBehavior="none">
      <Tab.Screen
        name={RouteNames.SAVED_USERS}
        component={SavedUsers}
        options={{
          tabBarLabel: ({color, focused}) => {
            return <Text style={{marginEnd: 8, color: color}}>Saved</Text>;
          },
        }}
      />
      <Tab.Screen
        name={RouteNames.BLOCKED_USERS}
        component={BlockedUsers}
        options={{
          tabBarLabel: ({color, focused}) => {
            return <Text style={{marginEnd: 8, color: color}}>Blocked</Text>;
          },
        }}
      />
    </Tab.Navigator>
  );
}

export default RequestsTabNavigator;

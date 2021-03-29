import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import * as RouteNames from '../config/Routes';
import Logs from '../screens/Logs';
import Chats from '../screens/Chats';
import React, {useEffect} from 'react';
import {Badge, Text} from 'react-native-paper';
import {View} from 'react-native';

const Tab = createMaterialTopTabNavigator();

function TabNavigator({navigation}) {
  return (
    <Tab.Navigator
      initialRouteName={RouteNames.CHAT_SCREEN}
      backBehavior="initialRoute">
      <Tab.Screen
        name={RouteNames.CHAT_SCREEN}
        component={Chats}
        options={{
          tabBarLabel: ({color, focused}) => {
            return (
              <View style={{flexDirection: 'row'}}>
                <Text style={{marginEnd: 8, color: color}}>Chats</Text>
                <Badge>3</Badge>
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name={RouteNames.LOG_SCREEN}
        component={Logs}
        options={{
          tabBarLabel: ({color, focused}) => {
            return (
              <View style={{flexDirection: 'row'}}>
                <Text style={{marginEnd: 8, color: color}}>Logs</Text>
                <Badge>9</Badge>
              </View>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}

export default TabNavigator;

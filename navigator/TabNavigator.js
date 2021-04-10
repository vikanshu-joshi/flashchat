import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import * as RouteNames from '../config/Routes';
import Logs from '../screens/Logs';
import Chats from '../screens/Chats';
import React, {useEffect} from 'react';
import {Badge, Text} from 'react-native-paper';
import {View} from 'react-native';
import {useSelector} from 'react-redux';

const Tab = createMaterialTopTabNavigator();

function TabNavigator({navigation}) {
  const chatsState = useSelector(state => state.chatsState);
  return (
    <Tab.Navigator
      initialRouteName={RouteNames.CHAT_SCREEN}
      backBehavior="initialRoute">
      <Tab.Screen
        name={RouteNames.CHAT_SCREEN}
        component={Chats}
        options={{
          tabBarLabel: ({color, focused}) => {
            let count = 0;
            for (
              let index = 0;
              index < Object.keys(chatsState.unreadCount).length;
              index++
            ) {
              const element = Object.keys(chatsState.unreadCount)[index];
              count += chatsState.unreadCount[element] ? 1 : 0;
            }
            return (
              <View style={{flexDirection: 'row'}}>
                <Text style={{marginEnd: 8, color: color}}>Chats</Text>
                {count !== 0 && <Badge>{count}</Badge>}
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
                {/* <Badge>9</Badge> */}
              </View>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}

export default TabNavigator;

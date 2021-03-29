import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import * as RouteNames from '../config/Routes';
import React from 'react';
import Requests from '../screens/Requests';
import SentRequests from '../screens/SentRequests';
import {Badge, Text} from 'react-native-paper';
import {View} from 'react-native';

const Tab = createMaterialTopTabNavigator();

function RequestsTabNavigator({navigation}) {
  return (
    <Tab.Navigator
      initialRouteName={RouteNames.REQUESTS_SCREEN}
      backBehavior="none">
      <Tab.Screen
        name={RouteNames.REQUESTS_SCREEN}
        component={Requests}
        options={{
          tabBarLabel: ({color, focused}) => {
            return (
              <View style={{flexDirection: 'row'}}>
                <Text style={{marginEnd: 8, color: color}}>Received</Text>
                <Badge>3</Badge>
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name={RouteNames.SENT_REQUESTS_SCREEN}
        component={SentRequests}
        options={{
          tabBarLabel: ({color, focused}) => {
            return (
              <View style={{flexDirection: 'row'}}>
                <Text style={{marginEnd: 8, color: color}}>Sent</Text>
                <Badge>8</Badge>
              </View>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}

export default RequestsTabNavigator;

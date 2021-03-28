import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import * as RouteNames from '../config/Routes';
import Logs from '../screens/Logs';
import Chats from '../screens/Chats';

const Tab = createMaterialTopTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName={RouteNames.CHAT_SCREEN}
      backBehavior="initialRoute">
      <Tab.Screen name={RouteNames.CHAT_SCREEN} component={Chats} />
      <Tab.Screen name={RouteNames.LOG_SCREEN} component={Logs} />
    </Tab.Navigator>
  );
}

export default TabNavigator;

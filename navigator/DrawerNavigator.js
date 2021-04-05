import React, {useEffect} from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import * as RouteNames from '../config/Routes';
import Contacts from '../screens/SavedUsers';
import Github from '../screens/Github';
import Settings from '../screens/Settings';
import RequestsTabNavigator from './RequestsTabNavigator';
import TabNavigator from './TabNavigator';
import {useNavigation} from '@react-navigation/core';
import {IconButton, Text} from 'react-native-paper';
import {AppState, Image, TouchableOpacity, View} from 'react-native';
import logo from '../assets/images/logo.png';
import firebase from '../config/firebase';
import {useDispatch} from 'react-redux';
import * as ChatActions from '../redux/action/ChatsActions';

function CustomDrawerContent(props) {
  const dispatch = useDispatch();
  return (
    <DrawerContentScrollView {...props}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
        }}>
        <Image
          source={logo}
          style={{width: 30, height: 30}}
          width={50}
          height={50}
        />
        <Text
          style={{
            fontFamily: 'Montserrat-Bold',
            marginStart: 8,
            fontSize: 18,
          }}>
          FlashChat
        </Text>
      </View>
      <DrawerItemList {...props} />
      <TouchableOpacity
        onPress={e => {
          dispatch(
            ChatActions.ChangeState({
              state: {
                chats: {},
                ids: [],
                unreadCount: {},
                loading: false,
              },
            }),
          );
          firebase.auth().signOut();
        }}
        style={{
          flex: 1,
          flexDirection: 'row',
          margin: 16,
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: 'rgba(28, 28, 30, 0.68)',
            fontWeight: '500',
            marginStart: 2,
          }}>
          Logout
        </Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

const DrawerNavigator = ({route}) => {
  const navigation = useNavigation();
  useEffect(() => {
    AppState.addEventListener('change', state => {
      firebase
        .firestore()
        .collection('status')
        .doc(firebase.auth().currentUser.uid)
        .set({
          online_status: state === 'active' ? 'online' : 'offline',
          timestamp: firebase.firestore.Timestamp.now(),
        });
    });
    const unsubscribe = firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('live')
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            const data = change.doc.data();
            navigation.navigate(RouteNames.CALL_SCREEN, {
              ...data,
              cid: change.doc.id,
            });
            firebase
              .firestore()
              .collection('users')
              .doc(firebase.auth().currentUser.uid)
              .collection('live')
              .doc(change.doc.id)
              .delete();
          }
        });
      });
    return () => {
      unsubscribe();
    };
  }, [route]);
  return (
    <Drawer.Navigator
      initialRouteName={RouteNames.TAB_NAVIGATOR}
      drawerContent={props => <CustomDrawerContent {...props} />}
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
      <Drawer.Screen
        name={RouteNames.CONTACTS_SCREEN}
        component={RequestsTabNavigator}
      />
      <Drawer.Screen name={RouteNames.GITHUB_SCREEN} component={Github} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

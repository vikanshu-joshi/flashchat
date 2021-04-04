import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import AuthNavigator from './navigator/AuthNavigator';
import {BookmarkedReducer} from './redux/reducer/BookmarkedReducer';
import {ChatsReducer} from './redux/reducer/ChatsReducer';
import {AppState, LogBox, PermissionsAndroid} from 'react-native';
import firebase from './config/firebase';

const rootReducer = combineReducers({
  bookmarkedState: BookmarkedReducer,
  chatsState: ChatsReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

const App = () => {
  LogBox.ignoreAllLogs();
  AppState.addEventListener('change', state => {
    firebase
      .firestore()
      .collection('status')
      .doc(firebase.auth().currentUser.uid)
      .set({
        online_status: state === 'active' ? 'online' : 'offline',
      });
  });
  return (
    <Provider store={store}>
      <NavigationContainer theme={DefaultTheme}>
        <PaperProvider theme={PaperDefaultTheme}>
          <AuthNavigator />
        </PaperProvider>
      </NavigationContainer>
    </Provider>
  );
};

export default App;

// private void leaveChannel() {
//   mRtcEngine.leaveChannel();
// }

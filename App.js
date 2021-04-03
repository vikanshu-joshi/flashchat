import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import React from 'react';
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
import {LogBox} from 'react-native';

const rootReducer = combineReducers({
  bookmarkedState: BookmarkedReducer,
  chatsState: ChatsReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

const App = () => {
  LogBox.ignoreAllLogs();
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

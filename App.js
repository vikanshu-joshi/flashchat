import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import AuthNavigator from './navigator/AuthNavigator';
import {BookmarkedReducer} from './redux/reducer/BookmarkedReducer';

const rootReducer = combineReducers({
  bookmarkedState: BookmarkedReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    </Provider>
  );
};

export default App;

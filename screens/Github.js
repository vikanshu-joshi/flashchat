import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import WebView from 'react-native-webview';

const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

const Github = () => {
  return (
    <View
      style={{
        width: dimensions.width,
        height: dimensions.height,
        flex: 1,
      }}>
      <WebView
        source={{
          uri: 'https://github.com/vikanshu-joshi/flashchat',
        }}
      />
    </View>
  );
};

export default Github;

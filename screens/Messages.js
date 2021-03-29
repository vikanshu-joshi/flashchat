import {useNavigation} from '@react-navigation/core';
import React, {useEffect} from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-paper';
import MessageBar from '../components/MessageBar';

const Messages = ({route}) => {
  const navigation = useNavigation();

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}></View>
      <MessageBar id={route.params.id} />
    </View>
  );
};

export default Messages;

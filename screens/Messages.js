import {useNavigation} from '@react-navigation/core';
import React, {useEffect, useRef} from 'react';
import {FlatList, View} from 'react-native';
import {Colors, IconButton, Text} from 'react-native-paper';
import {useSelector} from 'react-redux';
import MessageBar from '../components/MessageBar';
import MessageTile from '../components/MessageTile';

const Messages = ({route}) => {
  const navigation = useNavigation();
  const chatsState = useSelector(
    state => state.chatsState.chats[route.params.id],
  );
  useEffect(() => {
    setTimeout(() => {
      flatListRef !== null && flatListRef.current.scrollToEnd({animated: true});
    }, 500);
  }, [chatsState]);
  const flatListRef = useRef(null);
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1, paddingTop: 8}}>
        <FlatList
          ref={flatListRef}
          data={chatsState ? chatsState : []}
          keyExtractor={item => item.messageId}
          renderItem={({item}) => (
            <MessageTile
              from={item.from}
              messageId={item.messageId}
              text={item.text}
              timestamp={item.timestamp}
              read={item.read}
              id={route.params.id}
            />
          )}
        />
        <IconButton
          style={{
            backgroundColor: Colors.grey400,
            position: 'absolute',
            bottom: 10,
            right: 10,
          }}
          icon="chevron-down"
          onPress={e => {
            flatListRef != null &&
              flatListRef.current.scrollToEnd({animated: true});
          }}
        />
      </View>
      <MessageBar id={route.params.id} flatListRef={flatListRef} />
    </View>
  );
};

export default Messages;

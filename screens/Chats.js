import React, {useEffect} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Text, ProgressBar} from 'react-native-paper';
import {fetchAsync} from '../redux/reducer/ChatsReducer';
import firebase from '../config/firebase';
import {useDispatch, useSelector} from 'react-redux';
import ChatTile from '../components/ChatTile';
import {useNavigation} from '@react-navigation/core';
import {MESSAGES_SCREEN} from '../config/Routes';

const Chats = ({route}) => {
  const chatState = useSelector(state => state.chatsState);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  useEffect(() => {
    if (chatState.ids.length === 0) dispatch(fetchAsync());
  }, [route]);
  return (
    <View style={styles.container}>
      {chatState.loading ? (
        <Text style={styles.label}>Loading...</Text>
      ) : (
        <FlatList
          style={{width: '100%'}}
          data={chatState.ids}
          renderItem={({item}) => {
            return (
              <ChatTile
                from={chatState.chats[item].lastMessage.from}
                sender={chatState.chats[item].uid}
                text={chatState.chats[item].lastMessage.text}
                timestamp={chatState.chats[item].lastMessage.timestamp}
                lastMessage={chatState.chats[item].lastMessage}
                unreadCount={
                  chatState.chats[item].unreadCount
                    ? chatState.chats[item].unreadCount
                    : 0
                }
                onChatOpened={({photoURL, displayName}) =>
                  navigation.navigate(MESSAGES_SCREEN, {
                    id: chatState.chats[item].uid,
                    photoURL,
                    displayName,
                  })
                }
              />
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 32,
  },
});

export default Chats;

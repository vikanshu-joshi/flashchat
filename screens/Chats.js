import React, {useEffect} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {fetchAsync} from '../redux/reducer/ChatsReducer';
import firebase from '../config/firebase';
import {useDispatch, useSelector} from 'react-redux';
import ChatTile from '../components/ChatTile';

const Chats = ({navigation}) => {
  const chatState = useSelector(state => state.chatsState);
  const dispatch = useDispatch();
  useEffect(() => {
    if (chatState === undefined) dispatch(fetchAsync());
  }, [navigation]);
  return (
    <View style={styles.container}>
      <FlatList
        data={chatState.ids}
        renderItem={({item}) => {
          return (
            <ChatTile
              from={item}
              text={
                chatState.chats[item][chatState.chats[item].length - 1].text
              }
              timestamp={
                chatState.chats[item][chatState.chats[item].length - 1]
                  .timestamp
              }
              unreadCount={8}
            />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 32,
  },
});

export default Chats;

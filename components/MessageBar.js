import React, {useState} from 'react';
import {TextInput, View} from 'react-native';
import {Colors, IconButton} from 'react-native-paper';
import firebase from '../config/firebase';

const MessageBar = ({id, flatListRef, roomId}) => {
  const [state, setstate] = useState({
    message: '',
  });
  const onMessageSend = () => {
    flatListRef.current.scrollToEnd({animated: true});
    const timestamp = firebase.firestore.Timestamp.now();
    const messageId = makeid(20);
    const lastMessage = {
      messageId: messageId,
      text: state.message,
      timestamp,
      from: firebase.auth().currentUser.uid,
      read: false,
      hasMedia: false,
      mediaLink: 'null',
      mime: 'null',
      edited: false,
    };
    const messageData = {
      lastMessage,
      roomId,
      timestamp,
    };
    firebase
      .firestore()
      .collection('rooms')
      .doc(roomId)
      .collection('messages')
      .doc(messageId)
      .set({...lastMessage});
    firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('chats')
      .doc(id)
      .set({
        ...messageData,
        uid: id,
      });
    firebase
      .firestore()
      .collection('users')
      .doc(id)
      .collection('chats')
      .doc(firebase.auth().currentUser.uid)
      .set(
        {
          ...messageData,
          unreadCount: firebase.firestore.FieldValue.increment(1),
          uid: firebase.auth().currentUser.uid,
        },
        {merge: true},
      );
    setstate({...state, message: ''});
  };
  return (
    <View
      style={{
        backgroundColor: 'white',
        flexDirection: 'row',
      }}>
      <TextInput
        style={{flex: 1, marginStart: 16, color: Colors.grey900}}
        placeholder="Message"
        placeholderTextColor={Colors.grey700}
        value={state.message}
        onChangeText={text => setstate({...state, message: text})}
      />
      <IconButton icon="send" onPress={onMessageSend} />
    </View>
  );
};

function makeid(length) {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export default MessageBar;
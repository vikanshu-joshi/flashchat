import React, {useState} from 'react';
import {TextInput, View} from 'react-native';
import {Colors, IconButton} from 'react-native-paper';
import firebase from '../config/firebase';

const MessageBar = ({id}) => {
  const [state, setstate] = useState({
    message: '',
  });
  const onMessageSend = () => {
    console.log(id);
    const messageData = {
      text: state.message,
      timestamp: firebase.firestore.Timestamp.now(),
      from: firebase.auth().currentUser.uid,
      read: false,
      type: 'message',
    };
    firebase
      .firestore()
      .collection('users')
      .doc(id)
      .collection('live')
      .add(messageData);
    firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('chats')
      .doc(id)
      .collection('messages')
      .add(messageData);
    firebase
      .firestore()
      .collection('users')
      .doc(id)
      .collection('chats')
      .doc(firebase.auth().currentUser.uid)
      .collection('messages')
      .add(messageData);
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

export default MessageBar;

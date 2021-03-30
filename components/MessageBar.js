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
    const timestamp = firebase.firestore.Timestamp.now();
    const messageData = {
      text: state.message,
      timestamp,
      from: firebase.auth().currentUser.uid,
    };
    firebase
      .firestore()
      .collection('users')
      .doc(id)
      .collection('live')
      .add({...messageData, type: 'message'});
    firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('chats')
      .doc(id)
      .set(messageData);
    firebase
      .firestore()
      .collection('users')
      .doc(id)
      .collection('chats')
      .doc(firebase.auth().currentUser.uid)
      .set(messageData);
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

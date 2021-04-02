import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import firebase from '../config/firebase';
import {Colors, Text} from 'react-native-paper';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';

function MessageTile({message, roomId, id}) {
  const [state, setState] = useState({
    ...message,
  });
  useEffect(() => {
    let unsubscribe = null;
    if (message.from.toString() !== firebase.auth().currentUser.uid.toString()) {
      if(!state.read){
        firebase
        .firestore()
        .collection('rooms')
        .doc(roomId)
        .collection('messages')
        .doc(message.messageId)
        .update({
          read: true,
        });
      firebase
        .firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .collection('chats')
        .doc(id)
        .update({
          unreadCount: firebase.firestore.FieldValue.increment(-1),
        });
      }
    } else {
      unsubscribe = firebase
        .firestore()
        .collection('rooms')
        .doc(roomId)
        .collection('messages')
        .doc(message.messageId)
        .onSnapshot(doc => {
          const data = doc.data();
          setState({
            ...state,
            ...data
          });
        });
    }
    return () => {
      unsubscribe !== null && unsubscribe();
    };
  }, [message]);
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent:
          message.from === firebase.auth().currentUser.uid
            ? 'flex-end'
            : 'flex-start',
      }}>
      <View
        style={
          message.from === firebase.auth().currentUser.uid
            ? styles.messageTextHolderMine
            : styles.messageTextHolderUser
        }>
        <Text
          style={
            message.from === firebase.auth().currentUser.uid
              ? styles.messageText
              : styles.messageText
          }>
          {state.text}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
          <Text
            style={
              message.from === firebase.auth().currentUser.uid
                ? styles.messageTime
                : styles.messageTime
            }>
            {moment(state.timestamp.toDate().toLocaleString()).format(
              'hh:mm a',
            )}
          </Text>
          {message.from === firebase.auth().currentUser.uid && (
            <Ionicons
              name={state.read ? 'checkmark-done' : 'checkmark'}
              color={Colors.grey400}
              style={{alignSelf: 'flex-end', marginStart: 4}}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageTextHolderUser: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: Colors.grey800,
    borderRadius: 8,
    marginHorizontal: 5,
    marginTop: 2,
    flexDirection: 'column',
  },
  messageText: {
    color: 'white',
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    marginEnd: 50,
  },
  messageTime: {
    color: Colors.grey400,
    fontSize: 10,
    marginTop: 3,
    textAlign: 'right',
    fontFamily: 'Montserrat-Light',
  },
  messageTextHolderMine: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: Colors.deepPurple500,
    borderRadius: 8,
    marginHorizontal: 5,
    marginTop: 2,
    flexDirection: 'column',
  },
});

export default MessageTile;

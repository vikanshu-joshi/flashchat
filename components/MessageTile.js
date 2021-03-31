import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import firebase from '../config/firebase';
import {Colors, Text} from 'react-native-paper';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';

function MessageTile({from, messageId, text, timestamp, read, id}) {
  const [state, setState] = useState({
    from: from,
    messageId: messageId,
    text: text,
    read: read,
    timestamp: timestamp,
  });
  useEffect(() => {
    let unsubscribe = null;
    if (from === id) {
      firebase
        .firestore()
        .collection('users')
        .doc(id)
        .collection('chats')
        .doc(firebase.auth().currentUser.uid)
        .update({
          read: true,
        });
      firebase
        .firestore()
        .collection('users')
        .doc(id)
        .collection('chats')
        .doc(firebase.auth().currentUser.uid)
        .collection('messages')
        .doc(messageId)
        .update({read: true});
      firebase
        .firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .collection('chats')
        .doc(id)
        .update({
          read: true,
        });
      firebase
        .firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .collection('chats')
        .doc(id)
        .collection('messages')
        .doc(messageId)
        .update({read: true});
    } else {
      unsubscribe = firebase
        .firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .collection('chats')
        .doc(id)
        .collection('messages')
        .doc(messageId)
        .onSnapshot(doc => {
          const data = doc.data();
          setState({
            from: data.from,
            messageId: data.messageId,
            text: data.text,
            read: data.read,
            timestamp: data.timestamp,
          });
        });
    }
    return () => {
      unsubscribe !== null && unsubscribe();
    };
  }, [from]);
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent:
          from === firebase.auth().currentUser.uid ? 'flex-end' : 'flex-start',
      }}>
      <View
        style={
          from === firebase.auth().currentUser.uid
            ? styles.messageTextHolderMine
            : styles.messageTextHolderUser
        }>
        <Text
          style={
            from === firebase.auth().currentUser.uid
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
              from === firebase.auth().currentUser.uid
                ? styles.messageTime
                : styles.messageTime
            }>
            {moment(state.timestamp.toDate().toLocaleString()).format(
              'hh:mm a',
            )}
          </Text>
          {from === firebase.auth().currentUser.uid && (
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

import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
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
    if (
      message.from.toString() !== firebase.auth().currentUser.uid.toString()
    ) {
      if (!state.read) {
        firebase
          .firestore()
          .collection('rooms')
          .doc(roomId)
          .collection('messages')
          .doc(message.messageId)
          .update({
            read: true,
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
            ...data,
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
        marginHorizontal: 6,
        marginTop: 3,
        justifyContent:
          message.from === firebase.auth().currentUser.uid
            ? 'flex-end'
            : 'flex-start',
      }}>
      <View
        style={{
          backgroundColor:
            message.from === firebase.auth().currentUser.uid
              ? Colors.deepPurple500
              : Colors.grey800,
          flexDirection: 'column',
          borderRadius: 8,
        }}>
        {message.hasMedia && (
          <Image
            style={{
              height: 100,
              resizeMode: 'stretch',
              borderTopLeftRadius: 3,
              borderTopRightRadius: 3,
            }}
            source={{
              uri: message.mediaLink,
            }}
            width={300}
            height={300}
          />
        )}
        <View
          style={{
            padding: 3,
          }}>
          <Text style={styles.messageText}>{state.text}</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginVertical: 3,
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
                color="white"
                style={{alignSelf: 'flex-end', marginHorizontal: 4}}
              />
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageText: {
    color: 'white',
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    marginEnd: 50,
    marginHorizontal: 5,
    marginVertical: 3,
  },
  messageTime: {
    color: Colors.grey400,
    fontSize: 10,
    textAlign: 'right',
    fontFamily: 'Montserrat-Light',
    marginEnd: 3,
  },
});

export default MessageTile;

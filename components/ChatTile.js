import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Avatar, Badge, Text} from 'react-native-paper';
import firebase from '../config/firebase';

function ChatTile({
  from,
  messageId,
  text,
  sender,
  timestamp,
  unreadCount,
  onChatOpened,
}) {
  const [state, setstate] = useState({
    displayName: '...',
    photoURL: 'default',
  });
  useEffect(() => {
    firebase
      .firestore()
      .collection('users')
      .doc(sender)
      .get()
      .then(snapshot => {
        const data = snapshot.data();
        setstate({
          displayName: data.displayName,
          photoURL: data.photoURL,
        });
      });
  }, [sender]);
  return (
    <TouchableOpacity
      onPress={e =>
        onChatOpened({
          id: from,
          displayName: state.displayName,
          photoURL: state.photoURL,
        })
      }>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          padding: 8,
          alignItems: 'center',
          width: '100%',
        }}>
        {state.photoURL === 'default' ? (
          <Avatar.Text label={state.displayName.substr(0, 1)} />
        ) : (
          <Avatar.Image>{state.photoURL}</Avatar.Image>
        )}
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '70%',
            marginHorizontal: 16,
          }}>
          <Text
            style={{
              fontFamily: 'Montserrat-SemiBold',
              fontSize: 16,
            }}>
            {state.displayName}
          </Text>
          <Text
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: 16,
            }}>
            {from === firebase.auth().currentUser.uid ? 'You: ' + text : text}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: unreadCount !== 0 ? 'space-between' : 'center',
            height: '70%',
          }}>
          {unreadCount !== 0 && <Badge>{unreadCount}</Badge>}
          <Text>{timestamp.toDate().toLocaleDateString()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default ChatTile;

import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Avatar, Badge, Text, Colors} from 'react-native-paper';
import firebase from '../config/firebase';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

function ChatTile({
  from,
  messageId,
  text,
  sender,
  timestamp,
  unreadCount,
  lastMessage,
  onChatOpened,
}) {
  const [state, setstate] = useState({
    displayName: '...',
    photoURL: 'default',
    online: false,
    lastSeen: undefined,
  });
  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection('status')
      .doc(sender)
      .onSnapshot(s => {
        if (s.exists) {
          const {online_status, timestamp} = s.data();
          firebase
            .firestore()
            .collection('users')
            .doc(sender)
            .get()
            .then(snapshot => {
              const data = snapshot.data();
              setstate({
                ...state,
                displayName: data.displayName,
                photoURL: data.photoURL,
                online: online_status === 'online',
                lastSeen: moment(timestamp.toDate().toLocaleString()).format(
                  'DD/MM hh:mm a',
                ),
              });
            });
        }
      });
    return () => {
      unsubscribe();
    };
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
          <Avatar.Image source={{uri: state.photoURL}} />
        )}
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '70%',
            marginHorizontal: 16,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'Montserrat-SemiBold',
                fontSize: 16,
              }}>
              {state.displayName}
            </Text>
            {state.online && (
              <View
                style={{
                  borderRadius: 999,
                  width: 10,
                  height: 10,
                  backgroundColor: Colors.green500,
                  marginStart: 10,
                }}
              />
            )}
          </View>
          {from === firebase.auth().currentUser.uid ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  marginEnd: 8,
                  fontFamily: 'Montserrat-Regular',
                  fontSize: 16,
                }}>
                You:
              </Text>
              {lastMessage.hasMedia ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <FontAwesome name="image" />
                  <Text
                    style={{
                      marginStart: 5,
                      fontFamily: 'Montserrat-Regular',
                      fontSize: 16,
                    }}>
                    {text}
                  </Text>
                </View>
              ) : (
                <Text>{text}</Text>
              )}
            </View>
          ) : lastMessage.hasMedia ? (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <FontAwesome name="image" />
              <Text
                style={{
                  marginStart: 5,
                  fontFamily: 'Montserrat-Regular',
                  fontSize: 16,
                }}>
                {text}
              </Text>
            </View>
          ) : (
            <Text>{text}</Text>
          )}
        </View>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: unreadCount !== 0 ? 'space-between' : 'center',
            height: '70%',
          }}>
          {unreadCount !== 0 && <Badge>{unreadCount}</Badge>}
          <Text style={{fontSize: 12}}>
            {timestamp.toDate().toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default ChatTile;

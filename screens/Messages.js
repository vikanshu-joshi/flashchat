import {useNavigation} from '@react-navigation/core';
import React, {useEffect, useRef, useState} from 'react';
import {FlatList, View} from 'react-native';
import {Colors, IconButton, Text} from 'react-native-paper';
import {useSelector} from 'react-redux';
import MessageBar from '../components/MessageBar';
import MessageTile from '../components/MessageTile';
import firebase from '../config/firebase';

const Messages = ({route}) => {
  const navigation = useNavigation();
  const [state, setstate] = useState({
    messages: {},
    messageIds: [],
    loading: false,
    roomId:
      route.params.id > firebase.auth().currentUser.uid
        ? route.params.id + '--' + firebase.auth().currentUser.uid
        : firebase.auth().currentUser.uid + '--' + route.params.id,
  });
  useEffect(() => {
    setstate({
      ...state,
      loading: true,
    });
    const unsubscribe = firebase
      .firestore()
      .collection('rooms')
      .doc(state.roomId)
      .collection('messages')
      .orderBy('timestamp')
      .onSnapshot(snapshot => {
        const fetchedMessages = state.messages;
        const fetchedMessageIds = state.messageIds;
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            const data = change.doc.data();
            if (!fetchedMessageIds.includes(data.messageId))
              fetchedMessageIds.push(data.messageId);
            fetchedMessages[data.messageId] = data;
          }
          if (change.type === 'modified') {
            const data = change.doc.data();
            fetchedMessages[data.messageId] = data;
          }
          if (change.type === 'removed') {
            const data = change.doc.data();
            fetchedMessageIds.filter(item => item !== data.messageId);
            delete fetchedMessages[data.messageId];
          }
        });
        setstate({
          ...state,
          loading: false,
          messageIds: fetchedMessageIds,
          messages: fetchedMessages,
        });
        setTimeout(() => {
          flatListRef !== null &&
            flatListRef.current.scrollToEnd({animated: true});
        }, 500);
      });
    return () => {
      unsubscribe();
    };
  }, [route.params.id]);
  const flatListRef = useRef(null);
  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flex: 1,
          paddingVertical: 8,
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}>
        {state.loading ? (
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              fontSize: 32,
            }}>
            Loading...
          </Text>
        ) : (
          <FlatList
            ref={flatListRef}
            style={{
              width: '100%',
            }}
            data={state.messageIds}
            keyExtractor={item => item.toString()}
            renderItem={({item}) => (
              <MessageTile
                message={state.messages[item]}
                roomId={state.roomId}
                id={route.params.id}
              />
            )}
          />
        )}
        {!state.loading && (
          <IconButton
            style={{
              backgroundColor: Colors.grey400,
              position: 'absolute',
              bottom: 10,
              right: 10,
            }}
            icon="chevron-down"
            onPress={e => {
              flatListRef != null &&
                flatListRef.current.scrollToEnd({animated: true});
            }}
          />
        )}
      </View>
      <MessageBar
        id={route.params.id}
        flatListRef={flatListRef}
        roomId={state.roomId}
      />
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

export default Messages;

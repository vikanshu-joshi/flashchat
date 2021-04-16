import React, {useState} from 'react';
import {Image, TextInput, View} from 'react-native';
import {Colors, IconButton, Text} from 'react-native-paper';
import firebase from '../config/firebase';
import {launchImageLibrary} from 'react-native-image-picker';
import * as mime from 'react-native-mime-types';

const MessageBar = ({id, flatListRef, roomId}) => {
  const [state, setstate] = useState({
    message: '',
    mediaMime: undefined,
    mediaName: undefined,
    mediaUri: undefined,
  });
  const onPickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.3,
      },
      response => {
        if (!response.didCancel) {
          const fileName = response.fileName;
          const fileUri = response.uri;
          const mimeType = mime.lookup(fileUri);
          setstate({
            ...state,
            mediaMime: mimeType,
            mediaName: fileName,
            mediaUri: fileUri,
          });
        } else {
          console.error(response.errorCode, response.errorMessage);
        }
      },
    );
  };
  const onMessageSend = () => {
    flatListRef.current.scrollToEnd({animated: true});
    if (state.mediaUri !== undefined) {
      sendMediaMessage({
        mediaMime: state.mediaMime,
        mediaName: state.mediaName,
        mediaUri: state.mediaUri,
        message: state.message,
      });
      setstate({
        ...state,
        message: '',
        mediaMime: undefined,
        mediaName: undefined,
        mediaUri: undefined,
      });
    } else {
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
        .collection('rooms')
        .doc(roomId)
        .collection('messages')
        .doc(messageId)
        .set({...lastMessage});
      setstate({...state, message: ''});
    }
  };
  const sendMediaMessage = async ({
    message,
    mediaMime,
    mediaName,
    mediaUri,
  }) => {
    const imageId = makeid(10);
    const file = await fetch(mediaUri);
    const blob = await file.blob();
    const extension = mime.extension(mediaMime);
    firebase
      .storage()
      .ref()
      .child('chats')
      .child(`${imageId}.${extension}`)
      .put(blob)
      .on(
        'state_changed',
        snapshot => {
          let newProgress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        error => {
          alert(error.message);
        },
        () => {
          firebase
            .storage()
            .ref()
            .child('chats')
            .child(`${imageId}.${extension}`)
            .getDownloadURL()
            .then(url => {
              const timestamp = firebase.firestore.Timestamp.now();
              const messageId = makeid(20);
              const lastMessage = {
                messageId: messageId,
                text: message,
                timestamp,
                from: firebase.auth().currentUser.uid,
                read: false,
                hasMedia: true,
                mediaLink: url,
                mime: mediaMime,
                mediaName: mediaName,
                edited: false,
              };
              const messageData = {
                lastMessage,
                roomId,
                timestamp,
              };
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
                .collection('rooms')
                .doc(roomId)
                .collection('messages')
                .doc(messageId)
                .set({...lastMessage});
            });
        },
      );
  };
  return (
    <View
      style={{
        backgroundColor: 'white',
        flexDirection: 'column',
      }}>
      {state.mediaUri && (
        <View
          style={{
            backgroundColor: Colors.grey700,
            flexDirection: 'row',
            padding: 8,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}>
          <Image
            style={{
              width: 50,
              height: 50,
              borderRadius: 8,
            }}
            source={{
              uri: state.mediaUri,
            }}
            width={50}
            height={50}
          />
          <Text
            ellipsizeMode="tail"
            style={{flex: 1, marginHorizontal: 8, color: Colors.grey200}}>
            {state.mediaName}
          </Text>
          <IconButton
            icon="close"
            color={Colors.grey200}
            onPress={e =>
              setstate({
                ...state,
                mediaUri: undefined,
                mediaMime: undefined,
                mediaName: undefined,
              })
            }
          />
        </View>
      )}
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
        {state.message === '' && (
          <IconButton icon="image" onPress={onPickImage} />
        )}
        {(state.message !== '' || state.mediaUri) && (
          <IconButton icon="send" onPress={onMessageSend} />
        )}
      </View>
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

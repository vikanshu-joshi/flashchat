import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Avatar, Button, Colors, Text, TextInput} from 'react-native-paper';
import firebase from '../config/firebase';
import {launchImageLibrary} from 'react-native-image-picker';
import * as mime from 'react-native-mime-types';

const Settings = () => {
  const [state, setstate] = useState({
    displayName: firebase.auth().currentUser.displayName,
    photoURL: firebase.auth().currentUser.photoURL,
    mediaMime: undefined,
    mediaName: undefined,
  });
  const onPickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
      },
      response => {
        if (!response.didCancel) {
          const fileName = response.fileName;
          const fileUri = response.uri;
          const mimeType = mime.lookup(fileUri);
          setstate({
            ...state,
            photoURL: fileUri,
            mediaMime: mimeType,
            mediaName: fileName,
          });
        } else {
          console.error(response.errorCode, response.errorMessage);
        }
      },
    );
  };
  const saveImage = async () => {
    const url = state.photoURL;
    if (state.mediaMime !== undefined) {
      const file = await fetch(state.photoURL);
      const blob = await file.blob();
      const extension = mime.extension(state.mediaMime);
      firebase
        .storage()
        .ref()
        .child('profile_images')
        .child(`${firebase.auth().currentUser.uid}.${extension}`)
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
              .child('profile_images')
              .child(`${firebase.auth().currentUser.uid}.${extension}`)
              .getDownloadURL()
              .then(url => saveData(url));
          },
        );
    } else {
      saveData(url);
    }
  };
  const saveData = async photoURL => {
    const data = {
      displayName: state.displayName,
      photoURL: photoURL,
    };
    await firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .update(data);
    await firebase.auth().currentUser.updateProfile(data);
    alert('Profile Information Saved');
  };
  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : ''}>
      <View style={styles.container}>
        <TouchableOpacity
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            borderRadius: 999,
          }}
          onPress={e => onPickImage()}>
          {state.photoURL === 'default' ? (
            <Avatar.Text
              style={styles.image}
              size={200}
              label={firebase.auth().currentUser.displayName.substr(0, 1)}
            />
          ) : (
            <Avatar.Image
              style={styles.image}
              size={200}
              source={{
                uri: state.photoURL,
              }}
            />
          )}
        </TouchableOpacity>
        <TextInput
          value={state.displayName}
          onChangeText={text => setstate({...state, displayName: text})}
          style={{marginHorizontal: 32}}
          placeholder="Name"
        />
        <Button
          style={{marginHorizontal: 32, marginTop: 32}}
          mode="contained"
          onPress={saveImage}>
          Save
        </Button>
        {state.photoURL !== 'default' && (
          <Button
            color={Colors.red500}
            style={{marginHorizontal: 32, marginTop: 16}}
            mode="contained"
            onPress={() => setstate({...state, photoURL: 'default'})}>
            Remove Image
          </Button>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    marginVertical: 32,
  },
});

export default Settings;

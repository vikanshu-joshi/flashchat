import React, {useState} from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Button, TextInput, Text} from 'react-native-paper';
import logo from '../assets/images/logo.png';
import background from '../assets/images/background.png';
import firebase from '../config/firebase';
import {useNavigation} from '@react-navigation/native';
import TypeWriter from 'react-native-typewriter';
import {DRAWER_NAVIGATOR, SIGNUP_SCREEN} from '../config/Routes';

function Login() {
  const [state, setstate] = useState({
    email: '',
    password: '',
  });
  const navigation = useNavigation();
  const loginUser = async () => {
    if (state.email !== '' && state.password !== '') {
      firebase
        .auth()
        .signInWithEmailAndPassword(state.email, state.password)
        .then(user => {
          firebase
            .firestore()
            .collection('status')
            .doc(firebase.auth().currentUser.uid)
            .set({
              online_status: state === 'active' ? 'online' : 'offline',
              timestamp: firebase.firestore.Timestamp.now(),
            });
          navigation.reset({
            index: 0,
            routes: [{name: DRAWER_NAVIGATOR}],
          });
        })
        .catch(err => alert(err.message));
    }
  };
  return (
    <ImageBackground source={background} style={{flex: 1}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : ''}>
        <TouchableWithoutFeedback onPress={e => Keyboard.dismiss()}>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                width={100}
                height={100}
                style={{
                  width: 70,
                  height: 70,
                }}
                source={logo}
              />
              <Text
                style={{
                  fontFamily: 'Montserrat-Bold',
                  fontSize: 32,
                }}>
                <TypeWriter typing={1}>FlashChat</TypeWriter>
              </Text>
            </View>
            <View style={{width: '100%'}}>
              <TextInput
                label="Email"
                mode="outlined"
                keyboardType="email-address"
                style={{marginTop: 32}}
                value={state.email}
                autoCapitalize="none"
                onChangeText={text => setstate({...state, email: text})}
              />
              <TextInput
                label="Password"
                mode="outlined"
                secureTextEntry
                style={{marginTop: 16}}
                value={state.password}
                onChangeText={text => setstate({...state, password: text})}
              />
              <View
                style={{
                  marginTop: 48,
                  flexDirection: 'row',
                }}>
                <Button
                  mode="text"
                  uppercase={false}
                  onPress={() => navigation.navigate(SIGNUP_SCREEN)}>
                  Create New Account ?
                </Button>
                <View style={{flex: 1}} />
                <Button mode="text" uppercase={false} onPress={loginUser}>
                  Log In
                </Button>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

export default Login;

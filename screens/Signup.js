import React, {useState} from 'react';
import {
  ImageBackground,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Button, Colors, Switch, Text, TextInput} from 'react-native-paper';
import background from '../assets/images/background.png';
import firebase from '../config/firebase';
import {useNavigation} from '@react-navigation/native';
import {DRAWER_NAVIGATOR} from '../config/Routes';
import TypeWriter from 'react-native-typewriter';
import logo from '../assets/images/logo.png';

const Signup = () => {
  const navigation = useNavigation();
  const [state, setstate] = useState({
    name: '',
    email: '',
    password: '',
    passwordVisible: true,
  });
  const createAccount = () => {
    try {
      firebase
        .auth()
        .createUserWithEmailAndPassword(state.email, state.password)
        .then(result => {
          if (result.user) {
            firebase.firestore().collection('users').doc(result.user.uid).set({
              displayName: state.name,
              email: state.email,
              photoURL: 'default',
              password: state.password,
              id: result.user.uid,
            });
            navigation.reset({
              index: 0,
              routes: [{name: DRAWER_NAVIGATOR}],
            });
          }
        })
        .catch(err => {
          alert(err.message);
        });
    } catch (ex) {
      console.log('Signup', ex.message);
    }
  };
  return (
    <ImageBackground source={background} style={{flex: 1}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : ''}>
        <TouchableWithoutFeedback
          onPress={e => Keyboard.dismiss()}
          style={{flex: 1}}>
          <View
            style={{
              padding: 16,
              marginTop: 'auto',
              marginBottom: 'auto',
            }}>
            <View
              style={{
                justifyContent: 'center',
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
            <TextInput
              mode="outlined"
              style={{marginTop: 16}}
              value={state.name}
              autoCapitalize="words"
              placeholder="Name"
              keyboardType="default"
              onChangeText={text => setstate({...state, name: text})}
            />
            <TextInput
              mode="outlined"
              style={{marginTop: 16}}
              value={state.email}
              autoCapitalize="none"
              placeholder="Email"
              keyboardType="email-address"
              onChangeText={text => setstate({...state, email: text})}
            />
            <TextInput
              mode="outlined"
              style={{marginTop: 16}}
              value={state.password}
              secureTextEntry={state.passwordVisible}
              placeholder="Password"
              onChangeText={text => setstate({...state, password: text})}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 32,
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 16}}>abc</Text>
              <Switch
                style={{marginHorizontal: 16}}
                trackColor={{
                  false: Colors.grey400,
                  true: Colors.purple200,
                }}
                thumbColor={Colors.purple500}
                value={state.passwordVisible}
                onValueChange={value =>
                  setstate({
                    ...state,
                    passwordVisible: !state.passwordVisible,
                  })
                }
              />
              <Text style={{fontSize: 16}}>***</Text>
            </View>
            <Button
              style={{marginTop: 32}}
              onPress={() => {
                state.name === ''
                  ? alert('Enter a valid name')
                  : createAccount();
              }}>
              Create New Account
            </Button>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Signup;

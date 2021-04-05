import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Avatar, Colors, IconButton, Text} from 'react-native-paper';
import Zocial from 'react-native-vector-icons/Zocial';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RtcEngine, {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora';
import firebase from '../config/firebase';

const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

function Calling({route}) {
  const [state, setstate] = useState({
    from: {
      id: route.params.from.id,
      uid: route.params.from.uid,
      displayName: route.params.from.displayName,
      photoUrl: route.params.from.photoUrl,
    },
    to: {
      id: route.params.to.id,
      uid: route.params.to.uid,
      displayName: route.params.to.displayName,
      photoUrl: route.params.to.photoUrl,
    },
    timestamp: route.params.timestamp,
    engine: undefined,
    joined: false,
    micEnabled: true,
    speaker: false,
  });
  useEffect(() => {
    RtcEngine.create('61a494dd618c4586b98a0e069fd26269')
      .then(engine => {
        engine.addListener('Warning', warn => {
          console.log('Warning', warn);
        });
        engine.addListener('Error', err => {
          console.log('Error', err);
        });
        engine.addListener('UserJoined', (uid, elapsed) => {
          console.log('UserJoined', uid);
        });
        engine.addListener('UserOffline', (uid, reason) => {
          console.log('UserOffline', uid, reason);
        });
        engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
          if (state.engine === undefined)
            setstate({...state, engine: engine, joined: true});
          console.log('JoinChannelSuccess', channel, uid, elapsed);
        });
        if (state.engine === undefined) setstate({...state, engine: engine});
        console.log('Agora Initialized');
      })
      .catch(err => console.log('Agora Failed', err));
  }, [route.params.id]);
  const joinCall = async () => {
    await state.engine.enableVideo();
    await state.engine.enableAudio();
    await state.engine.joinChannel(
      '00661a494dd618c4586b98a0e069fd26269IAD4pMql97Ftz4V0V7JI3cYsCnuAS04u8CGpRl0PX2rZH+IVUyEAAAAAEABqNCIi0nNsYAEAAQDSc2xg',
      'demoChannel1',
      'Extra Optional Data',
      state.from.id === firebase.auth().currentUser.uid
        ? state.from.uid
        : state.to.uid,
    );
  };
  const endCall = async () => {
    await state.engine.leaveChannel();
    setstate({...state, joined: false});
  };
  const _switchMicrophone = () => {
    state.engine
      ?.enableLocalAudio(!state.micEnabled)
      .then(() => {
        setstate({...state, micEnabled: !state.micEnabled});
      })
      .catch(err => {
        console.warn('enableLocalAudio', err);
      });
  };

  const _switchSpeakerphone = () => {
    state.engine
      ?.setEnableSpeakerphone(!state.speaker)
      .then(() => {
        setstate({...state, speaker: !state.speaker});
      })
      .catch(err => {
        console.warn('setEnableSpeakerphone', err);
      });
  };
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
      }}>
      {!state.joined && (
        <Text>
          {state.from.id === firebase.auth().currentUser.uid
            ? 'Outgoing Call'
            : 'Incoming Call'}
        </Text>
      )}
      {!state.joined && (
        <Text
          style={{
            marginTop: 16,
            fontSize: 48,
            fontFamily: 'Montserrat-Bold',
          }}>
          {state.from.id === firebase.auth().currentUser.uid
            ? state.to.displayName
            : state.from.displayName}
        </Text>
      )}
      {!state.joined && (
        <Avatar.Text
          label={
            state.from.id === firebase.auth().currentUser.uid
              ? state.to.displayName.substr(0, 1)
              : state.from.displayName.substr(0, 1)
          }
          size={250}
        />
      )}
      {state.joined && (
        <RtcRemoteView.SurfaceView
          style={styles.remote}
          uid={
            state.from.id === firebase.auth().currentUser.uid
              ? state.to.uid
              : state.from.uid
          }
          channelId="demoChannel1"
          renderMode={VideoRenderMode.Hidden}
          zOrderMediaOverlay={true}
        />
      )}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          width: '100%',
        }}>
        <TouchableOpacity onPress={e => joinCall()}>
          <MaterialIcons name="call" size={50} color={Colors.green700} />
        </TouchableOpacity>
        <View />
        {state.joined && (
          <TouchableOpacity onPress={e => _switchMicrophone()}>
            <MaterialIcons
              name={state.micEnabled ? 'mic' : 'mic-off'}
              size={50}
              color={Colors.red700}
            />
          </TouchableOpacity>
        )}
        {state.joined && (
          <TouchableOpacity onPress={e => _switchSpeakerphone()}>
            <MaterialIcons
              name={state.speaker ? 'speaker' : 'speaker-phone'}
              size={50}
              color={Colors.blue500}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={e => endCall()}>
          <MaterialIcons name="call-end" size={50} color={Colors.red700} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  max: {
    flex: 1,
  },
  buttonHolder: {
    height: 100,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#0093E9',
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
  },
  fullView: {
    width: dimensions.width,
    height: dimensions.height - 100,
  },
  remoteContainer: {
    width: '100%',
    height: 150,
    position: 'absolute',
    top: 5,
  },
  remote: {
    width: 150,
    height: 150,
    marginHorizontal: 2.5,
  },
  noUserText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#0093E9',
  },
});

export default Calling;

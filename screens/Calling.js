import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Avatar, Colors, IconButton, Text} from 'react-native-paper';
import Zocial from 'react-native-vector-icons/Zocial';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RtcEngine, {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora';
import firebase from '../config/firebase';
import {useNavigation} from '@react-navigation/core';

const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

function Calling({route}) {
  const navigation = useNavigation();
  const [engine, setEngine] = useState(undefined);
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
    videoEnabled: true,
    audioEnabled: true,
    frontCamera: true,
    connected: false,
    joined: false,
    optionsVisible: true,
    message: undefined,
  });
  useEffect(() => {
    if (state.from.id === firebase.auth().currentUser.uid) setUpAgora();
    return () => {
      if (engine) engine.destroy();
    };
  }, [route.params.id]);

  const setUpAgora = async () => {
    const engine = await RtcEngine.create('61a494dd618c4586b98a0e069fd26269');
    await engine.enableAudio();
    await engine.enableVideo();
    await engine.joinChannel(
      '00661a494dd618c4586b98a0e069fd26269IAA1m8T3GvZmOEn8CyJx/lwdSzOpSN71gkFR7xfOhE3bO3ZXrgMAAAAAEAAVx5nn2FpyYAEAAQDYWnJg',
      'testChannel',
      null,
      state.from.id === firebase.auth().currentUser.uid
        ? state.from.uid
        : state.to.uid,
    );
    console.log('Agora Initialized');
    engine.addListener('Warning', warn => {
      console.log('Warning', warn);
    });
    engine.addListener('Error', err => {
      console.log('Error', err);
    });
    engine.addListener('UserJoined', (uid, elapsed) => {
      console.log('UserJoined', {uid});
      setstate({...state, connected: true});
      // engine.addListener(
      //   'RemoteVideoStateChanged',
      //   (uid, state, reason, elapsed) => {
      //     console.log('RemoteVideoStateChanged', {uid, state, reason});
      //     if (reason === 3) {
      //       setstate({...state, message: 'User video off'});
      //     } else if (reason === 4 && state.message === 'User video off') {
      //       setstate({...state, message: undefined});
      //     }
      //   },
      // );
      // engine.addListener(
      //   'RemoteAudioStateChanged',
      //   (uid, state, reason, elapsed) => {
      //     console.log('RemoteAudioStateChanged', {uid, state, reason});
      //     if (reason === 5) {
      //       setstate({...state, message: 'User mic off'});
      //     } else if (reason === 6 && state.message === 'User mic off') {
      //       setstate({...state, message: undefined});
      //     }
      //   },
      // );
    });
    engine.addListener('UserOffline', (uid, reason) => {
      console.log('UserOffline', {uid, reason});
      setstate({...state, connected: false, message: 'User Offline'});
    });
    engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
      console.log('JoinChannelSuccess', {channel, uid});
    });
    engine.addListener('UserEnableVideo', (uid, state, reason, elapsed) => {
      console.log('UserEnableVideo', {uid, state, reason});
    });
    engine.addListener('ConnectionStateChanged', (state, reason) => {
      console.log('ConnectionStateChanged', {state, reason});
    });
    setEngine(engine);
    setstate({...state, joined: true});
  };

  const switchCamera = async () => {
    await engine.switchCamera();
  };

  const switchMicrophone = async () => {
    if (engine) {
      if (state.audioEnabled) {
        await engine.disableAudio();
      } else {
        await engine.enableAudio();
      }
      setstate({...state, audioEnabled: !state.audioEnabled});
    }
  };

  const switchVideo = async () => {
    if (engine) {
      if (state.videoEnabled) {
        await engine.disableVideo();
      } else {
        await engine.enableVideo();
      }
      setstate({...state, videoEnabled: !state.videoEnabled});
    }
  };

  const endCall = async () => {
    if (engine && (state.connected || state.joined))
      await engine.leaveChannel();
    navigation.goBack();
  };

  const getAvatar = ({displayName, photoUrl}) => {
    return photoUrl === 'default' ? (
      <Avatar.Text label={displayName.substr(0, 1)} size={300} />
    ) : (
      <Avatar.Image
        source={{
          uri: photoUrl,
        }}
        size={300}
      />
    );
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        backgroundColor: 'red',
      }}>
      <View
        style={{
          width: '100%',
          position: 'absolute',
          right: 0,
          flexDirection: 'column',
          zIndex: 5,
          top: 0,
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}>
        {state.message && (
          <View
            style={{
              width: '100%',
              backgroundColor: 'rgba(255, 87, 51, 0.2)',
              paddingHorizontal: 8,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: 'white',
                flex: 1,
                fontSize: 18,
                fontFamily: 'Montserrat-Medium',
              }}>
              {state.message}
            </Text>
            <IconButton
              icon="close"
              color="white"
              onPress={e => setstate({...state, message: undefined})}
            />
          </View>
        )}
        {!state.connected && !state.joined && (
          <Text
            style={{
              color: 'white',
              fontSize: 22,
              width: '100%',
              paddingVertical: 8,
              marginTop: 30,
              backgroundColor: 'red',
              textAlign: 'center',
              marginBottom: 100,
              fontFamily: 'Montserrat-Medium',
            }}>
            {state.from.id === firebase.auth().currentUser.uid
              ? 'Calling....'
              : `Incoming Call`}
          </Text>
        )}
        {!state.connected &&
          !state.joined &&
          state.to.id === firebase.auth().currentUser.uid &&
          getAvatar({
            displayName: state.to.displayName,
            photoUrl: state.to.photoUrl,
          })}
      </View>
      <TouchableWithoutFeedback
        onPress={e =>
          setstate({...state, optionsVisible: !state.optionsVisible})
        }>
        <View
          style={{
            flex: 1,
            height: dimensions.height,
          }}>
          {state.connected || state.joined ? (
            <RtcRemoteView.SurfaceView
              style={{
                width: dimensions.width,
                height: dimensions.height,
              }}
              uid={
                state.from.id === firebase.auth().currentUser.uid
                  ? state.to.uid
                  : state.from.uid
              }
              channelId="testChannel"
              renderMode={VideoRenderMode.FILL}
              zOrderMediaOverlay={true}
            />
          ) : (
            <RtcLocalView.SurfaceView
              style={{
                width: dimensions.width,
                height: dimensions.height,
              }}
              channelId="testChannel"
              renderMode={VideoRenderMode.FILL}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
      {state.optionsVisible && (
        <View
          style={{
            width: '100%',
            position: 'absolute',
            right: 0,
            left: 0,
            bottom: 20,
            flexDirection: 'row',
            backgroundColor: 'rgba(0,0,0,0)',
            justifyContent: 'space-evenly',
          }}>
          {state.to.id === firebase.auth().currentUser.uid && !state.joined && (
            <CallButton
              icon={
                <MaterialIcons name="call" size={28} color={Colors.green700} />
              }
              onPress={() => setUpAgora()}
            />
          )}
          {(state.connected || state.joined) && (
            <CallButton
              icon={
                <Feather
                  name={state.videoEnabled ? 'video' : 'video-off'}
                  size={24}
                />
              }
              onPress={() => switchVideo()}
            />
          )}
          {(state.connected || state.joined) && (
            <CallButton
              icon={
                <Feather
                  name={state.audioEnabled ? 'mic' : 'mic-off'}
                  size={24}
                />
              }
              onPress={() => switchMicrophone()}
            />
          )}
          {(state.connected || state.joined) && (
            <CallButton
              icon={<Ionicons name="camera-reverse-outline" size={28} />}
              onPress={() => switchCamera()}
            />
          )}
          <CallButton
            icon={
              <MaterialIcons name="call-end" size={28} color={Colors.red700} />
            }
            onPress={() => endCall()}
          />
        </View>
      )}
    </View>
  );
}

const CallButton = ({icon, onPress}) => {
  return (
    <TouchableOpacity onPress={e => onPress()}>
      <View
        style={{
          width: 60,
          height: 60,
          padding: 16,
          backgroundColor: 'white',
          borderRadius: 999,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}>
        {icon}
      </View>
    </TouchableOpacity>
  );
};

export default Calling;

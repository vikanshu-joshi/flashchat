import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import firebase from '../config/firebase';
import RtcEngine, {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora';
import {useNavigation} from '@react-navigation/core';
import {Avatar, Colors, IconButton, Text} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AGORA_APP_ID, AGORA_CALL_TOKEN, AGORA_CHANNEL_NAME} from '../keys';

const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

const CALL_STATE = {
  CALLING: 'Calling ......',
  RINGING: 'Ringing ......',
  CONNECTED: 'Call Connected ......',
  DECLINED: 'Call Declined ......',
};

function OutgoingCall({route}) {
  const navigation = useNavigation();
  const currentUser = firebase.auth().currentUser;

  const [callState, setCallState] = useState(CALL_STATE.CALLING);
  const [rtcEngine, setRtcEngine] = useState(undefined);
  const [state, setstate] = useState({
    callData: {
      to: {
        id: route.params.id,
        uid: undefined,
        displayName: route.params.displayName,
        photoUrl: 'default',
      },
      from: {
        id: currentUser.uid,
        uid: undefined,
        displayName: currentUser.displayName,
        photoUrl: 'default',
      },
    },
    videoEnabled: true,
    audioEnabled: true,
    frontCamera: true,
    optionsVisible: true,
    remoteVideoEnabled: true,
    joined: false,
    channelName:
      route.params.id > firebase.auth().currentUser.uid
        ? route.params.id + '--' + firebase.auth().currentUser.uid
        : firebase.auth().currentUser.uid + '--' + route.params.id,
  });

  useEffect(() => {
    makeCall();
    return () => {
      engine.leaveChannel();
      engine.disableAudio();
      engine.disableVideo();
      engine.removeAllListeners();
      engine.destroy();
    };
  }, [route.params.id]);

  const makeCall = async () => {
    const timestamp = firebase.firestore.Timestamp.now();
    const userData = await firebase
      .firestore()
      .collection('users')
      .doc(route.params.id)
      .get();
    const myData = await firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .get();
    const user = userData.data();
    const my = myData.data();
    const callData = {
      to: {
        id: user.id,
        uid: user.uid,
        displayName: user.displayName,
        photoUrl: user.photoURL,
      },
      from: {
        id: my.id,
        uid: my.uid,
        displayName: my.displayName,
        photoUrl: my.photoURL,
      },
      timestamp,
    };
    await firebase
      .firestore()
      .collection('users')
      .doc(route.params.id)
      .collection('logs')
      .add(callData);
    await firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('logs')
      .add(callData);
    await firebase
      .firestore()
      .collection('users')
      .doc(route.params.id)
      .collection('live')
      .add(callData);
    setUpAgora(callData);
  };

  const setUpAgora = async callData => {
    const engine = await RtcEngine.create(AGORA_APP_ID);
    await engine.enableVideo();
    await engine.enableAudio();
    await engine.joinChannel(
      AGORA_CALL_TOKEN,
      AGORA_CHANNEL_NAME,
      null,
      callData.from.uid,
    );
    await engine.muteLocalAudioStream(true);
    setUpAgoraListener(engine, callData);
  };

  const setUpAgoraListener = (engine, callData) => {
    engine.addListener('Error', err => {
      console.log({err});
    });
    engine.addListener('Warn', warn => {
      console.log({warn});
    });
    engine.addListener('UserJoined', (uid, elapsed) => {
      setCallState(CALL_STATE.RINGING);
    });
    engine.addListener(
      'RemoteAudioStateChanged',
      (uid, state, reason, elapsed) => {
        if (reason === 6) {
          engine.muteLocalAudioStream(false);
          setCallState(CALL_STATE.CONNECTED);
        }
      },
    );
    engine.addListener('UserOffline', (uid, reason) => {
      if (callState === CALL_STATE.RINGING) {
        setCallState(CALL_STATE.DECLINED);
      } else {
        engine.leaveChannel();
        engine.disableAudio();
        engine.disableVideo();
        engine.removeAllListeners();
        engine.leaveChannel();
        engine.destroy();
        navigation.goBack();
      }
    });
    setRtcEngine(engine);
    setstate({...state, joined: true, callData: callData});
  };

  const switchCamera = async () => {
    await rtcEngine.switchCamera();
  };
  const switchMicrophone = async () => {
    if (rtcEngine) {
      await rtcEngine.muteLocalAudioStream(state.audioEnabled);
      setstate({...state, audioEnabled: !state.audioEnabled});
    }
  };
  const switchVideo = async () => {
    if (rtcEngine) {
      await rtcEngine.muteLocalVideoStream(state.videoEnabled);
      setstate({...state, videoEnabled: !state.videoEnabled});
    }
  };
  const endCall = async () => {
    await rtcEngine.leaveChannel();
    await rtcEngine.disableAudio();
    await rtcEngine.disableVideo();
    await rtcEngine.removeAllListeners();
    await rtcEngine.leaveChannel();
    await rtcEngine.destroy();
    navigation.goBack();
  };
  const getAvatar = ({displayName, photoUrl}) => {
    return photoUrl === 'default' ? (
      <Avatar.Text label={displayName.substr(0, 1)} size={150} />
    ) : (
      <Avatar.Image
        source={{
          uri: photoUrl,
        }}
        size={150}
      />
    );
  };

  return (
    <View
      style={{
        flex: 1,
      }}>
      {callState === CALL_STATE.CONNECTED ? (
        <TouchableWithoutFeedback
          style={{
            width: dimensions.width,
            height: dimensions.height,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          onPress={e =>
            setstate({...state, optionsVisible: !state.optionsVisible})
          }>
          <RtcRemoteView.SurfaceView
            style={{
              width: dimensions.width,
              height: dimensions.height,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            uid={state.callData.to.uid}
            channelId={state.channelName}
            renderMode={VideoRenderMode.FILL}
            zOrderMediaOverlay={true}
          />
        </TouchableWithoutFeedback>
      ) : state.joined ? (
        <RtcLocalView.SurfaceView
          style={{
            width: dimensions.width,
            height: dimensions.height,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          channelId="testChannel"
          renderMode={VideoRenderMode.FILL}
        />
      ) : (
        <View
          style={{
            width: dimensions.width,
            height: dimensions.height,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: Colors.grey800,
          }}
        />
      )}
      {state.optionsVisible &&
        (callState === CALL_STATE.CONNECTED ? (
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
              zIndex: 10,
            }}>
            <CallButton
              icon={
                <Feather
                  name={state.videoEnabled ? 'video' : 'video-off'}
                  size={24}
                />
              }
              onPress={() => switchVideo()}
            />
            <CallButton
              icon={
                <Feather
                  name={state.audioEnabled ? 'mic' : 'mic-off'}
                  size={24}
                />
              }
              onPress={() => switchMicrophone()}
            />
            <CallButton
              icon={<Ionicons name="camera-reverse-outline" size={28} />}
              onPress={() => switchCamera()}
            />
            <CallButton
              icon={
                <MaterialIcons
                  name="call-end"
                  size={28}
                  color={Colors.red700}
                />
              }
              onPress={() => endCall()}
            />
          </View>
        ) : (
          <View
            style={{
              width: dimensions.width,
              height: dimensions.height,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              zIndex: 10,
              backgroundColor: 'rgba(0,0,0,0)',
            }}>
            <Text
              style={{
                fontSize: 22,
                fontFamily: 'Montserrat-Medium',
                width: dimensions.width,
                backgroundColor: 'rgba(0,0,0,0.5)',
                textAlign: 'center',
                color: 'white',
                paddingVertical: 8,
              }}>
              {callState}
            </Text>
            {getAvatar({
              displayName: route.params.displayName,
              photoUrl: state.callData.to.photoUrl,
            })}
            <Text
              style={{
                fontSize: 28,
                fontFamily: 'Montserrat-Bold',
                width: dimensions.width,
                backgroundColor: 'rgba(0,0,0,0.5)',
                textAlign: 'center',
                color: 'white',
                paddingVertical: 8,
              }}>
              {state.callData.to.displayName}
            </Text>
            <TouchableOpacity onPress={e => endCall()}>
              <View
                style={{
                  width: 100,
                  height: 100,
                  padding: 16,
                  backgroundColor: 'white',
                  borderRadius: 999,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}>
                <MaterialIcons
                  name="call-end"
                  size={50}
                  color={Colors.red700}
                />
              </View>
            </TouchableOpacity>
          </View>
        ))}
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

export default OutgoingCall;

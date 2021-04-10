import React, {useEffect, useState} from 'react';
import {Dimensions, TouchableOpacity, View} from 'react-native';
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

const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

function OutgoingCall({route}) {
  const navigation = useNavigation();
  const currentUser = firebase.auth().currentUser;
  const [connected, setConnected] = useState(false);
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
    rtcEngine: undefined,
    videoEnabled: true,
    audioEnabled: true,
    frontCamera: true,
    joined: false,
    optionsVisible: true,
    remoteVideoEnabled: true,
  });
  useEffect(() => {
    makeCall();
    return () => {
      if (state.rtcEngine) state.rtcEngine.destroy();
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
      .collection('live')
      .add(callData);
    setUpAgora(callData);
  };
  const setUpAgora = async callData => {
    const engine = await RtcEngine.create('61a494dd618c4586b98a0e069fd26269');
    await engine.enableAudio();
    await engine.enableVideo();
    await engine.joinChannel(
      '00661a494dd618c4586b98a0e069fd26269IAA1m8T3GvZmOEn8CyJx/lwdSzOpSN71gkFR7xfOhE3bO3ZXrgMAAAAAEAAVx5nn2FpyYAEAAQDYWnJg',
      'testChannel',
      null,
      callData.from.uid,
    );
    setUpAgoraListener(engine, callData);
  };
  const setUpAgoraListener = (engine, callData) => {
    engine.addListener('Warning', warn => {
      console.log('Warning', warn);
    });
    engine.addListener('Error', err => {
      console.log('Error', err);
    });
    engine.addListener('UserJoined', (uid, elapsed) => {
      console.log('UserJoined', {uid});
      setConnected(true);
    });
    engine.addListener('UserOffline', (uid, elapsed) => {
      console.log('UserOffline', {uid});
      endCall();
    });
    setstate({...state, rtcEngine: engine, joined: true, callData: callData});
  };
  const switchCamera = async () => {
    await state.rtcEngine.switchCamera();
  };
  const switchMicrophone = async () => {
    if (state.rtcEngine) {
      if (state.audioEnabled) {
        await state.rtcEngine.disableAudio();
      } else {
        await state.rtcEngine.enableAudio();
      }
      setstate({...state, audioEnabled: !state.audioEnabled});
    }
  };
  const switchVideo = async () => {
    if (state.rtcEngine) {
      if (state.videoEnabled) {
        await state.rtcEngine.disableVideo();
      } else {
        await state.rtcEngine.enableVideo();
      }
      setstate({...state, videoEnabled: !state.videoEnabled});
    }
  };
  const endCall = async () => {
    if (state.rtcEngine && (connected || state.joined))
      await state.rtcEngine.leaveChannel();
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
      {!connected ? (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            width: dimensions.width,
            height: dimensions.height,
            backgroundColor: 'grey',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}>
          {state.joined ? (
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
            Calling......
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
          <View
            style={{
              width: dimensions.width,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
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
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            width: dimensions.width,
            height: dimensions.height,
            backgroundColor: 'grey',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}>
          <RtcRemoteView.SurfaceView
            style={{
              width: dimensions.width,
              height: dimensions.height,
            }}
            uid={state.callData.to.uid}
            channelId="testChannel"
            renderMode={VideoRenderMode.FILL}
            zOrderMediaOverlay={true}
          />
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
          )}
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

export default OutgoingCall;

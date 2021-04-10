import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Avatar, Colors, IconButton, Text} from 'react-native-paper';
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
import {AGORA_CALL_TOKEN, AGORA_APP_ID} from '../keys';

const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

function Calling({route}) {
  const navigation = useNavigation();
  const [connected, setConnected] = useState(false);
  const [rtcEngine, setRtcEngine] = useState(undefined);
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
    optionsVisible: true,
    joined: false,
    channelName:
      route.params.to.id > firebase.auth().currentUser.uid
        ? route.params.to.id + '--' + firebase.auth().currentUser.uid
        : firebase.auth().currentUser.uid + '--' + route.params.to.id,
  });
  useEffect(() => {
    setUpAgora();
    return () => {
      engine.leaveChannel();
      engine.disableAudio();
      engine.disableVideo();
      engine.removeAllListeners();
      engine.destroy();
    };
  }, [route.params.to.id]);

  const setUpAgora = async () => {
    const engine = await RtcEngine.create(AGORA_APP_ID);
    await engine.enableVideo();
    await engine.enableAudio();
    await engine.joinChannel(
      AGORA_CALL_TOKEN,
      'testingChannel',
      null,
      state.to.uid,
    );
    await engine.muteLocalAudioStream(true);
    setUpListeners(engine);
  };

  const joinCall = async () => {
    await rtcEngine.muteLocalAudioStream(false);
    setConnected(true);
  };

  const setUpListeners = engine => {
    engine.addListener('UserOffline', (uid, reason) => {
      engine.leaveChannel();
      engine.disableAudio();
      engine.disableVideo();
      engine.removeAllListeners();
      engine.leaveChannel();
      engine.destroy();
      navigation.goBack();
    });
    engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
      setstate({...state, joined: true});
    });
    setRtcEngine(engine);
  };

  const switchCamera = async () => {
    await rtcEngine.switchCamera();
  };

  const switchMicrophone = async () => {
    await rtcEngine.muteLocalAudioStream(state.audioEnabled);
    setstate({...state, audioEnabled: !state.audioEnabled});
  };
  const switchVideo = async () => {
    await rtcEngine.muteLocalVideoStream(state.videoEnabled);
    setstate({...state, videoEnabled: !state.videoEnabled});
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
      <Avatar.Text label={displayName.substr(0, 1)} size={200} />
    ) : (
      <Avatar.Image
        source={{
          uri: photoUrl,
        }}
        size={200}
      />
    );
  };

  return (
    <View
      style={{
        flex: 1,
      }}>
      {connected ? (
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
            uid={state.from.uid}
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
        (connected ? (
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
              Incoming Call ......
            </Text>
            {getAvatar({
              displayName: state.from.displayName,
              photoUrl: state.from.photoUrl,
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
              {state.from.displayName}
            </Text>
            <View
              style={{
                width: dimensions.width,
                justifyContent: 'space-evenly',
                flexDirection: 'row',
              }}>
              <TouchableOpacity onPress={e => joinCall()}>
                <View
                  style={{
                    width: 80,
                    height: 80,
                    padding: 16,
                    backgroundColor: 'white',
                    borderRadius: 999,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}>
                  <MaterialIcons
                    name="call"
                    size={40}
                    color={Colors.green700}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={e => endCall()}>
                <View
                  style={{
                    width: 80,
                    height: 80,
                    padding: 16,
                    backgroundColor: 'white',
                    borderRadius: 999,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}>
                  <MaterialIcons
                    name="call-end"
                    size={40}
                    color={Colors.red700}
                  />
                </View>
              </TouchableOpacity>
            </View>
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

export default Calling;

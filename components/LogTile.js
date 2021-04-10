import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Avatar, Badge, Text, Colors} from 'react-native-paper';
import firebase from '../config/firebase';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

function LogTile({callDetails, onPress}) {
  const [state, setstate] = useState({
    from: {
      id: callDetails.from.id,
      uid: callDetails.from.uid,
      displayName: callDetails.from.displayName,
      photoUrl: callDetails.from.photoUrl,
    },
    to: {
      id: callDetails.to.id,
      uid: callDetails.to.uid,
      displayName: callDetails.to.displayName,
      photoUrl: callDetails.to.photoUrl,
    },
    timestamp: callDetails.timestamp,
    cid: callDetails.cid,
    incoming: callDetails.to.id === firebase.auth().currentUser.uid,
  });
  return (
    <TouchableOpacity
      onPress={e =>
        onPress({
          displayName: state.incoming
            ? state.from.displayName
            : state.to.displayName,
          id: state.incoming ? state.from.id : state.to.id,
        })
      }>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          padding: 8,
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          paddingHorizontal: 16,
        }}>
        {(state.incoming ? state.from.photoUrl : state.to.photoUrl) ===
        'default' ? (
          <Avatar.Text
            size={60}
            label={
              state.incoming
                ? state.from.displayName.substr(0, 1)
                : state.to.displayName.substr(0, 1)
            }
          />
        ) : (
          <Avatar.Image
            size={60}
            source={{
              uri: state.incoming ? state.from.photoUrl : state.to.photoUrl,
            }}
          />
        )}
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '70%',
            marginHorizontal: 16,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'Montserrat-SemiBold',
                fontSize: 16,
              }}>
              {state.incoming ? state.from.displayName : state.to.displayName}
            </Text>
          </View>
          <Text>
            {moment(state.timestamp.toDate().toLocaleString()).format(
              'DD/MM hh:mm a',
            )}
          </Text>
        </View>
        <MaterialCommunityIcons
          name={state.incoming ? 'call-received' : 'call-made'}
          color={state.incoming ? Colors.green700 : Colors.blue700}
          size={20}
        />
      </View>
    </TouchableOpacity>
  );
}

export default LogTile;

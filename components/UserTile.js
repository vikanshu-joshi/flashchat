import React, {useState} from 'react';
import {Image, TouchableHighlight, TouchableOpacity, View} from 'react-native';
import {Avatar, Text} from 'react-native-paper';
import bookmark from '../assets/images/bookmark.png';
import bookmarked from '../assets/images/bookmarked.png';

const UserTile = ({
  id,
  photoURL,
  displayName,
  onUserSelected,
  onUserBookmarked,
  darkMode,
  isSaved,
}) => {
  const [state, setstate] = useState({
    userBookmarked: isSaved,
  });

  return (
    <TouchableHighlight
      underlayColor={darkMode ? 'rgba(225,225,225,0.3)' : 'rgba(0,0,0,0.1)'}
      onPress={() => {
        onUserSelected({id, photoURL, displayName, isSaved});
      }}>
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: 16,
          marginVertical: 8,
          alignItems: 'center',
        }}>
        {photoURL === 'default' ? (
          <Avatar.Text size={50} label={displayName.substr(0, 1)} />
        ) : (
          <Avatar.Image size={50} source={{uri: photoURL}} />
        )}
        <View style={{flex: 1}}>
          <Text
            style={{
              marginHorizontal: 18,
              fontSize: 18,
              fontFamily: 'Montserrat-Medium',
            }}>
            {displayName}
          </Text>
          <Text
            style={{
              marginHorizontal: 18,
              fontSize: 12,
              marginTop: 2,
              fontFamily: 'Montserrat-Regular',
            }}>
            {id}
          </Text>
        </View>
        <TouchableOpacity
          onPress={e => {
            onUserBookmarked({
              id,
              photoURL,
              displayName,
              isSaved: state.userBookmarked,
            });
            setstate({...state, userBookmarked: !state.userBookmarked});
          }}>
          <Image
            source={state.userBookmarked ? bookmarked : bookmark}
            style={{
              padding: 5,
              width: 20,
              height: 20,
              resizeMode: 'center',
            }}
          />
        </TouchableOpacity>
      </View>
    </TouchableHighlight>
  );
};

export default UserTile;

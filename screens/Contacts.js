import React, {useEffect, useState} from 'react';
import {Divider, ProgressBar, Text} from 'react-native-paper';
import {FlatList, RefreshControl, StyleSheet, View} from 'react-native';
import SearchBar from '../components/SearchBar';
import {useDispatch, useSelector} from 'react-redux';
import UserTile from '../components/UserTile';
import firebase from '../config/firebase';
import {fetchAsync} from '../redux/reducer/BookmarkedReducer';
import {RemoveBookmark} from '../redux/action/BookmarkedActions';

const Contacts = ({navigation}) => {
  const dispatch = useDispatch();
  const bookmarks = useSelector(state => state.bookmarkedState);
  const onRefresh = () => dispatch(fetchAsync());
  useEffect(() => {
    if (bookmarks.bookmarkedUsers.length === 0) {
      dispatch(fetchAsync());
    }
  }, [navigation]);
  return (
    <View style={styles.container}>
      {bookmarks.loading && <ProgressBar indeterminate={true} />}
      {bookmarks.bookmarkedUsers.length === 0 ? (
        <View
          style={{
            marginTop: 80,
          }}>
          <Text
            style={{
              textAlign: 'center',
            }}>
            No Users Saved
          </Text>
        </View>
      ) : (
        <FlatList
          refreshControl={<RefreshControl onRefresh={onRefresh} />}
          data={bookmarks.bookmarkedUsers}
          keyExtractor={item => item.id.toString()}
          ItemSeparatorComponent={() => (
            <Divider
              style={{
                backgroundColor: false
                  ? 'rgba(200,200,200,0.3)'
                  : 'rgba(0,0,0,0.5)',
              }}
            />
          )}
          renderItem={({item}) => (
            <UserTile
              {...item}
              darkMode={false}
              isSaved={true}
              onUserSelected={({id, photoURL, displayName}) => {}}
              onUserBookmarked={({id, photoURL, displayName, isSaved}) => {
                firebase
                  .firestore()
                  .collection('users')
                  .doc(firebase.auth().currentUser.uid)
                  .collection('bookmarked')
                  .doc(id)
                  .delete();
                dispatch(RemoveBookmark({id: id}));
              }}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 32,
  },
});

export default Contacts;

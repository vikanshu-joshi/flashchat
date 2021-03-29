import React, {useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Text, ProgressBar} from 'react-native-paper';
import SearchBar from '../components/SearchBar';
import UserTile from '../components/UserTile';
import firebase from '../config/firebase';

const Search = () => {
  const [state, setstate] = useState({
    loading: false,
    users: [],
    message: 'Search',
  });
  const onSearch = async query => {
    setstate({...state, loading: true, message: 'Searching......'});
    try {
      const snapshot = await firebase
        .firestore()
        .collection('users')
        .where('displayName', '>=', query)
        .get();
      const searchedUsers = [];
      snapshot.docs.forEach(document => {
        const data = document.data();
        if (data.id !== firebase.auth().currentUser.uid)
          searchedUsers.push({...data});
      });
      setstate({
        ...state,
        users: searchedUsers,
        loading: false,
        message: searchedUsers.length === 0 ? 'No users found' : 'Search',
      });
    } catch (ex) {
      console.log(ex.message, query);
      setstate({
        ...state,
        users: [],
        loading: false,
        message: 'Failed to search',
      });
    }
  };
  return (
    <View style={styles.container}>
      <SearchBar onSearch={onSearch} />
      {state.loading && <ProgressBar indeterminate />}
      <View style={styles.container}>
        {state.users.length === 0 ? (
          <Text style={styles.label}>{state.message}</Text>
        ) : (
          <FlatList
            data={state.users}
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
                onUserSelected={({id, photoURL, displayName}) => {}}
                onUserBookmarked={({id, photoURL, displayName, isSaved}) => {
                  if (isSaved) {
                    firebase
                      .firestore()
                      .collection('users')
                      .doc(firebase.auth().currentUser.uid)
                      .collection('bookmarked')
                      .doc(id)
                      .delete();
                  } else {
                    firebase
                      .firestore()
                      .collection('users')
                      .doc(firebase.auth().currentUser.uid)
                      .collection('bookmarked')
                      .doc(id)
                      .set({
                        id,
                        photoURL,
                        displayName,
                        timestamp: firebase.firestore.Timestamp.now(),
                      });
                  }
                }}
              />
            )}
          />
        )}
      </View>
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
    marginTop: 80,
    textAlign: 'center',
  },
});

export default Search;

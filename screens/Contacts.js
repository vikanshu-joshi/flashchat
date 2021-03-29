import React, {useState} from 'react';
import {ProgressBar} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import SearchBar from '../components/SearchBar';

const Contacts = () => {
  const [state, setstate] = useState({
    loading: false,
  });
  const onSearch = query => {
    setstate({...state, loading: true});
  };
  return (
    <View style={styles.container}>
      <SearchBar onSearch={onSearch} />
      {state.loading && <ProgressBar indeterminate={true} />}
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

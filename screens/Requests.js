import React, {useState} from 'react';
import {ProgressBar} from 'react-native-paper';
import {RefreshControl, ScrollView, StyleSheet, View} from 'react-native';
import SearchBar from '../components/SearchBar';

const Requests = () => {
  const [state, setstate] = useState({
    loading: false,
  });
  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={state.loading} />}>
        <View />
      </ScrollView>
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

export default Requests;

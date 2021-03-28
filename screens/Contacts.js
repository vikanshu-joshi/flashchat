import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';

const Contacts = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Contacts</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 32,
  },
});

export default Contacts;

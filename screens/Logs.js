import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';

const Logs = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Logs</Text>
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

export default Logs;

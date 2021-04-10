import React, {useEffect} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import LogTile from '../components/LogTile';
import {fetchAsync} from '../redux/reducer/LogsReducer';
import {useNavigation} from '@react-navigation/core';
import * as RouteNames from '../config/Routes';

const Logs = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const logState = useSelector(state => state.logsState);
  useEffect(() => {
    if (logState.ids.length === 0) dispatch(fetchAsync());
  }, [route]);
  const callUser = ({displayName, id}) => {
    navigation.navigate(RouteNames.OUTGOING_CALL_SCREEN, {
      id: id,
      displayName: displayName,
    });
  };
  return (
    <View style={styles.container}>
      {logState.loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          style={{
            width: '100%',
            marginTop: 8,
          }}
          data={logState.ids}
          renderItem={({item}) => {
            return (
              <LogTile
                callDetails={{...logState.logs[item], cid: item}}
                onPress={callUser}
              />
            );
          }}
          keyExtractor={item => item.toString()}
        />
      )}
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

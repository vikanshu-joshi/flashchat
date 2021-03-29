import React, {useState} from 'react';
import {Keyboard, TextInput, View} from 'react-native';
import {IconButton, Colors} from 'react-native-paper';

function SearchBar({onSearch}) {
  const [state, setstate] = useState({
    query: '',
  });
  return (
    <View
      style={{
        backgroundColor: Colors.grey400,
        flexDirection: 'row',
      }}>
      <TextInput
        style={{flex: 1, marginStart: 16, color: 'black'}}
        placeholderTextColor={Colors.grey600}
        placeholder="Search"
        value={state.query}
        onChangeText={text => setstate({...state, query: text})}
      />
      <IconButton
        style={{
          marginHorizontal: 8,
        }}
        icon="magnify"
        onPress={e => {
          onSearch();
          Keyboard.dismiss();
        }}
      />
    </View>
  );
}

export default SearchBar;

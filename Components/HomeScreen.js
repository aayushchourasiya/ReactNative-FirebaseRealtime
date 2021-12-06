import React, {createRef, Fragment, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import database from '@react-native-firebase/database';

export default function HomeScreen() {
  var dataRef = database().ref('/users');
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const numRef = createRef();
  const [data, setData] = useState([]);
  var [reload, setReload] = useState(true);
  const submitData = () => {
    if (name === '' || number === '') {
      alert('Please fill all fields!');
    } else {
      if (name.length > 10 || number.length > 10) {
        alert('Name and number should be less than 10!');
      } else {
        if (id === '') {
          var newKey = dataRef.push().key;
          //not using this as, pushing will give problem when we want to update
          //the data
          // dataRef.push({
          //   id: newKey,
          //   name: name,
          //   number: number,
          // });
          database()
            .ref('/users/' + newKey)
            .update({
              id: newKey,
              name: name,
              number: number,
            });
          setId('');
          setName('');
          setNumber('');
        } else {
          database()
            .ref('/users/' + id)
            .update({
              id: id,
              name: name,
              number: number,
            });
          setId('');
          setName('');
          setNumber('');
        }
      }
    }
  };
  useEffect(() => {
    var datam = [];
    const onLoadingListener = dataRef.on('value', snapshot => {
      setData([]);
      snapshot.forEach(item => {
        setData(datam => [...datam, item.val()]);
      });
    });
    setReload(prev => !prev);
    return () => {
      dataRef.off('value', onLoadingListener);
    };
  }, []);

  const editButton = item => {
    setId(item.id);
    setName(item.name);
    setNumber(item.number);
  };

  const deleteButton = item => {
    database()
      .ref('/users/' + item.id)
      .remove();
  };
  return (
    <Fragment>
      <View
        style={{
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 1,
          marginHorizontal: 10,
          borderRadius: 20,
          marginTop: 10,
        }}>
        <TextInput
          placeholder="Enter your name!"
          style={styles.textInput}
          value={name}
          onChangeText={text => setName(text)}
          returnKeyType="next"
          onSubmitEditing={() => numRef.current.focus()}
        />
        <TextInput
          placeholder="Enter your number!"
          style={styles.textInput}
          value={number}
          onChangeText={text => setNumber(text)}
          ref={numRef}
        />

        <TouchableOpacity
          onPress={submitData}
          disabled={!name.length || !number.length}
          style={{marginBottom: 10, width: '80%'}}>
          <Text
            style={[
              styles.resultButton,
              {
                fontWeight: '800',
                backgroundColor: !name || !number ? 'grey' : 'black',
              },
            ]}>
            Submit
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          backgroundColor: 'white',
          marginTop: 10,
          height: '70%',
          borderRadius: 20,
          borderWidth: 1,
          marginHorizontal: 10,
        }}>
        <FlatList
          data={data}
          renderItem={({item, index}) => {
            return (
              <View key={index} style={styles.list}>
                <View>
                  <Text style={{fontSize: 20}}>Name : {item.name}</Text>
                  <Text style={{fontSize: 20}}>Number : {item.number}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TouchableOpacity onPress={() => editButton(item)}>
                    <Text style={styles.resultButton}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteButton(item)}>
                    <Text style={styles.resultButton}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      </View>
    </Fragment>
  );
}
const styles = StyleSheet.create({
  textInput: {
    width: 300,
    borderBottomWidth: 2,
    fontSize: 20,
    marginBottom: 20,
  },
  list: {
    color: 'black',
    alignItems: 'center',
    height: 80,
    justifyContent: 'space-between',
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 10,
    flexDirection: 'row',
    marginTop: 10,
    paddingLeft: 10,
    backgroundColor: 'lightgrey',
  },
  resultButton: {
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: 'black',
    color: 'white',
    borderRadius: 10,
    textAlign: 'center',
  },
});

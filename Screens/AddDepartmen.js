import { StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';

const AddDepartmen = (props) => {

  const [selectedValue1, setSelectedValue1] = useState('');
  const [managerList, setManagerList] = useState([]);

  const [nameDepartmen, setNameDepartmen] = useState('');
  const [nameDepartmenErr, setNameDepartmenErr] = useState('');
  const [nameWorkingparts, setNameWorkingparts] = useState('');
  const [nameWorkingpartsErr, setNameWorkingpartsErr] = useState('');
  const [staff, setStaff] = useState([]);

  const [saveStatus, setSaveStatus] = useState('');

  const AddDepartmen = async () => {
    if (nameDepartmen.length === 0) {
      setNameDepartmenErr('Vui lòng điền tên phòng ban!');
      return;
    } if (nameWorkingparts.length === 0) {
      setNameWorkingpartsErr('Vui lòng chọn bộ phận!')
      return;
    }

    try {
      const response = await fetch('http://192.168.1.5:3000/listDepartmen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nameDepartmen: nameDepartmen,
          worlkingParts: nameWorkingparts,
          staff: staff,
          nameManager: selectedValue1,
          manager: [
            {
              name: selectedValue1,
              ...managerList.find((manager) => manager.username === selectedValue1),
            },
          ],
        }),
      });

      if (response.ok) {
        setSaveStatus('Phòng ban đã được thêm thành công!');
        setNameDepartmen('');
        setNameWorkingparts('');
        setSelectedValue1('');
      } else {
        setSaveStatus('Lỗi khi thêm phòng ban!');
      }
    } catch (error) {
      console.error('Error:', error);
      setSaveStatus('Lỗi khi thêm phòng ban!');
    }
  };

  useEffect(() => {
    fetchManagerList();
  }, []);

  const fetchManagerList = async () => {
    try {
      const response = await fetch('http://192.168.1.5:3000/listManager');
      const data = await response.json();
      setManagerList(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const ClearInput = () => {
    setNameDepartmen('');
    setNameWorkingparts('');

  };

  const navigateToHome = () => {
    props.navigation.navigate('Home');
  };

  return (
    <View style={{ flex: 1, marginTop: '10%' }}>
      <View style={{ flexDirection: 'row', margin: 5, borderColor: 'black', borderBottomWidth: 0.5 }}>
        <Icon name="chevron-left" size={30} color="black" onPress={navigateToHome} />
        <Icon name="history" size={30} color="black" marginLeft="auto" />
      </View>
      <Text style={styles.text}>Tên phòng ban:</Text>
      <TextInput placeholder="Name Departmen" style={styles.textInput} value={nameDepartmen} onChangeText={setNameDepartmen} />
      <Text style={styles.errorTxt}>{nameDepartmenErr}</Text>
      <Text style={styles.text}>Tên bộ phận:</Text>
      <Text style={styles.textInput}>{nameWorkingparts}</Text>
      <Picker
        selectedValue={nameWorkingparts}
        onValueChange={(itemValue) => setNameWorkingparts(itemValue)}
      >
        <Picker.Item label="Bộ phận 1" value="Bộ phận 1" />
        <Picker.Item label="Bộ phận 2" value="Bộ phận 2" />
        <Picker.Item label="Bộ phận 3" value="Bộ phận 3" />
      </Picker>
      <Text style={styles.errorTxt}>{nameWorkingpartsErr}</Text>

      <Text style={styles.text}>Tên quản lý:</Text>
      <Text style={styles.textInput}>{selectedValue1}</Text>
      <Picker
        selectedValue={selectedValue1}
        onValueChange={(itemValue) => setSelectedValue1(itemValue)}
      >
        {managerList.map((manager, index) => (
          <Picker.Item key={index} label={manager.username} value={manager.username} />
        ))}
      </Picker>

      <Text style={[styles.textInput, { backgroundColor: 'black', color: 'white', fontSize: 20, fontWeight: 'bold' }]} onPress={AddDepartmen}>
        Save
      </Text>
      <Text style={[styles.textInput, { color: 'black', fontSize: 20, fontWeight: 'bold', borderWidth: 2 }]} onPress={ClearInput}>
        Clear
      </Text>

      <Text style={styles.saveStatus}>{saveStatus}</Text>
    </View>
  );
};

export default AddDepartmen;

const styles = StyleSheet.create({
  textInput: {
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    margin: 10,
    textAlign: 'center',
  },
  text: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 17,
  },
  errorTxt: {
    color: 'red',
    marginLeft: '10%',
  },
  saveStatus: {
    color: 'green',
    marginVertical: 10,
    textAlign: 'center',
  },
});
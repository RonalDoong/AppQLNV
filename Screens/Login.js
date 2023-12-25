import { StyleSheet, Text, TextInput, View, Image, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = (props) => {
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [Staff, setStaffs] = useState([]);
  const [Manager, setManager] = useState([]);
  const [admin, setAdmin] = useState([]);
  

  useEffect(() => {
    fetchData();
    fetchData1();
    fetchData2();
    // Thiết lập Polling bằng cách gửi yêu cầu và cập nhật thông tin mới từ máy chủ mỗi 5 giây
    const interval = setInterval(() => {
      fetchData();
      fetchData1();
      fetchData2();
    }, 1000);

    // Xóa Polling khi component bị hủy
    return () => clearInterval(interval);
  }, []);

  async function fetchData2() {
    try {
      const API_URL = 'http://192.168.1.5:3000/listStaff';
      const response = await fetch(API_URL);
      const data = await response.json();
      setStaffs(data);
      //console.log('Staffs: ' + JSON.stringify(data));
    } catch (error) {
      console.error('Fetch data failed ' + error);
    }
  }

  async function fetchData() {
    try {
      const API_URL = 'http://192.168.1.5:3000/listManager';
      const response = await fetch(API_URL);
      const data = await response.json();
      setManager(data);
      //console.log('Manager: ' + JSON.stringify(data));
    } catch (error) {
      console.error('Fetch data failed ' + error);
    }
  }
  
  async function fetchData1() {
    try {
      const API_URL = 'http://192.168.1.5:3000/accountAdmin';
      const response = await fetch(API_URL);
      const data = await response.json();
      setAdmin(data);
      //console.log('admin: ' + JSON.stringify(data));
    } catch (error) {
      console.error('Fetch data failed ' + error);
    }
  }

  const clearError = () => {
    setUsernameError('');
    setPasswordError('');
  };

  const saveManagerInfoToStorage = async (managerInfo) => {
    try {
      const jsonValue = JSON.stringify(managerInfo);
      await AsyncStorage.setItem('managerInfo', jsonValue);
    } catch (error) {
      console.error('Error saving manager info to AsyncStorage: ' + error);
    }
  };
  const saveStaffInfoToStorage = async (staffInfo) => {
    try {
      const jsonValue = JSON.stringify(staffInfo);
      await AsyncStorage.setItem('staffInfo', jsonValue);
    } catch (error) {
      console.error('Error saving manager info to AsyncStorage: ' + error);
    }
  };

  const doLogin = () => {
    if (username.length === 0) {
      setUsernameError('Vui lòng không để trống Username');
      return;
    }

    if (password.length === 0) {
      setPasswordError('Vui lòng không để trống Password');
      return;
    }

    let request = { username: username, password: password };

    console.log('authInfo: ' + JSON.stringify(request));

    const authInfo = Manager.find((manager) => manager.username === request.username);
    const adminInfo = admin.find((admin) => admin.username === request.username);
    const staffInfo = Staff.find((staff) => staff.username === request.username);

    if (staffInfo) {
      if (staffInfo.password !== request.password) {
        clearError();
        setPasswordError('Nhập sai Password! Vui lòng nhập lại');
        return;
      } else {
        clearError();
        Alert.alert('Notification', 'Bạn có chắc muốn đăng nhập ' + request.username, [
          {
            text: 'OK',
            onPress: () => {
              navigateToHomeStaff();
             saveStaffInfoToStorage(staffInfo); // Lưu thông tin tài khoản vào AsyncStorage
              clearError();
              ClearInput();
            },
          },
          { text: 'Cancel', onPress: () => console.log('Press Cancel') },
        ]);
        return;
      }
    }

    if (authInfo) {
      if (authInfo.password !== request.password) {
        clearError();
        setPasswordError('Nhập sai Password! Vui lòng nhập lại');
        return;
      } else {
        clearError();
        Alert.alert('Notification', 'Bạn có chắc muốn đăng nhập ' + request.username, [
          {
            text: 'OK',
            onPress: () => {
              navigateToHomeManager();
              saveManagerInfoToStorage(authInfo); // Lưu thông tin tài khoản vào AsyncStorage
              clearError();
              ClearInput();
            },
          },
          { text: 'Cancel', onPress: () => console.log('Press Cancel') },
        ]);
        return;
      }
    }

    if (adminInfo) {
      if (adminInfo.password !== request.password) {
        clearError();
        setPasswordError('Nhập sai Password! Vui lòng nhập lại');
        return;
      } else {
        clearError();
        Alert.alert('Notification', 'Bạn có chắc muốn đăng nhập ' + request.username, [
          { text: 'OK', onPress: () => {
            navigateToHome();
            clearError();
            ClearInput();
          }},
          { text: 'Cancel', onPress: () => console.log('Press Cancel') },
        ]);
        return;
      }
    }

    clearError();
    setUsernameError('Nhập sai Username! Vui lòng nhập lại');
  };

  const navigateToHome = () => {
    props.navigation.navigate('Home');
  };

  const navigateToHomeManager = () => {
    props.navigation.navigate('HomeManager');
  };
  const navigateToHomeStaff = () => {
    props.navigation.navigate('HomeStaff');
  };

  const ClearInput = () => {
    setUsername('');
    setPassword('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.Logo}></Text>
      <TextInput style={styles.TextInput} value={username} onChangeText={setUsername}></TextInput>
      <Text style={styles.errorTxt}>{usernameError}</Text>
      <TextInput style={styles.TextInput} value={password} onChangeText={setPassword} secureTextEntry={true}></TextInput>
      <Text style={styles.errorTxt}>{passwordError}</Text>
      <Text style={styles.BtnLogin} onPress={doLogin}>Login</Text>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '30%'
  },
  Logo: {
    width: 90,
    padding: 35,
    textAlign: 'center',
    marginLeft: '37%',
    backgroundColor: 'black',
    color: 'white',
    borderRadius: 50,
    marginBottom: 30,
  },
  TextInput: {
    height: 40,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    margin: 5,
    textAlign: 'center',
  },
  BtnLogin: {
    margin: 20,
    height: 40,
    width: '80%',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    backgroundColor: 'black',
    color: 'white',
    textAlign: 'center',
    marginLeft: '10%',
    fontSize: 20,
    fontWeight: 'bold',
  },
  errorTxt: {
    color: 'red',
  }
});
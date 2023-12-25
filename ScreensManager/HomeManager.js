import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/Ionicons';
import ItemDepartmenHM from '../ItemHomeManager/ItemDepartmenHM';

const HomeManager = (props) => {
  const [managerInfo, setManagerInfo] = useState(null);
  const [matchingDepartments, setMatchingDepartments] = useState([]);

  useEffect(() => {
    const fetchStoredManagerInfo = async () => {
      const storedManagerInfo = await getStoredManagerInfo();
      setManagerInfo(storedManagerInfo);

      if (storedManagerInfo) {
        try {
          const response = await axios.get('http://192.168.1.5:3000/listDepartmen');

          if (response && response.data) {
            const listDepartmen = response.data;
            //console.log('Danh sách listDepartment:', JSON.stringify(listDepartmen));

            const jsonValue = JSON.parse(storedManagerInfo);
            const username = jsonValue.username;
            //console.log('Username trong asyncStorage:', username);

            // Lấy giá trị username từ listDepartmen
            const nameManager = listDepartmen.map(department => department.manager);
            //console.log('Manager trong listDepartmen:', nameManager);

            const usernameManagers = nameManager.flatMap(manager => {
              if (Array.isArray(manager)) {
                return manager.flatMap(item => item?.username || []);
              } else {
                return manager?.username || [];
              }
            });

            //console.log('Username trong manager: ', usernameManagers);

            const matchingDepartments = listDepartmen.filter(department => {
              const departmentManagers = department.manager;
              if (Array.isArray(departmentManagers)) {
                return departmentManagers.some(manager => manager.username === jsonValue.username);
              } else {
                return departmentManagers?.username === jsonValue.username;
              }
            });

            //console.log('Danh sách ListDepartmen có username giống nhau:', JSON.stringify(matchingDepartments));

            setMatchingDepartments(matchingDepartments);
          } else {
            console.error('Error getting listDepartment: Response or response.data is undefined.');
          }
        } catch (error) {
          console.error('Error getting listDepartment:', error);
        }
      }
    };

    fetchStoredManagerInfo();
  }, []);

  const getStoredManagerInfo = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('managerInfo');
      console.log('Thông tin:', jsonValue);
      return jsonValue != null ? jsonValue : null;
    } catch (error) {
      console.error('Error getting manager info from AsyncStorage: ' + error);
      return null;
    }
  };

  const navigateToLogin = () => {
    props.navigation.navigate('Login');
  };
  const navigateToNotificationChat = () => {
    props.navigation.navigate('NotificationManagerStaff');
  };
  const navigateToDepartment = (id) => {
    props.navigation.navigate('DepartmenManager', { id });
  };
  const navigateToSarchDepartmenM = () => {
    props.navigation.navigate('SearchDepartmenM');
  };
  // ...

  return (
    <View style={{ flex: 1, marginTop: '10%' }}>
      <View style={{ flexDirection: "row", borderColor: "black", borderBottomWidth: 0.5 }}>
        <TouchableOpacity onPress={navigateToLogin}>
          <Icon name='chevron-back' size={40} color="black" />
        </TouchableOpacity>
        <View style={{ flexDirection: "row", marginLeft: 'auto' }}>
          <TouchableOpacity style={styles.TextSerch} onPress={navigateToSarchDepartmenM}>
            <FontAwesome name='search' size={20} />
            <Text style={{color:'gray'}}>Nhập phòng ban cần tìm</Text>
            </TouchableOpacity>
          <TouchableOpacity onPress={navigateToNotificationChat}>
            <Icon name='notifications' size={30} color="black" margin={3} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        {matchingDepartments.length === 0 ? (
          <Text style={styles.noDataText}>Chưa được phân công phòng ban quản lý!</Text>
        ) : (
          matchingDepartments.map((Homedepartment, index) => (
            <ItemDepartmenHM key={index} Homedepartment={Homedepartment} navigateToManager={navigateToDepartment} />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  TextSerch: {
    width: 200,
    height: 35,
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 15,
    padding: 5,
    backgroundColor: "#F5F5F5",
    margin: 5,
    justifyContent:'center',
    flexDirection:'row',
  },
  noDataText: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 20,
    margin: 10,
    color: 'gray'
  },
});

export default HomeManager;
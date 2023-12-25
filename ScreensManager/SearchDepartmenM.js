import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ItemDepartmenHM from '../ItemHomeManager/ItemDepartmenHM';
import axios from 'axios';

const SearchDepartmenM = (props) => {
  const [searchKeyword, setSearchKeyword] = useState(''); // Từ khóa tìm kiếm
  const [filteredDepartment, setFilteredDepartment] = useState([]); // Danh sách quản lý đã lọc
  const [matchingDepartments, setMatchingDepartments] = useState([]);

  useEffect(() => {
    const fetchStoredManagerInfo = async () => {
      try {
        const storedManagerInfo = await getStoredManagerInfo();
        if (storedManagerInfo) {
          const jsonValue = JSON.parse(storedManagerInfo);
          const username = jsonValue.username;

          const response = await axios.get('http://192.168.1.5:3000/listDepartmen');
          if (response && response.data) {
            const listDepartmen = response.data;

            const matchingDepartments = listDepartmen.filter((department) => {
              const departmentManagers = department.manager;
              if (Array.isArray(departmentManagers)) {
                return departmentManagers.some((manager) => manager.username === username);
              } else {
                return departmentManagers?.username === username;
              }
            });

            setMatchingDepartments(matchingDepartments);
          } else {
            console.error('Error getting listDepartment: Response or response.data is undefined.');
          }
        }
      } catch (error) {
        console.error('Error getting manager info or listDepartment:', error);
      }
    };

    fetchStoredManagerInfo();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchKeyword]);

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

  const handleSearch = () => {
    if (matchingDepartments.length > 0 && searchKeyword) {
      const filteredDepartment = matchingDepartments.filter((department) =>
        department.nameDepartmen && department.nameDepartmen.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      setFilteredDepartment(filteredDepartment);
    }
  };

  const navigateToBack = () => {
    props.navigation.goBack();
  };

  const navigateToDepartment = (id) => {
    props.navigation.navigate('DepartmenManager', { id });
  };

  return (
    <View style={{ flex: 1, marginTop: '10%' }}>
      <View style={{ flexDirection: 'row', margin: 10, justifyContent: 'center' }}>
        <TouchableOpacity onPress={navigateToBack}>
          <Icon name="chevron-back" size={40} color="black" />
        </TouchableOpacity>
        <TextInput
          style={styles.TextSearch}
          placeholder="Nhập tên phòng ban cần tìm."
          onChangeText={(text) => setSearchKeyword(text)}
          value={searchKeyword}
        />
      </View>
      <ScrollView style={{ margin: 10 }}>
        {filteredDepartment.map((Homedepartment, index) => (
          <ItemDepartmenHM key={index} Homedepartment={Homedepartment} navigateToManager={navigateToDepartment} />
        ))}
      </ScrollView>
    </View>
  );
};

export default SearchDepartmenM;

const styles = StyleSheet.create({
  TextSearch: {
    flex: 1,
    height: 40,
    borderWidth: 1.5,
    borderRadius: 5,
    padding: 5,
    marginLeft: 10,
  },
});
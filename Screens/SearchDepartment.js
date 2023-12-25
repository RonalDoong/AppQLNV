import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import ItemManager from '../Items/ItemManager';
import Icon from 'react-native-vector-icons/Ionicons';
import ItemDepartmen from '../Items/ItemDepartmen';

const SearchDepartment = (props) => {
  const [departmetList, setDepartmentList] = useState([]); // Danh sách quản lý
  const [searchKeyword, setSearchKeyword] = useState(''); // Từ khóa tìm kiếm
  const [filteredDepartment, setFilteredDepartment] = useState([]); // Danh sách quản lý đã lọc

  useEffect(() => {
    fetchDepartentList();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchKeyword]);

  const fetchDepartentList = async () => {
    try {
      const response = await fetch('http://192.168.1.5:3000/listDepartmen');
      const data = await response.json();
      if (data) {
        setDepartmentList(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Chức năng tìm kiếm
  const handleSearch = () => {
    if (departmetList && searchKeyword) {
      const filteredDepartment = departmetList.filter(department =>
        department.nameDepartmen && department.nameDepartmen.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      setFilteredDepartment(filteredDepartment);
    }
  };

  const navigateToDepartmen = (id) => {
    props.navigation.navigate('Departmen', { id });
  };

  const navigateToBack = () => {
    props.navigation.goBack();
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
          onChangeText={text => setSearchKeyword(text)}
          value={searchKeyword}
        />
        {/* <TouchableOpacity style={{ marginLeft: 'auto', justifyContent: 'center' }} onPress={handleSearch}>
          <FontAwesome name="search" size={25} />
        </TouchableOpacity> */}
      </View>
      <ScrollView style={{ margin: 10 }}>
        {filteredDepartment.map((department, index) => (
          <ItemDepartmen key={index} Departmen={department} navigateToManager={navigateToDepartmen} />
        ))}
      </ScrollView>
    </View>
  );
};

export default SearchDepartment;

const styles = StyleSheet.create({
  TextSearch: {
    width: 305,
    height: 40,
    borderWidth: 1.5,
    borderRadius: 5,
    padding: 5,
  },
});
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';
import ItemStaff from '../Items/ItemStaff';

const SearchStaff = (props) => {
  const [staffList, setStaffList] = useState([]); // Danh sách quản lý
  const [searchKeyword, setSearchKeyword] = useState(''); // Từ khóa tìm kiếm
  const [filteredStaffs, setFilteredStaffs] = useState([]); // Danh sách quản lý đã lọc

  useEffect(() => {
    fetchStaffList();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchKeyword]);

  const fetchStaffList = async () => {
    try {
      const response = await fetch('http://192.168.1.5:3000/listStaff');
      const data = await response.json();
      setStaffList(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Chức năng tìm kiếm
  const handleSearch = () => {
    const filteredList = staffList.filter(staff =>
      staff.username.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    setFilteredStaffs(filteredList);
  };

  const navigateToStaffDetail = (id) => {
    props.navigation.navigate('StaffDetail', { id });
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
          placeholder="Nhập tên nhân viên cần tìm."
          onChangeText={text => setSearchKeyword(text)}
          value={searchKeyword}
        />
        {/* <TouchableOpacity style={{ marginLeft: 'auto', justifyContent: 'center' }} onPress={handleSearch}>
          <FontAwesome name="search" size={25} />
        </TouchableOpacity> */}
      </View>
      <ScrollView style={{ margin: 10 }}>
        {filteredStaffs.map((staff, index) => (
          <ItemStaff key={index} staff={staff} navigateToStaffDetail={navigateToStaffDetail} />
        ))}
      </ScrollView>
    </View>
  );
};

export default SearchStaff;

const styles = StyleSheet.create({
  TextSearch: {
    width: 305,
    height: 40,
    borderWidth: 1.5,
    borderRadius: 5,
    padding: 5,
  },
});
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import ItemManager from '../Items/ItemManager';
import Icon from 'react-native-vector-icons/Ionicons';

const SearchManager = (props) => {
  const [managerList, setManagerList] = useState([]); // Danh sách quản lý
  const [searchKeyword, setSearchKeyword] = useState(''); // Từ khóa tìm kiếm
  const [filteredManagers, setFilteredManagers] = useState([]); // Danh sách quản lý đã lọc

  useEffect(() => {
    fetchManagerList();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchKeyword]);

  const fetchManagerList = async () => {
    try {
      const response = await fetch('http://192.168.1.5:3000/listManager');
      const data = await response.json();
      setManagerList(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Chức năng tìm kiếm
  const handleSearch = () => {
    const filteredList = managerList.filter(manager =>
      manager.username.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    setFilteredManagers(filteredList);
  };

  const navigateToManagerDetail = (id) => {
    props.navigation.navigate('ManagerDetail', { id });
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
          placeholder="Nhập tên quản lý cần tìm."
          onChangeText={text => setSearchKeyword(text)}
          value={searchKeyword}
        />
        {/* <TouchableOpacity style={{ marginLeft: 'auto', justifyContent: 'center' }} onPress={handleSearch}>
          <FontAwesome name="search" size={25} />
        </TouchableOpacity> */}
      </View>
      <ScrollView style={{ margin: 10 }}>
        {filteredManagers.map((manager, index) => (
          <ItemManager key={index} manager={manager} navigateToManagerDetail={navigateToManagerDetail} />
        ))}
      </ScrollView>
    </View>
  );
};

export default SearchManager;

const styles = StyleSheet.create({
  TextSearch: {
    width: 305,
    height: 40,
    borderWidth: 1.5,
    borderRadius: 5,
    padding: 5,
  },
});
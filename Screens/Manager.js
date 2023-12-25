import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import ItemManager from '../Items/ItemManager';
import Icon from 'react-native-vector-icons/Ionicons';
import { FontAwesome } from '@expo/vector-icons'



const Manager = (props) => {
  const [managerList, setManagerList] = useState([]);
  const [numberOfManager, setNumberOfManager] = useState(0);


  //so luong
  useEffect(() => {
    setNumberOfManager(managerList.length);
  }, [managerList]);

  const navigateToHome = () => {
    props.navigation.navigate('Home');
  };

  useEffect(() => {
    // Thiết lập Polling bằng cách gửi yêu cầu và cập nhật thông tin mới từ máy chủ mỗi 5 giây
    const interval = setInterval(() => {
      fetchManagerList();
    }, 1000);

    // Xóa Polling khi component bị hủy
    return () => clearInterval(interval);
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

  const navigateToManagerDetail = (id) => {
    props.navigation.navigate('ManagerDetail', { id });
  };

  const navigateToSearchManager = () =>{
    props.navigation.navigate('SearchManager');
  }

  return (
    <View style={{ flex: 1, marginTop: '10%' }}>
      <View style={{ flexDirection: 'row', borderColor: "black", borderBottomWidth: 0.5, alignItems: 'center', padding: 5 }}>
        <TouchableOpacity onPress={navigateToHome}>
          <Icon name='chevron-back' size={40} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 17, fontWeight: 'bold', marginLeft: 10 }}>Danh sách quản lý (<Icon name='person' size={20}/>{numberOfManager})</Text>
        <TouchableOpacity style={{marginLeft:'auto', justifyContent:'center'}} onPress={navigateToSearchManager}>
          <Icon name='search' size={25}/>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {managerList.map((manager, index) => (
          <ItemManager key={index} manager={manager} navigateToManagerDetail={navigateToManagerDetail} />
        ))}
      </ScrollView>
    </View>
  );
};

export default Manager;

const styles = StyleSheet.create({});
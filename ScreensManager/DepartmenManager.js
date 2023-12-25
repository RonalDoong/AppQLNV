import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal, TextInput, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';
import ItemManagerDepartmen from '../Items/ItemManagerDepartmen';
import ItemStaffDepartmen from '../Items/ItemStaffDepartmen';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ItemChat from '../ItemHomeManager/ItemChat';


const DepartmenManager = (props) => {
  const [department, setDepartment] = useState(null);
  const [manager, setManager] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [selectedModal, setSelectedModal] = useState(false);

  const [listChat, setListChat] = useState([]);
  const [toChat, setToChat] = useState('');
  const [contentChat, setContentChat] = useState('');

  const [chatList, setchatList] = useState([]);

  const [newChat, setNewChat] = useState([]);



  // Chức năng chat

  const AddChat = async () => {
    try {
      // Lấy dữ liệu hiện có từ máy chủ hoặc API
      const response = await fetch(`http://192.168.1.5:3000/listDepartmen/${props.route.params.id}`);
      if (response.ok) {
        const currentData = await response.json();

        // Tiến hành lưu thông tin chat
        const newChat = {
          toChat: toChat,
          contentChat: contentChat,
          timeChat: new Date().toLocaleString(),
        };

        // Thêm dữ liệu mới vào mảng listChat
        const updatedData = {
          ...currentData,
          listChat: [...currentData.listChat, newChat], // <-- Update listChat
        };

        const patchResponse = await fetch(`http://192.168.1.5:3000/listDepartmen/${props.route.params.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        });

        if (patchResponse.ok) {
          console.log("Thêm thành công", newChat);
          console.log("danh sách listChat", updatedData.listChat);
          setContentChat('');

          // Thêm newChat vào danh sách chat hiện tại
          setListChat(prevList => [...prevList, newChat]);

        } else {
          // Xử lý phản hồi lỗi
          console.log("Thêm thất bại")
        }
      } else {
        console.log("Lấy dữ liệu hiện có thất bại");
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleShowChat = () => {
    setSelectedModal(true);
  };

  const handleCloseChat = () => {
    setSelectedModal(false);
  };

  useEffect(() => {
    fetchManagerList();
  }, []);

  const fetchManagerList = async () => {
    try {
      const response = await fetch('http://192.168.1.5:3000/listStaff');
      const data = await response.json();
      setStaffs(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetch('http://192.168.1.5:3000/listDepartmen')
      .then(response => response.json())
      .then(data => {
        const departmentData = data.find(item => item.id === props.route.params.id);
        setDepartment(departmentData);
        setManager(departmentData.manager);
        setStaffs(departmentData.staffs);
        setchatList(departmentData.listChat)
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  // Thông tin lưu trữ trong AsyncStorage
  useEffect(() => {
    const getToChatValue = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('managerInfo');
        if (jsonValue != null) {
          const parsedValue = JSON.parse(jsonValue);
          setToChat(parsedValue.username);
        }
      } catch (error) {
        console.error('Error getting toChat value from AsyncStorage: ' + error);
      }
    };

    getToChatValue();
  }, []);

  const navigateToHome = () => {
    props.navigation.goBack();
  };

  return (
    <View style={{ flex: 1, marginTop: '10%' }}>

      <View style={{ flexDirection: "row", borderColor: "black", borderBottomWidth: 0.5 }}>
        <TouchableOpacity onPress={navigateToHome}>
          <Icon name='chevron-back' size={40} color="black" />
        </TouchableOpacity>
        <Text style={styles.Text}>{department && department.nameDepartmen}</Text>
        <TouchableOpacity style={{ flexDirection: 'row', marginLeft: 'auto' }} onPress={handleShowChat}>
          <Icon name='chatbubble-ellipses-outline' size={30} color="black" margin={3}></Icon>
        </TouchableOpacity>
      </View>

      <Text style={styles.text}>Nhân viên:</Text>
      <ScrollView>
        {staffs && staffs.map((staffs, index) => (
          <ItemStaffDepartmen key={index} staffs={staffs} />
        ))}
      </ScrollView>

      <Modal visible={selectedModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>
                {department && department.nameDepartmen}
              </Text>
              <TouchableOpacity onPress={handleCloseChat} style={styles.closeIcon}>
                <Icon name='close-outline' size={30} color="black" margin={3} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.chatListContainer}>
              {[...chatList, ...newChat].map((chat, index) => (
                <ItemChat key={index} chat={chat} />
              ))}
            </ScrollView>

            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder='Nhập nội dung tin nhắn'
                value={contentChat}
                onChangeText={setContentChat}
                multiline={true}
                textAlignVertical="top"
              />
              <Icon name='chatbubble-ellipses-outline' size={30} color="black" style={styles.sendIcon} onPress={AddChat} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DepartmenManager;

const styles = StyleSheet.create({
  Text: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalContent: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    padding: 10,
  },

  modalHeader: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: 'black',
    alignItems: 'center',
  },

  modalHeaderText: {
    fontSize: 18,
    width: '90%',
    padding: 10,
  },

  closeIcon: {
    marginLeft: 'auto',
  },

  chatListContainer: {
    height: 300,
  },

  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },

  textInput: {
    flex: 1,
    height: 40,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 20,
    padding: 10,
  },

  sendIcon: {
    padding: 5,
  },
  text: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 17,
  },
});
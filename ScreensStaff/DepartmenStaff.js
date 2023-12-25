import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ItemStaffDepartmen from '../Items/ItemStaffDepartmen';
import ItemChat from '../ItemHomeManager/ItemChat';

import ItemManager from '../ItemHomeManager/ItemManager';
import ItemMS from '../ItemHomeStaff/ItemMS';

const DepartmenStaff = (props) => {
  const [department, setDepartmen] = useState([]);
  const [staffs, setStaffs] = useState('');
  const [managers, setManager] = useState('');

  const [toChat, setToChat] = useState('');
  const [contentChat, setContentChat] = useState('');

  const [chatList, setchatList] = useState([]);

  const [selectedModal, setSelectedModal] = useState(false);

  const scrollViewRef = useRef();

  const [managerInfo, setManagerInfo] = useState(null);

  const [numberOfStaff, setNumberOfStaff] = useState(0);

  //so luong nhan vien
  useEffect(() => {
      setNumberOfStaff(staffs.length);
    }, [staffs]);



  const handleShowChat = () => {
    setSelectedModal(true);
  };

  const handleCloseChat = () => {
    setSelectedModal(false);
  };

  const AddChat = async () => {
    if (contentChat.length === 0) {
      console.log("Không có nội dung tin nhắn");
      return;
    }


    try {
      // Lấy dữ liệu hiện có từ máy chủ hoặc API
      const response = await fetch(`http://192.168.1.5:3000/listDepartmen/${props.route.params.id}`);
      if (response.ok) {
        const currentData = await response.json();

        // Kiểm tra sự tồn tại của listChat và thêm dữ liệu mới vào mảng
        if (!currentData.hasOwnProperty('listChat') || !Array.isArray(currentData.listChat)) {
          currentData.listChat = [];
        }

        // Tiến hành lưu thông tin chat
        const newChat = {
          toChat: toChat,
          contentChat: contentChat,
          timeChat: new Date().toLocaleString(),
        };

        currentData.listChat.push(newChat);

        const patchResponse = await fetch(`http://192.168.1.5:3000/listDepartmen/${props.route.params.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(currentData),
        });

        if (patchResponse.ok) {
          //console.log("Thêm thành công", newChat);
          //console.log("Danh sách listChat", currentData.listChat);
          setContentChat('');
          // Cập nhật danh sách chat
          setchatList(prevList => [...prevList, newChat]);
          // Cuộn xuống phần cuối cùng của danh sách chat
          scrollViewRef.current.scrollToEnd({ animated: true });
        } else {
          // Xử lý phản hồi lỗi
          console.log("Thêm thất bại");
        }
      } else {
        console.log("Lấy dữ liệu hiện có thất bại");
      }
    } catch (error) {
      console.error('Lỗi:', error);
    }
  };

  //Thông tin trong phòng ban
  const fetchData = async () => {
    try {
      const response = await fetch(`http://192.168.1.5:3000/listDepartmen/${props.route.params.id}`);
      if (response.ok) {
        const currentData = await response.json();
        setDepartmen(currentData);
        setStaffs(currentData.staffs);
        setManager(currentData.manager);

        // Cập nhật danh sách tin nhắn
        if (currentData && currentData.listChat) {
          setchatList(currentData.listChat);
        } else {
          setchatList([]);
        }
      } else {
        console.log("Lấy dữ liệu mới thất bại");
      }
    } catch (error) {
      console.error('Lỗi:', error);
    }
  };
  useEffect(() => {
    // Gửi yêu cầu và cập nhật thông tin mới từ máy chủ một lần khi component được hiển thị
    fetchData();

    // Thiết lập Polling bằng cách gửi yêu cầu và cập nhật thông tin mới từ máy chủ mỗi 5 giây
    const interval = setInterval(() => {
      fetchData();
    }, 1000);

    // Xóa Polling khi component bị hủy
    return () => clearInterval(interval);
  }, []);

  // Thông tin lưu trữ trong AsyncStorage
  useEffect(() => {
    const getToChatValue = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('staffInfo');
        if (jsonValue != null) {
          const parsedValue = JSON.parse(jsonValue);
          setToChat(parsedValue.username);
          setManagerInfo(parsedValue); // Lưu trữ dữ liệu đã lấy được vào trạng thái
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
      <View style={{ flexDirection: "row", borderColor: "black", borderBottomWidth: 0.5, alignItems: "center" }}>
        <TouchableOpacity onPress={navigateToHome}>
          <Icon name='chevron-back' size={35} color="black" />
        </TouchableOpacity>
        <Text style={styles.Text}>{department.nameDepartmen}</Text>
        <TouchableOpacity style={{ flexDirection: 'row', marginLeft: 'auto', alignItems: 'center', justifyContent: 'center', }} onPress={handleShowChat}>
          <Icon name='menu' size={30} color="black" margin={5}></Icon>
        </TouchableOpacity>
      </View>

      {/* <Text style={styles.text}>Nhân viên:</Text>
      <ScrollView>
        {staffs && staffs.map((staffs, index) => (
          <ItemStaffDepartmen key={index} staffs={staffs} />
        ))}
      </ScrollView> */}
      <ScrollView
        style={styles.chatListContainer}
        contentContainerStyle={styles.chatListContent}
        ref={scrollViewRef}
        onContentSizeChange={() => {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }}
      >


        {chatList.slice(-13).map((chat, index) => (
          <ItemChat key={index} chat={chat} managerInfo={managerInfo} />
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
        <TouchableOpacity onPress={AddChat} >
          <Icon name='send' size={30} color="black" style={styles.sendIcon} />
        </TouchableOpacity>
      </View>

      <Modal visible={selectedModal} animationType='slide' transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>
                Thông tin
              </Text>
              <TouchableOpacity onPress={handleCloseChat} style={styles.closeIcon}>
                <Icon name='chevron-down' size={35} color="black" margin={3} />
              </TouchableOpacity>
            </View>

            <View style={{ height: 110, padding: 10, }}>
              <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Quản lý phòng ban:</Text>
              <View style={{ height: 70, backgroundColor: '#EEEEEE', padding: 10, borderRadius: 10, justifyContent: 'center' }}>
                {managers && managers.map((managerItem, index) => (
                  <ItemManager key={index} manager={managerItem} />
                ))}
              </View>
            </View>

            <Text style={{ fontWeight: 'bold', marginBottom: 10, margin:10 }}>Thành viên: {numberOfStaff}</Text>
            <ScrollView style={{ padding: 10, backgroundColor: '#EEEEEE', borderRadius: 10, margin: 10 }}>
              {staffs && staffs.map((staffsItem, index) => (
                <ItemMS key={index} staffs={staffsItem} />
              ))}
            </ScrollView>

            <View>
              <TouchableOpacity style={{ flexGrow: 1, justifyContent: 'flex-end', alignItems: "center", justifyContent: "center" }} onPress={handleCloseChat}>
                <View style={{ width: 350, height: 40, backgroundColor: 'black', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}>Đóng</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* <ScrollView
              style={styles.chatListContainer}
              contentContainerStyle={styles.chatListContent}
              ref={scrollViewRef}
              onContentSizeChange={() => {
                scrollViewRef.current.scrollToEnd({ animated: true });
              }}
            >


              {chatList.slice(-13).map((chat, index) => (
                <ItemChat key={index} chat={chat} managerInfo={managerInfo} />
              ))}
            </ScrollView>

            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder='Nhập nội dung tin nhắn'
                value={contentChat}
                onChangeText={setContentChat}
                multiline ={true}
                textAlignVertical="top"
              />
              <TouchableOpacity onPress={AddChat} >
                <Icon name='send' size={25} color="black" style={styles.sendIcon} />
              </TouchableOpacity>
            </View> */}
          </View>
        </View>
      </Modal>

    </View>
  )
}

export default DepartmenStaff

const styles = StyleSheet.create({
  Text: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
  },
  text: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 17,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalContent: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },

  modalHeader: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: 'black',
    alignItems: 'center',
    padding: 5,
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
  chatListContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
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
})
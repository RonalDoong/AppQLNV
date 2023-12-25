import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ItemStaffDepartmen from '../Items/ItemStaffDepartmen';
import ItemChat from '../ItemHomeManager/ItemChat';
import ItemMS from '../ItemHomeManager/ItemMS';
import ItemManager from '../ItemHomeManager/ItemManager';

import { Picker } from '@react-native-picker/picker';



const DepartmenManagerr = (props) => {
  const [department, setDepartmen] = useState([]);
  const [staffs, setStaffs] = useState('');

  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');


  const [manager, setManager] = useState('');

  const [toChat, setToChat] = useState('');
  const [contentChat, setContentChat] = useState('');

  const [chatList, setchatList] = useState([]);

  const [NewChat, setNewChat] = useState([]);



  const [selectedModal, setSelectedModal] = useState(false);
  const [selectedModalAddStaff, setSelectedModalAddStaff] = useState(false);

  const scrollViewRef = useRef();

  const [managerInfo, setManagerInfo] = useState(null);

  const [numberOfStaff, setNumberOfStaff] = useState(0);

  //so luong nhan vien
  useEffect(() => {
    setNumberOfStaff(staffs.length);
  }, [staffs]);

  useEffect(() => {
    fetchStaffList();
  }, []);

  const fetchStaffList = async () => {
    try {
      const response = await fetch('http://192.168.1.5:3000/listStaff');
      const data = await response.json();
      setStaffList(data);
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

  const handleShowAddStaff = () => {
    setSelectedModalAddStaff(true);
  };

  const handleCloseAddStaff = () => {
    setSelectedModalAddStaff(false);
  };

  //chức năng chat
  // const AddChat = async () => {
  //   try {
  //     // Lấy dữ liệu hiện có từ máy chủ hoặc API
  //     const response = await fetch(`http://192.168.1.7:3000/listDepartmen/${props.route.params.id}`);
  //     if (response.ok) {
  //       const currentData = await response.json();

  //       // Tiến hành lưu thông tin chat
  //       const newChat = {
  //         toChat: toChat,
  //         contentChat: contentChat,
  //         timeChat: new Date().toLocaleString(),
  //       };

  //       // Thêm dữ liệu mới vào mảng listChat
  //       const updatedData = {
  //         ...currentData,
  //         listChat: currentData.listChat ? [...currentData.listChat, newChat] : [newChat], // <-- Error occurs here
  //       };

  //       const patchResponse = await fetch(`http://192.168.1.7:3000/listDepartmen/${props.route.params.id}`, {
  //         method: 'PATCH',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify(updatedData),
  //       });

  //       if (patchResponse.ok) {
  //         console.log("Thêm thành công", newChat);
  //         console.log("danh sách listChat", updatedData.listChat);
  //         setContentChat('');

  //         // Thêm newChat vào danh sách chat hiện tại
  //         setchatList(prevList => [...prevList, newChat]);
  //         setNewChat([...listChat, newChat]);

  //         // Cuộn xuống phần cuối cùng của danh sách chat
  //         scrollViewRef.current.scrollToEnd({ animated: true });
  //       } else {
  //         // Xử lý phản hồi lỗi
  //         console.log("Thêm thất bại")
  //       }
  //     } else {
  //       console.log("Lấy dữ liệu hiện có thất bại");
  //     }
  //   } catch (error) {
  //     console.error('Lỗi:', error);
  //   }
  // };
  const AddChat = async () => {
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

          // Thêm newChat vào danh sách chat hiện tại
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
  useEffect(() => {

    const interval = setInterval(() => {
      fetch('http://192.168.1.5:3000/listDepartmen')
        .then(response => response.json())
        .then(data => {
          const departmentData = data.find(item => item.id === props.route.params.id);
          setDepartmen(departmentData);
          setStaffs(departmentData.staffs);
          setManager(departmentData.manager);

          if (departmentData && departmentData.listChat) {
            setchatList(departmentData.listChat);
          } else {
            setchatList([]);
          }
        })
        .catch(error => {
          console.error(error);
        });
    }, 1000);

    // Xóa Polling khi component bị hủy
    return () => clearInterval(interval);
  }, []);

  // Thông tin lưu trữ trong AsyncStorage
  useEffect(() => {
    const getToChatValue = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('managerInfo');
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

  //xoa nhan vien
  const deleteStaff = async (id) => {
    try {
      const response = await fetch(`http://192.168.1.5:3000/listDepartmen/${props.route.params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          staffs: department.staffs.filter((staff) => staff.id !== id),
        }),
      });

      if (response.ok) {
        console.log("Xóa thành công!");
      } else {
        console.log("Xóa thất bại!");
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  //add staff
  const AddStaffs = async () => {
    try {
      if (department) {
        const response = await fetch(`http://192.168.1.5:3000/listDepartmen/${props.route.params.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            staffs: [
              ...(department.staffs || []), // Sử dụng mảng rỗng nếu `department.staffs` không tồn tại
              {
                name: selectedStaff,
                ...(staffList.find((staff) => staff.username === selectedStaff) || {}),
              },
            ],
          }),
        });

        if (response.ok) {
          handleCloseAddStaff();
          console.log("Thêm thành công!")
        } else {
          console.log("Thêm thất bại!")
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

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
        <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={handleShowAddStaff}>
          <Icon name='add-circle' size={25} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }} onPress={handleShowChat}>
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
        {chatList.length === 0 ? (
          <Text style={styles.noDataText}>Loading...</Text>
        ) : (
          chatList.slice(-13).map((chat, index) => (
            <ItemChat key={index} chat={chat} managerInfo={managerInfo} />
          ))
        )}
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
                {manager && manager.map((managerItem, index) => (
                  <ItemManager key={index} manager={managerItem} />
                ))}
              </View>
            </View>

            <Text style={{ fontWeight: 'bold', marginBottom: 10, margin: 10 }}>Thành viên: {numberOfStaff}</Text>
            <ScrollView style={{ padding: 10, backgroundColor: '#EEEEEE', borderRadius: 10, margin: 10 }}>
              {staffs && staffs.map((staffsItem, index) => (
                <ItemMS key={index} staffs={staffsItem} deleteStaff={deleteStaff} />
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

      <Modal visible={selectedModalAddStaff} animationType="slide" transparent={true}>
        <View style={[styles.ContainerModal]}>
          <View style={[styles.contentModal,{alignItems:'center'}]}>
            <Text style={{ fontSize: 17, fontWeight: 'bold' }}>Thêm nhân viên</Text>
            <View>
              <Text style={{width:300, textAlign:'center', borderWidth:1.5,borderRadius:10, padding:10, marginTop:10}}>{selectedStaff}</Text>
              <Picker
                selectedValue={selectedStaff}
                onValueChange={(itemValue) => setSelectedStaff(itemValue)}
              >
                {staffList.map((staff, index) => (
                  <Picker.Item key={index} label={staff.username} value={staff.username} />
                ))}
              </Picker>
            </View>
            <TouchableOpacity style={styles.modalButton} onPress={AddStaffs}>
              <Text style={styles.modalButtonText}>Thêm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={handleCloseAddStaff}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  )
}

export default DepartmenManagerr

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
  noDataText: {
    fontSize: 15,
    textAlign: 'center',
    margin: 10,
    color: 'gray'
  },
  modalButton: {
    width: 250,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  ContainerModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
},
contentModal: {
    padding: 20,
    width: '100%',
    backgroundColor: 'white',
    borderTopStartRadius: 15,
    borderTopEndRadius: 15,
},
})
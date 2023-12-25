import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/Ionicons';
import ItemBoss from '../Items/ItemBoss';
import ItemDepartmen from '../Items/ItemDepartmen';


const Home = (props) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [bossList, setBossList] = useState([]);
  const [listDepartmen, setListDepartmen] = useState([]);

  useEffect(() => {
    fetchListDepartmen();
    // Thiết lập Polling bằng cách gửi yêu cầu và cập nhật thông tin mới từ máy chủ mỗi 5 giây
    const interval = setInterval(() => {
      fetchListDepartmen();
    }, 1000);

    // Xóa Polling khi component bị hủy
    return () => clearInterval(interval);
  }, []);
  const fetchListDepartmen = async () => {
    try {
      const response = await fetch('http://192.168.1.5:3000/listDepartmen');
      const data = await response.json();
      setListDepartmen(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteDepartment = async (id) => {
    try {
      const response = await fetch(`http://192.168.1.5:3000/listDepartmen/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Xóa thành công, cập nhật lại danh sách phòng ban
        fetchListDepartmen();
      } else {
        console.error('Delete request failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddIconPress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const navigateToAddDepartment = () => {
    props.navigation.navigate('AddDepartmen');
    handleCloseModal();
  };
  const navigateToDepartment = (id) => {
    props.navigation.navigate('Departmen', { id });
  };
  const navigateToAddManager = () => {
    props.navigation.navigate('AddManager');
    handleCloseModal();
  };
  const navigateToManager = () => {
    props.navigation.navigate('Manager');
  };
  const navigateToStaff = () => {
    props.navigation.navigate('Staff');
  };
  const navigateToAddStaff = () => {
    props.navigation.navigate('AddStaff');
    handleCloseModal();
  };
  const navigateToLogin = () => {
    props.navigation.navigate('Login');
  };
  const navigateToNotificationChat = () => {
    props.navigation.navigate('NotificationChat');
  };
  const navigateToSearchDepartment = () => {
    props.navigation.navigate('SearchDepartment');
  }



  return (
    <View style={{ flex: 1, marginTop: '10%' }}>
      <View style={{ flexDirection: "row", borderColor: "black", borderBottomWidth: 0.5 }}>
        <TouchableOpacity onPress={navigateToLogin} style={{justifyContent:'center'}}>
          <Icon name='chevron-back' size={40} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleAddIconPress}  style={{justifyContent:'center'}}>
          <Icon name='add-circle' size={35} color="black" marginLeft={10} />
        </TouchableOpacity>
        <View style={{ flexDirection: "row", marginLeft: 'auto' }}>
          <TouchableOpacity style={styles.TextSerch} onPress={navigateToSearchDepartment}>
            <FontAwesome name='search' size={20} color={'black'} />
            <Text style={{ color: 'gray' }}>Tìm kiếm phòng ban</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={navigateToNotificationChat} style={{justifyContent:'center'}}>
            <Icon name='notifications' size={30} color="black" margin={3} />
          </TouchableOpacity>
        </View>
      </View>
      {/* <View>
        <ScrollView>
          {bossList.map((boss, index) => (
            <ItemBoss key={index} boss={boss} />
          ))}
        </ScrollView>
      </View> */}
      <TouchableOpacity style={styles.Manager} onPress={navigateToManager}>
        <Icon name='person' size={30} color="white" />
        <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>Manager</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.Manager} onPress={navigateToStaff}>
        <Icon name='people' size={30} color="white" />
        <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>Staff</Text>
      </TouchableOpacity>

      <View style={{ flex: 1 }}>
        <ScrollView>
          <View style={{ marginBottom: 20 }}>
            {listDepartmen.map((Departmen, index1) => (
              <ItemDepartmen key={index1} Departmen={Departmen} navigateToManager={navigateToDepartment} deleteDepartment={deleteDepartment} />
            ))}
          </View>
        </ScrollView>
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText} onPress={navigateToAddManager}>Thêm quản lí</Text>
            <Text style={styles.modalText} onPress={navigateToAddDepartment}>Thêm phòng ban</Text>
            <Text style={styles.modalText} onPress={navigateToAddStaff}>Thêm nhân viên</Text>
            <Text style={styles.modalText}>Thêm tài khoản</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleCloseModal}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default Home;

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
    alignItems: "center",
    flexDirection: 'row'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  modalText: {
    backgroundColor: 'black',
    color: 'white',
    width: '100%',
    height: 30,
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    borderRadius: 10,
  },
  modalButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  Manager: {
    height: 60,
    backgroundColor: 'black',
    borderRadius: 30,
    borderColor: 'black',
    borderWidth: 2,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
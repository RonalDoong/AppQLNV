import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';
import ItemManagerDepartmen from '../Items/ItemManagerDepartmen';
import ItemStaffDepartmen from '../Items/ItemStaffDepartmen';
import { Picker } from '@react-native-picker/picker';

const Departmen = (props) => {
  const [department, setDepartment] = useState([]);
  const [manager, setManager] = useState([]);
  const [managerList, setManagerList] = useState([]);
  const [selectedManager, setSelectedManager] = useState('');

  const [staffs, setStaff] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [selectedModal, setSelectedMoadal] = useState('');

  const [selectedModal2, setSelectedMoadal2] = useState('');

  const [numberOfStaff, setNumberOfStaff] = useState(0);

  //so luong nhan vien
  useEffect(() => {
    setNumberOfStaff(staffList.length);
  }, [staffList]);

  const showListManager = () => {
    setSelectedMoadal2(true);
  };

  const closeListManager = () => {
    setSelectedMoadal2(false);
  };

  const handleAddIconPress = () => {
    setSelectedMoadal(true);
  };

  const handleCloseModal = () => {
    setSelectedMoadal(false);
  };

  useEffect(() => {
    fetchManagerList();
  }, []);
  useEffect(() => {
    fetchManagerList2();
  }, []);

  const fetchManagerList = async () => {
    try {
      const response = await fetch('http://192.168.1.5:3000/listStaff');
      const data = await response.json();
      setStaffList(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchManagerList2 = async () => {
    try {
      const response = await fetch('http://192.168.1.5:3000/listManager');
      const data = await response.json();
      setManagerList(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

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

  useEffect(() => {
    // Thiết lập Polling bằng cách gửi yêu cầu và cập nhật thông tin mới từ máy chủ mỗi 5 giây
    const interval = setInterval(() => {
      fetch('http://192.168.1.5:3000/listDepartmen')
        .then(response => response.json())
        .then(data => {
          const departmentData = data.find(item => item.id === props.route.params.id);
          setDepartment(departmentData);
          setManager(departmentData.manager);
          setStaff(departmentData.staffs)
        })
        .catch(error => {
          console.error(error);
        });
    }, 1000);

    // Xóa Polling khi component bị hủy
    return () => clearInterval(interval);
  }, []);



  const navigateToHome = () => {
    props.navigation.navigate('Home');
  };

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
          handleCloseModal();
          console.log("Thêm thành công!")
        } else {
          console.log("Thêm thất bại!")
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateManagerInfo = async () => {
    try {
      const response = await fetch(`http://192.168.1.5:3000/listDepartmen/${props.route.params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          manager: [
            {
              ...managerList.find((manager) => manager.username === selectedManager),
            },
          ],
        }),
      });
  
      if (response.ok) {
        console.log("Cập nhật thành công!");
        closeListManager();
      } else {
        console.error('Cập nhật thất bại');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <View style={{ flex: 1, marginTop: '10%' }}>
      <View style={{ flexDirection: "row", borderColor: "black", borderBottomWidth: 0.5 }}>
        <TouchableOpacity onPress={navigateToHome} style={{ justifyContent: 'center' }}>
          <Icon name='chevron-back' size={40} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleAddIconPress} style={{ justifyContent: 'center' }}>
          <Icon name='add-circle' size={30} color="black" marginLeft={10} />
        </TouchableOpacity>
        <Text style={styles.Text}>{department && department.nameDepartmen}</Text>
        <TouchableOpacity style={{ marginLeft: 'auto', justifyContent: 'center' }}>
          <Icon name='notifications' size={25} color="black" margin={3}></Icon>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
        <Text style={styles.text}>Quản lý:</Text>
        <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={showListManager}>
          <FontAwesome name='refresh' size={20} />
        </TouchableOpacity>
      </View>
      <View style={{ height: 150 }}>
        {manager && manager[0] && (
          <ItemManagerDepartmen manager={manager[0]} />
        )}
      </View>


      <Text style={[styles.text, {margin:10}]}>Nhân viên:</Text>
      <ScrollView>
        {staffs && staffs.map((staffs, index) => (
          <ItemStaffDepartmen key={index} staffs={staffs} deleteStaff={deleteStaff} />
        ))}
      </ScrollView>


      <Modal visible={selectedModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 17, fontWeight: 'bold' }}>Thêm nhân viên</Text>
            <View>
              <Text style={styles.textInput}>{selectedStaff}</Text>
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
            <TouchableOpacity style={styles.modalButton} onPress={handleCloseModal}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={selectedModal2} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 17, fontWeight: 'bold' }}>Thay đổi quản lý</Text>
            <View>
              <Text style={styles.textInput}>{selectedManager}</Text>
              <Picker
                selectedValue={selectedManager}
                onValueChange={(itemValue) => setSelectedManager(itemValue)} // <-- Fixed line
              >
                {managerList.map((manager, index) => (
                  <Picker.Item key={index} label={manager.username} value={manager.username} />
                ))}
              </Picker>
            </View>
            <TouchableOpacity style={styles.modalButton} onPress={updateManagerInfo}>
              <Text style={styles.modalButtonText}>Thay đổi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={closeListManager}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
};

export default Departmen;

const styles = StyleSheet.create({
  Text: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    width: 300,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    margin: 10,
    textAlign: 'center',
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
  text: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 17,
  },
});
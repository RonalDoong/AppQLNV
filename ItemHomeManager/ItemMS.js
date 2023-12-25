import { StyleSheet, Text, View, TouchableOpacity, Modal, ImageBackground, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import * as Linking from 'expo-linking';

const ItemMS = ({ staffs, deleteStaff }) => {
    const avatarSource = staffs.avatarStaff ? { uri: staffs.avatarStaff } : null;
    const [selectedModal, setSelectedMoadal] = useState('');
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [password, setPassword] = useState('');

    const ShowModal = () => {
        setSelectedMoadal(true);
        setSelectedStaff(staffs); // Gán thông tin chi tiết của mục được chọn vào selectedStaff
    }
    const CloseMadal = () => {
        setSelectedMoadal(false);
    }

    const [modalPassDe, setModalPassDe] = useState('');
    const [deletePassword, setDeletePassword] = useState('');
    const [deletePasswordErr, setDeletePasswordErr] = useState('');

    const showModelPassDe = () => {
        setModalPassDe(true);
    }
    const closeModalPassDe = () => {
        setModalPassDe(false);
    }
    useEffect(() => {
        getStoredManagerInfo();
    }, []);

   const getStoredManagerInfo = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('managerInfo');
    if (jsonValue) {
      const parsedValue = JSON.parse(jsonValue);
      setPassword(parsedValue.password);
    }
  } catch (error) {
    console.error('Error getting manager info from AsyncStorage: ' + error);
  }
};

    //Xoa nhan vien
    const deleteStaffs = async () => {
        try {
          // Lấy mật khẩu mới từ máy chu
      
          // Xác thực mật khẩu
          if (deletePassword.length === 0) {
            setDeletePasswordErr('Vui lòng nhập mật khẩu để xóa.');
            return;
          }
          if (deletePassword !== password) {
            setDeletePasswordErr('Mật khẩu không chính xác.');
            return;
          }
      
          // Xóa phòng ban
          deleteStaff(staffs.id);
          setDeletePassword('');
          setDeletePasswordErr('');
          closeModalPassDe(); // Close the password confirmation modal
        } catch (error) {
          console.error('Lỗi:', error);
        }
      };

      //Goi dien
      const makePhoneCall = () => {
        if (selectedStaff && selectedStaff.phoneStaff) {
          const phoneNumber = selectedStaff.phoneStaff;
          const telUrl = `tel:${phoneNumber}`;
      
          Linking.openURL(telUrl);
        }
      };

    return (
        <View style={{ flex: 1, flexDirection: 'row', alignItems: "center", paddingBottom: 10, }}>
            <ImageBackground
                style={styles.Avatar}
                source={avatarSource}        >
            </ImageBackground>
            <Text style={{ fontWeight: 'bold', marginLeft: 5 }}>{staffs.username}</Text>
            <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={ShowModal}>
                <Icon name='information-circle' size={25} color="black" />
            </TouchableOpacity>

            <Modal visible={selectedModal} animationType='fade' transparent={true}>
                <TouchableOpacity style={styles.ContainerModal} onPress={CloseMadal}>
                    <View style={styles.contentModal}>
                        {/* Hiển thị thông tin chi tiết của mục được chọn */}
                        {selectedStaff && (
                            <View styles={{ flex: 1 }}>
                                <View style={{ alignItems: "center" }}>
                                    <ImageBackground style={{ width: 90, height: 90, borderRadius: 50, borderWidth: 3, overflow: 'hidden' }} source={avatarSource}></ImageBackground>
                                    <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{selectedStaff.username}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 20, marginLeft: 20 }}>
                                    <View>
                                        <Icon name='call' size={18} color='black' />
                                        <Icon name='mail' size={18} color='black' marginTop={10} />
                                    </View>
                                    <View style={{ marginLeft: 10 }}>
                                        <Text>{selectedStaff.phoneStaff}</Text>
                                        <Text style={{ marginTop: 10 }}>{selectedStaff.emailStaff}</Text>
                                    </View>
                                </View>
                            </View>
                        )}
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 10, backgroundColor: '#DDDDDD', borderRadius: 10 }}>
                            <TouchableOpacity style={{ marginRight: '20%' }} onPress={makePhoneCall}>
                                <Icon name='call' size={25} color='black' />
                            </TouchableOpacity>
                            <Text style={{ height: 45, width: 0, borderWidth: 0.5, borderColor: 'white' }}></Text>
                            <TouchableOpacity style={{ marginLeft: '20%' }}>
                                <Icon name='exit-outline' size={25} color='black'  onPress={showModelPassDe}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>

            <Modal visible={modalPassDe} animationType="slide" transparent={true}>
                <TouchableOpacity style={styles.modalContainer} onPress={closeModalPassDe}>
                    <View style={styles.modalContent}>
                        <FontAwesome name='lock' size={35} />
                        <TextInput
                            style={styles.textInput}
                            placeholder="Nhập mật khẩu"
                            value={deletePassword}
                            onChangeText={setDeletePassword}
                            secureTextEntry={true}
                        />
                        <Text style={{ color: 'red' }}>{deletePasswordErr}</Text>
                        <TouchableOpacity style={styles.modalButton}>
                            <Text style={styles.modalButtonText} onPress={deleteStaffs}>Xác nhận</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={closeModalPassDe}>
                            <Text style={styles.modalButtonText}>Hủy</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

export default ItemMS;

const styles = StyleSheet.create({

    Avatar: {
        backgroundColor: 'white',
        width: 30,
        height: 30,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 40,
        overflow: 'hidden', // Đảm bảo hình ảnh không tràn ra ngoài khung
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
      textInput: {
        width: 300,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        margin: 10,
        textAlign: 'center',
      },
});
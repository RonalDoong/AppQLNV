import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';


const ItemDepartmen = ({ Departmen, navigateToManager, deleteDepartment}) => {

  const handlePress = () => {
    navigateToManager(Departmen.id);
  };
  const [modalPassDe, setModalPassDe] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deletePasswordErr, setDeletePasswordErr] = useState('');

  const showModelPassDe = () => {
    setModalPassDe(true);
  }
  const closeModalPassDe = () => {
    setModalPassDe(false);
  }

  const deleteDepartmen = async () => {
    try {
      // Lấy mật khẩu mới từ máy chủ
      const newPasswordResponse = await fetch('http://192.168.1.5:3000/accountAdmin');
      const newPasswordData = await newPasswordResponse.json();
      const newPassword = newPasswordData[0].password;
  
      // Xác thực mật khẩu
      if (deletePassword.length === 0) {
        setDeletePasswordErr('Vui lòng nhập mật khẩu để xóa.');
        return;
      }
      if (deletePassword !== newPassword) {
        setDeletePasswordErr('Mật khẩu không chính xác.');
        return;
      }
  
      // Xóa phòng ban
      deleteDepartment(Departmen.id);
      setDeletePassword('');
      setDeletePasswordErr('');
      closeModalPassDe(); // Close the password confirmation modal
    } catch (error) {
      console.error('Lỗi:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={styles.Container} onPress={handlePress}>
        <View style={styles.Avatar}></View>
        <Text style={{ width: 220, fontSize: 16, fontWeight: 'bold', color: 'black', marginTop: 35 }}>
          {Departmen.nameDepartmen}
        </Text>
        <TouchableOpacity style={{ justifyContent: 'center' }} onPress={showModelPassDe}>
          <Icon name='trash-outline' size={25} color={'red'} />
        </TouchableOpacity>
      </TouchableOpacity>

      <Modal visible={modalPassDe} animationType="slide" transparent={true}>
        <TouchableOpacity style={styles.modalContainer} onPress={closeModalPassDe}>
          <View style={styles.modalContent}>
            <FontAwesome name='lock' size={35}/>
            <TextInput
              style={styles.textInput}
              placeholder="Nhập mật khẩu"
              value={deletePassword}
              onChangeText={setDeletePassword}
              secureTextEntry={true}
            />
            <Text style={{ color: 'red' }}>{deletePasswordErr}</Text>
            <TouchableOpacity style={styles.modalButton}>
              <Text style={styles.modalButtonText} onPress={deleteDepartmen}>Xác nhận</Text>
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

export default ItemDepartmen;

const styles = StyleSheet.create({
  Container: {
    marginBottom: 10,
    flexDirection: 'row',
    backgroundColor: '#DDDDDD',
  },
  Avatar: {
    backgroundColor: 'white',
    margin: 10,
    width: 70,
    height: 70,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 40,
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
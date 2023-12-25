import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal, TextInput, ImageBackground } from 'react-native'
import React from 'react'
import { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';


const ManagerDetail = (props) => {
    const [staff, setStaff] = useState([]);
    const [NameBank, setNameBank] = useState('');
    const [numberBank, setNumberBank] = useState('');
    const [modalVisible, setModalVisible] = useState('');

    const [modalPassDe, setModalPassDe] = useState('');
    const [modalUpdate, setModalUpdate] = useState('');
    const [deletePassword, setDeletePassword] = useState('');
    const [deletePasswordErr, setDeletePasswordErr] = useState('');

    //update
    const [updatedUsername, setUpdatedUsername] = useState('');
    const [updatedPassword, setUpdatedPassword] = useState('');
    const [updatedPhoneManager, setUpdatedPhoneManager] = useState('');
    const [updatedEmailManager, setUpdatedEmailManager] = useState('');
    const [updatedNumberBank, setUpdatedNumberBank] = useState('');



    const showModelPassDe = () => {
        setModalPassDe(true);
    }
    const closeModalPassDe = () => {
        setModalPassDe(false);
    }

    const showModelUpdate = () => {
        setModalUpdate(true);
    }
    const closeModalUpdate = () => {
        setModalUpdate(false);
    }

    const showModel = () => {
        setModalVisible(true);
    }
    const closeModal = () => {
        setModalVisible(false);
    }



    useEffect(() => {
        const interval = setInterval(() => {
            fetch('http://192.168.1.5:3000/listManager')
                .then(response => response.json())
                .then(data => {
                    const staffData = data.find(item => item.id === props.route.params.id);
                    setStaff(staffData);
                })
                .catch(error => {
                    console.error(error);
                });
        }, 1000);

        // Xóa Polling khi component bị hủy
        return () => clearInterval(interval);
    }, []);


    const AddBank = async () => {
        if (staff && staff.NameBank && staff.numberBank) {
            // Các trường NameBank và numberBank đã được điền
            closeModal();
            return;
        }

        const data = {
            NameBank: NameBank,
            numberBank: numberBank,
        };

        try {
            const response = await fetch(`http://192.168.1.5:3000/listManager/${props.route.params.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                // Handle successful response
                console.log('Thêm thành công');
                closeModal();
            } else {
                // Handle error response
                console.error('Failed to add manager:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    //Xoa Manager
    const deleteManager = async () => {
        try {
            // Lấy mật khẩu mới từ máy chủ
            const newPasswordResponse = await fetch('http://192.168.1.5:3000/accountAdmin');
            const newPasswordData = await newPasswordResponse.json();
            console.log(newPasswordData);
            const newPassword = newPasswordData[0].password;
            console.log(newPassword);

            // Xác thực mật khẩu
            if (deletePassword.length === 0) {
                setDeletePasswordErr('Vui lòng nhập mật khẩu để xóa.');
                return;
            }
            if (deletePassword !== newPassword) {
                setDeletePasswordErr('Mật khẩu không chính xác.');
                return;
            }

            // Xóa nhân viên
            const deleteResponse = await fetch(`http://192.168.1.5:3000/listManager/${props.route.params.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (deleteResponse.ok) {
                // Xóa thành công
                console.log('Xóa quản lý thành công.');
                // Chuyển hướng đến màn hình trước đó hoặc thực hiện các thao tác khác
                navigateToBack();
            } else {
                // Xóa không thành công
                console.error('Xóa quản lý không thành công:', deleteResponse.statusText);
            }
        } catch (error) {
            console.error('Lỗi:', error);
        }
    };

    //Update
    const updateManager = async () => {
        const data = {
            username: updatedUsername,
            password: updatedPassword,
            phoneManager: updatedPhoneManager,
            emailManager: updatedEmailManager,
            numberBank: updatedNumberBank,
        };

        try {
            const response = await fetch(
                `http://192.168.1.5:3000/listManager/${props.route.params.id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }
            );

            if (response.ok) {
                // Xử lý khi cập nhật thành công
                console.log('Cập nhật thành công');
                closeModalUpdate();
            } else {
                // Xử lý khi cập nhật không thành công
                console.error('Lỗi khi cập nhật:', response.statusText);
            }
        } catch (error) {
            console.error('Lỗi:', error);
        }
    };

    const navigateToBack = () => {
        props.navigation.goBack();
    }

    const avatarSource = staff.avatarManager ? { uri: staff.avatarManager } : null;
    return (
        <View style={{ flex: 1, marginTop: '10%' }}>
            <View style={{ flexDirection: "row", borderColor: "black", borderBottomWidth: 0.5 }}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={navigateToBack}>
                        <Icon name='chevron-back' size={40} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.Text}>{staff && staff.username}</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <ImageBackground
                    style={styles.Avartar}
                    source={avatarSource}        >
                </ImageBackground>
                <View style={{ flexDirection: 'column', marginLeft: 'auto', width: 170, margin: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name='briefcase' color={'#FF6633'} size={17} />
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FF6633' }}>{staff && staff.position}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                        <Icon name='person' color={'black'} size={15} />
                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{staff && staff.username}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                        <Icon name='key' color={'black'} size={15} />
                        <Text>{staff && staff.password}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                        <Icon name='call' color={'black'} size={15} />
                        <Text>{staff && staff.phoneManager}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                        <Icon name='mail' color={'black'} size={15} />
                        <Text>{staff && staff.emailManager}</Text>
                    </View>
                </View>
            </View>
            <View style={{ margin: 10 }}>
                <View style={styles.textBank}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}><Icon name='card' size={20} /><Text style={{ fontWeight: 'bold', color: 'blue' }}>{staff && staff.numberBank}</Text>
                        <View style={{ flexDirection: 'row', marginLeft: "auto" }}>
                            <Text style={{ fontWeight: 'bold' }}>{staff && staff.NameBank}</Text>
                            {(!staff || !staff.NameBank || !staff.numberBank) && (
                                <TouchableOpacity onPress={showModel} >
                                    <Icon name='add-circle' size={30} color="black" marginLeft={10} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </View>
            <View style={{ margin: 10 }}>
                <TouchableOpacity style={styles.button} onPress={showModelUpdate}>
                    <Text style={styles.textBtn}>Chỉnh sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={showModelPassDe}>
                    <Text style={styles.textBtn}>Xóa</Text>
                </TouchableOpacity>
            </View>

            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <TouchableOpacity style={styles.modalContainer} onPress={closeModal}>
                    <View style={styles.modalContent}>
                        <Text style={{ fontSize: 17, fontWeight: 'bold' }}>Thêm tài khoản ngân hàng</Text>
                        <View>
                            <TextInput style={styles.textInput} placeholder='Tên ngân hàng' value={NameBank} onChangeText={setNameBank}></TextInput>
                            <TextInput style={styles.textInput} placeholder='Số tài khoản' value={numberBank} onChangeText={setNumberBank}></TextInput>
                        </View>
                        <TouchableOpacity style={styles.modalButton} onPress={AddBank}>
                            <Text style={styles.modalButtonText}>Thêm</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                            <Text style={styles.modalButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            <Modal visible={modalPassDe} animationType="slide" transparent={true}>
                <TouchableOpacity style={styles.modalContainer} onPress={closeModalPassDe}>
                    <View style={styles.modalContent}>
                        <Text style={{ fontSize: 17, fontWeight: 'bold' }}>Xác nhận xóa</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Nhập mật khẩu"
                            value={deletePassword}
                            onChangeText={setDeletePassword}
                            secureTextEntry={true}
                        />
                        <Text style={{ color: 'red' }}>{deletePasswordErr}</Text>
                        <TouchableOpacity style={styles.modalButton}>
                            <Text style={styles.modalButtonText} onPress={deleteManager}>Xác nhận</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={closeModalPassDe}>
                            <Text style={styles.modalButtonText}>Hủy</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>


            <Modal visible={modalUpdate} animationType="slide" transparent={true}>
                <TouchableOpacity style={styles.modalContainer} onPress={closeModalUpdate}>
                    <View style={styles.modalContent}>
                        <TextInput
                            style={styles.textInput}
                            placeholder={staff && staff.username}
                            value={updatedUsername}
                            onChangeText={setUpdatedUsername}
                        />
                        <TextInput
                            style={styles.textInput}
                            placeholder={staff && staff.password}
                            value={updatedPassword}
                            onChangeText={setUpdatedPassword}
                        />
                        <TextInput
                            style={styles.textInput}
                            placeholder={staff && staff.phoneManager}
                            value={updatedPhoneManager}
                            onChangeText={setUpdatedPhoneManager}
                        />
                        <TextInput
                            style={styles.textInput}
                            placeholder={staff && staff.emailManager}
                            value={updatedEmailManager}
                            onChangeText={setUpdatedEmailManager}
                        />
                        <TextInput
                            style={styles.textInput}
                            placeholder={staff && staff.numberBank}
                            value={updatedNumberBank}
                            onChangeText={setUpdatedNumberBank}
                        />

                        <TouchableOpacity style={styles.modalButton} onPress={updateManager}>
                            <Text style={styles.modalButtonText}>Xác nhận</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={closeModalUpdate}>
                            <Text style={styles.modalButtonText}>Hủy</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

        </View>
    )
}

export default ManagerDetail

const styles = StyleSheet.create({
    Avartar: {
        margin: 10,
        width: 150,
        height: 200,
        borderColor: 'black',
        borderWidth: 1
    },
    button: {
        backgroundColor: 'black',
        height: 40,
        margin: 10,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: 'center'
    },
    textBtn: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold'
    },
    textBank: {
        borderColor: 'black',
        borderBottomWidth: 1,
        padding: 10,
        marginBottom: 20,
        width: 340,
        backgroundColor: '#EEEEEE'
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
    Text: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 10,
        width: 300
    },
})
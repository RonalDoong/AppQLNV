import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, ScrollView } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import ItemNotificationChat from '../Items/ItemNotificationChat';


const NotificationChat = (props) => {
    const [From, setFrom] = useState('');
    const [FromList, setFromList] = useState([]);
    const [To, setTo] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const [ToErr, setToErr] = useState('');
    const [titleErr, setTitleErr] = useState('');
    const [contentErr, setContentErr] = useState('');

    const [NotificationList, setNotificationList] = useState([]);

    const [newNotificationList, setNewNotificationList] = useState([]);

    useEffect(() => {
        fetchNotificationList();
    }, []);

    const fetchNotificationList = async () => {
        try {
            const response = await fetch('http://192.168.1.5:3000/listNotificationChat');
            const data = await response.json();
            const formattedData = data.map(item => ({
                ...item,
                time: new Date(item.time).toLocaleString() // Định dạng lại thông tin thời gian
            }));
            setNotificationList(formattedData);
        } catch (error) {
            console.error('Error:', error);
        }
    };


    const AddNotification = async () => {

        if (To.length === 0) {
            setToErr('Vui lòng nhập tên người gửi');
            return;
        }
        if (title.length === 0) {
            setTitleErr('Vui lòng nhập tiêu đề');
            return;
        }
        if (content.length === 0) {
            setContentErr('Vui lòng nhập nội dung');
            return;
        }
        // Tiến hành lưu thông tin nhân viên
        const data = {
            From: From,
            To: To,
            title: title,
            content: content,
            time: new Date().toISOString() // Thêm thông tin thời gian
        };
        try {
            const response = await fetch('http://192.168.1.5:3000/listNotificationChat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                console.log("Thêm thành công");
                ClearInput();
                closeModal();
                const newNotification = {
                    From: From,
                    To: To,
                    title: title,
                    content: content,
                    time: new Date().toLocaleString() // Thêm thông tin thời gian
                };
                setNewNotificationList([...newNotificationList, newNotification]);
            } else {
                // Handle error response
                console.log("Thêm thất bại")
            }
        } catch (error) {
            console.error('Error:', error);

        }
    };

    useEffect(() => {
        fetchFromList();
    }, []);

    const fetchFromList = async () => {
        try {
            const response = await fetch('http://192.168.1.5:3000/accountAdmin');
            const data = await response.json();
            setFromList(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const navigateToHome = () => {
        props.navigation.navigate('Home');
    };

    const [modalVisible, setModalVisible] = useState('');

    const showModel = () => {
        setModalVisible(true);
    }
    const closeModal = () => {
        setModalVisible(false);
    }

    const ClearInput = () =>{
        setFrom('');
        setTo('');
        setTitle('');
        setContent('');
    };

    return (
        <View style={{ flex: 1, marginTop:'10%' }}>
            <View style={{ flexDirection: "row", borderColor: "black", borderBottomWidth: 0.5}}>
                <View style={{flexDirection: 'row' }}>
                    <TouchableOpacity onPress={navigateToHome}>
                        <Icon name='chevron-back' size={40} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.Text}>Thông báo</Text>
                    <View style={{marginLeft:'auto'}}>
                        <TouchableOpacity onPress={showModel}>
                            <Icon name='add-circle' size={40} color="black" margin={5} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={{ width: '100%', marginBottom: '20%' }}>
            <ScrollView>
    {[...newNotificationList.reverse(), ...NotificationList.reverse()].map((NotificationChat, index) => (
        <ItemNotificationChat key={index} NotificationChat={NotificationChat} />
    ))}
</ScrollView>
            </View>


            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={styles.textModel}>Từ: </Text>
                                <Text style={styles.textModel}>Đến: </Text>
                                <Text style={styles.textModel}>Tiêu đề: </Text>
                                <Text style={styles.textModel}>Nội dung: </Text>
                            </View>
                            <View style={{ flexDirection: 'column', marginLeft: 'auto' }}>
                                <Text style={styles.textInput}>{From}</Text>
                                <Picker
                                    selectedValue={From}
                                    onValueChange={(itemValue) => setFrom(itemValue)}
                                >
                                    {FromList.map((from, index) => (
                                        <Picker.Item key={index} label={from.name} value={from.name} />
                                    ))}
                                </Picker>
                                <TextInput style={styles.textInput} value={To} onChangeText={setTo}></TextInput>
                                <Text style={styles.errorTxt}>{ToErr}</Text>
                                <TextInput style={{
                                    borderColor: 'black',
                                    borderBottomWidth: 1,
                                }} value={title} onChangeText={setTitle}
                                ></TextInput>
                                <Text style={styles.errorTxt}>{titleErr}</Text>
                            </View>
                        </View>
                        <TextInput style={styles.textInputTitle} multiline={true}
                            textAlignVertical="top" value={content} onChangeText={setContent}
                        ></TextInput>
                        <Text style={styles.errorTxt}>{contentErr}</Text>

                        <TouchableOpacity style={styles.modalButton} onPress={AddNotification}>
                            <Text style={styles.modalButtonText}>Gửi</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                            <Text style={styles.modalButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View>
    )
}

export default NotificationChat

const styles = StyleSheet.create({
    Text: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 10,
        width: 300
    },
    pooter: {
        backgroundColor: 'white',
        borderTopWidth: 2,
        borderColor: 'black',
        width: '100%',
        height: 60,
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
        width: '95%',
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
        width: 230,
        height: 30,
        borderRadius: 20,
        borderWidth: 2,
        marginBottom: 5,
        textAlign: "center"
    },
    textInputTitle: {
        width: '100%',
        borderColor: 'black',
        borderBottomWidth: 1,
    },
    textModel: {
        marginBottom: 50,
        fontSize: 15,
        fontWeight: 'bold'
    },
    errorTxt: {
        color: 'red',
        marginLeft: '10%',
    },
})
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, ScrollView } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import ItemNotificationChat from '../Items/ItemNotificationChat';

const NotificationManagerStaff = (props) => {

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


    const navigateToBack = () => {
        props.navigation.goBack();
    };


    return (
        <View style={{ flex: 1, marginTop:'10%' }}>
            <View style={{ flexDirection: "row", borderColor: "black", borderBottomWidth: 0.5}}>
                <View style={{flexDirection: 'row' }}>
                    <TouchableOpacity onPress={navigateToBack}>
                        <Icon name='chevron-back' size={40} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.Text}>Thông báo</Text>
                </View>
            </View>

            <View style={{ width: '100%', marginBottom: '20%' }}>
                <ScrollView>
                    {[...NotificationList.reverse(), ...newNotificationList].map((NotificationChat, index) => (
                        <ItemNotificationChat key={index} NotificationChat={NotificationChat} />
                    ))}
                </ScrollView>
            </View>


        </View>
    )
}

export default NotificationManagerStaff

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
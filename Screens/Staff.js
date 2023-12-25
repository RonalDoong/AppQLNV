import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import ItemStaff from '../Items/ItemStaff';
import { useState, useEffect } from 'react';

const Staff = (props) => {
    const [staffList, setStaffList] = useState([]);
    const [numberOfStaff, setNumberOfStaff] = useState(0);

    //so luong nhan vien
    useEffect(() => {
        setNumberOfStaff(staffList.length);
      }, [staffList]);

    useEffect(() => {
        // Thiết lập Polling bằng cách gửi yêu cầu và cập nhật thông tin mới từ máy chủ mỗi 5 giây
        const interval = setInterval(() => {
            fetchStaffList();
        }, 1000);

        // Xóa Polling khi component bị hủy
        return () => clearInterval(interval);
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

    const navigateToStaffDetail = (id) => {
        props.navigation.navigate('StaffDetail', { id });
    };

    const navigateToHome = () => {
        props.navigation.navigate('Home');
    };
    const navigateToSearchStaff = () => {
        props.navigation.navigate('SearchStaff');
    }
    return (
        <View style={{ flex: 1, marginTop: '10%' }}>
            <View style={{ flexDirection: 'row', borderColor: "black", borderBottomWidth: 0.5, alignItems: 'center', padding: 5 }}>
                <TouchableOpacity onPress={navigateToHome}>
                    <Icon name='chevron-back' size={40} color="black" />
                </TouchableOpacity>
                <Text style={{ fontSize: 17, fontWeight: 'bold', marginLeft: 10 }}>Danh sách nhân viên (<Icon name='person' size={20}/>{numberOfStaff})</Text>
                <TouchableOpacity style={{ marginLeft: 'auto', justifyContent: 'center' }} onPress={navigateToSearchStaff}>
                    <Icon name='search' size={25} />
                </TouchableOpacity>
            </View>
            <ScrollView>
                {staffList.map((staff, index) => (
                    <ItemStaff key={index} staff={staff} navigateToStaffDetail={navigateToStaffDetail} />
                ))}
            </ScrollView>
        </View>
    )
}

export default Staff

const styles = StyleSheet.create({})
import { StyleSheet, Text, View, TouchableOpacity, Modal, ImageBackground, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import * as Linking from 'expo-linking';

const ItemMS = ({ staffs}) => {
    const avatarSource = staffs.avatarStaff ? { uri: staffs.avatarStaff } : null;
    const [selectedModal, setSelectedMoadal] = useState('');
    const [selectedStaff, setSelectedStaff] = useState(null);

    const ShowModal = () => {
        setSelectedMoadal(true);
        setSelectedStaff(staffs); // Gán thông tin chi tiết của mục được chọn vào selectedStaff
    }
    const CloseMadal = () => {
        setSelectedMoadal(false);
    }


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
                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 10, backgroundColor: '#DDDDDD', borderRadius: 10, height:45 }}
                        onPress={makePhoneCall}
                        >
                                <Icon name='call' size={30} color='black' />
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
});
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

const AddManager = (props) => {
    const [avatarManager, setAvatarManager] = useState("");
    const [image, setImage] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [emailManager, setEmailManager] = useState("");
    const [phoneManager, setPhoneManager] = useState("");
    const [position, setPosition] = useState("");

    const [avatarManagerErr, setAvatarManagerErr] = useState("");
    const [usernameErr, setUsernameErr] = useState("");
    const [passwordErr, setPasswordErr] = useState("");
    const [emailManagerErr, setEmailManagerErr] = useState("");
    const [phoneManagerErr, setPhoneManagerErr] = useState("");

    //Camera
    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permission denied');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    //libary
    const chooseImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permission denied');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };


    const AddManager = async () => {
        if (username.length === 0) {
            setUsernameErr("Vui lòng nhập tên!");
            return;
        }
        if (password.length === 0) {
            setPasswordErr("Vui lòng nhập mật khẩu!");
            return;
        }
        if (emailManager.length === 0) {
            setEmailManagerErr("Vui lòng nhập email!");
            return;
        }
        if (phoneManager.length === 0) {
            setPhoneManagerErr("Vui lòng nhập số điện thoại!");
            return;
        }

        const data = {
            avatarManager: image,
            username: username,
            password: password,
            emailManager: emailManager,
            phoneManager: phoneManager,
            position: position,
        };

        try {
            const response = await fetch('http://192.168.1.5:3000/listManager', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                // Handle successful response
                console.log('Manager added successfully');
                ClearInput();
            } else {
                // Handle error response
                console.error('Failed to add manager:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const ClearInput = () => {
        setUsername("");
        setPassword("");
        setEmailManager("");
        setPhoneManager("");
        setAvatarManager("");
        setImage("");
    };

    const clearError = () => {
        setUsernameErr("");
        setPasswordErr("");
        setEmailManagerErr("");
        setPhoneManagerErr("");
    };

    const navigateToHome = () => {
        props.navigation.navigate('Home');
    };

    return (
        <View style={{ flex: 1, marginTop: '10%' }}>
            <View style={{ flexDirection: 'row', borderColor: "black", borderBottomWidth: 0.5 }}>
                <Icon name="chevron-left" size={30} color='black' onPress={navigateToHome} />
                <Icon name="history" size={30} color="black" style={{ marginLeft: 'auto' }} />
            </View>
            <View style={{ flexDirection: 'row' }}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.Avatar} onChangeText={setImage}/>
                ) : (
                    <View style={styles.Avatar} onChangeText={setAvatarManager}></View>
                )}
                <View style={{ flexDirection: 'row', marginLeft: 'auto', marginTop: 30 }}>
                    <TouchableOpacity style={styles.ButtonCameraLibary} onPress={takePhoto}>
                        <Icon name='camera' color={"white"} size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.ButtonCameraLibary} onPress={chooseImage}>
                        <Icon name='image' color={"white"} size={20} />
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.text}>Chức vụ:</Text>
            <Text style={styles.textInput}>{position}</Text>
            <Picker
                selectedValue={position}
                onValueChange={(itemValue) => setPosition(itemValue)}
            >
                <Picker.Item label="Quản lý" value="Quản lý" />
            </Picker>
            <TextInput placeholder='Name Manager' style={styles.textInput} value={username} onChangeText={setUsername}></TextInput>
            <Text style={styles.errorTxt}>{usernameErr}</Text>
            <TextInput placeholder='Pass Manager' style={styles.textInput} value={password} onChangeText={setPassword}></TextInput>
            <Text style={styles.errorTxt}>{passwordErr}</Text>
            <TextInput placeholder='Email Manager' style={styles.textInput} value={emailManager} onChangeText={setEmailManager}></TextInput>
            <Text style={styles.errorTxt}>{emailManagerErr}</Text>
            <TextInput placeholder='Phone Manager' style={styles.textInput} value={phoneManager} onChangeText={setPhoneManager}></TextInput>
            <Text style={styles.errorTxt}>{phoneManagerErr}</Text>

            <Text style={[styles.btnSave, { backgroundColor: 'black', color: 'white' }]} onPress={AddManager}>Save</Text>
            <Text style={[styles.btnSave, { backgroundColor: 'white' }]} onPress={ClearInput}>Clear</Text>
        </View>
    );
};

export default AddManager;

const styles = StyleSheet.create({
    textInput: {
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        margin: 5,
        textAlign: 'center',
    },
    Avatar: {
        margin: 15,
        width: 80,
        height: 80,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 40,
    },
    ButtonCameraLibary: {
        width: 100,
        height: 30,
        backgroundColor: "black",
        borderRadius: 15,
        alignItems: 'center',
        paddingTop: 5,
        margin: 10,
    },
    btnSave: {
        width: '94%',
        height: 40,
        textAlign: 'center',
        borderRadius: 20,
        fontWeight: 'bold',
        fontSize: 17,
        paddingTop: 5,
        borderWidth: 2,
        borderColor: 'black',
        margin: 10,
    },
    errorTxt: {
        color: 'red',
        marginLeft: '10%',
    },
});
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';


const AddStaff = (props) => {
    const [workingTime, setWorkingTime] = useState('');
    const [employeeType, setEmployeeType] = useState('');
    const [avatarStaff, setAvatarStaff] = useState('');
    const [image, setImage] = useState(null);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [birthDay, setBirthDay] = useState('');
    const [emailStaff, setEmailStaff] = useState('');
    const [phoneStaff, setPhoneStaff] = useState('');
    const [position, setPosition] = useState("");

    const [avatarStaffErr, setAvatarStaffErr] = useState('');
    const [usernameErr, setUsernameErr] = useState('');
    const [passwordErr, setPasswordErr] = useState('');
    const [emailStaffErr, setEmailStaffErr] = useState('');
    const [phoneStaffErr, setPhoneStaffErr] = useState('');
    const [birthDayErr, setBirthDayErr] = useState('');

    const [saveStatus, setSaveStatus] = useState('');
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');


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


    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await fetch('http://192.168.1.5:3000/listDepartmen');
            const data = await response.json();
            setDepartments(data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };


    const addStaff = async () => {

        if (username.length === 0) {
            setUsernameErr('Vui lòng nhập tên!');
            return;
        }
        if (username.length < 7) {
            setUsernameErr('Tên phải có ít nhất 7 ký tự!');
            return;
        }

        if (password.length === 0) {
            setPasswordErr('Vui lòng nhập mật khẩu!');
            return;
        }
        if (password.length < 7) {
            setPasswordErr('Mật khẩu phải có ít nhất 7 ký tự!');
            return;
        }

        if (birthDay.length === 0) {
            setBirthDayErr('Vui lòng nhập ngày sinh!');
            return;
        }
        const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;

        if (!dateRegex.test(birthDay)) {
            setBirthDayErr('Ngày sinh không hợp lệ! Vui lòng nhập theo định dạng dd/mm/yyyy');
            return;
        }

        if (emailStaff.length === 0) {
            setEmailStaffErr('Vui lòng nhập email!');
            return;
        }
        if (phoneStaff.length === 0) {
            setPhoneStaffErr('Vui lòng nhập số điện thoại!');
            return;
        }
        if (!/^\d{10}$/.test(phoneStaff)) {
            setPhoneStaffErr('Số điện thoại không hợp lệ!');
            return;
        }
        // Tiến hành lưu thông tin nhân viên
        const data = {
            avatarStaff: image,
            username: username,
            password: password,
            birthDay: birthDay,
            emailStaff: emailStaff,
            phoneStaff: phoneStaff,
            position: position,
            workingTime: workingTime,
            employeeType: employeeType,
        };
        try {
            const response = await fetch('http://192.168.1.5:3000/listStaff', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {

                setSaveStatus('Nhân viên đã được thêm thành công!');
                ClearInput();
            } else {
                // Handle error response
                setSaveStatus('Lỗi khi thêm nhân viên!');
            }
        } catch (error) {
            console.error('Error:', error);
            setSaveStatus('Lỗi khi thêm nhân viên!');
        }
    };


    const ClearInput = () => {
        setImage('');
        setAvatarStaff('');
        setUsername('');
        setPassword('');
        setBirthDay('');
        setPhoneStaff('');
        setEmailStaff('');
        setSelectedDepartment('');

        setUsernameErr('');
        setPasswordErr('');
        setBirthDayErr('');
        setPhoneStaffErr('');
        setEmailStaffErr('');
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
                    <Image source={{ uri: image }} style={styles.Avatar} onChangeText={setImage} />
                ) : (
                    <View style={styles.Avatar} onChangeText={setAvatarStaff}></View>
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
            <ScrollView>
                <Text style={styles.text}>Chức vụ:</Text>
                <Text style={styles.textInput}>{position}</Text>
                <Picker
                    selectedValue={position}
                    onValueChange={(itemValue) => setPosition(itemValue)}
                >
                    <Picker.Item label="Nhân viên" value="Nhân viên" />
                </Picker>
                <TextInput placeholder='Name Staff' style={styles.textInput} value={username} onChangeText={setUsername}></TextInput>
                <Text style={styles.errorTxt}>{usernameErr}</Text>
                <TextInput placeholder='Pass Staff' style={styles.textInput} value={password} onChangeText={setPassword}></TextInput>
                <Text style={styles.errorTxt}>{passwordErr}</Text>
                <TextInput placeholder='BirthDay' style={styles.textInput} value={birthDay} onChangeText={setBirthDay}></TextInput>
                <Text style={styles.errorTxt}>{birthDayErr}</Text>
                <TextInput placeholder='Email Staff' style={styles.textInput} value={emailStaff} onChangeText={setEmailStaff}></TextInput>
                <Text style={styles.errorTxt}>{emailStaffErr}</Text>
                <TextInput placeholder='Phone Staff' style={styles.textInput} value={phoneStaff} onChangeText={setPhoneStaff}></TextInput>
                <Text style={styles.errorTxt}>{phoneStaffErr}</Text>

                <Text style={styles.text}>Loại nhân viên:</Text>
                <Text style={styles.textInput}>{employeeType}</Text>
                <Picker
                    selectedValue={employeeType}
                    onValueChange={(itemValue) => setEmployeeType(itemValue)}
                >
                    <Picker.Item label="Part-Time" value="Part-Time" />
                    <Picker.Item label="Full-Time" value="Full-Time" />
                </Picker>

                {employeeType === 'Part-Time' && (
                    <>
                        <Text style={styles.text}>Thời gian làm việc:</Text>
                        <Text style={styles.textInput}>{workingTime}</Text>
                        <Picker
                            selectedValue={workingTime}
                            onValueChange={(itemValue) => setWorkingTime(itemValue)}
                        >
                            <Picker.Item label="Ca1(7h15-9h15)" value="Ca1(7h15-9h15)" />
                            <Picker.Item label="Ca2(9h25-11h25)" value="Ca2(9h25-11h25)" />
                            <Picker.Item label="Ca3(12h00-14h00)" value="Ca3(12h00-14h00)" />
                            <Picker.Item label="Ca4(14h15-16h15)" value="Ca4(14h15-16h15)" />
                            <Picker.Item label="Ca5(16h25-18h25)" value="Ca5(16h25-18h25)" />
                            <Picker.Item label="Ca6(18h30-20h30)" value="Ca6(18h20-20h30)" />
                        </Picker>
                    </>
                )}

                {employeeType === 'Full-Time' && (
                    <>
                        <Text style={styles.text}>Thời gian làm việc:</Text>
                        <Text style={styles.textInput}>{workingTime}</Text>
                        <Picker
                            selectedValue={workingTime}
                            onValueChange={(itemValue) => setWorkingTime(itemValue)}
                        >
                            <Picker.Item label="Ca ngày(8h30-17h30)" value="Ca ngày(8h30-17h30)" />
                            <Picker.Item label="Ca đêm(20h30-5h30)" value="Ca đêm(20h30-5h30)" />
                        </Picker>
                    </>
                )}

                {/* <Text style={styles.text}>Bộ phận làm việc:</Text>
                <Text style={styles.textInput}>{selectedDepartment}</Text>
                <Picker
                    selectedValue={selectedDepartment}
                    onValueChange={(itemValue) => setSelectedDepartment(itemValue)}
                >
                    <Picker.Item label="" value="" />
                    {departments.map((department, index) => (
                        <Picker.Item
                            key={index}
                            label={department.nameDepartmen}
                            value={department.nameDepartmen}
                        />
                    ))}
                </Picker> */}

            </ScrollView>


            <Text style={[styles.btnSave, { backgroundColor: 'black', color: 'white' }]} onPress={addStaff}>Save</Text>
            <Text style={[styles.btnSave, { backgroundColor: 'white' }]} onPress={ClearInput}>Clear</Text>

            <Text style={styles.saveStatus}>{saveStatus}</Text>
        </View>
    )
}

export default AddStaff

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
        textAlign: "center",
        paddingTop: 5,
        margin: 10,
        alignItems:'center'
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
    text: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 17,
    },
    saveStatus: {
        color: 'green',
        marginVertical: 10,
        textAlign: 'center',
    },
});
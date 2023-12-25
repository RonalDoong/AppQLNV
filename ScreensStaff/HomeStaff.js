import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/Ionicons';
import ItemDepartmenHM from '../ItemHomeManager/ItemDepartmenHM';

const HomeStaff = (props) => {
  const [staffInfo, setStaffInfo] = useState(null);
  const [matchingDepartments, setMatchingDepartments] = useState([]);

  const [username, setUserName] = useState('');

  useEffect(() => {
    const fetchStoredStaffInfo = async () => {
      const storedStaffInfo = await getStoredStaffInfo();
      setStaffInfo(storedStaffInfo);

      if (storedStaffInfo) {
        try {
          const response = await axios.get('http://192.168.1.5:3000/listDepartmen');

          if (response && response.data) {
            const listDepartmen = response.data;
            //console.log('Danh sách listDepartment:', JSON.stringify(listDepartmen));

            const jsonValue = JSON.parse(storedStaffInfo);
            const username = jsonValue.username;
            //console.log('Username trong asyncStorage:', username);

            // Lấy giá trị username từ listDepartmen
            const nameStaff = listDepartmen.map(department => department.staffs);
            //console.log('staff trong listDepartmen:', nameStaff);

            const usernameStaff = nameStaff.flatMap(staffs => {
              if (Array.isArray(staffs)) {
                return staffs.flatMap(item => item?.username || []);
              } else {
                return staffs?.username || [];
              }
            });

            //console.log('Username trong staff: ', usernameStaff);

            const matchingDepartments = listDepartmen.filter(department => {
              const departmentManagers = department.staffs;
              if (Array.isArray(departmentManagers)) {
                return departmentManagers.some(staffs => staffs.username === jsonValue.username);
              } else {
                return departmentManagers?.username === jsonValue.username;
              }
            });

            //console.log('Danh sách ListDepartmen có username giống nhau:', JSON.stringify(matchingDepartments));

            setMatchingDepartments(matchingDepartments);
          } else {
            console.error('Error getting listDepartment: Response or response.data is undefined.');
          }
        } catch (error) {
          console.error('Error getting listDepartment:', error);
        }
      }
    };

    fetchStoredStaffInfo();
  }, []);

  const getStoredStaffInfo = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('staffInfo');
      console.log('Thông tin:', jsonValue);
      if (jsonValue != null) {
        const parsedValue = JSON.parse(jsonValue);
        const username = parsedValue.username;
        //console.log('Username trong asyncStorage:', username);
        setUserName(username); // Cập nhật giá trị username vào state
        return jsonValue;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting manager info from AsyncStorage: ' + error);
      return null;
    }
  };

  const navigateToLogin = () => {
    props.navigation.navigate('Login');
  };
  const navigateToNotificationChat = () => {
    props.navigation.navigate('NotificationManagerStaff');
  };
  const navigateToDepartment = (id) => {
    props.navigation.navigate('DepartmenStaff', { id });
  };
  // ...

  return (
    <View style={{ flex: 1, marginTop: '10%' }}>
      <View style={{ flexDirection: "row", borderColor: "black", borderBottomWidth: 0.5 }}>
        <TouchableOpacity onPress={navigateToLogin}>
          <Icon name='chevron-back' size={40} color="black" />
        </TouchableOpacity>
        <Text style={{margin:10}}><Text style={{fontSize: 18, fontWeight:'bold'}}>{username}</Text></Text>
        <View style={{ flexDirection: "row", marginLeft: 'auto' }}>
          <Text style={styles.TextSerch} ><FontAwesome name='search' color={'white'} size={20} /></Text>
          <TouchableOpacity onPress={navigateToNotificationChat}>
            <Icon name='notifications' size={30} color="black" margin={3} />
          </TouchableOpacity>
        </View>
      </View>
     
      <ScrollView>
        {matchingDepartments.length === 0 ? (
          <Text style={styles.noDataText}>Chưa được phân công phòng ban làm việc!</Text>
        ) : (
          matchingDepartments.map((Homedepartment, index) => (
            <ItemDepartmenHM key={index} Homedepartment={Homedepartment} navigateToManager={navigateToDepartment} />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  TextSerch: {
    width: 30,
    height: 30,
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 15,
    padding: 5,
    backgroundColor: "#F5F5F5",
    margin: 5,
    backgroundColor:'black'
  },
  noDataText: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 20,
    margin: 10,
    color: 'gray'
  },
});

export default HomeStaff;
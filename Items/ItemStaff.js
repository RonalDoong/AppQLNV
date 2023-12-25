import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


const ItemStaff = ({ staff, navigateToStaffDetail }) => {
  const avatarSource = staff.avatarStaff ? { uri: staff.avatarStaff } : null;
  // // Kiểm tra nếu staff không tồn tại hoặc không có thuộc tính departments
  // if (!staff || !staff.departments) {
  //   return null; // Hoặc bạn có thể thực hiện xử lý lỗi khác ở đây
  // }
  const handlePress = () => {
    navigateToStaffDetail(staff.id);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <TouchableOpacity style={styles.Container} onPress={handlePress}>
        <ImageBackground
          style={styles.Avatar}
          source={avatarSource}        >
        </ImageBackground>
        <View style={{ flexDirection: 'column', marginLeft: 'auto', justifyContent: 'center' }}>
          <Text style={{ width: 230, fontSize: 17, fontWeight: 'bold', color: '#3366CC' }}>
            <Icon name='briefcase' color={'black'} size={17} /> {staff.position}
          </Text>
          <View style={{ borderBottomWidth: 0.5 }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}><Icon name='person' />{staff.username}</Text>
            <Text><Icon name='mail' /> {staff.emailStaff}</Text>
            <Text><Icon name='call' /> {staff.phoneStaff}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ItemStaff;

const styles = StyleSheet.create({
  Container: {
    flexDirection: 'row',
    // backgroundColor: '#DDDDDD',
    marginBottom: 10,
  },
  Avatar: {
    backgroundColor: 'white',
    margin: 20,
    width: 80,
    height: 80,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 40,
    overflow: 'hidden', // Đảm bảo hình ảnh không tràn ra ngoài khung
},
});
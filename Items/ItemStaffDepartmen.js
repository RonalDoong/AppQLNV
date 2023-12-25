import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ItemStaffDepartmen = ({ staffs, deleteStaff }) => {
  const avatarSource = staffs.avatarStaff ? { uri: staffs.avatarStaff } : null;

  const handleDelete = () => {
    deleteStaff(staffs.id);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <TouchableOpacity style={styles.Container}>
        <ImageBackground style={styles.Avatar} source={avatarSource}></ImageBackground>
        <View style={{ flexDirection: 'column', marginLeft: 'auto', justifyContent: 'center' }}>
          <Text style={{ width: 220, fontSize: 17, fontWeight: 'bold', color: '#3366CC' }}>
            <Icon name='briefcase' color={'black'} size={17} /> {staffs.position}
          </Text>
          <View style={{ borderBottomWidth: 0.5 }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}><Icon name='person' />{staffs.username}</Text>
            <Text><Icon name='mail' /> {staffs.emailStaff}</Text>
            <Text><Icon name='call' /> {staffs.phoneStaff}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleDelete} style={{justifyContent:'center'}}>
          <Icon name='trash-outline' size={25} color={'red'} />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

export default ItemStaffDepartmen;

const styles = StyleSheet.create({
  Container: {
    flexDirection: 'row',
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
    overflow: 'hidden',
  },
});
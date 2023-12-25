import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, PanResponder, Animated, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


const ItemManager = ({ manager, navigateToManagerDetail }) => {

    const handlePress = () => {
        navigateToManagerDetail(manager.id);
    };


    const avatarSource = manager.avatarManager ? { uri: manager.avatarManager } : null;
    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
        <TouchableOpacity style={styles.Container} onPress={handlePress}>
          <ImageBackground
            style={styles.Avatar}
            source={avatarSource}        >
          </ImageBackground>
          <View style={{ flexDirection: 'column', marginLeft: 'auto', justifyContent: 'center' }}>
            <Text style={{ width: 230, fontSize: 17, fontWeight: 'bold', color: '#FF6633' }}>
              <Icon name='briefcase' color={'black'} size={17} /> {manager.position}
            </Text>
            <View style={{ borderBottomWidth: 0.5 }}>
              <Text style={{ fontSize: 15, fontWeight: 'bold' }}><Icon name='person' />{manager.username}</Text>
              <Text><Icon name='mail' /> {manager.emailManager}</Text>
              <Text><Icon name='call' /> {manager.phoneManager}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
};

const styles = StyleSheet.create({
    Container: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center',
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
export default ItemManager
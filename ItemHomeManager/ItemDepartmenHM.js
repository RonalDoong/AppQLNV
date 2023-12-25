import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const ItemDepartmenHM = ({ Homedepartment, navigateToManager }) => {
    const handlePress = () => {
        navigateToManager(Homedepartment.id);
      };
  return (
    <View style={{ flex: 1, marginBottom: 10 }}>
    <TouchableOpacity style={styles.Container} onPress={handlePress}>
      <View style={styles.Avatar}></View>
      <Text style={{ width: 220, fontSize: 16, fontWeight: 'bold', color: 'black', marginTop:12 }}>
        {Homedepartment.nameDepartmen}
      </Text>
    </TouchableOpacity>
  </View>
  );
};

const styles = StyleSheet.create({
    Container: {
        flexDirection: 'row',
        backgroundColor: '#DDDDDD',
      },
      Avatar: {
        backgroundColor: 'white',
        margin: 10,
        width: 70,
        height: 70,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 40,
      },
});

export default ItemDepartmenHM;
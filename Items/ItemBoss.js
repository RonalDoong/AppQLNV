import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ItemBoss = ({boss}) => {
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.Container}>
                <View style={styles.Avatar}></View>
                <View style={{ flexDirection: 'column', marginLeft: 'auto' }}>
                    <Text style={{ width: 250, fontSize: 20, fontWeight: 'bold', color: 'red' }}>{boss.position}</Text>
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{boss.usernameBoss}</Text>
                    <Text>{boss.emailBoss}</Text>
                    <Text>{boss.phoneBoss}</Text>
                </View>
            </View>
        </View>
    )
}

export default ItemBoss

const styles = StyleSheet.create({
    Container: {
        flexDirection: 'row',
        backgroundColor: '#CCFFFF',
        marginTop: 5
    },
    Avatar: {
        margin: 15,
        width: 80,
        height: 80,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 40,
    }
})
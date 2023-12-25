import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

const ItemNotificationChat = ({ NotificationChat }) => {
  const [showFullContent, setShowFullContent] = useState(false);

  const handleShowMore = () => {
    setShowFullContent(true);
  };

  const containerHeight = showFullContent ? 'auto' : 200;

  return (
    <View style={{ flex: 1, margin: 10 }}>
      <View style={[styles.Container, { height: containerHeight }]}>
        <View style={{ margin: 10 }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{NotificationChat.From}</Text>
          <Text>Tới: {NotificationChat.To}</Text>
          <Text>Tiêu đề: {NotificationChat.title}</Text>
          <TouchableOpacity onPress={handleShowMore}>
            <View style={styles.textContent}>
              <Text>
                {showFullContent ? NotificationChat.content : NotificationChat.content?.slice(0, 50)}
              </Text>
            </View>
          </TouchableOpacity>
          {!showFullContent && (
            <TouchableOpacity onPress={handleShowMore}>
              <Text style={styles.showMoreText}>Xem thêm</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={{ marginTop: 0, margin: 10, color: 'gray' }}>{NotificationChat.time}</Text>
      </View>
    </View>
  );
};

export default ItemNotificationChat;

const styles = StyleSheet.create({
  Container: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 20,
    borderColor: 'black',
    borderWidth: 1,
    overflow: 'hidden',
  },
  textContent: {
    backgroundColor: '#C6E2FF',
    borderRadius: 10,
    padding: 5,
  },
  showMoreText: {
    color: 'blue',
    marginTop: 10,
  },
});
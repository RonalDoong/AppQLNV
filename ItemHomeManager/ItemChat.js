import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ItemChat = ({ chat, managerInfo }) => {
    if (!managerInfo) {
      return null;
    }
  
    const isCurrentUser = chat.toChat === managerInfo.username;
    const containerStyle = isCurrentUser
      ? styles.itemChatContainerCurrentUser
      : styles.itemChatContainer;
    const contentChatStyle = isCurrentUser
      ? styles.contentChatCurrentUser
      : styles.contentChat;
    const toChatstyLes = isCurrentUser ? styles.toChatCurrentUser : styles.toChat;
    const timeChatStyles = isCurrentUser
      ? styles.timeChatCurrentUser
      : styles.timeChat;
  
    return (
      <View>
        <View style={containerStyle}>
          <View style={styles.container}>
            <View>
              {!isCurrentUser && <Text style={toChatstyLes}>{chat.toChat}</Text>}
              <View style={styles.contentChatContainer}>
                <Text style={contentChatStyle}>{chat.contentChat}</Text>
              </View>
            </View>
            {/* <Text style={timeChatStyles}>{chat.timeChat}</Text> */}
          </View>
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    itemChatContainer: {
      marginRight: 'auto',
      flex: 1,
    },
    itemChatContainerCurrentUser: {
      marginLeft: 'auto',
      flex: 1,
    },
    toChat: {
      fontSize: 12,
      fontWeight: 'bold',
      color: 'black',
    },
    toChatCurrentUser: {
      fontSize: 12,
      fontWeight: 'bold',
      color: 'black',
      opacity: 0, // Ẩn text
    },
    contentChatContainer: {
      maxWidth: 200,
      flexWrap: 'wrap',
    },
    contentChat: {
      color: 'black',
      fontWeight: 'bold',
      backgroundColor: '#EEEEEE',
      borderRadius: 20,
      padding: 10,
      marginRight:'auto'
    },
    contentChatCurrentUser: {
      color: 'white',
      fontWeight: 'bold',
      backgroundColor: '#33CCFF',
      borderRadius: 20,
      padding: 10,
      marginLeft: 'auto',
      marginBottom:5
    },
    timeChat: {
      fontSize: 10,
      color: 'gray',
    },
    timeChatCurrentUser: {
      fontSize: 10,
      color: 'gray',
    },
  });
  
  export default ItemChat;
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const ChatBubble = ({ role, text, onSpeech, isUser }) => {
  return (
    <View style={[styles.container, isUser ? styles.userBubble : styles.modelBubble]}>
      <Text style={styles.text}>{text}</Text>
      <TouchableOpacity onPress={onSpeech} style={styles.speechButton}>
        <Text style={styles.speechText}>🔊</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: "75%",
    padding: 12,
    marginVertical: 5,
    borderRadius: 15,
  },
  userBubble: {
    alignSelf: "flex-end",
   // backgroundColor: "#4285F4",
  },
  modelBubble: {
    alignSelf: "flex-start",
   // backgroundColor: "#202020",
  },
  text: {
    fontSize: 16,
    color: "#b3d3fc",
  },
  speechButton: {
    marginTop: 5,
    alignSelf: "flex-end",
  },
  speechText: {
    fontSize: 14,
    color: "#fff",
  },
});

export default ChatBubble;
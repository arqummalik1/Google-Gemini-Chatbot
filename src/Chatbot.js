import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import axios from "axios";
import ChatBubble from "./ChatBubble";
import { speak, isSpeakingAsync, stop } from "expo-speech";
import {
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Chatbot = () => {
  const [chat, setChat] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const flatListRef = useRef(null);

  const API_KEY = "KEY";

  const handleUserInput = async () => {
    if (!userInput.trim()) return;
    Keyboard.dismiss();
    let updatedChat = [
      ...chat,
      {
        role: "user",
        parts: [{ text: userInput }],
      },
    ];

    setChat(updatedChat);
    setLoading(true);

    // Auto-scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);


    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        { contents: updatedChat }
      );

      console.log("Gemini Pro API Response ===>>", response.data);

      const modelResponse =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      if (modelResponse) {
        const updatedChatWithModel = [
          ...updatedChat,
          {
            role: "model",
            parts: [{ text: modelResponse }],
          },
        ];

        setChat(updatedChatWithModel);

        // Auto-scroll to bottom after model response
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (error) {
      console.error("Error Calling Gemini Pro API ==>>", error);
      setError("An error has occurred, please try again.");
    } finally {
      setUserInput("");
      setLoading(false);
    }
  };

  const handleSpeech = async (text) => {
    if (isSpeaking) {
      stop();
      setIsSpeaking(false);
    } else {
      if (!(await isSpeakingAsync())) {
        speak(text);
        setIsSpeaking(true);
      }
    }
  };

  const renderChatItem = ({ item }) => {
    return (
      <ChatBubble
        role={item.role}
        text={item.parts[0].text}
        onSpeech={() => handleSpeech(item.parts[0].text)}
        isUser={item.role === "user"}
      />
    );
  };

  return (
    <LinearGradient
    colors={["#0F172A", "#1E3A8A", "#3B82F6"]}
    style={{flex:1,width : "100%", height : "100%"}}
  >
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjusts UI based on OS
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      
        <View style={styles.container}>
          <Text style={styles.title}>Gemini</Text>
          
          <FlatList
           ref={flatListRef}
            data={chat}
            renderItem={renderChatItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.chatContainer}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            } // Auto-scroll when content changes
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
            removeClippedSubviews={true} // Improves performance by unmounting off-screen items
            initialNumToRender={10} // Renders only first 10 messages initially
            maxToRenderPerBatch={5} // Reduces rendering workload
            windowSize={5} //
          />
  
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="   Type your message..."
              placeholderTextColor="#94A3B8"
              value={userInput}
              onChangeText={setUserInput}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleUserInput}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send</Text>
              )}
            </TouchableOpacity>
          </View>
  
          {error && <Text style={styles.error}>{error}</Text>}
        </View>
        
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    //backgroundColor: "#323232",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#d3dae3",
    marginBottom: 20,
    marginTop: 50,
    textAlign: "center",
  },
  chatContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    height: 50,
    marginRight: 10,
    padding: 8,
    //borderColor: "#333",
    //borderWidth: 1,
    borderRadius: 25,
    color: "#60A5FA",
    backgroundColor: "#1E293B",
    marginTop:10,
  },
  button: {
    padding: 12,
    backgroundColor: "#2563EB",
    borderRadius: 25,
    minWidth: 70,
    alignItems: "center",
    justifyContent: "center",
    marginTop:10
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
});

export default Chatbot;
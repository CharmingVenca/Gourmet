import React, { useState, useRef } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Image,
  Text,
  View,
  TouchableHighlight,
  Modal,
  PanResponder,
  Pressable,
  TextInput,
} from "react-native";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import ColorPalette from "@/constants/ColorPalette";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { auth, db } from "@/config/firebaseConfig"; // Updated import
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

type UserData = {
  username: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

async function isUsernameUnique(username: string): Promise<boolean> {
  const userDoc = await getDoc(doc(db, "users", username));
  return !userDoc.exists();
}

function getDynamicStyles(type: string, colorScheme: string) {
  switch (type) {
    case "bd": return { borderColor: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text };
    case "bg": return { backgroundColor: colorScheme === 'dark' ? Colors.dark.background : Colors.light.background };
    case "tn": return { tintColor: colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint };
    case "tbID": return { tabIconDefault: colorScheme === 'dark' ? Colors.dark.tabIconDefault : Colors.light.tabIconDefault };
    case "tbIS": return { tabIconSelected: colorScheme === 'dark' ? Colors.dark.tabIconSelected : Colors.light.tabIconSelected };
    default: return {};
  }
}

function Welcome() {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? Colors.dark.text : Colors.light.text;
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    username: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState<string | null>(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_evt, gestureState) => {
        if (gestureState.dy > 50) {
          setModalVisible(false);
        }
      },
    })
  ).current;

  const handleChange = (field: keyof UserData, value: string) => {
    setUserData(prevState => ({ ...prevState, [field]: value }));
  };

  const validatePassword = () => {
    if (userData.password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (userData.password !== userData.confirmPassword) {
      return "Passwords do not match.";
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validatePassword();
    if (validationError) {
      setError(validationError);
      return;
    }

    const isUnique = await isUsernameUnique(userData.username);
    if (!isUnique) {
      setError("Username already exists.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const userId = userCredential.user.uid;
      if (userId) {
        const userFirestoreData = {
          userUID: userId,
          username: userData.username,
          fullName: userData.fullName,
          email: userData.email,
          grade: "6.B",
          role: "guest",
          notes: {},
          contributions: {},
          inbox: []
        };
        await setDoc(doc(db, "users", userId), userFirestoreData);
      }
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <SafeAreaView style={style.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <SafeAreaView style={[style.modalView, { backgroundColor: Colors[colorScheme ?? 'light'].background}]} {...panResponder.panHandlers}>
          <Pressable style={style.buttonClose} onPress={() => setModalVisible(false)}>
            <MaterialIcons name="close" size={24} color={Colors[colorScheme ?? 'light'].text} />
          </Pressable>
          <Text style={[style.title, {
            marginTop: 50,
            marginBottom: 50,
            fontWeight: 800,
            fontSize: 25,
            color: Colors[colorScheme ?? 'light'].text
          }]}>Create an account</Text>
          <TextInput
            style={[style.textInput, getDynamicStyles("bd", colorScheme || 'light')]}
            placeholder={"Username"}
            autoComplete="username"
            autoCapitalize="none"
            value={userData.username}
            onChangeText={(value) => handleChange("username", value)}
          />
          <TextInput
            style={[style.textInput, getDynamicStyles("bd", colorScheme || 'light')]}
            placeholder={"Full Name"}
            autoComplete="name"
            autoCapitalize="words"
            value={userData.fullName}
            onChangeText={(value) => handleChange("fullName", value)}
          />
          <TextInput
            style={[style.textInput, getDynamicStyles("bd", colorScheme || 'light')]}
            placeholder={"Email"}
            autoComplete="email"
            autoCapitalize="none"
            value={userData.email}
            onChangeText={(value) => handleChange("email", value)}
          />
          <TextInput
            style={[style.textInput, getDynamicStyles("bd", colorScheme || 'light')]}
            placeholder={"Password"}
            secureTextEntry
            autoComplete="new-password"
            textContentType="newPassword"
            autoCapitalize="none"
            value={userData.password}
            onChangeText={(value) => handleChange("password", value)}
          />
          <TextInput
            style={[style.textInput, getDynamicStyles("bd", colorScheme || 'light')]}
            placeholder={"Confirm password"}
            secureTextEntry
            autoComplete="new-password"
            textContentType="newPassword"
            autoCapitalize="none"
            value={userData.confirmPassword}
            onChangeText={(value) => handleChange("confirmPassword", value)}
          />
          <TouchableHighlight onPress={handleSubmit} underlayColor="transparent">
            <View style={style.button}>
              <Text style={style.buttonText}>Sign Up</Text>
            </View>
          </TouchableHighlight>
        </SafeAreaView>
      </Modal>

      <Image style={style.image} source={require("../../assets/images/icon.png")} />
      <Text style={[style.title, { color: textColor }]}>Hey! Welcome</Text>
      <Text style={[style.text, { color: textColor }]}>This is a school canteen rating system made for CG Plzeň by Václav Klimeš</Text>
      <TouchableHighlight onPress={() => setModalVisible(!modalVisible)} underlayColor="transparent">
        <View style={style.button}>
          <Text style={style.buttonText}>Get Started</Text>
        </View>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => console.log("Button Pressed")} underlayColor="transparent">
        <View style={[style.button, { backgroundColor: Colors[colorScheme ?? 'light'].background, borderColor: colorScheme ==='dark' ? Colors.light.background : Colors.dark.background}]}>
          <Text style={[style.buttonText, {color: Colors[colorScheme ?? 'light'].text}]}>I already have an account</Text>
        </View>
      </TouchableHighlight>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 24,
  },
  text: {
    width: 300,
    textAlign: "center",
    marginBottom: 20,
    opacity: 0.65,
  },
  textInput: {
    width: 300,
    height: 40,
    marginBottom: 15,
    borderWidth: 0.3,
    borderRadius: 10,
    paddingLeft: 15
  },
  button: {
    width: 300,
    height: 50,
    backgroundColor: ColorPalette.color2,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 0.3,
  },
  buttonText: {
    fontWeight: "bold",
  },
  modalView: {
    flex: 1,
    marginTop: 65,
    borderRadius: 40,
    height: '90%',
    alignItems: "center",
  },
  buttonClose: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  }
});

export default Welcome;
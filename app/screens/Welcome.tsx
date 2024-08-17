import React, {useState} from "react";
import {
  StyleSheet,
  SafeAreaView,
  Image,
  Text,
  TextInput,
  Button,
  View,
  TouchableHighlight, TouchableWithoutFeedback, Modal,
} from "react-native";
import {useColorScheme} from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import ColorPalette from "@/constants/ColorPalette";

function Welcome() {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? Colors.dark.text : Colors.light.text;
  const [modalVisible, setModalVisible] = useState(false)

  return (
    <SafeAreaView style={style.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
        >

      </Modal>


      <Image style={style.image} source={require("../../assets/images/icon.png")} />
      <Text style={[style.title, {
        color: textColor,
      }]}>Hey! Welcome</Text>
      <Text style={[style.text, { color: textColor}]}>This is a school cantine rating system made for CG Plzeň by Václav Klimeš</Text>
      <TouchableHighlight onPress={() => setModalVisible(!modalVisible)} underlayColor="transparent">
        <View style={style.button}>
          <Text style={style.buttonText}>Get Started</Text>
        </View>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => console.log("Button Pressed")} underlayColor="transparent">
        <View style={[style.button, { backgroundColor: "#FFF"}]}>
          <Text style={style.buttonText}>I already have an account</Text>
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
  },
  textInput: {
    textAlign: "left"
  },
  button: {
    width: 300,
    height: 50,
    backgroundColor: ColorPalette.color2,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderColor: "#000",
    borderWidth: 0.3,
  },
  buttonText: {
    fontWeight: "bold",
  }
});

export default Welcome;
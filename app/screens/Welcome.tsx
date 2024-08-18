import React, { useState, useRef } from 'react';
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
  TouchableWithoutFeedback,
} from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';
import ColorPalette from '@/constants/ColorPalette';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Dropdown } from 'react-native-element-dropdown';
import { useAuthentication } from '@/hooks/useAuthentication';

type UserData = {
  username: string;
  fullName: string;
  grade: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function getDynamicStyles(type: string, colorScheme: string) {
  switch (type) {
    case 'bd':
      return { borderColor: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text };
    case 'bg':
      return { backgroundColor: colorScheme === 'dark' ? Colors.dark.background : Colors.light.background };
    case 'tn':
      return { tintColor: colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint };
    case 'tbID':
      return { tabIconDefault: colorScheme === 'dark' ? Colors.dark.tabIconDefault : Colors.light.tabIconDefault };
    case 'tbIS':
      return { tabIconSelected: colorScheme === 'dark' ? Colors.dark.tabIconSelected : Colors.light.tabIconSelected };
    default:
      return {};
  }
}

function Welcome() {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? Colors.dark.text : Colors.light.text;
  const [signupModalVisible, setSignupModalVisible] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    username: '',
    fullName: '',
    grade: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const { signUp, login, error } = useAuthentication();
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_evt, gestureState) => {
        if (gestureState.dy > 50) {
          setSignupModalVisible(false);
        }
      },
    })
  ).current;

  const handleChange = (field: keyof UserData, value: string) => {
    setUserData((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleLoginChange = (field: keyof typeof loginData, value: string) => {
    setLoginData((prevState) => ({ ...prevState, [field]: value }));
  };

  return (
    <SafeAreaView style={style.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={signupModalVisible}
        onRequestClose={() => setSignupModalVisible(!signupModalVisible)}
      >
        <SafeAreaView style={[style.modalView, { backgroundColor: Colors[colorScheme ?? 'light'].background }]} {...panResponder.panHandlers}>
          <Pressable style={style.buttonClose} onPress={() => setSignupModalVisible(false)}>
            <MaterialIcons name="close" size={24} color={Colors[colorScheme ?? 'light'].text} />
          </Pressable>
          <Text style={[style.title, { marginTop: 50, marginBottom: 50, fontWeight: 800, fontSize: 25, color: Colors[colorScheme ?? 'light'].text }]}>Create an account</Text>
          {error && <Text style={style.errorText}>{error}</Text>}
          <TextInput
            style={[style.textInput, getDynamicStyles('bd', colorScheme || 'light')]}
            placeholder={'Username'}
            autoComplete="username"
            autoCapitalize="none"
            value={userData.username}
            onChangeText={(value) => handleChange('username', value)}
            autoCorrect={false}
          />
          <TextInput
            style={[style.textInput, getDynamicStyles('bd', colorScheme || 'light')]}
            placeholder={'Full Name'}
            autoComplete="name"
            autoCapitalize="words"
            value={userData.fullName}
            onChangeText={(value) => handleChange('fullName', value)}
          />
          <Dropdown
            style={[style.textInput, getDynamicStyles('bd', colorScheme || 'light'), { paddingRight: 10 }]}
            placeholderStyle={style.placeholderStyle}
            selectedTextStyle={{ fontSize: 15 }}
            containerStyle={style.dropdownContainer}
            data={[
              { label: '1A', value: '1A' },
              { label: '1B', value: '1B' },
              { label: '2A', value: '2A' },
              { label: '2B', value: '2B' },
              { label: '3A', value: '3A' },
              { label: '3B', value: '3B' },
              { label: '4A', value: '4A' },
              { label: '4B', value: '4B' },
              { label: '5A', value: '5A' },
              { label: '5B', value: '5B' },
              { label: '6A', value: '6A' },
              { label: '6B', value: '6B' },
              { label: '7A', value: '7A' },
              { label: '7B', value: '7B' },
              { label: '8A', value: '8A' },
              { label: '8B', value: '8B' },
            ]}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={'Grade'}
            value={userData.grade}
            onChange={(item) => {
              handleChange('grade', item.value);
            }}
          />
          <TextInput
            style={[style.textInput, getDynamicStyles('bd', colorScheme || 'light')]}
            placeholder={'Email'}
            autoComplete="email"
            autoCapitalize="none"
            value={userData.email}
            onChangeText={(value) => handleChange('email', value)}
            autoCorrect={false}
          />
          <TextInput
            style={[style.textInput, getDynamicStyles('bd', colorScheme || 'light')]}
            placeholder={'Password'}
            secureTextEntry
            autoComplete="new-password"
            textContentType="newPassword"
            autoCapitalize="none"
            value={userData.password}
            onChangeText={(value) => handleChange('password', value)}
          />
          <TextInput
            style={[style.textInput, getDynamicStyles('bd', colorScheme || 'light')]}
            placeholder={'Confirm password'}
            secureTextEntry
            autoComplete="new-password"
            textContentType="newPassword"
            autoCapitalize="none"
            value={userData.confirmPassword}
            onChangeText={(value) => handleChange('confirmPassword', value)}
          />
          <TouchableHighlight onPress={() => signUp(userData)} underlayColor="transparent">
            <View style={style.button}>
              <Text style={style.buttonText}>Sign Up</Text>
            </View>
          </TouchableHighlight>
          <TouchableWithoutFeedback
            onPress={() => {
              setSignupModalVisible(false);
              setLoginModalVisible(true);
            }}
          >
            <Text style={[style.text, { color: textColor }]}>Already have an account?</Text>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={loginModalVisible}
        onRequestClose={() => setLoginModalVisible(!loginModalVisible)}
      >
        <SafeAreaView style={[style.modalView, { backgroundColor: Colors[colorScheme ?? 'light'].background }]} {...panResponder.panHandlers}>
          <Pressable style={style.buttonClose} onPress={() => setLoginModalVisible(false)}>
            <MaterialIcons name="close" size={24} color={Colors[colorScheme ?? 'light'].text} />
          </Pressable>
          <Text style={[style.title, { marginTop: 50, marginBottom: 50, fontWeight: 800, fontSize: 25, color: Colors[colorScheme ?? 'light'].text }]}>Log In</Text>
          {error && <Text style={style.errorText}>{error}</Text>}
          <TextInput
            style={[style.textInput, getDynamicStyles('bd', colorScheme || 'light')]}
            placeholder={'Email'}
            autoComplete="email"
            autoCapitalize="none"
            value={loginData.email}
            onChangeText={(value) => handleLoginChange('email', value)}
            autoCorrect={false}
          />
          <TextInput
            style={[style.textInput, getDynamicStyles('bd', colorScheme || 'light')]}
            placeholder={'Password'}
            secureTextEntry
            autoComplete="password"
            textContentType="password"
            autoCapitalize="none"
            value={loginData.password}
            onChangeText={(value) => handleLoginChange('password', value)}
          />
          <TouchableHighlight onPress={() => login(loginData.email, loginData.password)} underlayColor="transparent">
            <View style={style.button}>
              <Text style={style.buttonText}>Log In</Text>
            </View>
          </TouchableHighlight>
          <TouchableWithoutFeedback
            onPress={() => {
              setLoginModalVisible(false);
              setSignupModalVisible(true);
            }}
          >
            <Text style={[style.text, { color: textColor }]}>Don't have an account?</Text>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </Modal>

      <Image style={style.image} source={require('../../assets/images/icon.png')} />
      <Text style={[style.title, { color: textColor }]}>Hey! Welcome</Text>
      <Text style={[style.text, { color: textColor }]}>This is a school canteen rating system made for CG Plzeň by Václav Klimeš</Text>
      <TouchableHighlight onPress={() => setSignupModalVisible(!signupModalVisible)} underlayColor="transparent">
        <View style={style.button}>
          <Text style={style.buttonText}>Get Started</Text>
        </View>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => setLoginModalVisible(true)} underlayColor="transparent">
        <View style={[style.button, { backgroundColor: Colors[colorScheme ?? 'light'].background, borderColor: colorScheme === 'dark' ? Colors.light.background : Colors.dark.background }]}>
          <Text style={[style.buttonText, { color: Colors[colorScheme ?? 'light'].text }]}>I already have an account</Text>
        </View>
      </TouchableHighlight>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 24,
  },
  text: {
    width: 300,
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.65,
  },
  textInput: {
    width: 300,
    height: 40,
    marginBottom: 15,
    borderWidth: 0.3,
    borderRadius: 10,
    paddingLeft: 15,
  },
  button: {
    width: 300,
    height: 50,
    backgroundColor: ColorPalette.color2,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 0.3,
  },
  buttonText: {
    fontWeight: 'bold',
  },
  modalView: {
    flex: 1,
    marginTop: 65,
    borderRadius: 40,
    height: '90%',
    alignItems: 'center',
  },
  buttonClose: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1001,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  dropdownContainer: {
    borderRadius: 10,
  },
  placeholderStyle: {
    fontSize: 13,
    color: 'black',
    opacity: 0.3,
    fontWeight: 'normal',
  },
});

export default Welcome;
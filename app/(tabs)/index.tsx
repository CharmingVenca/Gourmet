import {Button, StyleSheet, Text} from 'react-native';
import { View } from '@/components/Themed';
import { useAuth } from '@/context/AuthContext';
import {useAuthentication} from "@/hooks/useAuthentication";
import {signOut} from "firebase/auth";

export default function TabOneScreen() {
  const { user } = useAuth();
  const authenticated = !!user;
  const {logout} = useAuthentication();

  return (
    <View style={styles.container}>
      <Text>Your are {authenticated ? "authenticated!" : "NOT authenticated"}</Text>
      <Button title={"Log out"} onPress={logout}/>
      <Button title={"Sign out"} onPress={() => signOut}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
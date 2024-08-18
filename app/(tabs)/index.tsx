import { StyleSheet, Text } from 'react-native';
import { View } from '@/components/Themed';
import { useAuth } from '@/context/AuthContext';

export default function TabOneScreen() {
  const { user } = useAuth();
  const authenticated = !!user;

  return (
    <View style={styles.container}>
      <Text>Your are {authenticated ? "authenticated!" : "NOT authenticated"}</Text>
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
import React from 'react';
import {Text, View} from "react-native";

function LoadingScreen() {
  return (
    <View style={{
      justifyContent: "center",
      alignItems: "center",

    }}>
      <Text>
        Loading...
      </Text>
    </View>
  );
}

export default LoadingScreen;
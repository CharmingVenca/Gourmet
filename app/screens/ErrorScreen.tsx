import React from 'react';
import {Text, View} from "react-native";

function ErrorScreen() {
  return (
    <View style={{
      justifyContent: "center",
      alignItems: "center",

    }}>
      <Text>
        Error has happened...
      </Text>
    </View>
  );
}

export default ErrorScreen;
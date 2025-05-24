import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Appbar } from "react-native-paper";
import WebView from "react-native-webview";

const Profile = () => {
  const { github } = useLocalSearchParams();

  return (
    <>
      <View style={{ width: "100%" }}>
        <Appbar.Header style={styles.appBar}>
          <Appbar.BackAction onPress={() => router.back()} />
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              Github Profile
            </Text>
          </View>
          {/* Dummy View to balance the BackAction and keep title centered */}
          <View style={{ width: 48 }} />
        </Appbar.Header>
      </View>

      <WebView
        style={{ flex: 1 }}
        source={{ uri: `https://github.com/${github}` }}
      />
    </>
  );
};
const styles = StyleSheet.create({
  appBar: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "transparent",
  },
});

export default Profile;

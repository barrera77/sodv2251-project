import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { Button, TextInput } from "react-native-paper";

//Add a default region - We will default to AB if there is a problem getting the location
const DEFAULT_REGION: Region = {
  latitude: 55.0,
  longitude: -115.0,
  latitudeDelta: 7.0,
  longitudeDelta: 10.0,
};

const WelcomeScreen = () => {
  const [githubUsername, setGithubUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<Region | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocation(DEFAULT_REGION);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } catch (error) {
        console.warn("Error getting location:", error);
        setLocation(DEFAULT_REGION);
      }
    })();
  }, []);

  const validateGitHubUsername = async () => {
    if (!githubUsername.trim()) {
      Alert.alert("There is no such username on GitHub");
      return false;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://api.github.com/users/${githubUsername.trim()}`
      );
      const isValid = response.ok;
      setLoading(false);

      if (!isValid) {
        Alert.alert("There is no such username on GitHub.");
      }

      return isValid;
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Could not validate GitHub username.");
      return false;
    }
  };

  const handleSignUp = async () => {
    const isValid = await validateGitHubUsername();
    if (isValid) {
      router.replace("/home");
    }
  };

  return (
    <View style={styles.fullScreen}>
      {location && (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFill}
          region={location}
        >
          <Marker coordinate={location} />
        </MapView>
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.spacer} />
        <View style={styles.bottom}>
          <TextInput
            mode="outlined"
            label="GitHub Username"
            value={githubUsername}
            onChangeText={setGithubUsername}
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={handleSignUp}
            loading={loading}
            style={{ borderRadius: 4, paddingVertical: 5 }}
          >
            Sign Up
          </Button>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
    marginBottom: 10,
  },
  spacer: {
    flex: 1,
  },
  bottom: {
    gap: 16,
    marginBottom: 40,
  },
  input: {
    backgroundColor: "white",
  },
});

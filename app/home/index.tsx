import { fetchDevelopers } from "@/services/api-client";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { Appbar, Button } from "react-native-paper";

const CALGARY_REGION: Region = {
  latitude: 51.0447,
  longitude: -114.0719,
  latitudeDelta: 0.3,
  longitudeDelta: 0.3,
};

type User = {
  id: number;
  name: string;
  location: { latitude: number; longitude: number };
  avatar: string;
};

const HomeScreen = () => {
  const [devs, setDevs] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDevs = async () => {
      try {
        const usersFromApi = await fetchDevelopers();

        setDevs(usersFromApi);
      } catch (error) {
        Alert.alert("Error", "Failed to load developers.");
        setDevs([]);
      } finally {
        setLoading(false);
      }
    };

    getDevs();
  }, []);

  const markers = useMemo(() => {
    return devs.map((dev) => (
      <Marker
        key={dev.id}
        coordinate={dev.location}
        title={dev.name}
        description="Software Developer"
      >
        <View style={styles.avatarContainer}>
          <Image source={{ uri: dev.avatar }} style={styles.avatar} />
        </View>
      </Marker>
    ));
  }, [devs]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <Appbar.Header style={styles.appbar}>
        <Button
          mode="contained"
          onPress={() => Alert.alert("Logout", "You have been logged out.")}
          style={{ borderRadius: 4 }}
        >
          Logout
        </Button>
      </Appbar.Header>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <MapView style={styles.map} region={CALGARY_REGION}>
          {markers}
        </MapView>
      )}
    </KeyboardAvoidingView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appbar: {
    backgroundColor: "transparent",
    elevation: 2,
    justifyContent: "flex-end",
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 50,
    padding: 4,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

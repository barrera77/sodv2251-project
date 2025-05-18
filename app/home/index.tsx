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

// Mock users – replace with real API data
const mockUsers = [
  {
    id: 1,
    name: "Alice",
    location: { latitude: 51.0486, longitude: -114.0708 },
    avatar: "https://avatar.iran.liara.run/public/girl",
  },
  {
    id: 2,
    name: "Bob",
    location: { latitude: 51.0501, longitude: -114.0852 },
    avatar: "https://avatar.iran.liara.run/public/boy",
  },
  {
    id: 3,
    name: "Clara",
    location: { latitude: 51.1171, longitude: -114.1286 },
    avatar: "https://avatar.iran.liara.run/public/girl",
  },
  {
    id: 4,
    name: "David",
    location: { latitude: 51.0126, longitude: -114.0011 },
    avatar: "https://avatar.iran.liara.run/public/boy",
  },
  {
    id: 5,
    name: "Ella",
    location: { latitude: 51.0425, longitude: -114.207 },
    avatar: "https://avatar.iran.liara.run/public/girl",
  },
];

type User = {
  id: number;
  name: string;
  location: { latitude: number; longitude: number };
  avatar: string;
};

const UsersMapScreen = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsers(mockUsers); // Replace with real fetch
      } catch (error) {
        Alert.alert("Error", "Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const markers = useMemo(() => {
    return users.map((user) => (
      <Marker
        key={user.id}
        coordinate={user.location}
        title={user.name}
        description="Software Developer"
      >
        <View style={styles.avatarContainer}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        </View>
      </Marker>
    ));
  }, [users]);

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

export default UsersMapScreen;

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

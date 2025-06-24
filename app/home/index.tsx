import { useAuth } from "@/context/AuthContext";
import { fetchDevelopers } from "@/services/api-client";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
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

type Developer = {
  id: number;
  name: string;
  location: { latitude: number; longitude: number };
  avatar: string;
  github: string;
};

const HomeScreen = () => {
  const [devs, setDevs] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDev, setSelectedDev] = useState<Developer | null>(null);
  const router = useRouter();
  const { logout } = useAuth();

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
        onPress={() => setSelectedDev(dev)}
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
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <>
          <MapView style={styles.map} region={CALGARY_REGION}>
            {markers}
          </MapView>

          <Appbar.Header style={styles.appbar}>
            <Button
              mode="contained"
              onPress={() => {
                logout();
                router.replace("/");
              }}
              style={{ borderRadius: 4 }}
            >
              Logout
            </Button>
          </Appbar.Header>
          {/* Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={!!selectedDev}
            onRequestClose={() => setSelectedDev(null)}
          >
            <TouchableWithoutFeedback onPress={() => setSelectedDev(null)}>
              <View style={styles.modalOverlay}>
                <Pressable onPress={() => {}} style={styles.modalContent}>
                  {selectedDev && (
                    <>
                      <Image
                        source={{ uri: selectedDev.avatar }}
                        style={styles.avatar}
                      />
                      <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                        {selectedDev.name}
                      </Text>
                      <Button
                        onPress={() => {
                          setSelectedDev(null);
                          router.push({
                            pathname: "./profile",
                            params: { github: selectedDev.github },
                          });
                        }}
                        mode="contained"
                        style={{ marginTop: 12 }}
                      >
                        View Profile
                      </Button>
                    </>
                  )}
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </>
      )}
    </KeyboardAvoidingView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  appbar: {
    backgroundColor: "transparent",
    elevation: 2,
    justifyContent: "flex-end",
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
    width: 33,
    height: 33,
    borderRadius: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 12,
    alignItems: "center",
  },
});

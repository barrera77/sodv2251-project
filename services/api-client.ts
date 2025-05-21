import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.API_URL ?? "";

export const fetchDevelopers = async () => {
  const url = "https://682d56374fae188947559802.mockapi.io/calgary_devs";

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("No users found");
    }
    const result = await response.json();

    return result;
  } catch (error) {
    console.error(error);
  }
};

export const createDeveloper = async (userData: {
  name: string;
  avatar: string;
  location: {
    latitude: number;
    longitude: number;
  };
}) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Failed to create user");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("Error creating user", error);
    throw error;
  }
};

export const deleteDeveloper = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}?id=${id}`, { method: "DELETE" });

    if (!response.ok) {
      throw new Error(`Failed to delete user with id ${id}`);
    }
    return true;
  } catch (error) {
    console.log(`No user with id number ${id} was found`);
    throw error;
  }
};

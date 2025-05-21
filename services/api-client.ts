import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.API_URL ?? "";

export const fetchUsers = async () => {
  const url = API_URL;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("No users found");
    }
    const result = await response.json();

    return result.body;
  } catch (error) {
    console.error(error);
  }
};

export const createUser = async (userData: {
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

export const deleteUser = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

    if (!response.ok) {
      throw new Error(`Failed to delete user with id ${id}`);
    }
    return true;
  } catch (error) {
    console.log(`No user with id number ${id} was found`);
    throw error;
  }
};

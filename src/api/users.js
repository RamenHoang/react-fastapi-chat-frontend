
import axios from "axios";

const BASE_URL = "http://localhost:8000";

export const fetchUsers = async (accessToken) => {
  try {
    const url = `${BASE_URL}/users`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
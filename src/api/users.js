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

export const registerUser = async (newUserData) => {
  const url = `${BASE_URL}/users/register`;
  return await axios.post(url, newUserData);
};

export const updateUser = async (accessToken, userId, updatedUserData) => {
  const url = `${BASE_URL}/users/update_user/${userId}`;
  return await axios.put(url, updatedUserData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const resetPassword = async (accessToken, userId) => {
  const url = `${BASE_URL}/users/reset_password/${userId}`;
  return await axios.post(url, {}, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const deleteUser = async (accessToken, userId) => {
  const url = `${BASE_URL}/users/admin_delete_user/${userId}`;
  return await axios.delete(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getCurrentUser = async (accessToken) => {
  try {
    const url = `${BASE_URL}/users/me`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching current user data:", error);
    throw error;
  }
};
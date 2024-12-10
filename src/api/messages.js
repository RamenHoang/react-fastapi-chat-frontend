import axios from "axios";

const BASE_URL = "http://localhost:8000";

export const sendMessage = async (
  accessToken,
  content,
  receiverId,
  encryptedForUserId
) => {
  return await axios.post(
    `${BASE_URL}/messages/send_message`,
    {
      content,
      receiver_id: receiverId,
      encrypted_for_user_id: encryptedForUserId,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};

export const markMessagesAsRead = async (accessToken, userId, messageIds) => {
  return await axios.put(
    `${BASE_URL}/messages/read`,
    {
      user_id: userId,
      message_ids: messageIds,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
};

export const deleteGroup = async (accessToken, groupId) => {
  try {
    const url = `${BASE_URL}/groups/delete_group/${groupId}`;
    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting group:", error);
    throw error;
  }
};

export const renameGroup = async (accessToken, groupId, newGroupName) => {
  try {
    const url = `${BASE_URL}/groups/rename_group/${groupId}`;
    const response = await axios.put(
      url,
      { name: newGroupName },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error renaming group:", error);
    throw error;
  }
};

export const groupUsers = async (accessToken, groupId) => {
  try {
    const url = `${BASE_URL}/groups/group_users/${groupId}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching group users:", error);
    throw error;
  }
};

export const kickUserFromGroup = async (accessToken, groupId, userId) => {
  try {
    const url = `${BASE_URL}/groups/kick_user/${groupId}`;
    const response = await axios.post(
      url,
      {
        user_id: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error kicking user from group:", error);
    throw error;
  }
};

export const deleteMessage = async (accessToken, messageId) => {
  try {
    const url = `${BASE_URL}/messages/delete_message/${messageId}`;
    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
};

export const pinMessage = async (accessToken, messageId) => {
  try {
    const url = `${BASE_URL}/messages/pin_message/${messageId}`;
    const response = await axios.put(
      url,
      {
        is_pin: true,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );  
    return response.data;
  } catch (error) {
    console.error("Error pinning message:", error);
    throw error;
  }
};

export const uploadImage = async (accessToken, formData, group_id) => {
  try {
    const url = `${BASE_URL}/groups/upload_image/${group_id}`;
    const response = await axios.post(url, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const sendImageMessage = async (
  accessToken,
  content,
  receiverId
) => {
  return await axios.post(
    `${BASE_URL}/messages/send_image_message`,
    {
      receiver_id: receiverId,
      content
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};
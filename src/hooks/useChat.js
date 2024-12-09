import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const useChat = (accessToken, userId, logout) => {
  const [userData, setUserData] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [showNewChatPopup, setShowNewChatPopup] = useState(false);
  const [showNewGroupPopup, setShowNewGroupPopup] = useState(false);
  const [showLeaveGroup, setShowLeaveGroup] = useState(false);
  const [showAddGroupMember, setShowAddGroupMember] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isTypingUser, setIsTypingUser] = useState(null);

  const socketRef = useRef(null);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/users/${userId}/all_data`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setUserData(response.data);
    } catch (err) {
      console.error("Failed to fetch user data", err);
      if (err.response?.status === 401) {
        console.error("Token abgelaufen. Logout.");
        toast.error(err.response.data.detail);
        logout();
      }
    }
  };

  useEffect(() => {
    fetchUserData();

    socketRef.current = new WebSocket("ws://localhost:8000/ws");

    socketRef.current.onopen = () => {
    };

    socketRef.current.onmessage = (event) => {
      try {
        const messageData = JSON.parse(event.data);
        const messageType = messageData.type;

        switch (messageType) {
          case "typing":
            fetchUserData();
            break;
          case "message":
            fetchUserData();
            break;
          default:
            break;
        }
      } catch (error) {
        fetchUserData();
      }
    };

    socketRef.current.onclose = () => {
    };

    return () => {
      socketRef.current.close();
    };
    // eslint-disable-next-line
  }, [accessToken, userId]);

  useEffect(() => {
    const updateTypingStatus = async () => {
      if (!selectedChatId) return;
      try {
        await axios.post(
          "http://localhost:8000/users/set_typing_status",
          {
            is_typing: isTyping,
            typing_chat_id: selectedChatId,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (
          socketRef.current &&
          socketRef.current.readyState === WebSocket.OPEN
        ) {
          socketRef.current.send(
            JSON.stringify({
              type: "typing",
              isTyping: isTyping,
              userId: userId,
            })
          );
        }
      } catch (error) {
        console.error("Fehler beim Aktualisieren des Typing-Status:", error);
      }
    };

    updateTypingStatus();
  }, [isTyping, userId, accessToken, selectedChatId]);

  const handleTyping = () => {
    setIsTyping(true);
    setIsTypingUser(userId);

    clearTimeout(window.typingTimeout);

    window.typingTimeout = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  return {
    userData,
    selectedChatId,
    setSelectedChatId,
    newMessage,
    setNewMessage,
    showNewChatPopup,
    setShowNewChatPopup,
    showNewGroupPopup,
    setShowNewGroupPopup,
    showLeaveGroup,
    setShowLeaveGroup,
    showAddGroupMember,
    setShowAddGroupMember,
    fetchUserData,
    isTyping,
    isTypingUser,
    handleTyping,
  };
};

export default useChat;

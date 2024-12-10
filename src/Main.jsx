import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useChat from "./hooks/useChat";
import {
  organizeChatsByUserId,
  formatTimestamp,
  getFullnamesFromChat,
} from "./utils";
import NewChatPopup from "./components/NewChatPopup";
import NewGroupPopup from "./components/NewGroupPopup";
import LeaveGroupPopup from "./components/LeaveGroupPopup";
import AddGroupMemberPopup from "./components/AddGroupMemberPopup";
import { sendMessage, markMessagesAsRead, deleteMessage, pinMessage, uploadImage, sendImageMessage } from "./api/messages";
import { importPublicKey, encryptMessage, arrayBufferToBase64 } from "./crypto";
import { ROLE_ADMIN, ROLE_MODERATOR } from "./constants";
import Navbar from "./components/Navbar";
import Modal from "./components/Modal"; // Import Modal component
import { deleteGroup, renameGroup, groupUsers, kickUserFromGroup } from "./api/messages"; // Import deleteGroup API
import ModalManageMember from "./components/ModalManageMember"; // Import ModalManageMember component
import ModalImageView from "./components/ModalImageView"; // Import ModalImageView component

const Main = ({
  accessToken = null,
  userId = null,
  publicKeyPara,
  privateKeyPara = null,
  logout,
  role,
}) => {
  const {
    userData,
    handleTyping,
    selectedChatId,
    setSelectedChatId,
  } = useChat(accessToken, userId, logout);

  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [chatIds, setChatIds] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showNewChatPopup, setShowNewChatPopup] = useState(false);
  const [showNewGroupPopup, setShowNewGroupPopup] = useState(false);
  const [showLeaveGroup, setShowLeaveGroup] = useState(false);
  const [showAddGroupMember, setShowAddGroupMember] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false); // Add state for delete group modal
  const [reload, setReload] = useState(false); // Add reload state
  const [showRenameGroupModal, setShowRenameGroupModal] = useState(false); // Add state for rename group modal
  const [newGroupName, setNewGroupName] = useState(""); // Add state for new group name
  const [showManageMembersModal, setShowManageMembersModal] = useState(false); // Add state for manage members modal
  const [groupMembers, setGroupMembers] = useState([]); // Add state for group members
  const [showDeleteMessageModal, setShowDeleteMessageModal] = useState(false); // Add state for delete message modal
  const [messageToDelete, setMessageToDelete] = useState(null); // Add state for message to delete
  const [messageToPin, setMessageToPin] = useState(null); // Add state for message to pin
  const [pinnedMessages, setPinnedMessages] = useState([]); // Add state for pinned messages
  const [showPinMessageModal, setShowPinMessageModal] = useState(false); // Add state for pin message modal
  const [image, setImage] = useState(null); // Add state for image
  const [showImageModal, setShowImageModal] = useState(false); // Add state for image modal
  const [imageToView, setImageToView] = useState(null); // Add state for image to view

  // Dummy Methods
  const selectChat = async (chatId) => {
    const selected = chats.find((chat) => chat.chatId === chatId);
    setSelectedChatId(chatId);
    setSelectedChat(selected);
    await handleMarkMessagesAsRead(selected);
  };

  const handleMarkMessagesAsRead = async (chat) => {
    if (chat && chat.messages) {
      const sentMessageIds = chat.messages
        .filter((message) => message.status === "sent")
        .map((message) => message.id);

      try {
        await markMessagesAsRead(accessToken, userId, sentMessageIds);
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    }
  };

  const handleSendMessage = async (receiverId, messageContent = newMessage) => {
    const message = messageContent;
    const selectedChat = chats.find((chat) => chat.chatId === selectedChatId);
    console.log("handleSendMessage aufgerufen mit receiverId:", receiverId);
    console.log("selectedChat vor dem Senden:", selectedChat);

    const publicKey = await importPublicKey(selectedChat.publicKey);
    const encryptedMessage = await encryptMessage(publicKey, message);
    const encryptedMessageBase64 = arrayBufferToBase64(encryptedMessage);

    try {
      if (selectedChat.isGroupMessage) {
        await sendMessage(accessToken, message, receiverId);
      } else {
        await sendMessage(accessToken, message, receiverId);

        // const publicKeySelf = await importPublicKey(publicKeyPara);
        // const encryptedMessageSelf = await encryptMessage(
        //   publicKeySelf,
        //   message
        // );
        // const encryptedMessageSelfBase64 =
        //   arrayBufferToBase64(encryptedMessageSelf);

        // await sendMessage(
        //   accessToken,
        //   encryptedMessageSelfBase64,
        //   receiverId,
        //   userId
        // );
      }

      setNewMessage("");
    } catch (error) {
      console.error("Fehler beim Senden der Nachricht:", error);
    }

    setSelectedChatId(receiverId);
  };

  const handleDeleteGroup = async () => {
    try {
      await deleteGroup(accessToken, selectedChatId); // Call deleteGroup API
      toast.success("Group deleted successfully");
      setShowDeleteGroupModal(false); // Close modal
      setSelectedChatId(null); // Reset selected chat
      setReload(!reload); // Trigger reload
    } catch (error) {
      console.error("Error deleting group:", error);
      toast.error(error.response?.data?.detail || "An error occurred");
    }
  };

  const handleRenameGroup = async () => {
    try {
      await renameGroup(accessToken, selectedChatId, newGroupName); // Call renameGroup API
      toast.success("Group renamed successfully");
      setShowRenameGroupModal(false); // Close modal
      setReload(!reload); // Trigger reload
    } catch (error) {
      console.error("Error renaming group:", error);
      toast.error(error.response?.data?.detail || "An error occurred");
    }
  };

  const handleManageMembers = async () => {
    try {
      const members = await groupUsers(accessToken, selectedChatId); // Call groupUsers API
      setGroupMembers(members);
      setShowManageMembersModal(true); // Show manage members modal
    } catch (error) {
      console.error("Error fetching group members:", error);
      toast.error(error.response?.data?.detail || "An error occurred");
    }
  };

  const handleKickUser = async (userId) => {
    try {
      await kickUserFromGroup(accessToken, selectedChatId, userId); // Call kickUserFromGroup API
      toast.success("User kicked from group successfully");
      setGroupMembers(groupMembers.filter((member) => member.id !== userId)); // Update group members state
    } catch (error) {
      console.error("Error kicking user from group:", error);
      toast.error(error.response?.data?.detail || "An error occurred");
    }
  };

  const handleDeleteMessage = async () => {
    try {
      await deleteMessage(accessToken, messageToDelete.id); // Call deleteMessage API
      toast.success("Message deleted successfully");
      setShowDeleteMessageModal(false); // Close modal
      setReload(!reload); // Trigger reload
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error(error.response?.data?.detail || "An error occurred");
    }
  };

  const handlePinMessage = async () => {
    try {
      await pinMessage(accessToken, messageToPin.id); // Call pinMessage API
      toast.success("Message pinned successfully");
      setShowPinMessageModal(false); // Close modal
      setMessageToPin(null); // Reset message to pin
      setReload(!reload); // Trigger reload
    } catch (error) {
      console.error("Error pinning message:", error);
      toast.error(error.response?.data?.detail || "An error occurred");
    }
  };

  const fetchPinnedMessages = async () => {
    try {
      const pinned = selectedChat.messages.filter((message) => message.is_pin);
      console.log("Pinned Messages:", pinned);
      setPinnedMessages(pinned);
    } catch (error) {
      console.error("Error fetching pinned messages:", error);
    }
  };

  const fetchChats = async () => {
    try {
      setLoadingChats(true);
      const organizedChats = organizeChatsByUserId(
        userData,
        userId,
        privateKeyPara
      );
      setChats(organizedChats);
      setChatIds(organizedChats.map((chat) => chat.chatId));
    } catch (error) {
      console.log("Fehler beim Organisieren der Chats:", error);
    } finally {
      setLoadingChats(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file.size > 1024 * 1024) {
      toast.error("File size should be less than 1MB");
      return;
    }
    if (file) {
      setImage(file);
    }
  };

  const handleSendImage = async () => {
    if (image) {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        const base64String = e.target.result;
        console.log("Base64 String:", base64String);
        sendImageMessage(accessToken, base64String, selectedChatId)
          .then(() => {
            setImage(null); // Reset image state
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
            toast.error("Error uploading image");
          });
      };
    }
  };

  const handleImageClick = (image) => {
    setImageToView(image);
    setShowImageModal(true);
  };

  useEffect(() => {
    if (userId && privateKeyPara) {
      fetchChats();
    }
  }, [userData, userId, privateKeyPara, reload]);

  useEffect(() => {
    if (!loadingChats && selectedChatId) {
      // console.log("Finde Chat mit selectedChatId:", selectedChatId);
      const selected = chats.find((chat) => chat.chatId === selectedChatId);
      if (selected) {
        setSelectedChat(selected);
        // console.log("Selected Chat nach Update gesetzt:", selected);
      } else {
        console.log("Kein Chat mit dieser ID gefunden:", selectedChatId);
      }
    }
  }, [loadingChats, selectedChatId, chats]);

  useEffect(() => {
    if (selectedChat) {
      fetchPinnedMessages();
    }
  }, [selectedChat]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
      <Navbar userData={userData} userId={userId} logout={logout} role={role} accessToken={accessToken} />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 p-4 shadow-md flex flex-col">
          <h2 className="text-2xl mb-6 text-gray-800 font-bold">Chats</h2>
          <ul className="flex-1">
            {chatIds.map((chatId) => {
              const chat = chats.find((c) => c.chatId === chatId);
              const chatName = chat.groupName
                ? chat.groupName
                : chat.withUser
                  ? chat.withUser.fullname
                  : "Unknown";
              return (
                <li
                  key={chatId}
                  className={`p-3 mb-2 cursor-pointer flex flex-row justify-between rounded-lg transition-all duration-200 ${selectedChatId === chatId
                    ? "bg-blue-500 bg-opacity-20 text-white shadow-lg transform hover:scale-105"
                    : "hover:bg-gray-100 hover:bg-opacity-40"
                    }`}
                  onClick={() => selectChat(chatId)}
                >
                  <div className="text-gray-900 font-medium">{chatName}</div>
                  {chat.numberOfUnreadMessages > 0 && (
                    <div className="bg-blue-500 rounded-full text-white w-6 h-6 flex items-center justify-center">
                      {chat.numberOfUnreadMessages}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          {(role == ROLE_ADMIN || role == ROLE_MODERATOR) && (
            <div className="mt-6">
              {/* <button
              className="w-full rounded-lg p-3 bg-purple-500 bg-opacity-20 text-black shadow-lg transform hover:scale-105 transition-transform mb-4"
              onClick={() => setShowNewChatPopup(true)}
            >
              New Chat
            </button> */}
              <button
                className="w-full rounded-lg p-3 bg-pink-500 bg-opacity-20 text-black shadow-lg transform hover:scale-105 transition-transform"
                onClick={() => setShowNewGroupPopup(true)}
              >
                New Group
              </button>
            </div>
          )}
        </div>

        {/* Chat Content */}
        <div className="flex-1 p-4 h-full">
          {selectedChatId ? (
            <div className="h-full flex flex-col">
              <div className="flex flex-row justify-between items-center mb-4">
                {selectedChat && (
                  <div className="flex flex-col">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {selectedChat.groupName || selectedChat.withUser.fullname}
                    </h2>
                    <p className="text-gray-600">
                      {getFullnamesFromChat(selectedChat).join(", ")}
                    </p>
                  </div>
                )}

                {selectedChat?.isGroupMessage && (
                  <div>
                    {(role == ROLE_ADMIN) && (
                      <>
                        <button
                          className="mr-2 p-2 bg-red-500 bg-opacity-20 text-black rounded-lg shadow-md hover:shadow-lg transition-shadow"
                          onClick={() => setShowDeleteGroupModal(true)} // Show delete group modal
                        >
                          Delete Group
                        </button>
                        <button
                          className="mr-2 p-2 bg-yellow-500 bg-opacity-20 text-black rounded-lg shadow-md hover:shadow-lg transition-shadow"
                          onClick={() => setShowRenameGroupModal(true)} // Show rename group modal
                        >
                          Rename Group
                        </button>
                      </>
                    )}
                    {(role == ROLE_ADMIN || role == ROLE_MODERATOR) && (
                      <>
                        <button
                          className="mr-2 p-2 bg-indigo-500 bg-opacity-40 text-black rounded-lg shadow-md hover:shadow-lg transition-shadow"
                          onClick={() => setShowAddGroupMember(true)}
                        >
                          Add Member
                        </button>
                        <button
                          className="p-2 bg-green-500 bg-opacity-40 text-black rounded-lg shadow-md hover:shadow-lg transition-shadow"
                          onClick={handleManageMembers} // Show manage members modal
                        >
                          Manage Members
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Pinned Messages */}
              {pinnedMessages.length > 0 && (
                <div className="mb-4 p-4 bg-yellow-100 rounded-lg shadow-inner max-h-40 overflow-y-auto">
                  {pinnedMessages.map((message, index) => (
                    <div key={index} className="mb-2 relative group">
                      <span className="text-sm text-gray-500">
                        {message.sender.fullname}
                        <span className="ml-2">
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </span>
                      <br />
                      <span className="inline-block p-2 rounded-lg bg-yellow-50 shadow-sm relative">
                        {message.content ? message.content : (
                          <img
                            src={message.file_data}
                            alt="Image"
                            className="h-32 object-cover rounded-lg cursor-pointer"
                            onClick={() => handleImageClick(message.file_data)}
                          />
                        )}
                        <button
                          className="absolute top-0 right-0 mt-1 mr-1 p-1 bg-yellow-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ transform: "translate(70px, 0)", width: "60px", height: "30px" }}
                          onClick={() => {
                            setMessageToPin(message);
                            setShowPinMessageModal(true); // Show pin message modal
                          }}
                        >
                          Unpin
                        </button>
                        {(role == ROLE_ADMIN || role == ROLE_MODERATOR) && (
                          <>
                            <button
                              className="absolute top-0 right-0 mt-1 mr-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{ transform: "translate(105px, 0)", width: "30px", height: "30px" }}
                              onClick={() => {
                                setMessageToDelete(message);
                                setShowDeleteMessageModal(true);
                              }}
                            >
                              X
                            </button>
                          </>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="border rounded-2xl border-gray-300 p-4 overflow-y-auto flex-1 bg-gray-50 bg-opacity-80 shadow-inner flex flex-col-reverse">
                {selectedChat?.withUser?.isTyping ? (
                  <div className="mb-2">
                    <span className="text-sm text-gray-500">
                      {selectedChat.withUser.fullname}
                    </span>
                    <br />
                    <span className="inline-block p-2 rounded-lg">
                      {"types..."}
                    </span>
                  </div>
                ) : null}

                {selectedChat?.members?.some(
                  (member) => member.userId !== userId && member.isTyping
                )
                  ? selectedChat.members.map((member, index) =>
                    member.userId !== userId && member.isTyping ? (
                      <div key={index} className="mb-2">
                        <span className="text-sm text-gray-500">
                          {member.fullname}
                        </span>
                        <br />
                        <span className="inline-block p-2 rounded-lg">
                          {member.isTyping && "types..."}
                        </span>
                      </div>
                    ) : null
                  )
                  : null}

                {/* Message list */}
                {selectedChat?.messages?.length > 0
                  ? selectedChat.messages.map((message, index) => (
                    <div
                      key={index}
                      className={`mb-2 ${message.sender.userId === userId ? "text-right" : ""
                        } relative group`}
                    >
                      <span className="text-sm text-gray-500">
                        {message.sender.fullname}
                        <span className="ml-2">
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </span>
                      <br />
                      {message.sender.userId === userId ? (
                        <span
                          className={`inline-block p-2 rounded-lg bg-blue-50 shadow-sm relative`}
                        >
                          {!message.is_pin && (
                            <button
                              className={`absolute top-0 left-0 mt-1 mr-1 p-1 bg-yellow-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity`}
                              style={{ position: "absolute", top: 0, left: 0, transform: "translate(-40px, 0)", width: "30px", height: "30px" }}
                              onClick={() => {
                                setMessageToPin(message);
                                setShowPinMessageModal(true); // Show pin message modal
                              }}
                            >
                              Pin
                            </button>
                          )}
                          {(role == ROLE_ADMIN || role == ROLE_MODERATOR) && (
                            <>
                              <button
                                className="absolute top-0 right-0 mt-1 mr-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ position: "absolute", top: 0, left: 0, transform: "translate(-75px, 0)", width: "30px", height: "30px" }}
                                onClick={() => {
                                  setMessageToDelete(message);
                                  setShowDeleteMessageModal(true);
                                }}
                              >
                                X
                              </button>
                            </>
                          )}
                          {message.content ? message.content : (
                            <img
                              src={message.file_data}
                              alt="Image"
                              className="h-32 object-cover rounded-lg cursor-pointer"
                              onClick={() => handleImageClick(message.file_data)}
                            />
                          )}
                        </span>
                      ) : (
                        <span
                          className={`inline-block p-2 rounded-lg bg-green-50 shadow-sm relative`}
                        >
                          {message.content ? message.content : (
                            <img
                              src={message.file_data}
                              alt="Image"
                              className="h-32 object-cover rounded-lg cursor-pointer"
                              onClick={() => handleImageClick(message.file_data)}
                            />
                          )}
                          {!message.is_pin && (
                            <button
                              className={`absolute top-0 right-0 mt-1 mr-1 p-1 bg-yellow-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity`}
                              style={{ transform: "translate(40px, 0)", width: "30px", height: "30px" }}
                              onClick={() => {
                                setMessageToPin(message);
                                setShowPinMessageModal(true); // Show pin message modal
                              }}
                            >
                              Pin
                            </button>
                          )}
                          {(role == ROLE_ADMIN || role == ROLE_MODERATOR) && (
                            <>
                              <button
                                className="absolute top-0 right-0 mt-1 mr-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ transform: "translate(75px, 0)", width: "30px", height: "30px" }}
                                onClick={() => {
                                  setMessageToDelete(message);
                                  setShowDeleteMessageModal(true);
                                }}
                              >
                                X
                              </button>
                            </>
                          )}
                        </span>
                      )}
                    </div>
                  ))
                  : null}

                {/* Check if both members and messages are empty */}
                {!selectedChat?.members?.some(
                  (member) => member.userId !== userId && member.isTyping
                ) &&
                  !selectedChat?.messages?.length && (
                    <p className="text-gray-500">No messages yet</p>
                  )}
              </div>

              <div className="flex mt-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping(selectedChatId); // Notify typing status
                  }}
                  placeholder="Type your message..."
                  className="p-2 border rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage(selectedChatId);
                    }
                  }}
                />
                <button
                  className="ml-2 p-2 bg-blue-400 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  onClick={() => handleSendMessage(selectedChatId)}
                >
                  Send
                </button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="ml-2 p-2 border rounded-lg"
                />
                <button
                  className="ml-2 p-2 bg-green-400 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  onClick={handleSendImage}
                  disabled={!image}
                >
                  Send Image
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Select a chat to start messaging</p>
            </div>
          )}
        </div>

        {/* Popups */}
        {showNewChatPopup && (
          <NewChatPopup
            accessToken={accessToken}
            onClose={() => setShowNewChatPopup(false)}
            publicKeyPara={publicKeyPara}
            userIdSelf={userId}
          />
        )}
        {showNewGroupPopup && (
          <NewGroupPopup
            accessToken={accessToken}
            onClose={() => setShowNewGroupPopup(false)}
          />
        )}
        {showLeaveGroup && (
          <LeaveGroupPopup
            accessToken={accessToken}
            selectedChatId={selectedChatId}
            onClose={() => setShowLeaveGroup(false)}
          />
        )}
        {showAddGroupMember && (
          <AddGroupMemberPopup
            accessToken={accessToken}
            selectedChatId={selectedChatId}
            onClose={() => setShowAddGroupMember(false)}
          />
        )}
        {showDeleteGroupModal && (
          <Modal
            title="Confirm Delete"
            message="Are you sure you want to delete this group?"
            onConfirm={handleDeleteGroup}
            onCancel={() => setShowDeleteGroupModal(false)}
          />
        )}
        {showRenameGroupModal && (
          <Modal
            title="Rename Group"
            message={
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Enter new group name"
                className="p-2 border rounded-lg w-full"
              />
            }
            onConfirm={handleRenameGroup}
            onCancel={() => setShowRenameGroupModal(false)}
          />
        )}
        {showManageMembersModal && (
          <ModalManageMember
            title="Manage Members"
            groupMembers={groupMembers}
            handleKickUser={handleKickUser}
            onCancel={() => setShowManageMembersModal(false)}
          />
        )}
        {showDeleteMessageModal && (
          <Modal
            title="Confirm Delete"
            message="Are you sure you want to delete this message?"
            onConfirm={handleDeleteMessage}
            onCancel={() => setShowDeleteMessageModal(false)}
          />
        )}
        {showPinMessageModal && (
          <Modal
            title="Confirm Pin"
            message={`Are you sure you want to ${messageToPin.is_pin ? "unpin" : "pin"} this message?`}
            onConfirm={handlePinMessage}
            onCancel={() => setShowPinMessageModal(false)}
          />
        )}
        {showImageModal && (
          <ModalImageView
            image={imageToView}
            onClose={() => setShowImageModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Main;

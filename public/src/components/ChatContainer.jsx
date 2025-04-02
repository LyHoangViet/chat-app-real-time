import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute, deleteMessageRoute, checkroleRoute, addMemberRouter , removeMemberRouter} from "../utils/APIRoutes";
import { FaPhone, FaVideo, FaEllipsisV, FaSearch } from "react-icons/fa";
import AddMemberModal from "./AddMemberModal";
import { toast } from "react-toastify";
import RemoveMemberModal from "./RemoveMemberModal"

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showCallOptions, setShowCallOptions] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpens, setIsModalOpens] = useState(false);
  const [members, setMembers] = useState([]);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        console.log("GroupID:",currentChat._id)
        const response = await axios.get(`${removeMemberRouter}/${currentChat._id}`);
        setMembers(response.data.members);
        console.log(response.data.members); // Lưu vào state members
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchMembers();
  }, [currentChat._id]); // Gọi lại API khi groupId thay đổi

  const handleRemoveMember = (email) => {
    console.log("Xóa thành viên với email:", email);
    // Thực hiện gọi API xóa thành viên khỏi nhóm tại đây
  };

  const handleOpenModals = () => {
    setIsModalOpens(true);
  };

  const handleCloseModals = () => {
    setIsModalOpens(false);
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        setUserRole(null);
        const storedData = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
        if (!storedData) {
          console.error("Không tìm thấy dữ liệu người dùng trong localStorage.");
          return;
        }
  
        const parsedData = JSON.parse(storedData);
        const response = await axios.get(
          `${checkroleRoute}/${currentChat._id}/${parsedData._id}`
        );
  
        console.log("role", response.data.role);
        setUserRole(response.data.role);
      } catch (error) {
        console.error("Lỗi khi lấy vai trò người dùng:", error);
      }
    };
  
    if (currentChat) {
      fetchUserRole();
    }
  }, [currentChat?._id]);
  const handleAddMember = async (memberEmail) => {
    try {
      const response = await axios.post(
        addMemberRouter,
        {
          email: memberEmail,
          groupId: currentChat._id,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.status) {
        toast.success("Member added successfully!",);
        handleCloseModal();
      } else {
        toast.error(response.data.msg || "Failed to add member.");
      }
    } catch (error) {
      console.error("Error adding member:", error);
      toast.error("An error occurred while adding member.");
    }
  };



  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentChat) return;
      const data = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
      const response = await axios.post(recieveMessageRoute, {
        from: data._id,
        to: currentChat._id,
      });
      setMessages(response.data);
    };
    fetchMessages();
  }, [currentChat]);

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msgData) => {
        const isGroupMessage = msgData.to === currentChat._id;
        if (isGroupMessage) {
          setArrivalMessage({ fromSelf: false, message: msgData.msg });
        }
      });

      socket.current.on("msg-deleted", (messageId) => {
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      });

      socket.current.on("msg-updated", ({ messageId, newContent }) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageId ? { ...msg, message: newContent } : msg
          )
        );
      });
    }

    return () => {
      if (socket.current) {
        socket.current.off("msg-recieve");
        socket.current.off("msg-deleted");
        socket.current.off("msg-updated");
      }
    };
  }, [currentChat?._id]);

  const handleSendMsg = async (msg, type = "text") => {
    const data = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));

    const payload = {
      to: currentChat._id,
      from: data._id,
      msg,
      type,
      isGroup: true,
    };

    socket.current.emit("send-msg", payload);

    const response = await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
      type,
      isGroup: true,
    });

    const msgs = [...messages];
    msgs.push({
      fromSelf: true,
      message: msg,
      type,
      _id: response.data.messageId,
    });
    setMessages(msgs);
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      if (!messageId) return;
      const response = await axios.delete(`${deleteMessageRoute}/${messageId}`);
      if (response.status === 200) {
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
        socket.current.emit("delete-msg", {
          to: currentChat._id,
          messageId,
        });
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const getAvatarSrc = (avatarImage) => {
    if (!avatarImage) return null;
    if (avatarImage.startsWith("data:image/")) return avatarImage;
    const base64Header = avatarImage.substring(0, 10);
    if (base64Header.startsWith("/9j/")) return `data:image/jpeg;base64,${avatarImage}`;
    if (base64Header.startsWith("iVBORw0KGgo")) return `data:image/png;base64,${avatarImage}`;
    if (base64Header.startsWith("R0lGODdh") || base64Header.startsWith("R0lGODlh")) return `data:image/gif;base64,${avatarImage}`;
    if (base64Header.startsWith("UklGR")) return `data:image/webp;base64,${avatarImage}`;
    if (avatarImage.trim().startsWith("<svg")) {
      const base64Svg = btoa(unescape(encodeURIComponent(avatarImage)));
      return `data:image/svg+xml;base64,${base64Svg}`;
    }
    return `data:image/svg+xml;;base64,${avatarImage}`;
  };

  const handleCall = () => alert("Voice call feature will be implemented soon!");
  const handleVideoCall = () => alert("Video call feature will be implemented soon!");
  const toggleCallOptions = () => setShowCallOptions(!showCallOptions);

  const isImageMessage = (message) => {
    return message.type === "image" || (typeof message.message === "string" && message.message.startsWith("data:image"));
  };

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={getAvatarSrc(currentChat.avatarImage)}
              alt=""
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%23cccccc'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff'%3E" +
                  (currentChat.name ? currentChat.name.charAt(0).toUpperCase() : "?") + "%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
          <div className="username">
            <h3>{currentChat.username || currentChat.name}</h3>
            <div className="status">
              <div className="status-indicator"></div>
              <span>Online</span>
            </div>
          </div>
        </div>
        <div className="chat-actions">
          <button className="action-button search-button"><FaSearch /></button>
          <button className="action-button call-button" onClick={handleCall}><FaPhone /></button>
          <button className="action-button video-button" onClick={handleVideoCall}><FaVideo /></button>
          <div className="more-options">
            <button className="action-button more-button" onClick={toggleCallOptions}><FaEllipsisV /></button>
            {showCallOptions && (
              <div className="options-dropdown">
                <ul>
                  <li>View Profile</li>
                  <li>Mute Notifications</li>
                  <li>Block User</li>
                  {userRole === "admin" && <li onClick={handleOpenModal}>Add Member</li>}
                  {userRole === "admin" && <li onClick={handleOpenModals}>Remove Member</li>}
                </ul>
                <RemoveMemberModal
        isOpen={isModalOpens}
        onRequestClose={handleCloseModals}
        members={members} // Truyền danh sách thành viên vào modal
        onRemoveMember={handleRemoveMember} // Hàm xử lý xóa thành viên
      />
                <AddMemberModal isOpen={isModalOpen} onClose={handleCloseModal} onAddMember={handleAddMember} />
              </div>
            )}
          </div>
          <Logout />
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => {
          const isImage = isImageMessage(message);
          return (
            <div ref={scrollRef} key={message._id || uuidv4()}>
              <div className={`message ${message.fromSelf ? "sended" : "recieved"}`}>
                <div className={`content ${isImage ? "image-content" : ""}`}>
                  {isImage ? (
                    <img
                      src={message.message}
                      alt="Chat content"
                      className="chat-image"
                      onClick={() => setSelectedImage(message.message)}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect width='150' height='150' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999999'%3EImage Error%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  ) : (
                    <p>{message.message}</p>
                  )}
                  {message.fromSelf && (
                    <button className="delete-btn" onClick={() => handleDeleteMessage(message._id)}>×</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ChatInput handleSendMsg={handleSendMsg} />

      {selectedImage && (
        <div className="modal-content">
          <span className="close-button" onClick={() => setSelectedImage(null)}>×</span>
          <img src={selectedImage} alt="Enlarged view" />
        </div>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  background-color: var(--background-light);
  border-radius: 1rem;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: linear-gradient(to right, var(--background-dark), var(--background-lighter));
    border-radius: 1rem 1rem 0 0;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);

    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;

      .avatar {
        img {
          height: 3rem;
          border-radius: 50%;
          border: 2px solid var(--primary-color);
          box-shadow: 0 0 10px rgba(78, 14, 255, 0.3);
          transition: all 0.3s ease;
          
          &:hover {
            transform: scale(1.1);
            border-color: var(--primary-light);
          }
        }
      }

      .username {
        h3 {
          color: var(--text-primary);
          font-size: 1.2rem;
          font-weight: bold;
          margin-bottom: 0.2rem;
        }
        
        .status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: var(--font-sm);
          color: var(--text-secondary);
          
          .status-indicator {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: var(--online);
          }
        }
      }
    }
    
    .chat-actions {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      
      .action-button {
        background-color: rgba(255, 255, 255, 0.1);
        border: none;
        border-radius: 50%;
        width: 2.5rem;
        height: 2.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: all 0.3s ease;
        color: var(--text-primary);
        
        &:hover {
          background-color: var(--primary-color);
          transform: translateY(-2px);
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
        }
        
        svg {
          font-size: 1.2rem;
        }
      }
      
      .call-button {
        &:hover {
          background-color: var(--online);
        }
      }
      
      .video-button {
        &:hover {
          background-color: var(--accent-color);
        }
      }
      
      .more-options {
        position: relative;
        
        .options-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          background-color: var(--background-lighter);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-md);
          z-index: 10;
          min-width: 180px;
          overflow: hidden;
          animation: fadeIn 0.2s ease;
          
          ul {
            list-style: none;
            padding: 0;
            margin: 0;
            
            li {
              padding: 0.8rem 1rem;
              color: var(--text-primary);
              cursor: pointer;
              transition: all 0.2s ease;
              
              &:hover {
                background-color: rgba(255, 255, 255, 0.1);
                color: var(--primary-light);
              }
            }
          }
        }
      }
    }
  }

  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    
    &::-webkit-scrollbar {
      width: 0.4rem;
      &-thumb {
        background-color: var(--primary-light);
        border-radius: 1rem;
      }
    }

    .message {
      display: flex;
      align-items: center;

      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: var(--text-primary);
        transition: all 0.3s ease;
        position: relative;

        &:hover {
          transform: translateY(-2px);
        }
      }

      .image-content {
        background-color: transparent !important;
        padding: 0;
        
        img.chat-image {
          max-width: 300px;
          border-radius: 1rem;
          object-fit: contain;
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
          transition: all 0.3s ease;
          
          &:hover {
            transform: scale(1.05);
          }
        }
      }

      .delete-btn {
        position: absolute;
        top: -8px;
        right: -8px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.2);
        border: none;
        color: var(--text-primary);
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        backdrop-filter: blur(5px);
        
        &:hover {
          background-color: var(--error);
        }
      }
      
      &:hover .delete-btn {
        display: flex;
      }
    }

    .sended {
      justify-content: flex-end;
      .content {
        background: linear-gradient(to right, var(--primary-color), var(--primary-dark));
        box-shadow: 2px 2px 8px rgba(0,0,0,0.1);
      }
    }

    .recieved {
      justify-content: flex-start;
      .content {
        background: linear-gradient(to left, var(--primary-light), var(--primary-color));
        box-shadow: -2px 2px 8px rgba(0,0,0,0.1);
      }
    }
  }
`;

const ImageModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;

  .modal-content {
    position: relative;
    max-width: 90%;
    max-height: 90%;
    animation: scaleIn 0.3s ease;

    img {
      max-width: 100%;
      max-height: 90vh;
      object-fit: contain;
      border-radius: 1rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }

    .close-button {
      position: absolute;
      top: -40px;
      right: 0;
      color: white;
      font-size: 30px;
      cursor: pointer;
      padding: 5px;
      transition: all 0.3s ease;
      
      &:hover {
        color: var(--error);
        transform: rotate(90deg);
      }
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes scaleIn {
    from { transform: scale(0.9); }
    to { transform: scale(1); }
  }
`;

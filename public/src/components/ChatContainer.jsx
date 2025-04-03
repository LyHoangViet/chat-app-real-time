import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute, deleteMessageRoute, clearChatRoute } from "../utils/APIRoutes";
import { FaPhone, FaVideo, FaEllipsisV, FaSearch } from "react-icons/fa";

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showCallOptions, setShowCallOptions] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentChat) return;
      
      const data = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      const response = await axios.post(recieveMessageRoute, {
        from: data._id,
        to: currentChat._id,
      });
      setMessages(response.data);
    };
    
    fetchMessages();
  }, [currentChat]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  const handleSendMsg = async (msg, type = "text") => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
      type,
    });
    
    // Gửi tin nhắn và lấy response từ server
    const response = await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
      type: type
    });

    // Thêm tin nhắn mới với _id từ response
    const msgs = [...messages];
    msgs.push({ 
      fromSelf: true, 
      message: msg, 
      type: type,
      _id: response.data.messageId // Thêm _id từ response
    });
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });

      // Thêm listener cho sự kiện msg-deleted
      socket.current.on("msg-deleted", (messageId) => {
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      });
    }

    // Cleanup function
    return () => {
      if (socket.current) {
        socket.current.off("msg-recieve");
        socket.current.off("msg-deleted"); // Đừng quên cleanup
      }
    };
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Kiểm tra xem một tin nhắn có phải là ảnh hay không
  const isImageMessage = (message) => {
    return (
      message.type === "image" || 
      (typeof message.message === 'string' && message.message.startsWith('data:image'))
    );
  };

  // Tạo một hàm để xử lý hiển thị avatar 
  const getAvatarSrc = (avatarImage) => {
    if (!avatarImage) return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%23cccccc'/%3E%3C/svg%3E";
    
    if (avatarImage.startsWith('data:')) return avatarImage;
    
    return `data:image/svg+xml;base64,${avatarImage}`;
  };

  // Thêm hàm xử lý xóa tin nhắn
  const handleDeleteMessage = async (messageId) => {
    try {
      if (!messageId) return;
      const response = await axios.delete(`${deleteMessageRoute}/${messageId}`);
      
      if (response.status === 200) {
        // Xóa tin nhắn ở phía người gửi
        setMessages(prev => prev.filter(msg => msg._id !== messageId));
        
        // Gửi sự kiện xóa tới người nhận
        socket.current.emit("delete-msg", {
          to: currentChat._id,
          messageId: messageId
        });
      }
    } catch (error) {
      console.error("Error deleting message:", error.response?.data || error.message);
    }
  };

  const handleCall = () => {
    // Implement call functionality
    alert("Voice call feature will be implemented soon!");
  };

  const handleVideoCall = () => {
    // Implement video call functionality
    alert("Video call feature will be implemented soon!");
  };

  const toggleCallOptions = () => {
    setShowCallOptions(!showCallOptions);
  };

  // Thêm hàm xử lý xóa lịch sử chat
  const handleClearChat = async () => {
    try {
      const data = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );

      const response = await axios.post(clearChatRoute, {
        from: data._id,
        to: currentChat._id,
      });

      if (response.data) {
        // Xóa tin nhắn khỏi state hiện tại
        setMessages([]);
        // Đóng menu tùy chọn
        setShowCallOptions(false);
      }
    } catch (error) {
      console.error("Lỗi khi xóa lịch sử trò chuyện:", error);
    }
  };

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={getAvatarSrc(currentChat.avatarImage)}
              alt={currentChat.username || "User"}
              onError={(e) => {
                console.log("Avatar load error");
                e.target.onerror = null;
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%23cccccc'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff'%3E" + 
                  (currentChat.username ? currentChat.username.charAt(0).toUpperCase() : '?') + 
                  "%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
            <div className="status">
              <div className="status-indicator"></div>
              <span>Online</span>
            </div>
          </div>
        </div>
        <div className="chat-actions">
          <button className="action-button search-button">
            <FaSearch />
          </button>
          <button className="action-button call-button" onClick={handleCall}>
            <FaPhone />
          </button>
          <button className="action-button video-button" onClick={handleVideoCall}>
            <FaVideo />
          </button>
          <div className="more-options">
            <button className="action-button more-button" onClick={toggleCallOptions}>
              <FaEllipsisV />
            </button>
            {showCallOptions && (
              <div className="options-dropdown">
                <ul>
                  <li>View Profile</li>
                  <li>Mute Notifications</li>
                  <li>Block User</li>
                  <li onClick={handleClearChat}>Clear Chat</li>
                </ul>
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
                <div className={`content ${isImage ? 'image-content' : ''}`}>
                  {isImage ? (
                    <img 
                      src={message.message} 
                      alt="Chat content"
                      className="chat-image"
                      onClick={() => setSelectedImage(message.message)}
                      onError={(e) => {
                        console.error("Image load failed");
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect width='150' height='150' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999999'%3EImage Error%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  ) : (
                    <p>{message.message}</p>
                  )}
                  {message.fromSelf && (
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteMessage(message._id)}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />

      {selectedImage && (
        <ImageModal>
          <div className="modal-content">
            <span className="close-button" onClick={() => setSelectedImage(null)}>×</span>
            <img src={selectedImage} alt="Enlarged view" />
          </div>
        </ImageModal>
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


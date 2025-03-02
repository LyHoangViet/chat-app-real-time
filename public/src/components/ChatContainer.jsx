import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

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
    
    // Gửi cả type qua socket để xác định loại tin nhắn
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
      type, // Thêm type để phân biệt loại tin nhắn
    });
    
    // Gửi cả type lên server API
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
      type: type
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg, type: type });
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (data) => {        
        // Xử lý đa dạng định dạng dữ liệu từ socket
        if (typeof data === 'object') {
          // Nếu là object có type
          setArrivalMessage({
            fromSelf: false,
            message: data.msg || data.message,
            type: data.type || "text"
          });
        } else {
          // Nếu là string đơn giản (cũ)
          setArrivalMessage({
            fromSelf: false,
            message: data,
            type: data.startsWith && data.startsWith('data:image') ? "image" : "text"
          });
        }
      });
    }
    
    return () => {
      if (socket.current) {
        socket.current.off("msg-recieve");
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
                // Sử dụng inline SVG để hiển thị chữ cái đầu tiên của username
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%23cccccc'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff'%3E" + 
                  (currentChat.username ? currentChat.username.charAt(0).toUpperCase() : '?') + 
                  "%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        <Logout />
      </div>
      <div className="chat-messages">
        {messages.map((message) => {
          const isImage = isImageMessage(message);
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${
                  message.fromSelf ? "sended" : "recieved"
                }`}
              >
                <div className={`content ${isImage ? 'image-content' : ''}`}>
                  {isImage ? (
                    <img 
                      src={message.message} 
                      alt="Chat content"
                      className="chat-image"
                      onError={(e) => {
                        console.error("Image load failed");
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect width='150' height='150' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999999'%3EImage Error%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  ) : (
                    <p>{message.message}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
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
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
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
        color: #d1d1d1;
        transition: all 0.3s ease;
        &:hover {
          transform: translateY(-2px);
        }
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }

      .image-content {
        background-color: transparent !important;
        padding: 0;
        box-shadow: none !important;
        
        img.chat-image {
          max-width: 300px;
          border-radius: 1rem;
          object-fit: contain;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff30;
        box-shadow: 2px 2px 8px rgba(0,0,0,0.1);
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff30;
        box-shadow: -2px 2px 8px rgba(0,0,0,0.1);
      }
    }
  }
`;

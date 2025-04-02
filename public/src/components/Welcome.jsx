import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";
import Logout from "./Logout";
import { FaUserFriends, FaComments, FaSearch } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import CreateGroupModal from "./CreateGroupModal";
import { createdGroupRoute } from "../utils/APIRoutes";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_API_URL);

export default function Welcome() {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("");
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateGroupClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Data = reader.result.split(",")[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  }

  const handleCreateGroup = async (groupName, groupImage) => {
    setIsLoading(true);
    try {
      const base64Image = await toBase64(groupImage);
      const userData = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      const response = await axios.post(createdGroupRoute, {
        name: groupName,
        createdBy: userData._id,
        members: [{ user: userData._id, role: "admin" }],
        avatarImage: base64Image,
      });

      if (response.data.status && response.data.group) {
        toast.success("Group created successfully!");
        socket.emit("group-added", response.data.group); // Emit để cập nhật UI client bên Contact
        handleCloseModal();
      } else {
        toast.error(response.data.msg || "Failed to create group.");
      }
    } catch (error) {
      toast.error("Error creating group. Please try again.");
      console.error("Error creating group:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      setUserName(userData.username);
      setUserId(userData._id);
      socket.emit("add-user", userData._id);
    };
    fetchUser();

    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay("Good morning");
    else if (hour < 18) setTimeOfDay("Good afternoon");
    else setTimeOfDay("Good evening");
  }, []);

  return (
    <Container>
      <div className="logout-button">
        <Logout />
      </div>

      <div className="welcome-content">
        <img src={Robot} alt="Robot welcome" className="welcome-image" />
        <h1>
          {timeOfDay}, <span>{userName}!</span>
        </h1>
        <p className="welcome-message">
          Select a chat to start messaging or explore the features below
        </p>

        <div className="feature-cards">
          <div className="feature-card">
            <div className="feature-icon">
              <FaUserFriends />
            </div>
            <h3>Find Friends</h3>
            <p>Connect with new people</p>
          </div>

          <div className="feature-card" onClick={handleCreateGroupClick}>
            <div className="feature-icon">
              <FaComments />
            </div>
            <h3>Group Chat</h3>
            <p>Create group conversations</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaSearch />
            </div>
            <h3>Explore</h3>
            <p>Discover new connections</p>
          </div>
        </div>

        <CreateGroupModal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          onCreateGroup={handleCreateGroup}
          isLoading={isLoading}
        />
      </div>

      <ToastContainer />
    </Container>
  );
}




const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--text-primary);
  flex-direction: column;
  position: relative;
  height: 100%;
  padding: 2rem;
  overflow-y: auto;
  
  .logout-button {
    position: absolute;
    right: 2rem;
    top: 2rem;
    z-index: 10;
  }
  
  .welcome-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    max-width: 800px;
    animation: fadeIn 0.5s ease;
    width: 100%;
    padding: 1rem;
    margin: auto;
  }
  
  .welcome-image {
    height: 18rem;
    margin-bottom: 1rem;
    animation: float 3s ease-in-out infinite;
    
    @media (max-height: 800px) {
      height: 14rem;
    }
  }
  
  h1 {
    font-size: var(--font-2xl);
    margin-bottom: 1rem;
    
    span {
      color: var(--primary-color);
      font-weight: bold;
    }
    
    @media (max-height: 800px) {
      font-size: var(--font-xl);
    }
  }
  
  .welcome-message {
    font-size: var(--font-lg);
    color: var(--text-secondary);
    margin-bottom: 2rem;
    
    @media (max-height: 800px) {
      font-size: var(--font-md);
      margin-bottom: 1.5rem;
    }
  }
  
  .feature-cards {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 0.5rem;
    width: 100%;
    max-width: 700px;
    
    @media (max-width: 768px) {
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    
    @media (max-height: 800px) {
      gap: 1rem;
    }
  }
  
  .feature-card {
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: var(--radius-md);
    padding: 1.5rem;
    width: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    transition: var(--transition-normal);
    cursor: pointer;
    box-shadow: var(--shadow-sm);
    
    @media (max-height: 800px) {
      padding: 1rem;
      width: 180px;
    }
    
    &:hover {
      transform: translateY(-10px);
      background-color: rgba(255, 255, 255, 0.1);
      box-shadow: var(--shadow-md);
    }
    
    .feature-icon {
      font-size: 2.5rem;
      color: var(--primary-color);
      margin-bottom: 1rem;
      
      @media (max-height: 800px) {
        font-size: 2rem;
        margin-bottom: 0.5rem;
      }
    }
    
    h3 {
      font-size: var(--font-lg);
      margin-bottom: 0.5rem;
      color: var(--text-primary);
      
      @media (max-height: 800px) {
        font-size: var(--font-md);
        margin-bottom: 0.3rem;
      }
    }
    
    p {
      font-size: var(--font-sm);
      color: var(--text-secondary);
      
      @media (max-height: 800px) {
        font-size: var(--font-xs);
      }
    }
  }
`;



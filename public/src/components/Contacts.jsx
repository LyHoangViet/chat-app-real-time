import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";

export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const navigate = useNavigate();
  
  useEffect(() => {
    const getData = async () => {
      const data = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
      if (data) {
        const userData = await JSON.parse(data);
        setCurrentUserName(userData.username);
        setCurrentUserImage(userData.avatarImage);
      }
    };
    getData();
  }, []);
  
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };
  
  const handleLogoClick = () => {
    // Reset selected chat and navigate to home
    setCurrentSelected(undefined);
    changeChat(undefined);
  };
  
  return (
    <>
      {currentUserImage && currentUserImage && (
        <Container>
          <div className="brand" onClick={handleLogoClick}>
            <img src={Logo} alt="logo" />
            <h3>Duckee</h3>
          </div>
          <div className="contacts">
            {contacts.map((contact, index) => {
              return (
                <div
                  key={contact._id}
                  className={`contact ${
                    index === currentSelected ? "selected" : ""
                  }`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div className="avatar">
                    <img
                      src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                      alt=""
                    />
                  </div>
                  <div className="username">
                    <h3>{contact.username}</h3>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="current-user">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
              />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #080420;
  height: 100%;
  
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    cursor: pointer;
    transition: var(--transition-normal);
    padding: 1rem;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.05);
      
      h3 {
        color: var(--primary-light);
      }
    }
    
    img {
      height: 2rem;
      animation: pulse 2s infinite ease-in-out;
    }
    
    h3 {
      color: var(--primary-color);
      text-transform: uppercase;
      font-size: 1.5rem;
      font-weight: bold;
      transition: var(--transition-normal);
    }
  }
  
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    padding: 0.5rem 0;
    
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    
    .contact {
      background-color: #ffffff34;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: all 0.3s ease;
      
      .avatar {
        img {
          height: 3rem;
          border-radius: 50%;
          border: 2px solid transparent;
          transition: var(--transition-normal);
        }
      }
      
      .username {
        h3 {
          color: white;
          font-size: var(--font-md);
        }
      }
      
      &:hover {
        background-color: #9a86f3;
        transform: translateX(5px);
        
        .avatar img {
          border-color: white;
        }
      }
    }
    
    .selected {
      background-color: #9a86f3;
    }
  }

  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    transition: all 0.3s ease;
    padding: 0.5rem;
    align-self: end;
    width: 100%;
    
    &:hover {
      background-color: #1a1a4d;
    }
    
    .avatar {
      img {
        height: 3.5rem;
        max-inline-size: 100%;
        border-radius: 50%;
        border: 2px solid var(--primary-color);
      }
    }
    
    .username {
      h2 {
        color: white;
        font-size: var(--font-lg);
      }
    }
    
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: var(--font-md);
        }
      }
      .avatar img {
        height: 3rem;
      }
    }
  }
`;

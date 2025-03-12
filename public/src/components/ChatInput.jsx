import React, { useState, useEffect, useRef } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { MdImage } from "react-icons/md"; // Using Material Design image icon
import styled from "styled-components";
import Picker from "emoji-picker-react";
import IconImage from "../assets/icon_image.png"; // Nhập hình ảnh

export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [image, setImage] = useState(null);
  const [imageFileName, setImageFileName] = useState("");
  const emojiPickerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event, emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
    inputRef.current?.focus();
  };

  const sendChat = (event) => {
    event.preventDefault();
    
    if (image) {
      handleSendMsg(image, "image");
      setImage(null);
      setImageFileName("");
    }
    
    if (msg.length > 0) {
      handleSendMsg(msg, "text");
      setMsg("");
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Add filename to message
      setImageFileName(file.name);
      
      // Convert image to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImageFileName("");
  };

  return (
    <Container>
      <div className="button-container">
        <div className="emoji" ref={emojiPickerRef}>
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && (
            <div className="emoji-picker-container">
              <Picker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>
      </div>
      <form className="input-container" onSubmit={sendChat}>
        {imageFileName ? (
          <div className="selected-image-info">
            <span className="image-name">{imageFileName}</span>
            <button type="button" className="remove-image" onClick={removeImage}>
              ✕
            </button>
          </div>
        ) : (
          <input
            type="text"
            placeholder="Type your message here"
            onChange={(e) => setMsg(e.target.value)}
            value={msg}
            ref={inputRef}
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
          id="imageInput"
        />
        <label htmlFor="imageInput" className="image-button">
          <MdImage className="image-icon" />
        </label>
        <button type="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 5% 95%;
  background-color: var(--background-dark);
  padding: 0 2rem;
  border-radius: 0 0 1rem 1rem;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }
  
  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    
    .emoji {
      position: relative;
      
      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          transform: scale(1.1);
        }
      }
      
      .emoji-picker-container {
        position: absolute;
        top: -350px;
        left: -10px;
        z-index: 999;
        box-shadow: var(--shadow-lg);
        border-radius: var(--radius-md);
        overflow: hidden;
        
        .emoji-picker-react {
          background-color: var(--background-lighter);
          border-color: var(--primary-color);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          
          .emoji-scroll-wrapper::-webkit-scrollbar {
            background-color: var(--background-lighter);
            width: 6px;
          }
          
          .emoji-scroll-wrapper::-webkit-scrollbar-thumb {
            background-color: var(--primary-color);
            border-radius: 10px;
          }
          
          .emoji-categories {
            button {
              filter: contrast(0);
            }
          }
          
          .emoji-search {
            background-color: transparent;
            border-color: var(--primary-color);
            color: var(--text-primary);
          }
          
          .emoji-group:before {
            background-color: var(--background-lighter);
            color: var(--text-primary);
          }
        }
      }
    }
  }
  
  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    background-color: var(--background-light);
    backdrop-filter: blur(10px);
    padding: 0.5rem 1rem;
    transition: all 0.3s ease;
    
    &:focus-within {
      box-shadow: 0 0 10px rgba(78, 14, 255, 0.3);
    }

    input {
      width: 90%;
      background-color: transparent;
      color: var(--text-primary);
      border: none;
      padding: 0.5rem;
      font-size: 1.2rem;
      
      &:focus {
        outline: none;
      }
      
      &::placeholder {
        color: var(--text-muted);
      }
    }
    
    .selected-image-info {
      display: flex;
      align-items: center;
      width: 90%;
      padding: 0.5rem;
      
      .image-name {
        color: var(--text-primary);
        font-size: 1rem;
        max-width: calc(100% - 30px);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .remove-image {
        margin-left: 10px;
        background: transparent;
        border: none;
        color: #f66;
        cursor: pointer;
        font-size: 1rem;
        padding: 0 5px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
      }
    }
    
    .image-button {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background-color: rgba(255, 255, 255, 0.1);
      padding: 0.5rem;
      border-radius: 50%;
      
      .image-icon {
        font-size: 1.5rem;
        color: var(--primary-light);
        transition: all 0.3s ease;
      }
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.2);
        transform: scale(1.1);
        
        .image-icon {
          color: var(--primary-color);
        }
      }
    }
    
    button {
      padding: 0.5rem;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: var(--primary-color);
      border: none;
      
      svg {
        font-size: 1.5rem;
        color: white;
      }
      
      transition: all 0.3s ease;
      
      &:hover {
        background-color: var(--primary-light);
        transform: scale(1.1);
      }
    }
  }
`;

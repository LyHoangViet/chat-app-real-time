import React, { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import IconImage from "../assets/icon_image.png"; // Nhập hình ảnh

export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [image, setImage] = useState(null);
  const [imageFileName, setImageFileName] = useState("");

  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event, emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
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
      // Thêm tên file vào tin nhắn
      setImageFileName(file.name);
      
      // Chuyển đổi hình ảnh thành base64
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result); // Lưu hình ảnh dưới dạng base64
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
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
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
            placeholder="type your message here"
            onChange={(e) => setMsg(e.target.value)}
            value={msg}
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
        <img src={imageFileName ? imageFileName : IconImage} style={{ width: "24px", height: "24px" }} />
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
  background-color: #080420;
  padding: 0 2rem;
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
      }
      .emoji-picker-react {
        position: absolute;
        top: -350px;
        background-color: #080420;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9a86f3;
        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #080420;
          width: 5px;
          &-thumb {
            background-color: #9a86f3;
          }
        }
        .emoji-categories {
          button {
            filter: contrast(0);
          }
        }
        .emoji-search {
          background-color: transparent;
          border-color: #9a86f3;
        }
        .emoji-group:before {
          background-color: #080420;
        }
      }
    }
  }
  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;
    padding: 0.3rem;
    
    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;

      &::selection {
        background-color: #9a86f3;
      }
      &:focus {
        outline: none;
      }
    }
    
    .selected-image-info {
      display: flex;
      align-items: center;
      width: 90%;
      padding: 0.5rem 1rem;
      
      .image-name {
        color: white;
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
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      
      img {
        width: 24px;
        height: 24px;
        transition: transform 0.2s ease;
      }
      
      &:hover img {
        transform: scale(1.1);
      }
    }
    
    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }
      svg {
        font-size: 2rem;
        color: white;
      }
      transition: all 0.3s ease;
      &:hover {
        background-color: #7b68ee;
        transform: scale(1.05);
      }
    }
    transition: all 0.3s ease;
    &:focus-within {
      box-shadow: 0 0 10px rgba(154, 134, 243, 0.4);
    }
  }
`;

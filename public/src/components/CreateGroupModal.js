import React, { useState } from "react";
import styled from "styled-components";
import Modal from "react-modal";

Modal.setAppElement("#root");

const CreateGroupModal = ({ isOpen, onRequestClose, onCreateGroup }) => {
  const [groupName, setGroupName] = useState("");
  const [groupImage, setGroupImage] = useState(null);
  const [memberEmail, setMemberEmail] = useState(""); // Để lại state này nếu bạn cần chức năng thêm thành viên

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateGroup(groupName, groupImage); // Chuyển cả tên nhóm và ảnh
    setGroupName("");
    setGroupImage(null);
    setMemberEmail(""); // Reset email
    onRequestClose();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setGroupImage(file);
  };

  return (
    <StyledModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Tạo Group"
      style={{
        overlay: {
          backgroundColor: "transparent",
          zIndex: 1000,
        },
      }}
    >
      <ModalHeader>
        <ModalTitle>Tạo Group</ModalTitle>
        <ModalCloseButton onClick={onRequestClose}>×</ModalCloseButton>
      </ModalHeader>
      <ModalBody>
        <Input
          type="text"
          placeholder="Tên Group"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
      </ModalBody>
      <ModalBody>
        <ImageInputLabel>Chọn Ảnh Group:</ImageInputLabel>
        <ImageInput type="file" accept="image/*" onChange={handleImageChange} />
        {groupImage && (
          <ImagePreview src={URL.createObjectURL(groupImage)} alt="Preview" />
        )}
      </ModalBody>

      <ModalFooter>
        <ModalButton onClick={onRequestClose}>Hủy</ModalButton>
        <ModalButton onClick={handleSubmit}>Tạo</ModalButton>
      </ModalFooter>
    </StyledModal>
  );
};

const StyledModal = styled(Modal)`
  background-color: #2a394d;
  border-radius: 12px;
  padding: 25px;
  width: 400px;
  max-width: 95%;
  margin: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  outline: none;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  border: 1px solid #4a5568;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #63b3ed;
`;

const ModalTitle = styled.h2`
  color: white;
  font-size: 1.6rem;
  margin: 0;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
`;

const ModalCloseButton = styled.button`
  background: none;
  border: none;
  color: #a0aec0;
  font-size: 2.5rem;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.3s ease;

  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
`;

const ModalBody = styled.div`
  margin-bottom: 30px;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  margin-bottom: 0;
  border: 2px solid #63b3ed;
  border-radius: 8px;
  background-color: #edf2f7;
  color: #2d3748;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);

  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const ImageInputLabel = styled.label`
  color: white;
  display: block;
  margin-bottom: 10px;
  font-size: 1.2rem;
`;

const ImageInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 2px solid #63b3ed;
  border-radius: 8px;
  background-color: #edf2f7;
  color: #2d3748;
  font-size: 1.2rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 200px;
  margin-top: 10px;
  border-radius: 8px;
  border: 2px solid #63b3ed;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  padding-top: 20px;
`;

const ModalButton = styled.button`
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.3rem;
  font-weight: bold;
  transition: all 0.3s ease;
  background-image: linear-gradient(to bottom right, #4fc3f7, #03a9f4);
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-image: linear-gradient(to bottom right, #03a9f4, #0288d1);
    transform: scale(1.05);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: scale(1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

export default CreateGroupModal;

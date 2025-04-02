import React, { useState } from "react";
import styled from "styled-components";
import Modal from "react-modal";

Modal.setAppElement("#root");

export default function RemoveMemberModal ({ isOpen, onRequestClose, members, onRemoveMember })  {
  const [selectedMember, setSelectedMember] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedMember) {
      console.log("a",selectedMember)
      onRemoveMember(selectedMember); // Gửi ID thành viên để xóa
      setSelectedMember(null); // Reset sau khi xóa
      onRequestClose(); // Đóng modal
    }
  };

  return (
    <StyledModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Remove Member"
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1000,
        },
      }}
    >
      <ModalHeader>
        <ModalTitle>Xóa Thành Viên</ModalTitle>
        <ModalCloseButton onClick={onRequestClose}>×</ModalCloseButton>
      </ModalHeader>

      {/* Nếu không có thành viên thì hiển thị thông báo */}
      {members.length === 0 ? (
        <ModalBody>
          <NoMembersMessage>Không có thành viên nào để xóa!</NoMembersMessage>
        </ModalBody>
      ) : (
        <ModalBody>
          <MemberList>
            {members.map((member) => (
              <MemberItem
                key={member._id}
                onClick={() => setSelectedMember(member._id)} // Chọn thành viên để xóa
                selected={selectedMember === member._id}
              >
                <MemberAvatar src={`data:image/svg+xml;base64,${member.user.avatarImage}`} alt={member.username} />
                <MemberName>{member.user.username}</MemberName>
              </MemberItem>
            ))}
          </MemberList>
        </ModalBody>
      )}

      <ModalFooter>
        <ModalButton onClick={onRequestClose}>Hủy</ModalButton>
        <ModalButton onClick={handleSubmit} disabled={!selectedMember}>
          Xóa
        </ModalButton>
      </ModalFooter>
    </StyledModal>
  );
};

const StyledModal = styled(Modal)`
  background-color: rgb(4, 14, 33);
  border-radius: 8px;
  padding: 20px;
  width: 400px;
  max-width: 90%;
  margin: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  outline: none;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid rgb(#ccff66);
  padding-bottom: 10px;
`;

const ModalTitle = styled.h2`
  color: white;
  font-size: 1.2rem;
  margin: 0;
`;

const ModalCloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
`;

const ModalBody = styled.div`
  margin-bottom: 20px;
  padding-top: 10px;
`;

const MemberList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 300px;
  overflow-y: auto;
`;

const MemberItem = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  background-color: ${(props) => (props.selected ? "#3b82f6" : "#2d3748")};
  border-radius: 6px;
  color: white;
  transition: background-color 0.2s;

  &:hover {
    background-color: #4c51bf;
  }
`;

const MemberAvatar = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-right: 10px;
`;

const MemberName = styled.span`
  color: white;
  font-size: 1rem;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const ModalButton = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;

  &:first-child {
    background-color: #555;
    color: white;
  }

  &:last-child {
    background-color: #e53e3e;
    color: white;
    &:disabled {
      background-color: #d4d4d4;
    }
  }
`;

const NoMembersMessage = styled.p`
  color: white;
  font-size: 1rem;
  text-align: center;
`;


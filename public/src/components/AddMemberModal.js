import React, { useState } from "react";
import "./AddMemberModal.css";

export default function AddMemberModal({ isOpen, onClose, onAddMember }) {
  const [memberEmail, setMemberEmail] = useState("");

  const handleAddMember = () => {
    onAddMember(memberEmail);
    setMemberEmail("");
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Thêm thành viên vào nhóm</h2>

        <input
          type="text"
          placeholder="Email thành viên"
          value={memberEmail}
          onChange={(e) => setMemberEmail(e.target.value)}
        />
        <button className="" onClick={handleAddMember}>
          Thêm
        </button>
      </div>
    </div>
  );
}

"use client";

import { fetchData } from "@/utils/fetch-api";
import { Modal } from "antd";
import { useState } from "react";

const SendStatementModal = ({ isModalOpen, hideModal, startDate, endDate }) => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const handleOk = () => {
    if (email) {
      const fetchDataAsync = async () => {
        try {
          const response = await fetchData("sendStatement", true, {
            StartDate: startDate?.format("YYYY-MM-DD"),
            EndDate: endDate?.format("YYYY-MM-DD"),
            Email: email,
          });
        } catch (error) {
          setErrorMessage(error.message);
        }
        hideModal();
        setEmail("");
        setErrorMessage("");
      };
      fetchDataAsync();
    } else {
      setErrorMessage("Please enter an email address.");
    }
  };

  const handleCancel = () => {
    hideModal();
    setEmail("");
    setErrorMessage(null);
  };

  return (
    <Modal
      title="Enter your email address, please."
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okButtonProps={{
        style: { backgroundColor: "var(--primary-theme-color)" },
      }}
      cancelButtonProps={{
        style: {
          color: "var(--secondary-theme-color)",
          border: "1px solid var(--secondary-theme-color)",
          outline: "1px solid var(--secondary-theme-color)",
        },
      }}
    >
      <input
        type="email"
        placeholder="Enter"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          borderRadius: "5px",
          outline: "1px solid var(--primary-theme-color)",
        }}
      />
      {errorMessage && (
        <p
          style={{
            color: "var(--error-color)",
            marginTop: "8px",
          }}
        >
          {errorMessage}
        </p>
      )}
    </Modal>
  );
};

export default SendStatementModal;

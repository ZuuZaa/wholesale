"use client";

import Link from "next/link";
import "./order-card.scss";
import { dateNormalizer } from "@/helpers";
import { useState } from "react";
import { Modal } from "antd";
import { fetchData } from "@/utils/fetch-api";
import Icon from "@/components/icon";

const renderStatusButton = (status, onSendClick, onEditClick) => {
  switch (status) {
    case 1:
      return (
        <button
          className="order-action flex items-center gap-1"
          onClick={onSendClick}
        >
          Send invoice
          <Icon name="send" size="inherit" color="inherit" />
        </button>
      );
    case 2:
      return (
        <button
          className="order-action flex items-center gap-1"
          onClick={onEditClick}
        >
          Edit order
          <Icon name="edit" size="inherit" color="inherit" />
        </button>
      );
    default:
      return null;
  }
};

const OrderCard = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const onEditClick = () => {
    const fetchDataAsync = async () => {
      try {
        const response = await fetchData("editOrder", true, {
          OrderId: data.Id,
        });
        window.location.href = "/cart";
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchDataAsync();
  };

  const onSendClick = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (email) {
      const fetchDataAsync = async () => {
        try {
          const response = await fetchData("sendInvoice", true, {
            Email: email,
            SaleId: data.Id,
          });
        } catch (error) {
          setErrorMessage(error.message);
        } finally {
          setIsModalOpen(false);
        }
      };
      fetchDataAsync();
    } else {
      setErrorMessage("please enter email address");
    }
  };

  const handleCancel = () => {
    setEmail("");
    setErrorMessage(null);
    setIsModalOpen(false);
  };

  return (
    <div className="order-card">
      <div className="order-card-title flex justify-between items-center mb-3">
        <h3 className="order-id">ID:{data?.Id}</h3>
        {renderStatusButton(data?.Status, onSendClick, onEditClick)}
      </div>
      <div className="felx column gap-2">
        <h4 className="order-total">Total: ₤{data?.Total}</h4>
        <p>Credit: ₤{data?.Credit}</p>
        <p>{data?.AddressLine1}</p>
        <p>{dateNormalizer(data?.SoldDate)}</p>
      </div>
      <Link className="details-link color-premium" href={`history/${data.Id}`}>
        Details &#8811;
      </Link>
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
            }}
          >
            {errorMessage}
          </p>
        )}
      </Modal>
    </div>
  );
};

export default OrderCard;

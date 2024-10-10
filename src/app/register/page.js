"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  UilPhone,
  UilInfo,
  UilMap,
  UilEnvelope,
} from "@iconscout/react-unicons";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import VerificationModal from "./verification";
import "./register.scss";

function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${
        id === open ? "rotate-180" : ""
      } h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

export default function Register() {
  const [isModalOpen, setModalOpen] = useState(false);

  // const [open, setOpen] = useState(0);
  // const handleOpen = (value) => setOpen(open === value ? 0 : value);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const buttonRef = useRef(null);

  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://api.wscshop.co.uk/api/account/register",
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify({
            FirstName: firstname,
            LastName: lastname,
            Email: email,
            Password: password,
            Phone: phone,
            CompanyName: company,
            Position: position,
          }),
        }
      );
      const resJson = await res.json();
      if (res.status === 200) {
        if (resJson.status === 400) {
          setMessage(resJson.statusText);
        } else {
          setMessage("Thanks for register. We will contact with you soonly!");
          // if (buttonRef.current) {
          //   buttonRef.current.click();
          // }
        }
      } else {
        setMessage(res.statusText);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main>
      <div className="register-page">
        <div className="form-container">
          <div className="form-title">
            <h2 className="color-premium">Welcome!</h2>
            <p className="color-premium">Create an account</p>
          </div>
          <form action="" className="register-form">
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <input type="password" placeholder="Password" />
            <button type="submit">Sign up</button>
          </form>

          <p className="color-premium">
            Already has an account?
            <Link href="/login" className="color-premium">
              Log in
            </Link>
          </p>
        </div>
      </div>
      <VerificationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        email={email}
      ></VerificationModal>
    </main>
  );
}

"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  UilPhone,
  UilInfo,
  UilMap,
  UilEnvelope,
} from "@iconscout/react-unicons";
import ChangePassModal from "./change";
import Swal from "sweetalert2";

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

import "./login.scss";

export default function Login() {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  const [isModalOpen, setModalOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [message1, setMessage1] = useState("");
  const [email_forg, setEmailForg] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const buttonRef = useRef(null);

  let login = async (e) => {
    e.preventDefault();
    let session_id = "";
    if (typeof localStorage !== "undefined") {
      session_id = localStorage.getItem("sessionId");
    }
    try {
      const res = await fetch(
        "https://ws.wscshop.co.uk/api/account/post-login",
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify({
            Email: email,
            Password: password,
            SessionId: session_id,
          }),
        }
      );
      const resJson = await res.json();
      console.log(resJson);
      if (res.status === 200) {
        if (resJson.status === 400) {
          setMessage(resJson.statusText);
        } else {
          setEmail("");
          setPassword("");
          setMessage("Login successfully");

          if (typeof localStorage !== "undefined") {
            localStorage.setItem("refreshToken", resJson.output.refreshToken);
            localStorage.setItem("jwtToken", resJson.output.token);
          }

          //window.location.href="/";
          //window.history.back()
          let page_path = "";
          if (typeof localStorage !== "undefined") {
            page_path = localStorage.getItem("pagePath");
          }
          //console.log(page_path)
          if (page_path == "/checkout") {
            window.location.href = "/cart";
          } else {
            window.location.href = page_path;
          }

          //router.back().refresh()
        }
      } else {
        setMessage(res.statusText);
      }
    } catch (err) {
      console.log(err);
    }
  };

  let forgotPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://api.wscshop.co.uk/api/account/forgot-password",
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify({
            Email: email_forg,
          }),
        }
      );
      const resJson = await res.json();
      if (res.status === 200) {
        if (resJson.status === 400) {
          setMessage1(resJson.statusText);
        } else {
          //setEmail("");
          setMessage1("Reset successfully");
          //window.location.href="/change_pass";
          if (buttonRef.current) {
            buttonRef.current.click();
          }
        }
      } else {
        setMessage1(res.statusText);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      const rememberMeValue = localStorage.getItem("rememberMe") === "true";
      setRememberMe(rememberMeValue);
      if (rememberMeValue) {
        const storedUsername = localStorage.getItem("email");
        setEmail(storedUsername || "");
        const storedpassword = localStorage.getItem("password");
        setPassword(storedpassword || "");
      }
    }
  }, []);

  const handleLogin = () => {
    // Logic for authentication
    // After successful login, store username and rememberMe value in localStorage
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("rememberMe", rememberMe);
      if (rememberMe) {
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
      } else {
        localStorage.removeItem("email");
        localStorage.removeItem("password");
      }
    }

    // Redirect or set authenticated state
  };

  return (
    <main>
      <div className="login-page">
        <div className="form-container">
          <div className="form-title">
            <h2 className="color-green">Welcome!</h2>
            <p className="color-green">
              Please login using account detail below
            </p>
          </div>
          <form action="" className="login-form" onSubmit={login}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Log in</button>
            <div className="message">{message ? <p>{message}</p> : null}</div>
          </form>

          {/* <p className="color-green">
            Don't have an account?
            <Link href="/register" className="color-green">
              Sign up
            </Link>
          </p> */}
        </div>
      </div>
    </main>
  );
}

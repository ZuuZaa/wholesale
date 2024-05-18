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
        "https://api.wscshop.co.uk/api/account/post-login",
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
      <div className="login--desktop">
        {/* Breadcrumb */}
        <div className="breadcrumb-wrapper py-12">
          <div className="custom-container mx-auto">
            <div className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li className="inline-flex items-center">
                  <a
                    href="#"
                    className="inline-flex items-center text-sm font-medium"
                  >
                    {" "}
                    Home{" "}
                  </a>
                </li>

                <li>
                  <div className="flex items-center">
                    <a href="#" className="ms-1 text-sm font-medium md:ms-2">
                      Account
                    </a>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Login  Section */}
        <section className="login-register-main-section mt-5">
          <div className="custom-container mx-auto">
            <div className="account-lr-wrap mx-auto p-8 text-center">
              <h4 className="account-page-title">Login</h4>
              <p className="mb-8">Please login using account detail bellow.</p>
              <form className="w-full" onSubmit={login}>
                <div className="account-form-flex mb-4">
                  <label className="text-sm">Email</label>
                  <input
                    className=""
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="account-form-flex mb-4">
                  <label className="text-sm">Password</label>
                  <input
                    className=""
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="account-form-remember-me mb-4 justify-start">
                  <label className="text-sm">Remember me</label>
                  <input
                    className=""
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                            
                </div>
                <Link
                  className="hover-red cursor-pointer text-sm block"
                  href="/register"
                >
                  Creat account
                </Link>
                <span
                  className="hover-red cursor-pointer text-sm block mt-5"
                  onClick={toggleVisibility}
                >
                  {" "}
                  Forgot Your Password?
                </span>

                <div class="mt-5">
                  <button
                    class="account-page-btn link-design1 inline-block border-none font-bold"
                    onClick={handleLogin}
                  >
                    Sign In
                  </button>
                </div>
                <div className="message">
                  {message ? <p>{message}</p> : null}
                </div>
              </form>
            </div>
            {isVisible && (
              <div className="account-lr-wrap mx-auto p-8 mt-8 text-center">
                <h4 className="account-page-title">Reset your password</h4>
                <p className="mb-8">
                  We will send you an email to reset your password
                </p>
                <form className="w-full" onSubmit={forgotPassword}>
                  <div className="account-form-flex mb-4">
                    <label className="text-sm">Email</label>
                    <input
                      className=""
                      type="text"
                      placeholder="Email"
                      value={email_forg}
                      onChange={(e) => setEmailForg(e.target.value)}
                    />
                  </div>
                  <div class="mt-5 flex gap-3 items-center justify-center">
                    {/* <button class="account-page-btn-cancel link-design1-cancel inline-block border-none font-bold">Cancel</button> */}
                    <button class="account-page-btn-success link-design1 inline-block border-none font-bold">
                      Send
                    </button>
                  </div>
                  <div className="message">
                    {message1 ? <p>{message1}</p> : null}
                  </div>
                </form>
              </div>
            )}
          </div>
        </section>

        {/* Verification Modal */}
        <button
          ref={buttonRef}
          className="verification-modal-btn"
          onClick={() => setModalOpen(true)}
        ></button>
        <ChangePassModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          email={email_forg}
        ></ChangePassModal>
      </div>

      <div className="login--mobile">
        <div className="form-container">
          <div className="form-title">
            <h2 className="color-green">Welcome!</h2>
            <p className="color-green">
              Please login using account detail bellow
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

          <p className="color-green">
            Don't have an account?
            <Link href="/register" className="color-green">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "70px",
            right: "10px",
            display: 'flex',
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#3fe29e",
            opacity: 0.8,
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            lineHeight: "18.52px",
            width: "48px",
            height: "48px",
            border: "1px solid #ccc",
            cursor: "pointer",
            zIndex: 1000,
          }}
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;

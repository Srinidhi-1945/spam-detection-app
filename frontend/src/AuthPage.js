// src/AuthPage.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import axios from "axios";
// import "./AuthPage.css";  // Optional: Add nice styling if you want

function AuthPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const navigate = useNavigate();

  const validatePhoneNumber = (number) => {
    return /^[6-9]\d{9}$/.test(number);
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: (response) => {
          console.log("Recaptcha resolved", response);
        },
        'expired-callback': () => {
          alert("Recaptcha expired. Please try again.");
        }
      });
    }
  };

  const handleSendOtp = async () => {
    if (!validatePhoneNumber(phone)) {
      alert("❌ Please enter a valid 10-digit Indian phone number.");
      return;
    }

    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const fullPhone = `+91${phone}`;
      const confirmation = await signInWithPhoneNumber(auth, fullPhone, appVerifier);

      setConfirmationResult(confirmation);
      setShowOtpInput(true);
      alert("✅ OTP sent successfully!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("❌ Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtpAndRegister = async () => {
    try {
      if (!otp) {
        alert("Please enter the OTP.");
        return;
      }
      await confirmationResult.confirm(otp);
      alert("✅ OTP verified successfully!");

      const res = await axios.post("http://localhost:5000/api/auth/register", { phone_number: phone });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userPhone", res.data.phone_number);
        navigate("/dashboard");
      } else {
        alert(res.data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      alert("❌ Invalid or expired OTP.");
    }
  };

  const handleLogin = async () => {
    if (!validatePhoneNumber(phone)) {
      alert("❌ Please enter a valid 10-digit Indian phone number.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { phone_number: phone });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userPhone", res.data.phone_number);
        navigate("/dashboard");
      } else {
        alert(res.data.message || "User not found. Please register.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Login failed. Try again.");
    }
  };

  return (
    <div className="auth-container">
      {isRegistering ? (
        <div className="auth-box">
          <h2>Register</h2>
          <input
            type="text"
            placeholder="Enter your 10-digit Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {!showOtpInput ? (
            <button onClick={handleSendOtp}>Send OTP</button>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button onClick={handleVerifyOtpAndRegister}>Verify & Register</button>
            </>
          )}
          <p>
            Already registered?{" "}
            <span
              className="link"
              onClick={() => {
                setIsRegistering(false);
                setShowOtpInput(false);
                setOtp("");
              }}
            >
              Login here
            </span>
          </p>
        </div>
      ) : (
        <div className="auth-box">
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Enter your 10-digit Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
          <p>
            Don't have an account?{" "}
            <span
              className="link"
              onClick={() => {
                setIsRegistering(true);
                setShowOtpInput(false);
                setOtp("");
              }}
            >
              Register here
            </span>
          </p>
        </div>
      )}
      <div id="recaptcha-container"></div>
    </div>
  );
}

export default AuthPage;

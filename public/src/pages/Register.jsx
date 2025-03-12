import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes";

export default function Register() {
  const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, username, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );
        navigate("/");
      }
    }
  };

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" className="logo-animation" />
            <h1>Duckee</h1>
          </div>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              name="username"
              onChange={(e) => handleChange(e)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              name="email"
              onChange={(e) => handleChange(e)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              name="password"
              onChange={(e) => handleChange(e)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm your password"
              name="confirmPassword"
              onChange={(e) => handleChange(e)}
              required
            />
          </div>
          <button type="submit" className="submit-btn">Create Account</button>
          <span className="switch-form">
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: var(--background-dark);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: "";
    position: absolute;
    width: 150%;
    height: 150%;
    background: radial-gradient(circle, var(--primary-dark) 0%, transparent 70%);
    opacity: 0.1;
    top: -25%;
    left: -25%;
    z-index: 0;
    animation: pulse 15s infinite;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 1rem;
    
    img {
      height: 5rem;
      animation: float 3s ease-in-out infinite;
    }
    
    h1 {
      color: var(--primary-color);
      text-transform: uppercase;
      font-size: var(--font-2xl);
      font-weight: bold;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background-color: var(--background-light);
    border-radius: var(--radius-lg);
    padding: 3rem 5rem;
    box-shadow: var(--shadow-lg);
    backdrop-filter: blur(10px);
    transition: var(--transition-normal);
    z-index: 1;
    width: 100%;
    max-width: 500px;
    animation: slideUp 0.5s ease;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 30px rgba(0,0,0,0.3);
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      
      label {
        color: var(--text-primary);
        font-size: var(--font-sm);
        font-weight: 500;
      }
    }
  }
  
  input {
    background-color: rgba(255, 255, 255, 0.05);
    padding: 1rem;
    border: 0.1rem solid var(--primary-color);
    border-radius: var(--radius-sm);
    color: var(--text-primary);
    width: 100%;
    font-size: var(--font-md);
    transition: var(--transition-normal);
    
    &:focus {
      border: 0.1rem solid var(--primary-light);
      outline: none;
      box-shadow: 0 0 10px rgba(78, 14, 255, 0.3);
    }
    
    &::placeholder {
      color: var(--text-muted);
    }
  }
  
  .submit-btn {
    background-color: var(--primary-color);
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: var(--radius-sm);
    font-size: var(--font-md);
    text-transform: uppercase;
    transition: var(--transition-normal);
    margin-top: 1rem;
    
    &:hover {
      background-color: var(--primary-light);
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(78, 14, 255, 0.4);
    }
  }
  
  .switch-form {
    color: var(--text-primary);
    text-align: center;
    font-size: var(--font-sm);
    margin-top: 0.5rem;
    
    a {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: bold;
      transition: var(--transition-normal);
      margin-left: 0.5rem;
      
      &:hover {
        color: var(--primary-light);
        text-decoration: underline;
      }
    }
  }
  
  @media screen and (max-width: 768px) {
    form {
      padding: 2rem;
      width: 90%;
    }
  }
`;

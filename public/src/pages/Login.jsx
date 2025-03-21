import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";
import { auth, fbProvider, ggProvider} from "../Firebase/config";
import {signInWithPopup} from "firebase/auth";
import { setUserRoute } from "../utils/APIRoutes";
export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, []);
  const handleLogin = async (provider) => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        
        try {
         
          const user = result.user;
          if (user) {
            // Người dùng đã đăng nhập
            var userInfo = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              emailVerified: user.emailVerified
            };
            // Truy cập từng thuộc tính
            console.log("UID:", userInfo.uid);
            console.log("Email:", userInfo.email);
            console.log("Username:", userInfo.displayName);
            console.log("Ảnh đại diện:", userInfo.photoURL);
            console.log("Email đã xác thực:", userInfo.emailVerified);
          }
          // Lấy thông tin người dùng từ backend
          const response = await axios.post(setUserRoute, { 
            email: user.email,
            username: user.displayName,
            password: user.uid,


          
          
          });
      
          if (response.data.emailcheck) {
            // Lưu thông tin người dùng từ backend vào localStorage
            localStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY, JSON.stringify(response.data.emailcheck));
            navigate('/');
          } else {
            localStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY, JSON.stringify(response.data.user));
            // Nếu không tìm thấy người dùng, chuyển hướng đến setavatar
            navigate('/');
          }
      
        } catch (error) {
          console.error('Login Error:', error);
        }
      });
  };
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { username, password } = values;
    if (username === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
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
              min="3"
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
          <div className="remember-forgot">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#" className="forgot-password">Forgot Password?</a>
          </div>
          <button type="submit" className="submit-btn">Log In</button>
          <div className="social-login">
            <p>Or login with</p>
            <div className="social-icons">
              <button type="button" onClick={() => handleLogin(ggProvider)} className="social-icon google">G</button>
              <button type="button" onClick={() => handleLogin(fbProvider)} className="social-icon facebook">f</button>
              <button type="button" className="social-icon twitter">t</button>
            </div>
          </div>
          <span className="switch-form">
            Don't have an account? <Link to="/register">Create One</Link>
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
    
    .remember-forgot {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .remember-me {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        
        input[type="checkbox"] {
          accent-color: var(--primary-color);
          width: auto;
        }
        
        label {
          color: var(--text-secondary);
          font-size: var(--font-sm);
        }
      }
      
      .forgot-password {
        color: var(--primary-light);
        font-size: var(--font-sm);
        text-decoration: none;
        transition: var(--transition-normal);
        
        &:hover {
          color: var(--primary-color);
          text-decoration: underline;
        }
      }
    }
    
    .social-login {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      margin-top: 0.5rem;
      
      p {
        color: var(--text-secondary);
        font-size: var(--font-sm);
        position: relative;
        width: 100%;
        text-align: center;
        
        &::before, &::after {
          content: "";
          position: absolute;
          top: 50%;
          width: 35%;
          height: 1px;
          background-color: var(--text-muted);
        }
        
        &::before {
          left: 0;
        }
        
        &::after {
          right: 0;
        }
      }
      
      .social-icons {
        display: flex;
        gap: 1rem;
        
        .social-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
          cursor: pointer;
          transition: var(--transition-normal);
          border: none;
          
          &:hover {
            transform: translateY(-3px);
          }
          
          &.google {
            background-color: #DB4437;
            color: white;
          }
          
          &.facebook {
            background-color: #4267B2;
            color: white;
          }
          
          &.twitter {
            background-color: #1DA1F2;
            color: white;
          }
        }
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

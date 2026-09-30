import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

import logo from '../assets/adanp-logo.jpg';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top } = containerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await fetch("http://localhost:8000/adanp-back/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setSuccessMsg(data.message);
        console.log('Login successful:', data.user);
        
        // Persist user session
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // RBAC Routing based on role returned from backend
        if (data.user?.role === 'admin_user') {
          navigate('/admin-dashboard');
        } else if (data.user?.role === 'non_members') {
          navigate('/non-member-dashboard');
        } else if (data.user?.role === 'members') {
          navigate('/member-dashboard');
        } else {
          navigate('/gallery-admin'); // Fallback
        }
      } else {
        setErrorMsg(data.message || "An error occurred during login.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrorMsg("Failed to connect to the backend server. Is it running?");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await fetch("http://localhost:8000/adanp-back/register.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ full_name: fullName, age, gender, email, password }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setSuccessMsg("Registration successful! You can now login.");
        setIsRegister(false); // Switch back to login
      } else {
        setErrorMsg(data.message || "An error occurred during registration.");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      setErrorMsg("Failed to connect to the backend server. Is it running?");
    }
  };

  return (

    <>
      <div
        className="login-container"
        ref={containerRef}
        onMouseMove={handleMouseMove}
      >
        {/* Starfall Background Animation */}
        <div className="starfall">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="falling-star"></div>
          ))}
        </div>

        <div className="login-card-wrapper">
          <div className="login-card">
            <div className="login-logo-header">
              <img src={logo} alt="ADANP Logo" className="navbar-logo-img" />
              <div className="navbar-logo-text">
                <strong className="navbar-logo-title">ADANP</strong>
                <span className="navbar-logo-subtitle">Association of Dermatology & Aesthetic Nurses of the Philippines</span>
              </div>
            </div>
            <h1 className="login-title">{isRegister ? "Register Account" : "Member Login"}</h1>
            {errorMsg && <div className="login-error-msg" style={{ color: '#ff4d4f', marginBottom: '1rem', fontSize: '14px', textAlign: 'center' }}>{errorMsg}</div>}
            {successMsg && <div className="login-success-msg" style={{ color: '#52c41a', marginBottom: '1rem', fontSize: '14px', textAlign: 'center' }}>{successMsg}</div>}
            
            {isRegister ? (
              <form onSubmit={handleRegister} className="login-form">
                <div className="login-input-group">
                  <input type="text" placeholder="Full Name" className="login-input" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>
                <div className="login-input-group">
                  <input type="number" placeholder="Age" className="login-input" value={age} onChange={(e) => setAge(e.target.value)} required />
                </div>
                <div className="login-input-group">
                  <select className="login-input" value={gender} onChange={(e) => setGender(e.target.value)} required>
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="login-input-group">
                  <input type="email" placeholder="Email" className="login-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="login-input-group">
                  <input type="password" placeholder="Password" className="login-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="login-btn">Register</button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="login-form">
                <div className="login-input-group">
                  <input
                    type="email"
                    placeholder="Email"
                    className="login-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="login-input-group">
                  <input
                    type="password"
                    placeholder="Password"
                    className="login-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="login-btn">Login</button>
                <p className="login-forgot-password">Forgot Password?</p>
              </form>
            )}

            <p className="login-toggle-link" style={{ textAlign: 'center', marginTop: '15px', display: 'block', cursor: 'pointer', color: '#1f4172', fontWeight: '500' }} onClick={() => { setIsRegister(!isRegister); setErrorMsg(''); setSuccessMsg(''); }}>
              {isRegister ? "Already have an account? Login here" : "Not a member? Register Now!"}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/Toast";
import Lottie from "lottie-react";
import robotAnimation from "../../animations/robot.json";

const LottieComponent = Lottie.default || Lottie;

const Register = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userName || !email || !password) {
      showToast("All fields are required", "error");
      return;
    }

    try {
      setLoading(true);
      await register(userName, email, password);
      showToast("Registration successful! Please login.", "success");
      navigate("/login");
    } catch (err) {
      showToast(err.response?.data?.message || "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container dual-column">
      <div className="auth-background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>
      
      <div className="auth-dual-wrapper glassmorphism animate-fade-in">
        <div className="auth-visual-column">
          <div className="visual-lottie-wrapper">
            <LottieComponent animationData={robotAnimation} loop={true} />
          </div>
          <h3>Join the Notes Space</h3>
          <p>Organize, collaborate, and remember your ideas in style.</p>
        </div>

        <div className="auth-form-column">
          <div className="auth-header">
            <h2>Create Account</h2>
            <p>Get started with your secure space</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                placeholder="John Doe"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="premium-btn auth-submit-btn"
              disabled={loading}
            >
              {loading ? <span className="btn-spinner"></span> : "Sign Up"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="auth-link">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

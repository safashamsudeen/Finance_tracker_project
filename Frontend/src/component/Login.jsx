import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../App.css"; // Import styles

export default function Login({ setUser }) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token); // Store token
        localStorage.setItem("user", JSON.stringify(data.user)); // Store user details
        setUser(data.user);
        navigate("/home"); // Redirect to home
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Something went wrong. Try again!");
    }
  };

  return (
    <div className="login-page">
      {/* Navbar with Expensio Branding & Dashboard Link */}
      <div className="navbar">
        <h1>Expensio</h1>
        <Link to="/" className="nav-dashboard">Home</Link>
      </div>

      {/* Login Box */}
      <div className="login-box">
        <h3>Login</h3>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input type="email" name="email" value={credentials.email} onChange={handleChange} required />

          <label>Password</label>
          <input type="password" name="password" value={credentials.password} onChange={handleChange} required />

          <button type="submit">Login</button>
        </form>

        {/* Links for Sign Up & Forgot Password */}
        <h5 className="auth-link">
          Don't have an account? <Link to="/signin" className="auth-link">Sign up</Link>
        </h5>
        <h5>
          <Link to="/forgot-password" className="auth-link">Forgot Password?</Link>
        </h5>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // React Router navigation
import "../App.css"; // Import styles

export default function Signin() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    age: "",
    address: "",
    state: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate(); // React Router navigation

  // Debugging: Log user state when it updates
  useEffect(() => {
    console.log("Updated User State:", user);
  }, [user]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "age" ? Number(value) : value;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.password !== user.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Signup Successful! Please log in.");
        navigate("/login");
      } else {
        alert(data.msg || "Signup failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Try again!");
    }
  };

  return (
    <div className="signin-container">
      <div className="navbar">
        <h1>Expensio</h1>
        <Link to="/" className="nav-dashboard">Home</Link>
      </div>
      <div className="signin-box">
        <h3>Sign Up</h3>
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input type="text" name="name" value={user.name} onChange={handleChange} required />

          <label>Email</label>
          <input type="email" name="email" value={user.email} onChange={handleChange} required />

          <label>Age</label>
          <input type="number" name="age" value={user.age} onChange={handleChange} required />

          <label>Address</label>
          <input type="text" name="address" value={user.address} onChange={handleChange} required />

          <label>State</label>
          <input type="text" name="state" value={user.state} onChange={handleChange} required />

          <label>Password</label>
          <input type="password" name="password" value={user.password} onChange={handleChange} required />

          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" value={user.confirmPassword} onChange={handleChange} required />

          <button type="submit">Sign Up</button>
        </form>

        <h5>
          Already have an account? <Link to="/login" className="auth-link">Log in</Link>
        </h5>
      </div>
    </div>
  );
}

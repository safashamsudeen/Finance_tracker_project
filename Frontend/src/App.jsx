import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./component/Home"; // Dashboard (after login)
import Dash from "./component/Dash"; // Landing Page (before login)
import TransactionForm from "./component/TransactionForm";
import TransactionList from "./component/TransactionList";
import Login from "./component/Login";
import Signin from "./component/Signin";
import SidebarLayout from "./component/SidebarLayout"; // Layout wrapper for sidebar pages
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/dashboard"; // Redirect to login
  };

  return (
    <Router>
      <Routes>
        {/* Landing Page with Navbar only */}
        <Route path="/" element={<Dash />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signin" element={<Signin />} />

        {/* Sidebar Layout for Logged-in Pages */}
        {user && (
          <Route element={<SidebarLayout handleLogout={handleLogout} />}>
            <Route path="/home" element={<Home user={user} />} />
            <Route path="/add-transaction" element={<TransactionForm />} />
            <Route path="/transaction-history" element={<TransactionList />} />
          </Route>
        )}

        {/* Redirect non-logged-in users */}
        {!user && <Route path="*" element={<Navigate to="/" />} />}
      </Routes>
    </Router>
    
  );
};
 {/* Footer */}


export default App;

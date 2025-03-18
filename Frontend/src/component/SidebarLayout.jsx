import React from "react";
import { Outlet, Link } from "react-router-dom";
import "../App.css";

const SidebarLayout = ({ handleLogout }) => {
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <nav className="sidebar">
        <h1 className="navbar">Expensio</h1><br /><br /><br />
      
        
        <ul className="nav flex-column">
           <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/home">Dasboard</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/add-transaction">Add Transaction</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/transaction-history">Transaction History</Link>
          </li>
          <li className="nav-item">
            <button className="btn btn-danger nav-link" onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default SidebarLayout;

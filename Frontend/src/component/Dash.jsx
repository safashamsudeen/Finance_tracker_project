import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

// Sample data for charts
const barChartData = {
  labels: ["Food", "Rent", "Entertainment", "Transport", "Other"],
  datasets: [
    {
      label: "Monthly Expenses (in $)",
      data: [400, 1200, 300, 150, 250],
      backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"],
      borderRadius: 5,
    },
  ],
};

const pieChartData = {
  labels: ["Savings", "Essentials", "Leisure"],
  datasets: [
    {
      data: [40, 50, 10],
      backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
      hoverOffset: 4,
    },
  ],
};

const Dash = () => {
  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
        <span className="navbar-brand">Expensio</span>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/signin">Sign Up</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">About</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Landing Page */}
      <div className="home-container">
        <motion.h2 className="text" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          Budget today, prosper tomorrow. <br />
        </motion.h2>
        <motion.p className="subtext" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, delay: 0.5 }}>
          Take control of your finances and plan for a secure future. <br />
        </motion.p>
        <motion.div className="cta-buttons" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1 }}>
          <Link to="/signin" className="btn btn-outline-light btn-lg">
            Get Started
          </Link>
          <Link to="/login" className="btn btn-outline-light btn-lg ms-3">
            Login
          </Link>
        </motion.div>
      </div>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <motion.h2 className="about-title" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          
            About Expensio
          </motion.h2>

          <motion.p
            className="about-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Expensio is your personal finance assistant that helps you manage your income and expenses efficiently.
            Track your transactions, analyze spending patterns, and stay financially organized—all in one place.
          </motion.p>

          <motion.div
            className="about-features"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <div className="feature">
              <h4>🔹 Track Expenses</h4>
              <p>Record and categorize your daily transactions effortlessly.</p>
            </div>
            <div className="feature">
              <h4>📊 Insights & Reports</h4>
              <p>Visualize your financial data with charts and reports.</p>
            </div>
            <div className="feature">
              <h4>🔒 Secure & Private</h4>
              <p>Your financial data is securely stored and protected.</p>
            </div>
          </motion.div>


          {/* Graph Section */}
          <motion.div className="graph-section mt-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.5 }}>
            <h3 className="text-center">Financial Insights</h3>
            <div className="row">
              <div className="col-md-6">
                <div className="chart-container">
                  <h5 className="text-center">Expense Categories</h5>
                  <Bar data={barChartData} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="chart-container">
                  <h5 className="text-center">Spending Distribution</h5>
                  <Pie data={pieChartData} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer bg-dark text-light text-center py-4">
        <div className="container">
          <p>&copy; 2025 Expensio. All rights reserved.</p>
          <p className="mt-2">
            <Link to="#" className="text-light">Privacy Policy</Link> | <Link to="#" className="text-light">Terms of Service</Link>
          </p>
        </div>
      </footer>
    </>
  );
};

export default Dash;

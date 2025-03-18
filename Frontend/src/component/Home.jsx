import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import "../Home.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

const Home = ({ user: propUser }) => {
  const [user, setUser] = useState(null);
  const [monthlyData, setMonthlyData] = useState({ labels: [], datasets: [] });
  const [dailyData, setDailyData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    // Fetch logged-in user from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else if (propUser) {
      setUser(propUser);
    }
  }, [propUser]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("⚠ No token found. User might be logged out.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        console.log("🔹 Fetched Transactions:", data);

        if (!Array.isArray(data) || data.length === 0) {
          console.warn("⚠ No transactions found. Using default chart data.");
          setLoading(false);
          return;
        }

        processChartData(data);
        calculateTotals(data);
      } catch (error) {
        console.error("❌ Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    const processChartData = (transactions) => {
      const monthlyTotals = {};
      const dailyTotals = {};

      transactions.forEach(({ type, amount, date }) => {
        const month = new Date(date).toLocaleString("default", { month: "short" });
        const day = new Date(date).toISOString().split("T")[0];

        if (!monthlyTotals[month]) monthlyTotals[month] = { Income: 0, Expense: 0 };
        if (!dailyTotals[day]) dailyTotals[day] = 0;

        if (type === "Income") {
          monthlyTotals[month].Income += Number(amount);
        } else {
          monthlyTotals[month].Expense += Number(amount);
          dailyTotals[day] += Number(amount);
        }
      });

      setMonthlyData({
        labels: Object.keys(monthlyTotals),
        datasets: [
          {
            label: "Income",
            data: Object.values(monthlyTotals).map((t) => t.Income),
            backgroundColor: "#4CAF50",
          },
          {
            label: "Expense",
            data: Object.values(monthlyTotals).map((t) => t.Expense),
            backgroundColor: "#FF5733",
          },
        ],
      });

      setDailyData({
        labels: Object.keys(dailyTotals),
        datasets: [
          {
            label: "Daily Expenses",
            data: Object.values(dailyTotals),
            borderColor: "#e74c3c",
            fill: false,
          },
        ],
      });
    };

    const calculateTotals = (transactions) => {
      let totalIncome = 0;
      let totalExpense = 0;

      transactions.forEach(({ type, amount }) => {
        if (type === "Income") {
          totalIncome += Number(amount);
        } else {
          totalExpense += Number(amount);
        }
      });

      setIncome(totalIncome);
      setExpense(totalExpense);
      setBalance(totalIncome - totalExpense);
    };

    fetchTransactions();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true } },
    plugins: { legend: { position: "top" } },
  };

  return (
    <div>
    <div className="home-container">
      {/* 🔹 Navbar with Welcome Message */}
      
      <div className="dashboard">
        {/* 🔹 Left Side - Balance Summary + Quick Access */}
        <div className="left-section">
          <div className="balance-box">
            <h3>Account Overview</h3>
            <div className="balance-details">
              <p><strong>Income:</strong> ₹ {income.toFixed(2)}</p>
              <p><strong>Expense:</strong> ₹ {expense.toFixed(2)}</p>
              <p><strong>Balance:</strong> ₹ {balance.toFixed(2)}</p>
            </div>
          </div>

          <div className="quick-access">
            <h3>Quick Access</h3>
            <div className="quick-buttons">
              <Link to="/add-transaction" className="quick-button income">New Income</Link>
              <Link to="/add-transaction" className="quick-button expense">New Expense</Link>
            </div>
          </div>
        </div>

        {/* 🔹 Right Side - Charts */}
        <div className="right-section">
          <div className="chart-box">
            <h4>Monthly Report</h4>
            {loading ? <p>Loading...</p> : <Bar data={monthlyData} options={chartOptions} />}
          </div>

          <div className="chart-box">
            <h4>Daily Expenses</h4>
            {loading ? <p>Loading...</p> : <Line data={dailyData} options={chartOptions} />}
          </div>
        </div>
      </div>
     
           
    </div>
    </div>
  );
};

export default Home;

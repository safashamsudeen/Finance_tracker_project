import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../App.css";
import "../index.css";

const TransactionForm = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const defaultType = queryParams.get("type") || "";

  const [transaction, setTransaction] = useState({
    type: defaultType,
    amount: "",
    category: "",
    date: "",
    description: "",
  });

  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found.");
        return;
      }

      fetch("http://localhost:5000/api/transactions", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setTransactions(data);
        })
        .catch((err) => console.error("Error fetching transactions:", err));
    }
  }, [user]);

  useEffect(() => {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((t) => {
      if (t.type === "Income") {
        totalIncome += Number(t.amount);
      } else if (t.type === "Expense") {
        totalExpense += Number(t.amount);
      }
    });

    setIncome(totalIncome);
    setExpense(totalExpense);
    setBalance(totalIncome - totalExpense);
  }, [transactions]);

  const handleChange = (e) => {
    setTransaction({ ...transaction, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!transaction.type || !transaction.amount || !transaction.date || !transaction.category) {
      alert("Please fill in all required fields!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found.");
        return;
      }

      const newTransaction = { ...transaction, amount: Number(transaction.amount) };
      
      const response = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTransaction),
      });

      if (!response.ok) throw new Error("Failed to add transaction");

      const savedTransaction = await response.json();

      setTransactions((prevTransactions) => [...prevTransactions, savedTransaction]);

      if (newTransaction.type === "Income") {
        setIncome((prevIncome) => prevIncome + newTransaction.amount);
        setBalance((prevBalance) => prevBalance + newTransaction.amount);
      } else if (newTransaction.type === "Expense") {
        setExpense((prevExpense) => prevExpense + newTransaction.amount);
        setIncome((prevIncome) => prevIncome - newTransaction.amount);
        setBalance((prevBalance) => prevBalance - newTransaction.amount);
      }

      setTransaction({ type: "", amount: "", category: "", date: "", description: "" });
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="transaction-summary">
        <div className="summary-card income-card">
          <h5>Income</h5>
          <h4>₹{income}</h4>
        </div>
        <div className="summary-card expense-card">
          <h5>Expense</h5>
          <h4>₹{expense}</h4>
        </div>
        <div className="summary-card balance-card">
          <h5>Balance</h5>
          <h4>₹{balance}</h4>
        </div>
      </div>

      <div className="transaction-form-container">
        <h3>Add Transaction</h3>
        <form onSubmit={handleSubmit}>
          <label>Type</label>
          <select name="type" value={transaction.type} onChange={handleChange} required>
            <option value="">Select Type</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>

          <label>Amount</label>
          <input type="number" name="amount" value={transaction.amount} onChange={handleChange} required />

          <label>Category</label>
          <input type="text" name="category" value={transaction.category} onChange={handleChange} required />

          <label>Date</label>
          <input type="date" name="date" value={transaction.date} onChange={handleChange} required />

          <label>Description</label>
          <input type="text" name="description" value={transaction.description} onChange={handleChange} />

          <button type="submit">Add Transaction</button>
        </form>
      </div>
      

    </div>
    
  );
};

export default TransactionForm;

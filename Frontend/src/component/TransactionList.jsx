import { useEffect, useState } from "react";
import "../App.css";
import "../index.css";

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);

  // Load logged-in user
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Fetch only the logged-in user's transactions
  useEffect(() => {
    if (user) {
      // Get token from localStorage
      const token = localStorage.getItem("token");

      fetch("http://localhost:5000/api/transactions", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Include token in header
        },
      })
        .then((res) => res.json())
        .then((data) => {
          const userTransactions = data.filter(
            (transaction) => transaction.userId === user.id
          );
          setTransactions(userTransactions);
        })
        .catch((err) => console.error("Error fetching transactions:", err));
    }
  }, [user]);

  return (
    <div className="transaction-list-container">
      <div className="transaction-list-box">
        <h3>Your Transactions</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Date</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <tr
                  key={index}
                  className={
                    transaction.type === "Income" ? "table-success" : "table-danger"
                  }
                >
                  <td>{transaction.type}</td>
                  <td>₹{transaction.amount}</td>
                  <td>{transaction.category}</td>
                  <td>{transaction.date}</td>
                  <td>{transaction.description || "—"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;

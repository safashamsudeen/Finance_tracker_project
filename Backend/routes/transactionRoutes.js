import express from "express";
import Transaction from "../models/Transaction.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Fetch Transactions
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized access" });

    console.log(`🔍 Fetching transactions for user: ${userId}`);

    const transactions = await Transaction.find({ userId }).sort({ date: -1 });

    console.log(`🔹 Found ${transactions.length} transactions for user: ${userId}`);
    res.status(200).json(transactions);
  } catch (error) {
    console.error("❌ Error fetching transactions:", error.message);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// ✅ Add Transaction
router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log("🔹 Incoming transaction data:", req.body);

    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized access" });

    console.log(`🔍 Saving transaction for user: ${userId}`);

    const { type, amount, category, date, description } = req.body;

    if (!type || !amount || !category || !date) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Amount must be a positive number" });
    }

    const newTransaction = new Transaction({
      userId,
      type,
      amount,
      category,
      date: new Date(date),
      description: description || "",
    });

    const savedTransaction = await newTransaction.save();
    console.log("✅ Transaction saved successfully:", savedTransaction);

    res.status(201).json(savedTransaction);
  } catch (error) {
    console.error("❌ Error saving transaction:", error.message);
    res.status(500).json({ error: "Failed to save transaction" });
  }
});

export default router;

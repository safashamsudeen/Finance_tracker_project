import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { 
    type: String, 
    enum: ["Income", "Expense"], 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true, 
    min: [0.01, "Amount must be a positive number"] 
  },
  category: { type: String, required: true },
  date: { 
    type: Date, 
    required: true, 
    default: Date.now
  },
  description: { type: String, default: "" },
});

transactionSchema.index({ date: -1 });

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;

import db from "../db.js";
import { convertToNGN } from "../services/currencyService.js";

export const createTransaction = async (req, res) => {
  const { type, amount, category, description, date, currency } = req.body;

  let finalAmount = amount;

  if (currency && currency !== "NGN") {
    finalAmount = await convertToNGN(amount, currency);
  }

  const result = db.prepare(`
    INSERT INTO transactions 
    (user_id, type, amount, category, description, date)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(req.user.id, type, finalAmount, category, description, date);

  res.status(201).json({ id: result.lastInsertRowid });
};

export const getTransactions = (req, res) => {
  const { category, month, type } = req.query;

  let query = "SELECT * FROM transactions WHERE user_id = ?";
  const params = [req.user.id];

  if (category) {
    query += " AND category = ?";
    params.push(category);
  }

  if (type) {
    query += " AND type = ?";
    params.push(type);
  }

  if (month) {
    query += " AND date LIKE ?";
    params.push(`${month}%`);
  }

  const rows = db.prepare(query).all(...params);
  res.json(rows);
};

export const deleteTransaction = (req, res) => {
  db.prepare("DELETE FROM transactions WHERE id = ? AND user_id = ?")
    .run(req.params.id, req.user.id);

  res.json({ message: "Deleted" });
};
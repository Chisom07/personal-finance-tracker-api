import db from "../db.js";

export const getSummary = (req, res) => {
  const { month } = req.query;

  const like = `${month}%`;

  const income = db.prepare(`
    SELECT SUM(amount) as total FROM transactions
    WHERE user_id = ? AND type='income' AND date LIKE ?
  `).get(req.user.id, like).total || 0;

  const expenses = db.prepare(`
    SELECT SUM(amount) as total FROM transactions
    WHERE user_id = ? AND type='expense' AND date LIKE ?
  `).get(req.user.id, like).total || 0;

  const categories = db.prepare(`
    SELECT category, SUM(amount) as total
    FROM transactions
    WHERE user_id = ? AND date LIKE ?
    GROUP BY category
    ORDER BY total DESC
    LIMIT 5
  `).all(req.user.id, like);

  res.json({
    income,
    expenses,
    balance: income - expenses,
    topCategories: categories
  });
};
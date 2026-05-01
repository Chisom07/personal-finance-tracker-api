import express from "express";
import crypto from "crypto";
import db from "../db.js";

const router = express.Router();

router.post("/paystack", express.json(), (req, res) => {
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash !== req.headers["x-paystack-signature"]) {
    return res.sendStatus(401);
  }

  const event = req.body;

  if (event.event === "charge.success") {
    const amount = event.data.amount / 100;

    db.prepare(`
      INSERT INTO transactions (user_id, type, amount, category, description, date)
      VALUES (?, 'income', ?, 'Paystack', 'Payment received', ?)
    `).run(1, amount, new Date().toISOString());
  }

  res.sendStatus(200);
});

export default router;
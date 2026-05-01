import db from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  try {
    const result = db
      .prepare("INSERT INTO users (email, password) VALUES (?, ?)")
      .run(email, hash);

    res.status(201).json({ message: "User created" });
  } catch {
    res.status(400).json({ message: "User already exists" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email);

  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);

  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

  res.json({ token });
};
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());            // allows frontend (React) to access backend
app.use(express.json());    // parses JSON request bodies

// Dummy user data
let users = [
  { id: 1, name: "Raju" },
  { id: 2, name: "Dilip" }
];

// ✅ GET all users
app.get("/users", (req, res) => {
  res.json(users);
});

// ✅ POST new user
app.post("/users", (req, res) => {
  const { name } = req.body;
  const newUser = { id: users.length + 1, name };
  users.push(newUser);
  res.json(newUser);
});

// Start server
app.listen(PORT, () => {
  console.log("🚀 Server running at http://localhost:5000");
});

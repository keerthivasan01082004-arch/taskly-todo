const express = require("express");
const cors = require("cors");
const todoRoutes = require("./routes/todos");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/todos", todoRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Todo API is running", version: "1.0.0" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

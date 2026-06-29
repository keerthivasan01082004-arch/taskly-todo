const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "../data/todos.json");

const ensureDataFile = () => {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([]));
};

const readTodos = () => {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
};

const writeTodos = (todos) => {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
};

module.exports = { readTodos, writeTodos };

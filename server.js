const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json()); // parse JSON

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// --- MONGODB SETUP ---
const uri = "mongodb+srv://gamersnake8996:POODLENOODLE8996@users.11dwh3e.mongodb.net/?appName=chatApp";
const client = new MongoClient(uri);
let usersCollection;

async function connectDB() {
  try {
    await client.connect();
    const db = client.db("chatApp");
    usersCollection = db.collection("users");
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error(err);
  }
}
connectDB();

// --- SIGNUP ---
app.post("/signup", async (req, res) => {
  if (!usersCollection) return res.status(500).json({ message: "DB not ready" });
  const { username, password } = req.body;
  const exists = await usersCollection.findOne({ username });
  if (exists) return res.json({ message: "Username already taken." });
  await usersCollection.insertOne({ username, password });
  res.json({ message: "Account created successfully." });
});

// --- LOGIN ---
app.post("/login", async (req, res) => {
  if (!usersCollection) return res.status(500).json({ message: "DB not ready" });
  const { username, password } = req.body;
  const user = await usersCollection.findOne({ username, password });
  if (!user) return res.json({ message: "Invalid credentials." });
  res.json({ message: "Logged in!" });
});

// --- CHAT SOCKET.IO ---
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('chat message', (msg) => {
    console.log('Message: ' + msg);
    io.emit('chat message', msg);
  });
  socket.on('disconnect', () => console.log('A user disconnected'));
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

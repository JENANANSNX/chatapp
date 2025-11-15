const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware to parse JSON
app.use(express.json());

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// --- MONGODB SETUP ---
const uri = "mongodb+srv://gamersnake8996:POODLENOODLE8996@users.11dwh3e.mongodb.net/?appName=Users";
const client = new MongoClient(uri);
let usersCollection;

async function connectDB() {
  try {
    await client.connect();
    const db = client.db("chatApp"); // <-- database name
    usersCollection = db.collection("users"); // <-- collection name
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error(err);
  }
}

connectDB();

// --- SIGNUP ROUTE ---
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  const exists = await usersCollection.findOne({ username });
  if (exists) {
    return res.json({ message: "Username already taken." });
  }

  await usersCollection.insertOne({ username, password });
  res.json({ message: "Account created successfully." });
});

// --- LOGIN ROUTE ---
app.post("/login", async (req, res) => {
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

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start server
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

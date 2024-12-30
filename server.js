import express from 'express';
import pkg from 'pg';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs'
dotenv.config();

const { Pool } = pkg;
// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL client setup
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// POST route to register a new user
app.post('/register', async (req, res) => {
  const {
    userName,
    userEmail,
    userPassword,
    userStatus,
    balanceAmount,
    totalPoints,
    memberLevel,
    memberExpired,
    lastUsedDate,
    trafficUsed,
    registeredIP,
    deviceNumber,
  } = req.body;

  try {
    const emailCheck = await pool.query('SELECT * FROM users WHERE userEmail = $1', [userEmail]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const usernameCheck = await pool.query('SELECT * FROM users WHERE userName = $1', [userName]);
    if (usernameCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    const result = await pool.query(
      `INSERT INTO users (
        userName, userEmail, userPassword, userStatus, balanceAmount, totalPoints,
        memberLevel, memberExpired, lastUsedDate, trafficUsed, registeredIP, deviceNumber
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [
        userName,
        userEmail,
        userPassword,
        userStatus || "Normal",
        balanceAmount || 0,
        totalPoints || 0,
        memberLevel || null,
        memberExpired || null,
        lastUsedDate || null,
        trafficUsed || 0,
        registeredIP || null,
        deviceNumber || null,
      ]
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error registering user' });
  }
});

app.post('/login', async (req, res) => {
  const { 
    userEmail, 
    userPassword 
  } = req.body;
  console.log("Request:", req.body)


  try {
    const emailResult = await pool.query('SELECT * FROM users WHERE userEmail = $1', [userEmail]);
    console.log('Result: ',emailResult.rows)

    if (emailResult.rows.length === 0) {
      return res.status(401).json({ error: "User does not exist" });
    }

    const user = emailResult.rows[0];

    //verify password                                     //need to small letter, json file pull out small letter QAQ
    const isMatch = await bcrypt.compare(userPassword, user.userpassword); // Compare with stored hash
    if (!isMatch) {
        return res.status(401).json({ error: 'Invalid password' });
    } else{
      res.status(200).json({ message: "Login successful", user });
    }

    //normal way if no bcrypt
    // if (user.userPassword === password) {
    //   res.status(200).json({ message: "Login successful", user });
    // } else {
    //   res.status(401).json({ error: "Invalid username or password" });
    // }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred during login" });
  }
});

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.status(200).json(result.rows); // Return the users' data as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

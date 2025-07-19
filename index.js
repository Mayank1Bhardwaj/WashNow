const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');


const app = express();
const port = 3000;


// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the public directory


// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root', // your username
    password: '0503', // your password
    database: 'laundry_service' // your database name
});


// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('MySQL connection error:', err);
        return;
    }
    console.log('MySQL Connected...');
});


// Sample route for user registration
// app.post('/register', (req, res) => {
//     const { username, password } = req.body;
//     db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err, result) => {
        
//         if  (err) {
//             console.log( err)
//             return res.status(500).json({ error: 'User registration failed' });
//         }
//         res.status(201).json({ message: 'User registered successfully' });
//     });
// });

app.post('/register', (req, res) => {
    console.log('Request body:', req.body);  // Log the request body to check if it contains the correct data
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';

    db.query(query, [username, password], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'User registration failed' });
        }
        res.status(201).json({ message: 'User registered successfully' });
    });
});


// Sample route for user login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Login failed' });
        }
        if (results.length > 0) {
            res.status(200).json({ message: 'Login successful', userId: results[0].id });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    });
});


// Sample route for scheduling a pickup
app.post('/schedule', (req, res) => {
    const { userId, serviceType, pickupDate, pickupLocation } = req.body;
    db.query('INSERT INTO schedules (user_id, service_type, pickup_date, pickup_location) VALUES (?, ?, ?, ?)',
    [userId, serviceType, pickupDate, pickupLocation], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to schedule pickup' });
        }
        res.status(201).json({ message: 'Pickup scheduled successfully' });
    });
});


// Serve the main HTML file when accessing the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Start the server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

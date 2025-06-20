var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const dogsRouter = require('./routes/dogs');
const walkrequestsRouter = require('./routes/walkrequests');
const walkersRouter = require('./routes/walkers');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let db;

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: ''
    });

    await connection.query('CREATE DATABASE IF NOT EXISTS DogWalkService');
    await connection.end();

    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'DogWalkService'
    });

    await db.query(`
      CREATE TABLE IF NOT EXISTS Users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('owner', 'walker') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS Dogs (
        dog_id INT AUTO_INCREMENT PRIMARY KEY,
        owner_id INT NOT NULL,
        name VARCHAR(50) NOT NULL,
        size ENUM('small', 'medium', 'large') NOT NULL,
        FOREIGN KEY (owner_id) REFERENCES Users(user_id)
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS WalkRequests (
        request_id INT AUTO_INCREMENT PRIMARY KEY,
        dog_id INT NOT NULL,
        requested_time DATETIME NOT NULL,
        duration_minutes INT NOT NULL,
        location VARCHAR(255) NOT NULL,
        status ENUM('open', 'accepted', 'completed', 'cancelled') DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (dog_id) REFERENCES Dogs(dog_id)
      )
    `);

    const [users] = await db.query('SELECT COUNT(*) AS count FROM Users');
    if (users[0].count === 0) {
      await db.query(`
        INSERT INTO Users (username, email, password_hash, role) VALUES
        ('alice123', 'alice@example.com', 'hashed123', 'owner'),
        ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
        ('carol123', 'carol@example.com', 'hashed789', 'owner'),
        ('Brian', 'Brian@example.com', 'hashed416', 'owner'),
        ('Arrebol', 'Arrebol@example.com', 'hashed101', 'walker')
      `);

      await db.query(`
        INSERT INTO Dogs (owner_id, name, size) VALUES
        (1, 'Max', 'medium'),
        (3, 'Bella', 'small'),
        (4, 'Alex', 'medium'),
        (5, 'Biga', 'large'),
        (4, 'Acan', 'small')
      `);

      await db.query(`
        INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) VALUES
        (1, '2025-06-10 08:00:00', 30, 'Parklands', 'open'),
        (2, '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted'),
        (3, '2025-06-10 10:00:00', 45, 'Torrens River', 'accepted'),
        (4, '2025-06-12 09:00:00', 30, 'Botanic Garden', 'cancelled'),
        (5, '2025-06-13 11:00:00', 60, 'North terrace', 'completed')
      `);
    }

    console.log('Database DogWalkService initialized successfully');
  } catch (err) {
    console.error('Failed to initialize database.', err.message);
  }
})();

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/dogs', dogsRouter);
app.use('/api/walkrequests', walkrequestsRouter);
app.use('/api/walkers', walkersRouter);

module.exports = app;

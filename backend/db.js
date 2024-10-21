const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // change this to your MySQL user
    database: 'task_management_system', // your database name
});

db.connect(err => {
    if (err) {
        console.error('Database connection error:', err);
        return;
    }
    console.log('Connected to MySQL');
});

module.exports = db;

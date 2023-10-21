

const mysql = require('mysql2')

const dotenv = require('dotenv')

console.log(__dirname + '/../.env')

dotenv.config({ path: __dirname + '/../.env' });


const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

async function checkDatabaseConnection() {
    try {
        // Attempt to get a connection from the pool and execute a query
        const connection = await pool.getConnection();
        await connection.query('SELECT 1');
        connection.release(); // Release the connection back to the pool
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
    }
}

// Call the function to check the database connection
checkDatabaseConnection();


module.exports = { pool }
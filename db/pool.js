const { Pool } = require("pg");

const adminPool = new Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    max: 5,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 10000
});

const pool = new Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_SANHANGHOA_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    max: 5,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 10000
});


module.exports = { pool, adminPool };

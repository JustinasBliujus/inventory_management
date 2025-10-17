import mysql from 'mysql2'
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function getUsers() {
    const [rows] = await pool.query(`
        SELECT name,surname,email,status,is_admin,last_login
        FROM users
        ORDER BY last_login DESC
        `
    );
    return rows;
}

export async function getUser(id){
    const [rows] = await pool.query(`
        SELECT *
        FROM users
        WHERE id = ?
        `,[id]);
    return rows[0];
}

export async function updateLoginTime(email){
    await pool.query(`
        UPDATE users
        SET last_login = NOW()
        WHERE email = ?
        `,[email]);
}

export async function blockUsers(emails) {
    if (!emails || emails.length === 0) return;

    const sql = `UPDATE users
    SET prev_status = CASE 
                        WHEN status IN ('unverified','active') THEN status 
                        ELSE prev_status 
                     END,
        status = 'blocked'
    WHERE email IN (?)`;
    await pool.query(sql, [emails]);
}

export async function unblockUsers(emails) {
    if (!emails || emails.length === 0) return;

    const sql = `
        UPDATE users
        SET status = prev_status
        WHERE email IN (?)`;
    
    await pool.query(sql, [emails]);
}

export async function promoteUsers(emails) {
    if (!emails || emails.length === 0) return;

    const sql = `
        UPDATE users
        SET is_admin = true
        WHERE email IN (?)`;
    
    await pool.query(sql, [emails]);
}

export async function demoteUsers(emails) {
    if (!emails || emails.length === 0) return;

    const sql = `
        UPDATE users
        SET is_admin = false
        WHERE email IN (?)`;
    
    await pool.query(sql, [emails]);
}

export async function verifyUser(email) {
    const sql = `UPDATE users SET prev_status = 'verified', status = 'verified' WHERE email = ?`;
    await pool.query(sql, [email]);
}

export async function getUserByEmail(email) {
    const sql = `
        SELECT * FROM users
        WHERE email = ?
    `;
    const [rows] = await pool.query(sql, [email]);
    return rows[0];
}
export async function deleteUsers(emails){
    const [rows] = await pool.query(`
        DELETE
        FROM users
        WHERE email IN (?)
        `,[emails]);
    return rows.affectedRows;
}

export async function findUserByToken(verification_token){
    const [rows] = await pool.query(`
        SELECT *
        FROM users
        WHERE verification_token = ?
        `,[verification_token]);
    return rows[0];
}
export async function deleteUnverified(){
    const [rows] = await pool.query(`
        DELETE
        FROM users
        WHERE status = 'unverified'
        `);
    return rows.affectedRows;
}
export async function createUser(name,surname,password,email,verification_token){
    const [result] = await pool.query(`
        INSERT INTO users(name,surname,password,email,verification_token)
        VALUES (?, ?, ?, ?, ?)
        `,[name,surname,password,email,verification_token]);
    return getUser(result.insertId);
}
export async function createUserGoogle(name,surname,email){
    const [result] = await pool.query(`
        INSERT INTO users(name,surname,email,google,status,prev_status)
        VALUES (?, ?, ?, ?, ?, ?)
        `,[name,surname,email, true, 'verified', 'verified']);
    return getUser(result.insertId);
}
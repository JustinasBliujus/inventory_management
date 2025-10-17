import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

export async function createDatabase() {
    // Connect without specifying database first
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD
    });

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.MYSQL_DATABASE}\`;`);
    await connection.end();

    // Create pool connected to the database
    const pool = mysql.createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    });

    // =====================
    // USERS
    // =====================
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            surname VARCHAR(50) NOT NULL,
            password VARCHAR(255) DEFAULT NULL,
            email VARCHAR(100) NOT NULL,
            last_login DATETIME NULL,
            status ENUM('unverified', 'verified', 'blocked') NOT NULL DEFAULT 'unverified',
            prev_status ENUM('unverified', 'verified') DEFAULT 'unverified',
            verification_token VARCHAR(255) DEFAULT NULL,
            created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            is_admin BOOL DEFAULT TRUE,
            google BOOL DEFAULT FALSE,
            facebook BOOL DEFAULT FALSE,
            UNIQUE INDEX index_email (email)
        );
    `);

    // =====================
    // INVENTORIES
    // =====================
    await pool.query(`
        CREATE TABLE IF NOT EXISTS inventories (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            -- Custom single-line fields
            custom_line1_state BOOLEAN DEFAULT FALSE,
            custom_line1_name VARCHAR(255),
            custom_line1_desc VARCHAR(70),
            custom_line1_show BOOLEAN DEFAULT FALSE,
            custom_line2_state BOOLEAN DEFAULT FALSE,
            custom_line2_name VARCHAR(255),
            custom_line2_desc VARCHAR(70),
            custom_line2_show BOOLEAN DEFAULT FALSE,
            custom_line3_state BOOLEAN DEFAULT FALSE,
            custom_line3_name VARCHAR(255),
            custom_line3_desc VARCHAR(70),
            custom_line3_show BOOLEAN DEFAULT FALSE,

            -- Custom multi-line fields
            custom_multiline1_state BOOLEAN DEFAULT FALSE,
            custom_multiline1_name VARCHAR(255),
            custom_multiline1_desc VARCHAR(70),
            custom_multiline1_show BOOLEAN DEFAULT FALSE,
            custom_multiline2_state BOOLEAN DEFAULT FALSE,
            custom_multiline2_name VARCHAR(255),
            custom_multiline2_desc VARCHAR(70),
            custom_multiline2_show BOOLEAN DEFAULT FALSE,
            custom_multiline3_state BOOLEAN DEFAULT FALSE,
            custom_multiline3_name VARCHAR(255),
            custom_multiline3_desc VARCHAR(70),
            custom_multiline3_show BOOLEAN DEFAULT FALSE,

            -- Custom number fields
            custom_number1_state BOOLEAN DEFAULT FALSE,
            custom_number1_name VARCHAR(255),
            custom_number1_desc VARCHAR(70),
            custom_number1_show BOOLEAN DEFAULT FALSE,
            custom_number2_state BOOLEAN DEFAULT FALSE,
            custom_number2_name VARCHAR(255),
            custom_number2_desc VARCHAR(70),
            custom_number2_show BOOLEAN DEFAULT FALSE,
            custom_number3_state BOOLEAN DEFAULT FALSE,
            custom_number3_name VARCHAR(255),
            custom_number3_desc VARCHAR(70),
            custom_number3_show BOOLEAN DEFAULT FALSE,

            -- Custom URL fields
            custom_url1_state BOOLEAN DEFAULT FALSE,
            custom_url1_name VARCHAR(255),
            custom_url1_desc VARCHAR(70),
            custom_url1_show BOOLEAN DEFAULT FALSE,
            custom_url2_state BOOLEAN DEFAULT FALSE,
            custom_url2_name VARCHAR(255),
            custom_url2_desc VARCHAR(70),
            custom_url2_show BOOLEAN DEFAULT FALSE,
            custom_url3_state BOOLEAN DEFAULT FALSE,
            custom_url3_name VARCHAR(255),
            custom_url3_desc VARCHAR(70),
            custom_url3_show BOOLEAN DEFAULT FALSE,

            -- Custom boolean fields
            custom_bool1_state BOOLEAN DEFAULT FALSE,
            custom_bool1_name VARCHAR(255),
            custom_bool1_desc VARCHAR(70),
            custom_bool1_show BOOLEAN DEFAULT FALSE,
            custom_bool2_state BOOLEAN DEFAULT FALSE,
            custom_bool2_name VARCHAR(255),
            custom_bool2_desc VARCHAR(70),
            custom_bool2_show BOOLEAN DEFAULT FALSE,
            custom_bool3_state BOOLEAN DEFAULT FALSE,
            custom_bool3_name VARCHAR(255),
            custom_bool3_desc VARCHAR(70),
            custom_bool3_show BOOLEAN DEFAULT FALSE,

            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `);

    // =====================
    // INVENTORY EDITORS (many-to-many)
    // =====================
    await pool.query(`
        CREATE TABLE IF NOT EXISTS inventory_editors (
            inventory_id BIGINT UNSIGNED NOT NULL,
            user_id INT NOT NULL,
            PRIMARY KEY (inventory_id, user_id),
            FOREIGN KEY (inventory_id) REFERENCES inventories(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `);

    // =====================
    // ITEMS
    // =====================
    await pool.query(`
        CREATE TABLE IF NOT EXISTS items (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            inventory_id BIGINT UNSIGNED NOT NULL,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            quantity INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (inventory_id) REFERENCES inventories(id) ON DELETE CASCADE
        );
    `);

    // =====================
    // ITEM CUSTOM FIELDS
    // =====================
    await pool.query(`
        CREATE TABLE IF NOT EXISTS item_custom_fields (
            item_id BIGINT UNSIGNED NOT NULL,
            field_name VARCHAR(255) NOT NULL,
            field_value TEXT,
            PRIMARY KEY (item_id, field_name),
            FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
        );
    `);

    console.log("Database and all tables created successfully.");
}

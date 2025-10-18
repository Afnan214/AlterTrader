// server/db/users.js
import { pool } from "./pool.js";

/**
 * Create a new user
 */
export async function createUser(username, email, balance = 0) {
    const query = `
    INSERT INTO users (username, email, balance)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
    const values = [username, email, balance];

    try {
        const { rows } = await pool.query(query, values);
        return rows[0];
    } catch (err) {
        console.error("Error creating user:", err);
        throw err;
    }
}

/**
 * Get all users
 */
export async function getAllUsers() {
    const query = `SELECT * FROM users ORDER BY id ASC;`;

    try {
        const { rows } = await pool.query(query);
        return rows;
    } catch (err) {
        console.error("Error fetching users:", err);
        throw err;
    }
}

/**
 * Get a single user by ID
 */
export async function getUserById(userId) {
    const query = `SELECT * FROM users WHERE id = $1;`;
    const values = [userId];

    try {
        const { rows } = await pool.query(query, values);
        return rows[0] || null;
    } catch (err) {
        console.error("Error fetching user:", err);
        throw err;
    }
}

/**
 * Update user balance
 */
export async function updateUserBalance(userId, newBalance) {
    const query = `
    UPDATE users
    SET balance = $1
    WHERE id = $2
    RETURNING *;
  `;
    const values = [newBalance, userId];

    try {
        const { rows } = await pool.query(query, values);
        return rows[0];
    } catch (err) {
        console.error("Error updating balance:", err);
        throw err;
    }
}

/**
 * Delete a user
 */
export async function deleteUser(userId) {
    const query = `DELETE FROM users WHERE id = $1 RETURNING *;`;
    const values = [userId];

    try {
        const { rows } = await pool.query(query, values);
        return rows[0];
    } catch (err) {
        console.error("Error deleting user:", err);
        throw err;
    }
}

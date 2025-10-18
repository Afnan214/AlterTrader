// server/db/users.js
import { pool } from "../postgres.js";

/**
 * Create a new user
 * @param {string} id - Firebase UID (Primary Key)
 * @param {string|null} username - Optional username
 * @param {string} email - User email
 * @param {number} balance - Initial balance
 */
export async function createUser(id, username = null, email, balance = 0) {
    const query = `
    INSERT INTO "Users" (id, username, email, balance, "createdAt", "updatedAt")
    VALUES ($1, $2, $3, $4, NOW(), NOW())
    RETURNING *;
  `;
    const values = [id, username, email, balance];
    console.log("Creating user with ID:", id);
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
    const query = `SELECT * FROM "Users" ORDER BY "createdAt" DESC;`;

    try {
        const { rows } = await pool.query(query);
        return rows;
    } catch (err) {
        console.error("Error fetching users:", err);
        throw err;
    }
}

/**
 * Get a single user by ID (Firebase UID)
 */
export async function getUserById(userId) {
    const query = `SELECT * FROM "Users" WHERE id = $1;`;
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
    UPDATE "Users"
    SET balance = $1, "updatedAt" = NOW()
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
    const query = `DELETE FROM "Users" WHERE id = $1 RETURNING *;`;
    const values = [userId];

    try {
        const { rows } = await pool.query(query, values);
        return rows[0];
    } catch (err) {
        console.error("Error deleting user:", err);
        throw err;
    }
}

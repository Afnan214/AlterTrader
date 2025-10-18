// server/db/alerts.js
import { pool } from "./postgresSetup.js";
const alertsTableName = "alerts";

/**
 * Get all alerts for a specific user (Firebase UID)
 */
export async function getAlertsFromUser(userId) {
    try {
        const res = await pool.query(
            `SELECT * FROM ${alertsTableName} WHERE user_id = $1 ORDER BY id DESC;`,
            [userId]
        );
        return res.rows;
    } catch (error) {
        console.error("Error executing query", error.stack);
        throw error;
    }
}

export async function getAllAlerts() {
    try {
        const res = await pool.query(`SELECT * FROM ${alertsTableName}`);
        return res.rows;
    } catch (error) {
        console.error("Error executing query", error.stack);
        throw error;
    }
}

/**
 * Add a new alert for a user
 */
export async function addAlert(alert, userId) {
    try {
        const res = await pool.query(
            `INSERT INTO ${alertsTableName} (alert, user_id) VALUES ($1, $2) RETURNING *;`,
            [alert, userId]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error.stack);
        throw error;
    }
}

/**
 * Edit an existing alert
 */
export async function editAlert(alertId, alertText, userId) {
    try {
        const res = await pool.query(
            `UPDATE ${alertsTableName}
       SET alert = $1
       WHERE id = $2 AND user_id = $3
       RETURNING *;`,
            [alertText, alertId, userId]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error.stack);
        throw error;
    }
}

/**
 * Delete an alert
 */
export async function deleteAlert(alertId, userId) {
    try {
        const res = await pool.query(
            `DELETE FROM ${alertsTableName}
       WHERE id = $1 AND user_id = $2
       RETURNING *;`,
            [alertId, userId]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error.stack);
        throw error;
    }
}

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

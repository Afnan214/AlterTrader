import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const POSTGRESQL_USER = process.env.POSTGRESQL_USER;
const POSTGRESQL_HOST = process.env.POSTGRESQL_HOST;
const POSTGRESQL_DB = process.env.POSTGRESQL_DB;
const POSTGRESQL_PASSWORD = process.env.POSTGRESQL_PASSWORD;
const POSTGRESQL_PORT = process.env.POSTGRESQL_PORT;

const { Pool } = pg;

const pool = new Pool({
  user: POSTGRESQL_USER,
  host: POSTGRESQL_HOST,
  database: POSTGRESQL_DB,
  password: POSTGRESQL_PASSWORD,
  port: POSTGRESQL_PORT,
  max: 20,
  idleTimeoutMillis: 30000,
});

export async function getUUIDByID(id) {
  const tableName = "numid";
  try {
    const res = await pool.query(`SELECT uid FROM ${tableName} WHERE id = $1`, [
      id,
    ]);
    console.log("----");
    console.log(res);
    console.log("----------");
    console.log(res.rows);
    console.log(res.rows.length === 0);
    console.log("----");

    return res;
  } catch (error) {
    console.error("Error executing query", error.stack);
  }
}

const alertsTableName = "alerts";

export async function getData() {
  const res = await pool.query(`SELECT * FROM ${alertsTableName}`);
  console.log(res.rows);
}

export async function addAlert(alert) {
  const res = await pool.query(
    `INSERT INTO ${alertsTableName} (alert, user_id) VALUES ($1, $2)`,
    [alert, 1]
  );

  console.log(res);
}

// getData();
// addAlert("test123");

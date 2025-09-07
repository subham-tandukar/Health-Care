import { createPool } from "mysql2/promise";

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

// Validate environment variables
if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
  throw new Error("Missing required database environment variables");
}

// Extend globalThis to include mysqlPool (Next.js specific for hot reloads)
let pool;

// Reuse pool in development (avoid creating multiple pools with hot reload)
if (!global.mysqlPool) {
  global.mysqlPool = createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 60000,
    multipleStatements: false, // for security
    dateStrings: true,
  });
}

pool = global.mysqlPool;

// Utility query function
export async function db(query, params = []) {
  try {
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    console.error("Database query failed:", error);
    throw new Error(`Database query failed: ${error.message}`);
  }
}

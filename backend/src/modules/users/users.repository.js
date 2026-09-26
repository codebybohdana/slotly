import pool from "../../db/index.js";

const findAllUsers = async () => {
  const result = await pool.query("SELECT id, email, created_at FROM users");

  return result.rows;
};

export { findAllUsers };

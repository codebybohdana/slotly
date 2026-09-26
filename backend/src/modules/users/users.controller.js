import { findAllUsers } from "./users.repository.js";

const getUsers = async (req, res) => {
  const users = await findAllUsers();

  res.json(users);
};

export { getUsers };
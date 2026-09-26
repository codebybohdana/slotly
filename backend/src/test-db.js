import "dotenv/config";

import { findAllUsers } from "./modules/users/users.repository.js";

const test = async () => {
  const users = await findAllUsers();

  console.log(users);
};

test();

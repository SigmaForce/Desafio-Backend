import { env } from "@/env";
import bcryptjs from "bcryptjs";

async function hash(password: string) {
  const rounds = getNumberOfRounds();
  return await bcryptjs.hash(password, rounds);
}

function getNumberOfRounds() {
  return env.NODE_ENV === "production" ? 14 : 1;
}

async function compare(providedPassword: string, storedPassword: string) {
  return await bcryptjs.compare(providedPassword, storedPassword);
}

const passwordUtils = {
  hash,
  compare,
};

export default passwordUtils;

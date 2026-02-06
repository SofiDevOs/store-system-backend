import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const {
  PORT,
  JWT_SECRET_KEY,
  DATABASE_URL
} = process.env;

export {
  PORT,
  JWT_SECRET_KEY,
  DATABASE_URL
};

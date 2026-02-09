import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const {
    PORT,
    DB_PORT,
    DB_HOST,
    DB_DATABASE,
    DB_PASSWORD,
    DB_USER,
    JWT_SECRET_KEY,
    DATABASE_URL,
} = process.env;

export {
    PORT,
    DB_PORT,
    DB_HOST,
    DB_DATABASE,
    DB_PASSWORD,
    DB_USER,
    JWT_SECRET_KEY,
    DATABASE_URL,
};

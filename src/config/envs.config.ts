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
    CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    SITE,
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
    CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    SITE,
};

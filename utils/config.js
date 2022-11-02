const USER_NAME = process.env.MONGO_DB_USER_NAME || "admin";
const PASSWORD = process.env.MONGO_DB_USER_PASSWORD || "wwwwww";
const MONGO_DB_URL = process.env.MONGO_DB_URL || "cluster0.hwtxh3m.mongodb.net/blog"; // bd for tests

export const MongoDBDen =`mongodb+srv://${USER_NAME}:${PASSWORD}@${MONGO_DB_URL}?retryWrites=true&w=majority&tls=true`;


export const DEV_VERSION = false;

export const VERSION_2_0 = "/2.0";

export const GMAIL_USER = "";
export const GMAIL_PASS = "";

export const LOCAL_PORT = 6006;
const USER_NAME = process.env.MONGO_DB_USER_NAME;
const PASSWORD = process.env.MONGO_DB_USER_PASSWORD;
const MONGO_DB_URL = process.env.MONGO_DB_URL; // bd for tests
export const MongoDBDen =process.env.MONGO_DB_URI
    // `mongodb+srv://${USER_NAME}:${PASSWORD}@${MONGO_DB_URL}?retryWrites=true&w=majority&tls=true`;

export const GMAIL_USER = process.env.MONGO_DB_GMAIL_USER;

export const GMAIL_PASS = process.env.MONGO_DB_GMAIL_PASS;
export const LOCAL_PORT = 6006;
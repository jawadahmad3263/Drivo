module.exports = {
    DATABASE_URL: process.env.DATABASE_URL,
    SESSION_SECRET: process.env.SESSION_SECRET,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_ACCOUNT_PASS: process.env.ADMIN_ACCOUNT_PASS,
    ADMIN_APP_PASS: process.env.ADMIN_APP_PASS,
    PORT: process.env.PORT,
    TOKEN_EXPIRY: process.env.TOKEN_EXPIRY,
    DEFAULT_LIMIT: 14,
    DEFAULT_OFFSET: 0,
    DB_HOST:process.env.DB_HOST,
    DB_NAME: process.env.DB_NAME,
    AUTH_KEY:process.env.AUTH_KEY,
    BASE_URL:process.env.BASE_URL || 'http://localhost:3003'
}
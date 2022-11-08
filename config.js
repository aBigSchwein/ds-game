import dotenv from 'dotenv';
dotenv.config();

const domain = process.env.domain || "http://ds-game.onrender.com",
    PORT = process.env.PORT,
    SHOW_LOGS = (process.env.SHOW_LOGS) ? Boolean(process.env.SHOW_LOGS) : false,
    LOG_LEVELS = (process.env.LOG_LEVELS) ? JSON.parse(process.env.LOG_LEVELS) : [];

export { domain, PORT, SHOW_LOGS, LOG_LEVELS };
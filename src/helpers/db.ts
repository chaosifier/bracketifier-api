import mongoose from "mongoose";
import "dotenv/config";

export function connect() {
    const conStr = process.env.DB_ENDPOINT;
    if (conStr) {
        mongoose.connect(conStr)
            .then(() => console.log('Connected to DB'))
            .catch(console.log);
        // mongoose.syncIndexes();
    }
}
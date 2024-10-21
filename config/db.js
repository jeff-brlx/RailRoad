const mongoose = require('mongoose');

mongoose.connect(process.env.DB_HOST+"/NODE_PROJECT");

const db = mongoose.connection;

db.on("error", (err) => {
    console.log(`ERROR on db with error: ${err}`);
});

db.once("open", () => {
    console.log("Connected to db");
});

module.exports = db;
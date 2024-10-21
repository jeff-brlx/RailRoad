const express = require("express")

/// Allow using .env variables
require("dotenv").config();
const PORT = process.env.PORT

/// Middlewares
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}))

/// Open API

/// Applying the middlewares globally

/// Routes
const trainRoutes = require("./routes/trains.routes")
app.use("/trains", trainRoutes)

/// Database Config
require("./config/db")

/// SERVER LISTEN
app.listen(PORT, () =>{
    console.log(`Server up and running on http://localhost:${PORT}`);
})
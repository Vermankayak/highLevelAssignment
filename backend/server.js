const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const router = require("./router/router");


dotenv.config({path:path.join(__dirname, ".env")});

const { PORT } = process.env;

const app = express();
app.use(cors(), express.json());
app.use("/api", router)


app.listen(PORT, () => {
    console.log(`App is running on Port ${PORT}`)
})
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({path:path.join(__dirname, "..", ".env")});

const {
    MYSQL_HOST,
    MYSQL_USERNAME,
    MYSQL_PASSWORD,
    MYSQL_DATABASE,
} = process.env

async function getDBConnection(){
    try{
        const dbConfig = {
            host:MYSQL_HOST,
            user:MYSQL_USERNAME,
            password:MYSQL_PASSWORD,
            database:MYSQL_DATABASE,
        }
        const pool = mysql.createPool(dbConfig);
        const dbConn = await pool.getConnection();
        return dbConn;
    }catch(e){
        console.log("Error occurred here")
    }
   
}

process.on("uncaughtException", (err) => {
    console.log("Error ocurred here")
})

module.exports = getDBConnection;

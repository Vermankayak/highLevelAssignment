const dotenv = require("dotenv");
const { v4: uuid4 } = require("uuid");
const path = require("path");
const moment = require('moment');
const checkDecimalDigits = require("../utils/checkDecimalDigits");
const getDBConnection = require("../utils/dbConnection");


dotenv.config({ path: path.join(__dirname, "..", ".env") })

const { DECIMAL_POINTS } = process.env;

const walletSetupController = async (req, res, next) => {
    const dbConn = await getDBConnection();
    let { name, balance } = req.body;
    if (!name) {
        res.status(400).json({
            msg: "Invalid request, Name is required!"
        })
        return dbConn.release()
    }
    if (!balance) {
        balance = 0;
    }

    const notValidDecimalDigits = checkDecimalDigits(balance, DECIMAL_POINTS);

    if (!notValidDecimalDigits) {
        const checkIfNameAlreadyExistsQuery = `SELECT COUNT(name_vch) as count FROM wallets WHERE name_vch like "${name}"`;
        const [[{ count }]] = await dbConn.query(checkIfNameAlreadyExistsQuery);
        if (count > 0) {
            res.status(400).json({
                msg: "User already exists!"
            });
            return dbConn.release();
        } else {
            const walletId = `W-${uuid4()}`;
            const transactionId = `T-${uuid4()}`;
            const currentTimestamp = moment().utc().format('YYYY-MM-DD HH:mm:ss'); 
            const insertIntoWalletsQuery = `INSERT INTO wallets ( wallet_id_vch, balance_vch, name_vch, created_dt ) VALUES ?`;
            const insertIntoTransactionsQuery = `INSERT INTO transactions (transactionId_vch, wallet_id_vch, amount_vch, description_vch, balance_vch, type_vch) VALUES ?`;
            const insertIntoWalletsPayload = [
                [walletId, `${balance}`, name, currentTimestamp]
            ];
            const insertIntoTransactionsPayload = [
                [transactionId, walletId,"0", "Recharge", `${balance}`, "SETUP"]
            ];
            try{
                await dbConn.beginTransaction();
                await dbConn.query(insertIntoWalletsQuery, [insertIntoWalletsPayload]);
                await dbConn.query(insertIntoTransactionsQuery,[insertIntoTransactionsPayload]);
                await dbConn.commit();
        
                res.status(200).json({
                    id:walletId,
                    balance,
                    transactionId,
                    name,
                    currentTimestamp
                })
                return dbConn.release();
            }catch(e){
                await dbConn.rollback();
                res.status(400).json({
                    msg:"Error occurred during DB transaction."
                })
                return dbConn.release();
            }
        }

    } else {
        res.status(400).json({
            msg: "Kindly enter an amount with upto 4 decimal digits."
        });
        return dbConn.release();
    }
}

module.exports = walletSetupController
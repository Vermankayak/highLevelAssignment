const dotenv = require("dotenv");
const { v4: uuid4 } = require("uuid");
const path = require("path");
const moment = require("moment");
const checkDecimalDigits = require("../utils/checkDecimalDigits");
const getDBConnection = require("../utils/dbConnection");


dotenv.config({ path: path.join(__dirname, "..", ".env") })

const { DECIMAL_POINTS } = process.env;

const transactionController = async (req, res, next) => {
    const dbConn = await getDBConnection();

    const { walletId } = req.params;
    const { amount, description } = req.body;

    if(!walletId){
        res.status(400).json({
            msg:"Wallet Id can't be empty!"
        });
        return dbConn.release();
    }
    if(typeof amount === 'undefined'){
        res.status(400).json({
            msg:"Enter a valid amount!"
        });
        return dbConn.release();
    }

    const notValidDecimalDigits = checkDecimalDigits(amount, DECIMAL_POINTS);

    if(notValidDecimalDigits){
        res.status(400).json({
            msg: "Kindly enter an amount with upto 4 decimal digits."
        });
        return dbConn.release();
    }


    if(!description){
        res.status(400).json({
            msg:"Description can't be empty or invalid string!"
        });
        return dbConn.release();
    }

    const checkIfWalletIdExistsQuery = `SELECT balance_vch FROM transactions WHERE wallet_id_vch like "${walletId}" ORDER BY created_dt DESC LIMIT 1`;
    const [ result ] = await dbConn.query(checkIfWalletIdExistsQuery);
    if(result.length > 0){
        const type = amount >= 0 ? "CREDIT" : "DEBIT";
        const [ { balance_vch } ] = result;
        const updatedBalance = (parseFloat(balance_vch) + parseFloat(amount)).toFixed(4);
        if(updatedBalance < 0){
            res.status(400).json({
                msg:"Not Enough Balance!"
            })
            return dbConn.release();
        }
        const transactionId = `T-${uuid4()}`;
        const insertIntoTransactionsPayload = [
            [transactionId, walletId,`${amount}`, description, `${updatedBalance}`, type]
        ];
        try{
            await dbConn.beginTransaction();
            await dbConn.query(`UPDATE wallets SET balance_vch = "${updatedBalance}", updated_dt = "${moment().utc().format('YYYY-MM-DD HH:mm:ss')}" WHERE wallet_id_vch like "${walletId}"`);
            await dbConn.query(`INSERT INTO transactions (transactionId_vch, wallet_id_vch, amount_vch, description_vch, balance_vch, type_vch) VALUES ?`,[insertIntoTransactionsPayload]);
            await dbConn.commit();
            res.status(200).json({
                balance:updatedBalance,
                transactionId
            })
            return dbConn.release();
        }catch(e){
            await dbConn.rollback();
            res.status(400).json({
                msg:"Error occurred during DB transaction."
            })
            return dbConn.release();
        }
        
    }else{
        res.status(400).json({
            msg:"Invalid wallet id!"
        });

        return dbConn.release();
    }
}

module.exports = transactionController
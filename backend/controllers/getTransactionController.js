const getDBConnection = require("../utils/dbConnection");

const getTransactionController = async (req, res, next) => {
    const dbConn = await getDBConnection();
    let { walletId, skip, limit, orderBy } = req.query;
    const countTransactionsQuery = `SELECT COUNT(*) as count FROM transactions WHERE wallet_id_vch like "${walletId}"`;
    const [[{ count }]] = await dbConn.query(countTransactionsQuery);
    if(count < 1){
        res.status(400).json({
            msg:"Wallet Id doesn't exist!"
        })
        return dbConn.release();
    }

    if(!skip || skip < 0){
        skip = 1;
    }
    if(!limit || limit < 0){
        limit = count;
    }
    if(!orderBy && orderBy !== "created_dt" && orderBy !== "amount_vch"){
        orderBy = "created_dt"
    }
    if(orderBy === "amount_vch"){
        orderBy = `CAST(amount_vch AS DECIMAL(10,4))`
    }
    
    const getTransactionsQuery = `SELECT transactionId_vch, wallet_id_vch, amount_vch, balance_vch, description_vch, type_vch, created_dt FROM transactions WHERE wallet_id_vch like "${walletId}" ORDER BY ${orderBy} DESC LIMIT ${(skip - 1)*limit}, ${limit}`;
    const [ result ] = await dbConn.query(getTransactionsQuery);
   
    res.status(200).json({
        result,
        count,
    })
    return dbConn.release();

}

module.exports = getTransactionController
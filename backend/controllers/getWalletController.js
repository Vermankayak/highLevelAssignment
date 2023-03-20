const getDBConnection = require("../utils/dbConnection");
const getWalletController = async (req, res, next) => {
    const dbConn = await getDBConnection();
    const { id } = req.params;

    const getWalletInfoQuery = `SELECT wallet_id_vch, balance_vch, name_vch, created_dt, updated_dt  FROM  wallets WHERE wallet_id_vch like "${id}"`;
    const [result] = await dbConn.query(getWalletInfoQuery);
    if(result.length < 1){
        res.status(400).json({
            msg:"Wallet Id doesn't exist!"
        })
        return dbConn.release();
    }
    res.status(200).send(result)
    return dbConn.release();
}

module.exports = getWalletController
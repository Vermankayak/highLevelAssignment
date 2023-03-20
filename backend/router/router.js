const express = require("express");
const getTransactionController = require("../controllers/getTransactionController");
const getWalletController = require("../controllers/getWalletController");
const transactionController = require("../controllers/transactionController");
const walletSetupController = require("../controllers/walletSetupController");

const router = express.Router();

router.post("/setup", walletSetupController);
router.post("/transact/:walletId", transactionController);
router.get("/transactions",getTransactionController);
router.get("/wallet/:id", getWalletController);



module.exports = router
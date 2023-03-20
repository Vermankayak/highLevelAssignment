import { combineReducers } from "redux";
import { getCSVDataReducer } from "./getCSVDataReducer";
import { getTransactionsReducer } from "./getTransactionsReducer";
import { transactionReducer } from "./transactionReducer";
import { walletBalanceReducer } from "./walletBalanceReducer";
import { walletHomeReducer } from "./walletHomeReducer";



export const rootReducer = combineReducers({
    walletHome: walletHomeReducer,
    transaction: transactionReducer,
    walletBalance:walletBalanceReducer,
    getTransactions:getTransactionsReducer,
    getCSVData:getCSVDataReducer,
})
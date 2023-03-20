import axios from "axios";

const {
    REACT_APP_PROTOCOL,
    REACT_APP_HOST,
    REACT_APP_PORT,
    REACT_APP_LIMIT
    } = process.env;

export function GetTransactionsAction(walletId, skip=0, orderBy="created_dt"){
    return async function(dispatch){
        try{
            const response = await axios.get(`${REACT_APP_PROTOCOL}://${REACT_APP_HOST}:${REACT_APP_PORT}/api/transactions?walletId=${walletId}&skip=${skip}&limit=${REACT_APP_LIMIT}&orderBy=${orderBy}`);
            const transactionData = response.data;
            if(response.status === 200){
                dispatch({type: "GET_TRANSACTION_DATA_SUCCESS", payload:transactionData});
            }else{
                dispatch({type: "GET_TRANSACTION_DATA_FAILURE", payload:transactionData});
            }
        }
        catch(error){
            return dispatch({type: "GET_TRANSACTION_DATA_FAILURE", payload:error});
        }
    }
}
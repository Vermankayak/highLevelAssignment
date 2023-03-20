import axios from "axios";

const {
    REACT_APP_PROTOCOL,
    REACT_APP_HOST
    } = process.env;

export function TransactionAction(walletId, type, bodyData){
    return async function(dispatch){
        try{
            if(type==="Debit"){
                bodyData.amount = (bodyData.amount * -1).toFixed(4)
            }
            const response = await axios.post(`${REACT_APP_PROTOCOL}://${REACT_APP_HOST}/api/transact/${walletId}`, bodyData);
            const transactionData = response.data;
            if(response.status === 200){
                dispatch({type: "POST_TRANSACTION_DATA_SUCCESS", payload:transactionData});
                try{
                    const response = await axios.get(`${REACT_APP_PROTOCOL}://${REACT_APP_HOST}:${REACT_APP_PORT}/api/wallet/${walletId}`);
                    const walletData  = response.data;
                    if(response.status === 200){
                        return dispatch({type: "GET_WALLET_DATA_SUCCESS", payload:walletData});
                    }else{
                        return dispatch({type: "GET_WALLET_DATA_FAILURE", payload:walletData});
                    }
                    
                }catch(error){
                    return dispatch({type: "GET_WALLET_DATA_FAILURE", payload:error?.response?.data});
                }
            }else{
                dispatch({type: "POST_TRANSACTION_DATA_FAILURE", payload:transactionData});
            }
        }
        catch(error){
            return dispatch({type: "POST_TRANSACTION_DATA_FAILURE", payload:error?.response?.data});
        }
    
            
        }
    }

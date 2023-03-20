import axios from "axios";

const {
    REACT_APP_PROTOCOL,
    REACT_APP_HOST
    } = process.env;
    
export function WalletHomeAction(bodyData){
    return async function(dispatch){
        let walletId;
        try{
            const response = await axios.post(`${REACT_APP_PROTOCOL}://${REACT_APP_HOST}/api/setup`, bodyData);
            const { data } = response;
            walletId = data.id
            if(response.status === 200){
               dispatch({type: "POST_NEW_WALLET_DATA_SUCCESS", payload:data});
               try{
                if(walletId){
                    const response = await axios.get(`${REACT_APP_PROTOCOL}://${REACT_APP_HOST}:${REACT_APP_PORT}/api/wallet/${walletId}`);
                    const walletData  = response.data;
                    if(response.status === 200){
                        return dispatch({type: "GET_WALLET_DATA_SUCCESS", payload:walletData});
                    }else{
                        return dispatch({type: "GET_WALLET_DATA_FAILURE", payload:walletData});
                    }
                }  
                    
                }catch(error){
                    return dispatch({type: "GET_WALLET_DATA_FAILURE", payload:error?.response?.data});
                }
            }else{
               dispatch({type: "POST_NEW_WALLET_DATA_FAILURE", payload:data});
            }
            
        }catch(error){
           dispatch({type: "POST_NEW_WALLET_DATA_FAILURE", payload:error?.response?.data});
        }
       
    }
}
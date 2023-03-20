import axios from "axios";

const {
REACT_APP_PROTOCOL,
REACT_APP_HOST,
REACT_APP_PORT
} = process.env;

export function GetCSVDataAction(walletId){
    return async function(dispatch){
        try{
            const response = await axios.get(`${REACT_APP_PROTOCOL}://${REACT_APP_HOST}:${REACT_APP_PORT}/api/transactions?walletId=${walletId}`);
            const csvData = response.data;
            if(response.status === 200){
                dispatch({type: "GET_CSV_DATA_SUCCESS", payload:csvData});
            }else{
                dispatch({type: "GET_CSV_DATA_FAILURE", payload:csvData});
            }
        }catch(e){
            dispatch({type: "GET_CSV_DATA_FAILURE", payload:e})
        }
    }
}
const initialState = {
    transactions:[],
}

export function getTransactionsReducer(state=initialState.transactions, action){
    switch(action.type){
        case "GET_TRANSACTION_DATA_SUCCESS":
            return action.payload
        case "GET_TRANSACTION_DATA_FAILURE":
            return action.payload
        default:
            return state
    }
}
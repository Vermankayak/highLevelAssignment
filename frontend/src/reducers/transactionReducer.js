const initialState = {
    transaction:[],
}

export function transactionReducer(state=initialState.transaction, action){
    switch(action.type){
        case "POST_TRANSACTION_DATA_SUCCESS":
            return action.payload
        case "POST_TRANSACTION_DATA_FAILURE":
            return action.payload
        default:
            return state
    }
}
const initialState = {
    walletBalance:[],
}

export function walletBalanceReducer(state=initialState.walletBalance, action){
    switch(action.type){
        case "GET_WALLET_DATA_SUCCESS":
            return action.payload
        case "GET_WALLET_DATA_FAILURE":
            return action.payload
        default:
            return state
    }
}
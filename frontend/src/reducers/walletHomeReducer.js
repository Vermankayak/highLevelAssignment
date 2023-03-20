const initialState = {
    wallet:[],
}

export function walletHomeReducer(state=initialState.wallet, action){
    switch(action.type){
        case "POST_NEW_WALLET_DATA_SUCCESS":
            return action.payload
        case "POST_NEW_WALLET_DATA_FAILURE":
            return action.payload
        default:
            return state
    }
}

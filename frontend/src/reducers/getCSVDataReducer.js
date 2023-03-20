const initialState = {
    csvData:[],
}

export function getCSVDataReducer(state=initialState.csvData, action){
    switch(action.type){
        case "GET_CSV_DATA_SUCCESS":
            return action.payload
        case "GET_CSV_DATA_FAILURE":
            return action.payload
        default:
            return state
    }
}
const initialState = {
    historyData: [],
    addressData: [],
    term: ""
  }
  const InfoReducer = function (state = initialState, action) {
    switch (action.type) {
      case "GET_HISTORY":
        return Object.assign({}, state, {
          historyData: action.payload
        })
      case "SEARCH":
        return Object.assign({}, state, {
          term: action.payload
        })
      default:
        return state;
    }
  };
  
  export default InfoReducer;
import  { USER_BUY_COIN, GET_USER_COIN,
  CLEAR_USER_COIN, 
  GET_ORDER_DETAIL, 
  ORDER_LOADING,
  DONATE_COIN,
  CHANGE_DONATE_STATE }  from '../actions/types';

const initialState = {
  coin: 0,
  loading: false,
  details:[],
  new: false,
  donate: false,
  donate_data:''
}
export default function(state=initialState, action){
  switch(action.type){
    case GET_USER_COIN:
      return {
        ...state,
        coin: action.payload,
        donate: false,
        new: true
      }
    case USER_BUY_COIN:
      return {
        ...state,
        new: false
      }
    case ORDER_LOADING:
      return {
        ...state,
        loading: true
      }
    case GET_ORDER_DETAIL:
      return {
        ...state,
        details: action.payload,
        loading: false
      }
    case DONATE_COIN:
      return {
        ...state,
        donate_data : action.payload,
        donate: true,
        new: false
      }
    case CLEAR_USER_COIN:
      return initialState ;
    case CHANGE_DONATE_STATE:
      return {
        ...state,
        donate: false}
    default:
      return state;
  }

}

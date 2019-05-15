import axios from 'axios';
import { GET_ERRORS,USER_BUY_COIN,
   GET_USER_COIN, GET_ORDER_DETAIL,
    ORDER_LOADING,DONATE_COIN,CHANGE_DONATE_STATE } from './types';

export const currnetCoin = (userData) => dispatch => {
  axios.get('/api/coin')
    .then(res => {      
      dispatch({
        type: GET_USER_COIN,
        payload: res.data.coin
      })
    })
}
export const buyCoin = (word) => dispatch => {
  axios.post(`/api/checkout/pay${word}/reserve`)
    .then(res => {      
      window.open(res.data, "_blank")
      dispatch({type: USER_BUY_COIN})
    })    
}
export const getOrderDetail = () => dispatch => {
  dispatch(getOrderLoading())
  setTimeout(() => {
    axios.get('/api/checkout/details')
    .then(res => {
      console.log("getOrderDetail", res)
      dispatch({
        type: GET_ORDER_DETAIL,
        payload: res.data
      })
    })
    .catch(err =>
      //傳到不同的Reducer 所以有用dispatch ?
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    )
  }, 500)  
}
export const getOrderLoading = () => {
  return {
    type: ORDER_LOADING
  }
}

export const donateCoin = (data) => dispatch => {
  axios.post('/api/donate', data)
    .then(res => {
      console.log(res)
      dispatch({
        type: DONATE_COIN,
        payload: res.data
      })
    })
    .catch(err =>
      //傳到不同的Reducer 所以有用dispatch ?
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    )
}

export const changeDonateProps = () => dispatch => {
  dispatch({
    type: CHANGE_DONATE_STATE
  })
}

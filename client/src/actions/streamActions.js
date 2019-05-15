import axios from 'axios';
import { SET_STREAM_KEY, STREAM_LOADING, GET_ERRORS,
  SET_STREAM_DATA, GET_STREAM_DATA, SET_CURRENT_AMOUNT,
  SET_CURRENT_STREAM,
  CLEAR_STREAM_DETAIL,
  SET_STREAMCATE_LIST,
CLEAR_USER_STREAM_SETTING,
UPDATE_STREAM_IMG,
IMG_UPLOAD_LOADING } from './types' ;





export const streamRoom = user_name => dispatch => {
  axios.post('/api/user/streamKey', user_name)
    .then(res => dispatch({
      type: SET_STREAM_KEY,
      payload: res.data
    }))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    )
}

export const clearSream = () => {
  return {
    type: CLEAR_STREAM_DETAIL
  }
}


// stream Loading
export const setStreamLoading = () => {
  return {
    type: STREAM_LOADING
  }
}

export const getStreamData = user_id => dispatch => {
  axios.get('/api/stream/data', user_id)
    .then(res => dispatch({
      type: GET_STREAM_DATA,
      payload: res.data
    }))
}

export const setStreamData = data => dispatch => {
  axios.post('/api/stream/data', data)
    .then(res => dispatch({
      type: SET_STREAM_DATA,
      payload: res.data.stream_data
    }))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    )
}

export const setCurrentUser = data => {
  return {
    type: SET_CURRENT_AMOUNT,
    payload: data
  }
}

export const setCurrentStream = () => dispatch =>{
  dispatch(setStreamLoading());
  axios.get('/api/stream/onstream')
    .then(res => dispatch({
      type: SET_CURRENT_STREAM,
      payload: res.data
    }))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    )
}

export const getStreamCateList = () => dispatch => {
  dispatch(setStreamLoading());
  axios.get('/api/stream/cate')
    .then(res => dispatch({
      type: SET_STREAMCATE_LIST,
      payload: res.data
    }))
}


export const updateStreamImg = (data) => dispatch => {  
  dispatch(updateStreamImgLoading());
  let fd = new FormData();  
  fd.append('file',data)  
  postData('https://www.wuhsun.com/api/stream/img_change',fd, localStorage.jwtToken).then(res => {
  // postData('http://localhost:5000/api/stream/img_change',fd, localStorage.jwtToken).then(res => {
      dispatch({
        type: UPDATE_STREAM_IMG,
        payload: res.data
      })
    })
    .catch(err =>      
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    )  
}
function postData(url, data,bearer) {  
  return fetch(url, {
    body: data, // must match 'Content-Type' header    
    headers: {
      'Authorization': bearer
    },
    method: 'POST' // *GET, POST, PUT, DELETE, etc.    
  })
}

export const updateStreamImgLoading = () => {
  return {
    type: IMG_UPLOAD_LOADING
  }
}


export const clearState =() => {
  return {
    type: CLEAR_USER_STREAM_SETTING
  }
}

import setAuthToken from '../utils/setAuthToken'
import axios from 'axios';
import jwt_decode from 'jwt-decode';

import { GET_ERRORS,
  SET_CURRENT_USER,
  UPDATE_USER_EMAIL,
  CLEAR_USER_COIN,
  CLEAR_STREAM_DATA,
  UPDATE_USER_IMG,
  USER_IMG_UPLOADING,
USER_DONATE_DETAILS,
USER_DONATE_DETAILS_LOADING } from './types';

// Register User
export const registerUser = (userData, history) => dispatch => {
  axios.post('/api/user/register', userData)
    .then(res => history.push('/login'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    )
}
// Login - get User Token
export const loginUser = userData => dispatch => {
  axios.post('/api/user/login', userData)
    .then(res => {
      // Save to localStorage
      const { token } = res.data;
      // Set token to ls
      localStorage.setItem('jwtToken', token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user

      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      //傳到不同的Reducer 所以有用dispatch ?
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    )
};

// Set logged in user
export const setCurrentUser = (decoded) => {
  return {
    //傳到authReducer 不用dispatch
    type: SET_CURRENT_USER,
    payload: decoded
  }
}

export const updateUserEmail = (data) => dispatch => {
  axios.post('/api/user/email_change', data)
    .then(res => {
      dispatch({
        type: UPDATE_USER_EMAIL,
        payload: res.data
      })
      setTimeout(() => {
        dispatch(logoutUser())
      },5000)
    })
    .catch(err =>
      //傳到不同的Reducer 所以有用dispatch ?
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    )
}

export const updateUserImg = (data) => dispatch => {
  dispatch(udpateUserImgLoading())
  console.log('action',data);
  let fd = new FormData();
  fd.append('file',data)
  // postData('http://localhost:5000/api/user/img_change',fd, localStorage.jwtToken).then(res => {
    postData('https://www.wuhsun.com/api/user/img_change',fd, localStorage.jwtToken).then(res => {
      Promise.all([res, res.json()])
        .then(([res, json]) => {
          dispatch({
            type: UPDATE_USER_IMG,
            payload: json
          })
        })
    })
    .catch(err =>
      {console.log(err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })}
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


export const udpateUserImgLoading = () => dispatch => {
  return dispatch({
    type: USER_IMG_UPLOADING
  })
}

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from localstage
  localStorage.removeItem('jwtToken');
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to {} which will set isAuth to false
  dispatch(setCurrentUser({}))
  setTimeout(() => {
    dispatch({type: CLEAR_USER_COIN})
    dispatch({type: CLEAR_STREAM_DATA})
  }, 3000)
}


export const getUserDonateDetails = () => dispatch => {
  dispatch(getUserDonateDetailsLoading())
  axios.get('/api/donate/list')
    .then(res=> {
      dispatch({
        type: USER_DONATE_DETAILS,
        payload: res.data
      })
    })
}

export const getUserDonateDetailsLoading = () => dispatch => {
    return dispatch({
        type: USER_DONATE_DETAILS_LOADING
      })
}

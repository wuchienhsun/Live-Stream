import axios from 'axios';
import { UPLOAD_VIDEO,UPLOAD_VIDEO_LOADING,
   GET_USER_VIDEO_LIST,
    GET_USER_VIDEO_LIST_LOADING,GET_ERRORS,
  USER_VIEW_VIDEO,
DELETE_USER_VIDEO,
GET_VIDEO_UPLOAD_LIST,
GET_VIDEO_UPLOAD_LIST_LOADING,
UPLOAD_YT_VIDEO,
EDIT_VIDEO,
EDIT_VIDEO_LOADING } from './types';

export const uploadVideo = data => dispatch => {
  console.log(data)
  dispatch(uploadvideloading(data))
  let fd = new FormData();
  fd.append('file', data)
  axios.post('/api/video/upload', fd)
    .then(res => dispatch({
      type: UPLOAD_VIDEO,
      payload: res.data
    }))
    .catch(err =>
      //傳到不同的Reducer 所以有用dispatch ?
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    )
}

export const uploadvideloading = (data) => {
  return {
    type: UPLOAD_VIDEO_LOADING,
    payload: {
      id: null,
      user_id: 'loading',
      video_name: data.name,
      video_path: 'file uploading',
      video_url: 'file uploading',
      views: 0
    }
  }
}

export const getUserVideoList = () => dispatch => {
  dispatch(getUserVideoListLoading())
  axios.get('/api/video/list')
    .then(res => {
      dispatch({
        type: GET_USER_VIDEO_LIST,
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

export const getUserVideoListLoading = () => {
  return {
    type: GET_USER_VIDEO_LIST_LOADING
  }
}

export const deleteUserVideo = (data) => dispatch => {
  console.log(data);
  axios.post('/api/video/delete', data)
    .then(res => {
      dispatch({
        type: DELETE_USER_VIDEO,
        payload: data
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

export const plusVideoViewsAmount = (data) => (dispatch) => {
  axios.post('/api/video/plus', data)
    .then(res => {
      dispatch({
        type: USER_VIEW_VIDEO,
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

export const getAllUploadVideoList = () => dispatch => {
  dispatch(getAllUploadVideoListLoading())
  axios.get('/api/video/alllist')
    .then(res => {
      dispatch({
        type: GET_VIDEO_UPLOAD_LIST,
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
export const getAllUploadVideoListLoading = () => dispatch => {
  dispatch({
    type:GET_VIDEO_UPLOAD_LIST_LOADING
  })
}

export const uploadYtVideo = (data) =>dispatch => {
  let text = {name: 'upload'}
  dispatch(uploadvideloading(text))
  axios.post('/api/video/ytdl', data)
    .then(res => {
      dispatch({
        type:UPLOAD_YT_VIDEO,
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

export const editVideo = (data,history) => dispatch => {
  dispatch(editVideoLoading())
  axios.post('/api/video/edit', data)
  .then(res => {
    dispatch({
      type: EDIT_VIDEO,
      payload: res.data
    })
  })
}

export const editVideoLoading = () => dispatch => {
  dispatch({
    type: EDIT_VIDEO_LOADING
  })
}

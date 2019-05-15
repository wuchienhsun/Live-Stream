import {  STREAM_LOADING,SET_STREAM_KEY, SET_STREAM_DATA,
  GET_STREAM_DATA,CLEAR_STREAM_DATA, SET_CURRENT_AMOUNT,
  SET_CURRENT_STREAM,
  CLEAR_STREAM_DETAIL,
  SET_STREAMCATE_LIST,
CLEAR_USER_STREAM_SETTING,
UPDATE_STREAM_IMG,
IMG_UPLOAD_LOADING } from '../actions/types' ;

const initialState = {
  streamId: null,
  streamKey: null,
  streamName:null,
  streamHost:null,
  streamCate:null,
  streamDetail:null,
  streamCateList:null,
  streamImg: null,
  streamUpdated: false,
  updated: false,
  loading: false,
  uploadImgLoading: false,
  playlist:[],
  current: 0
}

export default function(state = initialState, action) {
  switch(action.type) {
    case STREAM_LOADING:
    return {
      ...state,
      loading: true
    }
    case IMG_UPLOAD_LOADING:
    return {
      ...state,
      uploadImgLoading: true
    }
    case SET_STREAM_KEY:
     return {
      ...state,
      streamKey: action.payload.Key,
      streamName: action.payload.Name,
      streamHost: action.payload.host,
      streamId:action.payload.id,
      streamDetail: action.payload.Detail,
      streamCate: action.payload.Cate,
      loading: false
    }
    case CLEAR_STREAM_DETAIL:
    return {
      ...state,
      streamKey: null,
      streamName: null,
      streamHost: null,
      streamId:null,
      current: 0
    }
    case SET_STREAM_DATA:
      return {
        ...state,
        streamName: action.payload.stream_name,
        streamCate: action.payload.stream_id,
        streamDetail:action.payload.stream_detail,
        updated: true
      }
    case GET_STREAM_DATA:
      return {
        ...state,
        streamName: action.payload.stream_name,
        streamCate: action.payload.stream_id,
        streamDetail:action.payload.stream_detail,
        streamImg: action.payload.stream_img
    }
    case SET_CURRENT_AMOUNT:
      return {
        ...state,
        current: action.payload
      }
    case SET_CURRENT_STREAM:
      return {
        ...state,
        playlist: action.payload,
        loading: false
      }
    case SET_STREAMCATE_LIST:
      return {
        ...state,
        streamCateList: action.payload,
        loading: false
      }
    case UPDATE_STREAM_IMG:
    return {
      ...state,
      streamUpdated: true,
      uploadImgLoading: false
    }
    case CLEAR_USER_STREAM_SETTING:
      return {      
        streamId: null,
        streamKey: null,
        streamName:null,
        streamHost:null,
        streamCate:null,
        streamDetail:null,
        streamCateList:null,
        updated: false,
        loading: false,        
        current: 0
      }    
    case CLEAR_STREAM_DATA:
      return initialState;
    default:
      return state;
  }
}

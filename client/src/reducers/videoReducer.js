import {
  UPLOAD_VIDEO_LOADING,
  UPLOAD_VIDEO,
  GET_USER_VIDEO_LIST,
    GET_USER_VIDEO_LIST_LOADING,
    USER_VIEW_VIDEO,
    DELETE_USER_VIDEO,
    GET_VIDEO_UPLOAD_LIST,
    GET_VIDEO_UPLOAD_LIST_LOADING,
    UPLOAD_YT_VIDEO,
    EDIT_VIDEO,
    EDIT_VIDEO_LOADING
 } from '../actions/types';

const initialState = {
  errors: {msg:null},
  videoupload: false,
  VideoCreateDetail: null,
  getUserVideoLoding: false,
  userVideoList:[],
  views:[],
  allvideolistloading: false,
  allvideolist: [],
  editVideoload: false
}

export default function(state = initialState, action) {
  switch(action.type) {
  case UPLOAD_YT_VIDEO:
    state.userVideoList.splice(0,1)
    return {
      ...state,
       videoupload: false,
      // userVideoList: { [action.payload]:action.payload, ...state.userVideoList }
      userVideoList: [ action.payload, ...state.userVideoList ]
    }
  case UPLOAD_VIDEO:
  state.userVideoList.splice(0,1)
  //oldState.unshift(action.payload)
    return {
      ...state,
      videoupload: false,
      // userVideoList: { [action.payload]:action.payload, ...state.userVideoList }
      userVideoList: [ action.payload, ...state.userVideoList ]
    }
  case UPLOAD_VIDEO_LOADING:
    return {
      ...state,
      videoupload:true,
      userVideoList: [ action.payload, ...state.userVideoList ]
    }
  case GET_USER_VIDEO_LIST:
  let data = action.payload
   return {
     ...state,
     getUserVideoLoding: false,
     userVideoList: action.payload
   }

   case GET_USER_VIDEO_LIST_LOADING:
    return {
      ...state,
      getUserVideoLoding: true
    }
  case USER_VIEW_VIDEO:
    return {
      ...state,
      views: {[action.payload.video_path]:action.payload.views}
    }
  case DELETE_USER_VIDEO:
    return {
      ...state,
      userVideoList: state.userVideoList.filter(list => list.video_path !== action.payload.video_path)
    }
    case GET_VIDEO_UPLOAD_LIST_LOADING:
      return {
        ...state,
        allvideolistloading: true
      }
    case GET_VIDEO_UPLOAD_LIST:
      return {
        ...state,
        allvideolist: action.payload,
        allvideolistloading: false
      }
    case EDIT_VIDEO:
      return {
        ...state,
        editVideoload: false
      }
      case EDIT_VIDEO_LOADING:
      return {
        ...state,
        editVideoload: true
      }
    default:
      return state;
  }
}

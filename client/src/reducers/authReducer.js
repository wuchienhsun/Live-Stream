import { SET_CURRENT_USER,UPDATE_USER_EMAIL,
  UPDATE_USER_IMG, USER_IMG_UPLOADING,USER_DONATE_DETAILS,
  USER_DONATE_DETAILS_LOADING
 } from '../actions/types' ;
import isEmpty from '../validation/is-empty';

const initialState = {
  isAuthenticated: false,
  user: {},
  img:null,
  updated: false,
  userImgLoading: false,
  text: null,
  loading: false,
  donateList:null
}

export default function(state = initialState, action){
  switch(action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
        img:action.payload.img,
        updated: false
      }
    case UPDATE_USER_EMAIL:
      return {
        ...state,
        updated: true
      }
    case UPDATE_USER_IMG:
    console.log(action.payload);
      return {
        ...state,     
        img: action.payload.img,
        updated: true,
        userImgLoading: false
      }
    case USER_IMG_UPLOADING:
    return {
      ...state,
      userImgLoading: true
    }
    case USER_DONATE_DETAILS:
    return {
      ...state,
      donateList: action.payload,
      loading: false
    }
    case USER_DONATE_DETAILS_LOADING:
    return {
      ...state,
      loading: true
    }
    default:
      return state;
  }
}
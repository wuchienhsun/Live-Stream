import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import streamReducer from './streamReducer';
import coinReducer from './coinReducer';
import videoReducer from './videoReducer';

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  stream: streamReducer,
  coin: coinReducer,
  video: videoReducer
})

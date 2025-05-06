import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import alertReducer from './alertSlice';

const rootReducer = combineReducers({
  user: userReducer,
  alert: alertReducer,
});

export default rootReducer;
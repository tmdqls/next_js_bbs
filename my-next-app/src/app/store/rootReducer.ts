import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './slice/userSlice';
import alertReducer from './slice/alertSlice';

const rootReducer = combineReducers({
  user: userReducer,
  alert: alertReducer,
});

export default rootReducer;
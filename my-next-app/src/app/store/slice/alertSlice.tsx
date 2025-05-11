import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AlertState {
  msg: string;
  msgType: string;
}

const initialState: AlertState = {
  msg: '',
  msgType: '',
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    setAlert(state, action: PayloadAction<{ msg: string; msgType: string }>) {
      state.msg = action.payload.msg;
      state.msgType = action.payload.msgType;
    },
    clearAlert(state) {
      state.msg = '';
      state.msgType = '';
    },
  },
});

export const { setAlert, clearAlert } = alertSlice.actions;
export default alertSlice.reducer;
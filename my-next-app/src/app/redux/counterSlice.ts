// redux/counterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 초기 상태 타입 정의
interface CounterState {
  count: number;
}

// 초기 상태
const initialState: CounterState = {
  count: 0,
};

// 카운터 상태를 관리하는 slice 정의
const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
    setCount: (state, action: PayloadAction<number>) => {
      state.count = action.payload;
    },
  },
});

// 액션 생성자들 export
export const { increment, decrement, setCount } = counterSlice.actions;

// 리듀서 export
export default counterSlice.reducer;
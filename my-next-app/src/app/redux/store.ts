// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import counterReducer from './counterSlice';

// 스토어 타입 정의
export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

// RootState와 AppDispatch 타입을 설정하여, useSelector와 useDispatch 훅에서 타입 추론을 제공
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// useDispatch, useSelector 훅을 타입 안전하게 사용할 수 있도록 커스텀 훅 정의
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from '@/redux/apiSlice'
import priceFilterReducer from '@/redux/slices/priceFilterSlice'
import roomTypeFilterReducer from '@/redux/slices/roomTypeFilterSlice'
import bedFilterReducer from '@/redux/slices/bedFilterSlice'
import amenitiesFilterReducer from '@/redux/slices/amenitiesFilterSlice'
import filterReducer from '@/redux/slices/filterSlice'

const store = configureStore({
  reducer: {
    // ES6+ 문법의 Computed Property Names를 사용하여 동적으로 apiSlice를 추가합니다.
    [apiSlice.reducerPath]: apiSlice.reducer,
    priceFilter: priceFilterReducer,
    roomTypeFilter: roomTypeFilterReducer,
    bedFilter: bedFilterReducer,
    amenitiesFilter: amenitiesFilterReducer,
    filter: filterReducer,
  },
  // Redux의 미들웨어는 액션이 리듀서에 도달하기 전에 가로채서 처리하는 함수입니다.
  middleware: getDefaultMiddleware =>
    // RTK Query의 기본 미들웨어에 concat을 사용하여 apiSlice를 미들웨어로 추가합니다.
    getDefaultMiddleware().concat(apiSlice.middleware),
})

// 타입스크립트가 스토어의 전체 상태를 추론하도록 합니다.
export type RootState = ReturnType<typeof store.getState>
// 타입스크립트가 스토어의 전체 디스패치 함수를 추론하도록 합니다.
export type AppDispatch = typeof store.dispatch

export default store

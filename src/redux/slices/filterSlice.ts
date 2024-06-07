import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// 각 필터의 값을 정의합니다.
type FilterValues = string | number | string[] | null

// FilterState 인터페이스를 정의합니다.
interface FilterState {
  selectedFilters: Record<string, FilterValues>
}

const initialState: FilterState = {
  selectedFilters: {},
}

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilter(
      state,
      action: PayloadAction<{ key: string; value: FilterValues }>,
    ) {
      state.selectedFilters[action.payload.key] = action.payload.value
    },
    clearFilters(state) {
      state.selectedFilters = {}
    },
  },
})

export const { setFilter, clearFilters } = filterSlice.actions
export default filterSlice.reducer

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Filters } from '@/types/Filters'

const initialState: Partial<Filters> = {
  priceMin: 14000,
  priceMax: 779850,
}

const priceRangeFilterSlice = createSlice({
  name: 'priceFilter',
  initialState,
  reducers: {
    setPriceRangeFilter: (state, action: PayloadAction<Partial<Filters>>) => {
      state.priceMin = action.payload.priceMin ?? state.priceMin
      state.priceMax = action.payload.priceMax ?? state.priceMax
    },
    setMinPrice(state, action: PayloadAction<number>) {
      state.priceMin = action.payload
    },
    setMaxPrice(state, action: PayloadAction<number>) {
      state.priceMax = action.payload
    },
    resetPriceRange(state) {
      state.priceMin = initialState.priceMin
      state.priceMax = initialState.priceMax
    },
  },
})

export const {
  setPriceRangeFilter,
  setMinPrice,
  setMaxPrice,
  resetPriceRange,
} = priceRangeFilterSlice.actions
export default priceRangeFilterSlice.reducer

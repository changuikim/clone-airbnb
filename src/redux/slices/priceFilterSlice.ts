import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Filters } from '@/types/Filters'

const initialState: Partial<Filters> = {
  priceMin: 100,
  priceMax: 200,
}

const priceFilterSlice = createSlice({
  name: 'priceFilter',
  initialState,
  reducers: {
    setPriceFilter: (state, action: PayloadAction<Partial<Filters>>) => {
      state.priceMin = action.payload.priceMin ?? state.priceMin
      state.priceMax = action.payload.priceMax ?? state.priceMax
    },
    resetPriceFilter: () => initialState,
  },
})

export const { setPriceFilter, resetPriceFilter } = priceFilterSlice.actions
export default priceFilterSlice.reducer

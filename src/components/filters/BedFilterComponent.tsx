import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setBedrooms,
  setBeds,
  setBathrooms,
} from '@/redux/slices/bedFilterSlice'
import { RootState } from '@/redux/store'

const BedFilterComponent: React.FC = () => {
  const dispatch = useDispatch()
  const { bedrooms, beds, bathrooms } = useSelector(
    (state: RootState) => state.bedFilter,
  )

  const handleBedroomClick = (value: number | null) => {
    dispatch(setBedrooms(value))
  }

  const handleBedClick = (value: number | null) => {
    dispatch(setBeds(value))
  }

  const handleBathroomClick = (value: number | null) => {
    dispatch(setBathrooms(value))
  }

  const renderButtons = (
    selectedValue: number | null,
    handleClick: (value: number | null) => void,
  ) => (
    <div className='flex space-x-2'>
      <button
        onClick={() => handleClick(null)}
        className={`border px-4 py-2 ${selectedValue === null ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}>
        상관없음
      </button>
      {[1, 2, 3, 4, 5, 6, 7].map(value => (
        <button
          key={value}
          onClick={() => handleClick(value)}
          className={`border px-4 py-2 ${selectedValue === value ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}>
          {value}
        </button>
      ))}
      <button
        onClick={() => handleClick(8)}
        className={`border px-4 py-2 ${selectedValue === 8 ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}>
        8+
      </button>
    </div>
  )

  return (
    <div className='p-4'>
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700'>침실</label>
        {renderButtons(bedrooms, handleBedroomClick)}
      </div>
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700'>침대</label>
        {renderButtons(beds, handleBedClick)}
      </div>
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700'>욕실</label>
        {renderButtons(bathrooms, handleBathroomClick)}
      </div>
    </div>
  )
}

export default BedFilterComponent

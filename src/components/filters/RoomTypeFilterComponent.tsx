import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setRoomTypeFilter } from '@/redux/slices/roomTypeFilterSlice'
import { RootState } from '@/redux/store'

const RoomTypeFilterComponent: React.FC = () => {
  const dispatch = useDispatch()
  const roomTypeFilter = useSelector(
    (state: RootState) => state.roomTypeFilter.roomType,
  )

  const handleRoomTypeClick = (value: string) => {
    dispatch(setRoomTypeFilter(value))
  }

  return (
    <div className='p-4'>
      <label className='block text-sm font-medium text-gray-700'>
        숙소 유형
      </label>
      <div className='flex space-x-2'>
        <button
          onClick={() => handleRoomTypeClick('')}
          className={`border px-4 py-2 ${roomTypeFilter === '' ? 'bg-black text-white' : 'bg-white text-black'}`}>
          모든 유형
        </button>
        <button
          onClick={() => handleRoomTypeClick('방')}
          className={`border px-4 py-2 ${roomTypeFilter === '방' ? 'bg-black text-white' : 'bg-white text-black'}`}>
          방
        </button>
        <button
          onClick={() => handleRoomTypeClick('집 전체')}
          className={`border px-4 py-2 ${roomTypeFilter === '집 전체' ? 'bg-black text-white' : 'bg-white text-black'}`}>
          집 전체
        </button>
      </div>
    </div>
  )
}

export default RoomTypeFilterComponent

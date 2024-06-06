import { ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setAmenitiesFilter } from '@/redux/slices/amenitiesFilterSlice'
import { RootState } from '@/redux/store'
import { amenitiesList } from '@/utils/FilterItems'

const AmenitiesFilterComponent: React.FC = () => {
  const dispatch = useDispatch()
  const amenitiesFilter = useSelector(
    (state: RootState) => state.amenitiesFilter,
  )

  const handleAmenitiesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target
    const currentValues = amenitiesFilter.amenities || []
    if (checked) {
      dispatch(setAmenitiesFilter([...currentValues, value]))
    } else {
      dispatch(setAmenitiesFilter(currentValues.filter(v => v !== value)))
    }
  }

  return (
    <div className='p-4'>
      <label className='mb-2 block text-sm font-medium text-gray-700'>
        편의시설
      </label>
      {amenitiesList.map(amenity => (
        <label key={amenity} className='mt-2 inline-flex items-center'>
          <input
            type='checkbox'
            name='amenities'
            value={amenity}
            checked={amenitiesFilter.amenities?.includes(amenity)}
            onChange={handleAmenitiesChange}
            className='form-checkbox'
          />
          <span className='ml-2'>{amenity}</span>
        </label>
      ))}
    </div>
  )
}

export default AmenitiesFilterComponent
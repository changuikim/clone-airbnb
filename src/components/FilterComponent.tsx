'use client'

import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { useGetRoomsCountQuery } from '@/redux/apiSlice'
import PriceFilterComponent from '@/components/filters/PriceFilterComponent'
import RoomTypeFilterComponent from '@/components/filters/RoomTypeFilterComponent'
import BedFilterComponent from '@/components/filters/BedFilterComponent'
import AmenitiesFilterComponent from '@/components/filters/AmenitiesFilterComponent'
import { resetAmenitiesFilter } from '@/redux/slices/amenitiesFilterSlice'
import { resetBedFilter } from '@/redux/slices/bedFilterSlice'
import { resetPriceFilter } from '@/redux/slices/priceFilterSlice'
import { resetRoomTypeFilter } from '@/redux/slices/roomTypeFilterSlice'
import { Filters } from '@/types/Filters'

function FilterComponent(): React.ReactElement {
  const dispatch = useDispatch()

  // 1. useSelector를 사용하여 각 필터 항목의 상태를 가져와 filters 변수에 설정합니다.
  const priceFilter = useSelector((state: RootState) => state.priceFilter)
  const roomTypeFilter = useSelector((state: RootState) => state.roomTypeFilter)
  const bedFilter = useSelector((state: RootState) => state.bedFilter)
  const amenitiesFilter = useSelector(
    (state: RootState) => state.amenitiesFilter,
  )

  const filters: Partial<Filters> = {
    priceMin: priceFilter.priceMin || null,
    priceMax: priceFilter.priceMax || null,
    roomType: roomTypeFilter.roomType || '',
    bedrooms: bedFilter.bedrooms || null,
    beds: bedFilter.beds || null,
    amenities:
      amenitiesFilter.amenities.length > 0 ? amenitiesFilter.amenities : [],
  }

  const handleClearFilters = () => {
    dispatch(resetAmenitiesFilter())
    dispatch(resetBedFilter())
    dispatch(resetPriceFilter())
    dispatch(resetRoomTypeFilter())
  }

  // 2. useGetRoomsCountQuery 훅을 사용하여 필터링된 방의 개수를 가져옵니다.
  // Redux의 상태 값이 변경될 때마다 useGetRoomsCountQuery 훅이 다시 실행됩니다.
  const { data, error, isLoading } = useGetRoomsCountQuery(filters)

  return (
    <div className='rounded-lg bg-white p-6 shadow-md'>
      <h2 className='mb-4 text-xl font-bold'>필터</h2>
      <PriceFilterComponent />
      <RoomTypeFilterComponent />
      <BedFilterComponent />
      <AmenitiesFilterComponent />
      <div className='mt-6'>
        <button onClick={handleClearFilters} className='text-red-500'>
          모든 필터 초기화
        </button>
        <p className='text-lg font-semibold'>
          숙소 {isLoading ? 'Loading...' : data?.count}개 보기
        </p>
        {error && (
          <p className='text-red-500'>데이터를 가져오는데 실패했습니다.</p>
        )}
      </div>
    </div>
  )
}

export default FilterComponent

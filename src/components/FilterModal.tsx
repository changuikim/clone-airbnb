'use client'

import { useSelector, useDispatch } from 'react-redux'
import { IoMdClose } from 'react-icons/io'
import { useRef, useEffect, useMemo } from 'react'
import { RootState } from '@/redux/store'
import { useGetRoomsCountQuery } from '@/redux/apiSlice'
import PriceRangeFilter from '@/components/filters/PriceRangeFilter'
import RoomTypeFilter from '@/components/filters/RoomTypeFilter'
import BedFilter from '@/components/filters/BedFilter'
import AmenitiesFilter from '@/components/filters/AmenitiesFilter'
import { resetAmenitiesFilter } from '@/redux/slices/amenitiesFilterSlice'
import { resetBedFilter } from '@/redux/slices/bedFilterSlice'
import { resetPriceRange } from '@/redux/slices/priceRangeFilterSlice'
import { resetRoomTypeFilter } from '@/redux/slices/roomTypeFilterSlice'
import { closeModal, setModalScrollPosition } from '@/redux/slices/modalSlice'
import { Filters } from '@/types/Filters'
import Portal from '@/components/Portal'

function FilterModal(): React.ReactElement {
  const dispatch = useDispatch()
  const bodyRef = useRef<HTMLDivElement>(null)
  const modalScrollPosition = useSelector(
    (state: RootState) => state.modal.modalScrollPosition,
  )

  const priceFilter = useSelector((state: RootState) => state.priceRangeFilter)
  const roomTypeFilter = useSelector((state: RootState) => state.roomTypeFilter)
  const bedFilter = useSelector((state: RootState) => state.bedFilter)
  const amenitiesFilter = useSelector(
    (state: RootState) => state.amenitiesFilter,
  )

  const filters: Partial<Filters> = useMemo(
    () => ({
      priceMin: priceFilter.priceMin || null,
      priceMax: priceFilter.priceMax || null,
      roomType: roomTypeFilter.roomType || '',
      bedrooms: bedFilter.bedrooms || null,
      beds: bedFilter.beds || null,
      amenities:
        amenitiesFilter.amenities.length > 0 ? amenitiesFilter.amenities : [],
    }),
    [priceFilter, roomTypeFilter, bedFilter, amenitiesFilter],
  )

  const handleCloseModal = () => {
    dispatch(closeModal())
  }

  const handleClearFilters = () => {
    dispatch(resetAmenitiesFilter())
    dispatch(resetBedFilter())
    dispatch(resetPriceRange())
    dispatch(resetRoomTypeFilter())
  }

  const handleApplyFilters = () => {
    dispatch(closeModal())
  }

  const { data, error, isLoading } = useGetRoomsCountQuery(filters)

  // 컴포넌트 마운트될때 스크롤 위치를 복원
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = modalScrollPosition
    }
  }, [modalScrollPosition])

  // 컴포넌트가 언마운트될 때 스크롤 위치를 저장
  useEffect(
    () => () => {
      if (bodyRef.current) {
        dispatch(setModalScrollPosition(bodyRef.current.scrollTop))
      }
    },
    [dispatch],
  )

  return (
    <Portal>
      <div className='fixed inset-0 z-50 flex items-center justify-center outline-none bg-neutral-800/70 focus:outline-none'>
        <div className='relative w-full max-w-3xl mx-auto my-6 overflow-hidden h-5/6'>
          <div className='relative flex flex-col w-full h-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none'>
            <div className='flex items-center justify-center p-6 border-b border-solid rounded-t border-slate-200'>
              <button
                onClick={handleCloseModal}
                className='absolute p-1 transition border-0 left-9 hover:opacity-70'>
                <IoMdClose size={18} />
              </button>
              <div className='text-lg font-semibold'>필터</div>
            </div>
            <div ref={bodyRef} className='relative flex-auto overflow-y-auto'>
              <PriceRangeFilter />
              <RoomTypeFilter />
              <BedFilter />
              <AmenitiesFilter />
            </div>
            <div className='flex flex-col items-center w-full gap-4 p-6 border-t'>
              <button
                onClick={handleClearFilters}
                className='w-full py-3 font-semibold text-black transition bg-white border-2 border-black rounded-lg text-md hover:opacity-80'>
                전체 해제
              </button>
              <button
                onClick={handleApplyFilters}
                className='w-full py-3 font-semibold text-white transition bg-black rounded-lg text-md hover:opacity-80'>
                숙소 {isLoading ? 'Loading...' : data?.count}개 보기
              </button>
              {error && (
                <p className='text-red-500'>
                  데이터를 가져오는데 실패했습니다.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Portal>
  )
}

export default FilterModal

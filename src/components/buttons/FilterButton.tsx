'use client'

import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'
import { openModal } from '@/redux/slices/modalSlice'
import FilterModal from '@/components/FilterModal'
import { RootState } from '@/redux/store'

function FilterButton() {
  const dispatch = useDispatch()
  const isOpen = useSelector((state: RootState) => state.modal.isOpen)

  const handleOpenModal = () => {
    dispatch(
      openModal({
        modalProps: {
          // ...modalProps,
        },
      }),
    )
  }

  return (
    <div className='flex items-center justify-center'>
      <button
        onClick={handleOpenModal}
        className='flex h-full cursor-pointer flex-col items-center justify-center rounded-lg border-[1px] border-solid border-neutral-300 px-0 py-2 transition hover:shadow-md'>
        <span className='flex flex-row items-center justify-between gap-2 px-4 pb-0 pt-0.5'>
          <Image
            alt={'FilterIcon'}
            src={`/images/FilterIcon.svg`}
            width={16}
            height={16}
            style={{ width: 16, height: 16 }}
          />
          <span className='text-xs font-semibold'>필터</span>
        </span>
      </button>
      {isOpen && <FilterModal />}
    </div>
  )
}

export default FilterButton

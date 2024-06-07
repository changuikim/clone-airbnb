import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Range, getTrackBackground } from 'react-range'
import _ from 'lodash'
import clsx from 'clsx'
import { RootState } from '@/redux/store'
import { setMinPrice, setMaxPrice } from '@/redux/slices/priceRangeFilterSlice'

const MIN = 14000
const MAX = 779850
const STEP = 1
const GAP = 10000
const BINS = 40

// 히스토그램 데이터입니다. (40개의 구간)
const histogramData = [
  1, 2, 3, 5, 8, 12, 18, 25, 33, 42, 52, 62, 72, 82, 91, 98, 104, 109, 112, 114,
  114, 112, 109, 104, 98, 91, 82, 72, 62, 52, 42, 33, 25, 18, 12, 8, 5, 3, 2, 1,
]

function Heading() {
  return (
    <div className='flex flex-col'>
      <span className='text-2xl font-semibold'>가격 범위</span>
      <span className='pt-2 text-sm text-gray-500'>
        1박 요금(수수료 및 세금 포함)
      </span>
    </div>
  )
}

/**
 * 히스토그램을 그려내는 컴포넌트
 * 전역상태 min, max의 변화에 따라 각 막대 그래프의 음영이 변화합니다.
 * @prop {number} min - 전역상태의 최소 가격
 * @prop {number} max - 전역상태의 최대 가격
 * @prop {number[]} histogramData - 각 구간별 숙소의 개수
 */
function Histogram({ min, max, histogramData }) {
  // 각 막대 그래프의 너비를 계산합니다. (현재 40구간)
  const binWidth = (MAX - MIN) / BINS

  return (
    <div className='relative flex items-end w-full h-24'>
      {histogramData.map((count, index) => {
        // 각 막대 그래프를 그려낼 시작점과 끝점입니다.
        const binMin = MIN + index * binWidth
        const binMax = binMin + binWidth
        // 사용자의 최소보다 크고 최대보다 작다면, 선택된 구간입니다.
        const isSelected = binMin >= min && binMax <= max
        return (
          <div
            key={index}
            // 선택된 구간의 막대 그래프는 진하게, 아니면 연하게 그려냅니다.
            className={clsx('mx-1 flex-1', {
              'bg-black': isSelected,
              'bg-gray-300': !isSelected,
            })}
            style={{
              height: `${(count / Math.max(...histogramData)) * 100}%`,
            }}
          />
        )
      })}
    </div>
  )
}

// 가격 범위가 변하지 않았다면, 리렌더링을 방지합니다.
const MemoizedHistogram = React.memo(
  Histogram,
  (prevProps, nextProps) =>
    prevProps.min === nextProps.min && prevProps.max === nextProps.max,
)

/**
 * 가격 범위를 조절하는 슬라이드 바 컴포넌트
 * 전역상태 min, max의 변화에 따라 가로 막대의 음영이 변화합니다.
 * 사용자 인터랙션으로 가로 막대의 양 끝을 조절하여 전역상태를 변경할 수 있습니다.
 * @prop {number} min - 전역상태의 최소 가격
 * @prop {number} max - 전역상태의 최대 가격
 * @prop {function} handlePriceChange - 전역상태를 변경하는 함수
 */
function RangeBar({ min, max, onChange: handlePriceChange }) {
  return (
    <div className='flex flex-col items-center'>
      <Range
        step={STEP}
        min={MIN}
        max={MAX}
        values={[min, max]}
        onChange={handlePriceChange}
        // 가로 막대를 렌더링합니다.
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className='flex w-full h-2 bg-gray-300 rounded'
            style={{
              background: getTrackBackground({
                values: [min, max],
                colors: ['#ccc', '#000', '#ccc'],
                min: MIN,
                max: MAX,
              }),
            }}>
            {children}
          </div>
        )}
        // 양 끝의 동그라미를 렌더링합니다.
        renderThumb={({ props }) => (
          <div
            {...props}
            key={props.key}
            className='w-8 h-8 bg-white border border-gray-200 border-solid rounded-full shadow'
          />
        )}
      />
    </div>
  )
}

/**
 * 가격 범위를 조절하는 입력 필드 컴포넌트
 * 지역 상태 localMin, localMax의 변화에 따라 입력 필드의 값이 변화합니다.
 * 전역 상태 min, max가 변화할 시 localMin, localMax가 변화하여 입력 필드의 값에 반영됩니다.
 * 사용자 인터랙션으로 지역 상태를 변경할 수 있습니다.
 * 포커스가 떠날때 지역 상태의 유효성을 검사하여 전역 상태를 변경할 수 있습니다.
 * @prop {string} label - 입력 필드의 라벨
 * @prop {string} value - 입력 필드의 값
 * @prop {function} onChange - 입력 필드의 값이 변화할 때 호출되는 함수
 * @prop {function} onBlur - 입력 필드의 포커스가 떠날 때 호출되는 함수
 */
function InputBox({ label, value, onChange, onBlur }) {
  return (
    <div className='relative flex flex-col items-center'>
      <div className='relative w-40 h-16'>
        <span className='absolute text-lg transform -translate-y-1/2 left-2 top-1/2'>
          ₩
        </span>
        <input
          type='text'
          value={value || ''}
          onChange={onChange}
          onBlur={onBlur}
          className='w-full h-full pl-8 text-lg text-left border rounded'
          min={MIN}
          max={MAX}
          style={{ paddingLeft: '2rem' }}
        />
      </div>
      <label className='absolute text-sm text-gray-500 left-3 top-1'>
        {label}
      </label>
    </div>
  )
}

function PriceRangeFilter() {
  const dispatch = useDispatch()

  // 사용자가 설정하고자하는 가격 범위의 최소, 최대를 반영하는 전역 상태입니다.
  const { priceMin: min, priceMax: max } = useSelector(
    (state: RootState) => state.priceRangeFilter,
  )

  // 사용자의 인터랙션의 유효성을 검사하기 위해 로컬 상태를 사용합니다.
  const [localMin, setLocalMin] = useState(null)
  const [localMax, setLocalMax] = useState(null)

  // 유효성 검사를 통과해 전역 상태가 변경되면, 로컬 상태를 전역 상태에 동기화합니다.
  useEffect(() => {
    setLocalMin(min)
    setLocalMax(max)
  }, [min, max])

  // lodash의 throttle을 사용하여, 200ms마다 값을 업데이트합니다. (과도한 리렌더링 방지)
  const throttledPriceChange = useMemo(
    () =>
      _.throttle((values: number[]) => {
        let [newMin, newMax] = values

        if (newMin >= newMax) {
          if (newMin === newMax) {
            newMin = Math.max(MIN, newMin - GAP)
            newMax = Math.min(MAX, newMax + GAP)
          } else {
            ;[newMin, newMax] = [newMax, newMin]
          }
        }

        dispatch(setMinPrice(newMin))
        dispatch(setMaxPrice(newMax))
      }, 200),
    [dispatch],
  )

  // 슬라이드 바가 움직일때마다 throttledPriceChange를 호출합니다.
  // lodash의 throttle로 감싸져 있기 때문에 사용자의 인터랙션은 200ms마다 한번씩만 처리됩니다.
  const handlePriceChange = useCallback(
    (values: number[]) => {
      throttledPriceChange(values)
    },
    [throttledPriceChange],
  )

  // 왼쪽 input의 입력을 지역 상태에 반영합니다.
  const handleLeftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalMin(e.target.value)
  }

  // 왼쪽 input의 지역 상태 유효성을 검사한 후 전역 상태에 반영합니다.
  const handleLeftBlur = () => {
    let value = Number(localMin)
    if (Number.isNaN(value) || value < MIN || value >= localMax) {
      setLocalMin(min)
    } else {
      if (value > max - GAP) value = max - GAP
      dispatch(setMinPrice(value))
    }
  }

  // 오른쪽 input의 입력을 지역 상태에 반영합니다.
  const handleRightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalMax(e.target.value)
  }

  // 오른쪽 input의 지역 상태 유효성을 검사한 후 전역 상태에 반영합니다.
  const handleRightBlur = () => {
    let value = Number(localMax)
    if (Number.isNaN(value) || value > MAX || value <= localMin) {
      setLocalMax(max)
    } else {
      if (value < min + GAP) value = min + GAP
      dispatch(setMaxPrice(value))
    }
  }

  return (
    <div className='flex flex-col px-6 py-8 space-y-4 border-b border-solid border-slate-300'>
      <Heading />
      <MemoizedHistogram min={min} max={max} histogramData={histogramData} />
      <RangeBar min={min} max={max} onChange={handlePriceChange} />
      <div className='flex justify-between space-x-4'>
        <InputBox
          label='최저'
          value={localMin}
          onChange={handleLeftChange}
          onBlur={handleLeftBlur}
        />
        <InputBox
          label='최고'
          value={localMax}
          onChange={handleRightChange}
          onBlur={handleRightBlur}
        />
      </div>
    </div>
  )
}

export default PriceRangeFilter

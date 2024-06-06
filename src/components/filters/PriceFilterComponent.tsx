import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Range, getTrackBackground } from 'react-range'
import { Bar } from 'react-chartjs-2'
import { setPriceFilter } from '@/redux/slices/priceFilterSlice'
import { RootState } from '@/redux/store'
import 'chart.js/auto'

const MIN = 0
const MAX = 500
const STEP = 10

const PriceFilterComponent: React.FC = () => {
  const dispatch = useDispatch()
  const priceFilter = useSelector((state: RootState) => state.priceFilter)
  const [values, setValues] = useState([
    priceFilter.priceMin,
    priceFilter.priceMax,
  ])

  const data = [
    { id: 1, price: 100 },
    { id: 2, price: 200 },
    { id: 3, price: 150 },
    { id: 4, price: 250 },
    { id: 5, price: 120 },
    // 추가 데이터를 필요에 따라 추가하세요.
  ]

  const priceDistribution = Array.from(
    { length: (MAX - MIN) / STEP + 1 },
    (_, i) => ({
      range: i * STEP + MIN,
      count: data.filter(
        item =>
          item.price >= i * STEP + MIN && item.price < (i + 1) * STEP + MIN,
      ).length,
    }),
  )

  const handlePriceChange = (values: number[]) => {
    setValues(values)
    dispatch(setPriceFilter({ priceMin: values[0], priceMax: values[1] }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const newValue = parseInt(value, 10)

    if (name === 'priceMin') {
      const updatedValues = [Math.min(newValue, values[1] - STEP), values[1]]
      setValues(updatedValues)
      dispatch(setPriceFilter({ priceMin: updatedValues[0] }))
    } else if (name === 'priceMax') {
      const updatedValues = [values[0], Math.max(newValue, values[0] + STEP)]
      setValues(updatedValues)
      dispatch(setPriceFilter({ priceMax: updatedValues[1] }))
    }
  }

  const chartData = {
    labels: priceDistribution.map(item => `${item.range}-${item.range + STEP}`),
    datasets: [
      {
        label: 'Price Distribution',
        data: priceDistribution.map(item => item.count),
        backgroundColor: priceDistribution.map(item =>
          item.range >= values[0] && item.range < values[1]
            ? 'rgba(0, 0, 0, 0.5)'
            : 'rgba(0, 0, 0, 0.1)',
        ),
      },
    ],
  }

  return (
    <div className='p-4'>
      <label className='block text-sm font-medium text-gray-700'>
        가격 범위
      </label>
      <Bar data={chartData} />
      <Range
        values={values}
        step={STEP}
        min={MIN}
        max={MAX}
        onChange={handlePriceChange}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '36px',
              display: 'flex',
              width: '100%',
            }}>
            <div
              ref={props.ref}
              style={{
                height: '5px',
                width: '100%',
                borderRadius: '4px',
                background: getTrackBackground({
                  values,
                  colors: ['#ccc', '#548BF4', '#ccc'],
                  min: MIN,
                  max: MAX,
                }),
                alignSelf: 'center',
              }}>
              {children}
            </div>
          </div>
        )}
        renderThumb={({ index, props }) => (
          <div
            {...props}
            key={index} // key를 직접 추가
            style={{
              ...props.style,
              height: '24px',
              width: '24px',
              borderRadius: '12px',
              backgroundColor: '#FFF',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0px 2px 6px #AAA',
            }}>
            <div
              style={{
                height: '16px',
                width: '5px',
                backgroundColor: '#548BF4',
              }}
            />
          </div>
        )}
      />
      <div className='flex justify-between mt-4'>
        <input
          type='number'
          name='priceMin'
          value={values[0]}
          onChange={handleInputChange}
          min={MIN}
          max={values[1] - STEP}
          className='w-1/3 p-2 border rounded'
        />
        <span className='mx-2'>—</span>
        <input
          type='number'
          name='priceMax'
          value={values[1]}
          onChange={handleInputChange}
          min={values[0] + STEP}
          max={MAX}
          className='w-1/3 p-2 border rounded'
        />
      </div>
    </div>
  )
}

export default PriceFilterComponent

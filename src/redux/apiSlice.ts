import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Filters } from '@/types/Filters'

// RTK Query를 사용하기 위한 API Slice입니다.
export const apiSlice = createApi({
  // 1. 일반적인 Slice의 name에 해당합니다.
  reducerPath: 'api',
  // 2. API를 요청하는 기본 URL을 설정합니다.
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  // RTK Query의 엔드포인트는 query 또는 mutation으로 정의합니다.
  // query는 데이터를 가져오는 엔드포인트로 GET 요청과 SQL문의 SELECT와 관련됩니다.
  // mutation은 데이터를 변경하는 엔드포인트로 POST, PUT, DELETE 요청과 SQL문의 INSERT, UPDATE, DELETE와 관련됩니다.
  endpoints: builder => ({
    // 3. 엔드포인트를 정의하면 자동으로 use이름Query, useLazy이름Query라는 훅이 생성됩니다.
    getRoomsCount: builder.query<{ count: number }, Partial<Filters>>({
      // 이 엔드포인트는 FilterComponent에서 사용되고 있으며, 숙소를 필터링하기 위한 filters 객체를 매개변수로 전달받습니다.
      query: filters => {
        const queryString = new URLSearchParams(
          // 4. Object.entries(filters)는 filters 객체를 [key, value] 쌍의 배열로 변환합니다.
          Object.entries(filters).reduce(
            // 배열.reduce를 사용하면 배열의 모든 요소를 순회하면서 결과물을 acc에 누적해서 최종 결과물을 반환합니다.
            (acc, [key, value]) => {
              // 편의시설 등 여러 개 선택가능한 필터는 배열로 들어오므로, 배열인 경우 쉼표로 구분된 문자열로 변환합니다.
              if (Array.isArray(value)) {
                acc[key] = value.join(',')
                // 그외 빈 값이 아닌 숫자 또는 문자열인 경우 문자열로 형변환합니다.
              } else if (value !== null && value !== '') {
                acc[key] = value.toString()
              }
              return acc
            },
            // acc의 초기값은 빈 객체이며 키의 타입은 문자열이고 값의 타입은 문자열입니다.
            {} as Record<string, string>,
          ),
        ).toString()
        // 5. 최종적으로 filters 객체는 UrlSearchParams와 reduce()를 사용해 키=값 형태의 쿼리스트링으로 변환됩니다.
        return `/filter?${queryString}`
      },
    }),
  }),
})

export const { useGetRoomsCountQuery } = apiSlice

/*
  apiSlice는 FilterComponent에서 비동기적으로 필터링된 숙소의 개수를 업데이트하기 위해  RTK Query를 사용하는 파일입니다.

  1. store에 등록할 Slice의 이름을 reducerPath에 설정합니다.
  2. API를 요청할 기본 URL을 설정합니다.
  3. RTK Query의 엔드포인트를 정의합니다.
  4. 엔드포인트에서 요청할 query 또는 mutation의 요청을 정의합니다.
  5. useGetRoomsCountQuery 훅은 baseUrl에 설정된 URL과 query에서 반환된 쿼리스트링을 합쳐서 최종적인 URL을 반환합니다.
  6. 보내진 쿼리스트링은 /api/filter/routes.ts의 GET 엔드포인트로 전달되어 파싱될 예정입니다.
  
*/

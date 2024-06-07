export interface Filters {
  priceMin: number | null
  priceMax: number | null
  roomType: string
  bedrooms: number | null
  beds: number | null
  bathrooms: number | null
  amenities: string[]
  bookingOptions: string[]
  buildingType: string
  name: string
  age: number | null
  city: string
}

export interface Room {
  id: number
  name: string
  pricePerDay: number
  roomType: string
  bedrooms: number
  beds: number
  bathrooms: number
  amenities: string[]
  bookingOptions: string[]
  buildingType: string
  age: number
  city: string
}

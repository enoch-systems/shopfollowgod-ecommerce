// Product data fetched from Supabase
import { supabase } from '../utils/supabase'

let cachedProducts = null
let cachePromise = null

export const products = []
export default products

export async function fetchProducts() {
  // Return cached data if available
  if (cachedProducts) {
    return cachedProducts
  }

  // Return existing promise if fetch is in progress
  if (cachePromise) {
    return cachePromise
  }

  // Start new fetch
  cachePromise = (async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false })

      if (error) throw error
      
      cachedProducts = data || []
      return cachedProducts
    } catch (err) {
      console.error('Error fetching products:', err)
      // Return empty array on error
      return []
    } finally {
      cachePromise = null
    }
  })()

  return cachePromise
}

// For client-side components that need synchronous access,
// we'll export a function that returns products asynchronously
export function getProducts() {
  return cachedProducts || []
}
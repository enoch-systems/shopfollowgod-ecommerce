// Product data fetched from Firebase Firestore
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../utils/firebase'

// Helper to generate Cloudinary URL
export function cld(name, options = {}) {
  const CLOUD_NAME = 'djdbcoyot'
  const CLOUD_BASE = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`
  const {
    width,
    height,
    format = 'auto',
    quality = 'auto',
    crop = 'limit',
  } = options

  const transforms = [`f_${format}`, `q_${quality}`]
  if (width) transforms.push(`w_${width}`)
  if (height) transforms.push(`h_${height}`)
  transforms.push('c_' + crop)

  return `${CLOUD_BASE}/${transforms.join(',')}/followgod/assets/${name}`
}

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
      const q = query(collection(db, 'products'), orderBy('id', 'asc'))
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      
      // Sort by numeric id descending (newest first)
      data.sort((a, b) => b.id - a.id)
      
      // Convert Cloudinary URLs to cld format for client-side usage
      // Keep the URLs as-is since they're already full Cloudinary URLs from admin
      
      cachedProducts = data
      return data
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
// Cloudinary image URL helper
// Usage: cld.image('em1') → returns the Cloudinary transformation URL

const CLOUD_NAME = 'djdbcoyot'
const CLOUD_BASE = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`

// Map logical image names to their Cloudinary public IDs
// Format: cld.image('em1') or cld.image('tactical_camo')
export function cld(name, options = {}) {
  const {
    width,
    height,
    format = 'auto',
    quality = 'auto',
    crop = 'limit',
  } = options

  // Build transformation string
  const transforms = [`f_${format}`, `q_${quality}`]
  if (width) transforms.push(`w_${width}`)
  if (height) transforms.push(`h_${height}`)
  transforms.push('c_' + crop)

  const transformStr = transforms.join(',')

  // Determine folder: most product images are in 'followgod/assets'
  // Hero images (em1-em6) and public images are in 'followgod/public'
  const heroImages = ['em1', 'em2', 'em3', 'em4', 'em5', 'em6']
  const folder = heroImages.includes(name) ? 'followgod/public' : 'followgod/assets'

  return `${CLOUD_BASE}/${transformStr}/v1/${folder}/${name}`
}

// Default export for convenience
export default { image: cld }
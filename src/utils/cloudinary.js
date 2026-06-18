// Cloudinary image URL helper
// Usage: cld('em1') → returns the Cloudinary transformation URL
const CLOUD_NAME = 'djdbcoyot'
const CLOUD_BASE = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`

export function cld(name, options = {}) {
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

  const transformStr = transforms.join(',')
  // All uploaded images live in followgod/assets
  const folder = 'followgod/assets'

  return `${CLOUD_BASE}/${transformStr}/${folder}/${name}`
}

export default { image: cld }
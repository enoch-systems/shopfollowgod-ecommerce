const CLOUD_NAME = 'djdbcoyot'
const CLOUD_BASE = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`
const CLOUD_RAW = `https://res.cloudinary.com/${CLOUD_NAME}/raw/upload`

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

  return `${CLOUD_BASE}/${transforms.join(',')}/followgod/assets/${name}`
}

/** For SVG / raw assets uploaded with resource_type: 'raw' */
export function cldRaw(name) {
  return `${CLOUD_RAW}/followgod/assets/${name}`
}

export default { image: cld, raw: cldRaw }
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

/**
 * Upload an image to Cloudinary using unsigned upload preset.
 * @param {File} file
 * @param {string} uploadPreset - your unsigned preset name
 * @returns {Promise<{secure_url: string}>}
 */
export async function upload(file, uploadPreset = 'ml_default') {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
  const form = new FormData()
  form.append('file', file)
  form.append('upload_preset', uploadPreset)

  const res = await fetch(url, {
    method: 'POST',
    body: form,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Cloudinary upload failed: ${res.status} ${text}`)
  }

  return await res.json()
}

export default { image: cld, raw: cldRaw, upload }
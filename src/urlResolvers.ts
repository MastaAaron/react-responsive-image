export type CropSetting = "left" | "right" | "top" | "center" | "bottom"

interface ImageParams {
  width?: number
  height?: number
  quality?: number
  crop?: CropSetting
}

/**
 * Adds the provided image transform params to the provided URL in the correct format
 * assuming it's a Shopify image URL
 */
const addShopifyParams = (url: URL, params: ImageParams) => {
  const existingParamsRegex = /_(\d+x\d+|\d+x|x\d+)(_crop_[^.]+)?(\.[^.]+)$/

  // Remove existing transformation params from URL
  url.pathname = url.pathname.replace(existingParamsRegex, "$3")

  // NOTE: this regex assumes there's always a file extension, so the end of
  // an extensionless path will be captured as an extension if there's a dot
  // However – Shopify image URLs reliably have file extensions, so it's okay
  const fileNameRegex = /(?<file>\S+)(?<extension>\.[^.]+)$/

  const { file, extension } = url.pathname.match(fileNameRegex)?.groups || {}

  const { width, height, crop } = params

  const stringParams = []

  // e.g. "800x600", "800x", "x600"
  if (width || height) {
    stringParams.push([width || "", height || ""].join("x"))
  }

  if (crop) {
    stringParams.push(`crop_${crop}`)
  }

  // e.g. "path/to/file_800x600_crop_center.jpg"
  url.pathname = [file, ...stringParams].join("_") + extension
}

/**
 * Adds the provided image transform params to the provided URL in the correct format
 * assuming it's a Contentful asset URL
 */
const addContentfulParams = (url: URL, params: ImageParams) => {
  const { width, height, quality, crop } = params

  const urlParams = new URLSearchParams()

  if (width) urlParams.append("w", width.toString())
  if (height) urlParams.append("h", height.toString())
  if (quality) urlParams.append("q", quality.toString())

  if (crop) {
    urlParams.append("f", crop) // Focus area
    urlParams.append("fit", "crop") // Resize mode
  }

  url.search = urlParams.toString()
  url.protocol = "https:"
}

/**
 * Adds the provided image transform params to the provided URL in the correct format
 * Compatible with Shopify & Contentful asset URLs
 */
export default function resolveUrlDefault(
  inputUrl: string,
  params: ImageParams
) {
  // URL() class doesn't support protocol-relative URLs
  // Make sure input URL contains full protocol; assume HTTPS as fallback
  const url = inputUrl?.startsWith?.("//") ? `https:${inputUrl}` : inputUrl

  try {
    const urlObj = new URL(url)

    if (urlObj.hostname.includes("shopify")) addShopifyParams(urlObj, params)

    if (urlObj.hostname.includes("ctfassets"))
      addContentfulParams(urlObj, params)

    return urlObj.toString()
  } catch (err) {
    // URL() doesn't support relative URLs; just return original input URL if this
    // is the reason that parsing failed (we're assuming that locally-hosted images
    // don't support URL-based transformations)
    if (inputUrl?.startsWith?.("/")) return inputUrl

    // Catch-all for any other problems parsing URL; just return original URL passed
    return inputUrl
  }
}

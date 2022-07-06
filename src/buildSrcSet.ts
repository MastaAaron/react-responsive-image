import resolveUrlDefault, { ImageParams, URLResolver } from "./urlResolvers"

const widths = [
  240, 320, 480, 640, 768, 800, 1024, 1280, 1440, 1680, 1920, 2240, 2560, 3000,
  3440
]

type BuildSrcSetWParams = Pick<ImageParams, "quality" | "crop"> & {
  srcSetWidths?: number[]
  resolveUrl?: URLResolver
}

export function buildSrcSetW(src: string, params?: BuildSrcSetWParams) {
  const {
    quality,
    crop,
    srcSetWidths,
    resolveUrl: resolveUrlParam
  } = params || {}

  const resolveUrl = resolveUrlParam || resolveUrlDefault

  return (srcSetWidths || widths)
    .map((width) => {
      return resolveUrl(src, { width, quality, crop }) + ` ${width}w`
    })
    .join(",\n")
}

const densities = [1, 1.5, 2, 3]

type BuildSrcSetXParams = Pick<ImageParams, "quality" | "crop"> & {
  minWidth: number
  resolveUrl?: URLResolver
}

export function buildSrcSetX(src: string, params: BuildSrcSetXParams) {
  const { minWidth, quality, crop, resolveUrl: resolveUrlParam } = params

  const resolveUrl = resolveUrlParam || resolveUrlDefault

  return densities
    .map((density) => {
      return (
        resolveUrl(src, { width: minWidth * density, quality, crop }) +
        ` ${density}x`
      )
    })
    .join(",\n")
}

import resolveUrlDefault from "./urlResolvers"

const widths = [
  240, 320, 480, 640, 768, 800, 1024, 1280, 1440, 1680, 1920, 2240, 2560, 3000,
  3440
]

export function buildSrcSetW(src: string) {
  return widths
    .map((width) => {
      return resolveUrlDefault(src, { width }) + ` ${width}w`
    })
    .join(",\n")
}

const densities = [1, 1.5, 2, 3]

export function buildSrcSetX(src: string, minWidth: number) {
  return densities
    .map((density) => {
      return (
        resolveUrlDefault(src, { width: minWidth * density }) + ` ${density}x`
      )
    })
    .join(",\n")
}

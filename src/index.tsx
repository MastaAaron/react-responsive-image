import React, { CSSProperties, ImgHTMLAttributes } from "react"
import { buildSrcSetW, buildSrcSetX } from "./buildSrcSet"
import { CropSetting } from "./urlResolvers"

interface ImageSrcSetPropsX {
  descriptor: "x"
  minWidth: number
  // Don't allow properties below (from W)
  maxWidth?: never
  srcSetWidths?: never
  sizes?: never
}

interface ImageSrcSetPropsW {
  descriptor?: "w"
  maxWidth?: number
  srcSetWidths?: number[]
  sizes?: string
  // Don't allow properties below (from X)
  minWidth?: never
}

interface ImageCommonProps {
  src: string // 'src' is not required is standard HTML attributes but needs to be here
  quality?: number
  crop?: CropSetting
  objectFit?: CSSProperties["objectFit"]
  objectPosition?: CSSProperties["objectPosition"]
  resolveUrl?: () => string | undefined
}

type ImageHTMLElementProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "sizes" | "src"
>

type ImagePropsX = ImageHTMLElementProps & ImageCommonProps & ImageSrcSetPropsX
type ImagePropsW = ImageHTMLElementProps & ImageCommonProps & ImageSrcSetPropsW

type ImageProps = ImagePropsW | ImagePropsX

// TEMP - to test discriminating union type
// const mockProps: ImageProps = {
//   src: "/",
//   descriptor: "w",
//   maxWidth: 2000,
//   objectFit: "cover",
//   // minWidth: 200,
//   sizes: ""
// }

export function Image(props: ImageProps) {
  const {
    src,
    srcSet: srcSetProp,
    // descriptor = "w",
    // quality,
    // crop,
    // objectFit,
    // objectPosition,
    // resolveUrl,
    // minWidth,
    // maxWidth,
    // srcSetWidths,
    // sizes,
    ...passthroughProps
  } = props

  let srcSet = ""

  if (props.descriptor === "x") {
    srcSet = buildSrcSetX(src, props.minWidth)
  } else {
    srcSet = buildSrcSetW(src)
  }

  return <img srcSet={srcSetProp || srcSet} {...passthroughProps} />
}

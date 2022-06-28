import React, { CSSProperties, ImgHTMLAttributes } from "react"
import buildSrcSet from "./buildSrcSet"

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  quality?: number
  descriptor?: "w" | "x"
  objectFit?: CSSProperties["objectFit"]
  objectPosition?: CSSProperties["objectPosition"]
  resolveUrl?: () => string | undefined
}

export function Image(props: ImageProps) {
  const {
    src,
    srcSet: srcSetProp,
    quality,
    descriptor,
    objectFit,
    objectPosition,
    ...passthroughProps
  } = props

  const srcSet = srcSetProp || buildSrcSet(src)

  return <img {...passthroughProps} />
}

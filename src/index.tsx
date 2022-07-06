import React, { CSSProperties, ImgHTMLAttributes } from "react"
import { buildSrcSetW, buildSrcSetX } from "./buildSrcSet"
import { CropSetting, URLResolver } from "./urlResolvers"

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
  resolveUrl?: URLResolver
}

type ImageHTMLElementProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "sizes" | "src"
>

type ImagePropsX = ImageHTMLElementProps & ImageCommonProps & ImageSrcSetPropsX
type ImagePropsW = ImageHTMLElementProps & ImageCommonProps & ImageSrcSetPropsW

type ImageProps = ImagePropsW | ImagePropsX

function gatherProps<T extends ImageProps>(props: T) {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    descriptor, // Omitted
    // Descriptor-specific
    minWidth,
    maxWidth,
    srcSetWidths,
    sizes,
    // Common/config
    src,
    srcSet,
    objectFit,
    objectPosition,
    style: styleProp,
    quality,
    crop,
    resolveUrl,
    ...imageElementProps
  } = props

  const style: CSSProperties = {
    ...styleProp,
    objectFit,
    objectPosition
  }

  return {
    descriptorSpecificProps: {
      minWidth,
      maxWidth,
      srcSetWidths,
      sizes
    } as Pick<T, "minWidth" | "maxWidth" | "srcSetWidths" | "sizes">,
    commonProps: {
      src,
      srcSet,
      quality,
      crop,
      resolveUrl
    },
    passthroughProps: {
      style,
      ...imageElementProps
    }
  }
}

function ImageX(props: ImagePropsX) {
  const { descriptorSpecificProps, commonProps, passthroughProps } =
    gatherProps<ImagePropsX>(props)

  const { minWidth } = descriptorSpecificProps

  const { src, srcSet: srcSetProp, ...srcSetBuilderParams } = commonProps

  const srcSet = buildSrcSetX(src, { minWidth, ...srcSetBuilderParams })

  return <img srcSet={srcSetProp || srcSet} {...passthroughProps} />
}

function ImageW(props: ImagePropsW) {
  const { descriptorSpecificProps, commonProps, passthroughProps } =
    gatherProps<ImagePropsW>(props)

  const {
    maxWidth = 1280,
    sizes: sizesProp,
    srcSetWidths
  } = descriptorSpecificProps

  const { src, srcSet: srcSetProp, ...srcSetBuilderParams } = commonProps

  const srcSet = buildSrcSetW(src, { srcSetWidths, ...srcSetBuilderParams })
  const sizes = `(max-width: ${maxWidth}px) 100vw, ${maxWidth}px`

  return (
    <img
      sizes={sizesProp || sizes}
      srcSet={srcSetProp || srcSet}
      {...passthroughProps}
    />
  )
}

export function Image(props: ImageProps) {
  if (props.descriptor === "x") {
    return <ImageX {...props} />
  }

  return <ImageW {...props} />
}

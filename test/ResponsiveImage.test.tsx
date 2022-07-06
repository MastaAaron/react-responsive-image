import React from "react"
import { render } from "@testing-library/react"
import "@testing-library/jest-dom"
import { Image } from "../src/index"
import { URLResolver } from "../src/urlResolvers"

test("Correctly renders with width descriptors (default sizes/widths)", () => {
  const { getByTestId } = render(
    <Image
      data-testid="responsive-image"
      src="https://cdn.shopify.com/s/files/1/image.png"
      objectFit="cover"
      objectPosition="left"
    />
  )

  const imgElement = getByTestId("responsive-image")

  expect(imgElement).toBeInTheDocument()
  expect(imgElement).toHaveAttribute(
    "srcset",
    [
      "https://cdn.shopify.com/s/files/1/image_240x.png 240w",
      "https://cdn.shopify.com/s/files/1/image_320x.png 320w",
      "https://cdn.shopify.com/s/files/1/image_480x.png 480w",
      "https://cdn.shopify.com/s/files/1/image_640x.png 640w",
      "https://cdn.shopify.com/s/files/1/image_768x.png 768w",
      "https://cdn.shopify.com/s/files/1/image_800x.png 800w",
      "https://cdn.shopify.com/s/files/1/image_1024x.png 1024w",
      "https://cdn.shopify.com/s/files/1/image_1280x.png 1280w",
      "https://cdn.shopify.com/s/files/1/image_1440x.png 1440w",
      "https://cdn.shopify.com/s/files/1/image_1680x.png 1680w",
      "https://cdn.shopify.com/s/files/1/image_1920x.png 1920w",
      "https://cdn.shopify.com/s/files/1/image_2240x.png 2240w",
      "https://cdn.shopify.com/s/files/1/image_2560x.png 2560w",
      "https://cdn.shopify.com/s/files/1/image_3000x.png 3000w",
      "https://cdn.shopify.com/s/files/1/image_3440x.png 3440w"
    ].join(",\n")
  )

  expect(imgElement).toHaveAttribute(
    "sizes",
    "(max-width: 1280px) 100vw, 1280px"
  )

  expect(imgElement).toHaveAttribute("style")
  expect(imgElement.style).toHaveProperty("objectFit", "cover")
  expect(imgElement.style).toHaveProperty("objectPosition", "left")

  expect(imgElement).not.toHaveAttribute("src")
})

test("Correctly renders with pixel density descriptors", () => {
  const { getByTestId } = render(
    <Image
      data-testid="responsive-image"
      src="https://res.cloudinary.com/test/image/upload/image.jpg"
      descriptor="x"
      minWidth={200}
    />
  )

  const imgElement = getByTestId("responsive-image")

  expect(imgElement).toBeInTheDocument()
  expect(imgElement).toHaveAttribute(
    "srcset",
    [
      "https://res.cloudinary.com/test/image/upload/w_200/image.jpg 1x",
      "https://res.cloudinary.com/test/image/upload/w_300/image.jpg 1.5x",
      "https://res.cloudinary.com/test/image/upload/w_400/image.jpg 2x",
      "https://res.cloudinary.com/test/image/upload/w_600/image.jpg 3x"
    ].join(",\n")
  )

  expect(imgElement).not.toHaveAttribute("src")
})

test("Correctly renders with width descriptors (custom sizes & srcSet widths)", () => {
  const testSizes = "(min-width: 1200px) 400px, 100vw"

  const { getByTestId } = render(
    <Image
      data-testid="responsive-image"
      src="//images.ctfassets.net/123abc/456xyz/image.jpg"
      descriptor="w"
      sizes={testSizes}
      srcSetWidths={[200, 400, 800, 1600, 2400, 3200]}
    />
  )

  const imgElement = getByTestId("responsive-image")

  expect(imgElement).toBeInTheDocument()
  expect(imgElement).toHaveAttribute(
    "srcset",
    [
      "https://images.ctfassets.net/123abc/456xyz/image.jpg?w=200 200w",
      "https://images.ctfassets.net/123abc/456xyz/image.jpg?w=400 400w",
      "https://images.ctfassets.net/123abc/456xyz/image.jpg?w=800 800w",
      "https://images.ctfassets.net/123abc/456xyz/image.jpg?w=1600 1600w",
      "https://images.ctfassets.net/123abc/456xyz/image.jpg?w=2400 2400w",
      "https://images.ctfassets.net/123abc/456xyz/image.jpg?w=3200 3200w"
    ].join(",\n")
  )
  expect(imgElement).toHaveAttribute("sizes", testSizes)
  expect(imgElement).not.toHaveAttribute("src")
})

test("Correctly adds crop & quality params to srcSet URLs", () => {
  const { getByTestId } = render(
    <Image
      data-testid="responsive-image"
      src="https://res.cloudinary.com/test/image/upload/image.jpg"
      srcSetWidths={[200, 400, 800]}
      crop="bottom"
      quality={60}
    />
  )

  const imgElement = getByTestId("responsive-image")

  expect(imgElement).toBeInTheDocument()
  expect(imgElement).toHaveAttribute(
    "srcset",
    [
      "https://res.cloudinary.com/test/image/upload/c_fill,g_south,w_200,q_60/image.jpg 200w",
      "https://res.cloudinary.com/test/image/upload/c_fill,g_south,w_400,q_60/image.jpg 400w",
      "https://res.cloudinary.com/test/image/upload/c_fill,g_south,w_800,q_60/image.jpg 800w"
    ].join(",\n")
  )
  expect(imgElement).not.toHaveAttribute("src")
})

test("Correctly renders with custom URL resolver", () => {
  const resolveUrl: URLResolver = (url, { width, quality, crop }) =>
    `${url}-${width}-${quality}-${crop}`

  const { getByTestId } = render(
    <Image
      data-testid="responsive-image"
      src="/image"
      srcSetWidths={[200, 400, 800]}
      crop="bottom"
      quality={60}
      resolveUrl={resolveUrl}
    />
  )

  const imgElement = getByTestId("responsive-image")

  expect(imgElement).toBeInTheDocument()
  expect(imgElement).toHaveAttribute(
    "srcset",
    [
      "/image-200-60-bottom 200w",
      "/image-400-60-bottom 400w",
      "/image-800-60-bottom 800w"
    ].join(",\n")
  )
  expect(imgElement).not.toHaveAttribute("src")
})

test("Correctly passes through standard <img> element attributes", () => {
  const { getByTestId } = render(
    <Image
      data-testid="responsive-image"
      src="/image.jpg"
      descriptor="x"
      minWidth={400}
      className="custom-class"
      width={400}
      height={300}
      alt="A responsive image"
      title="A responsive image"
      loading="lazy"
    />
  )

  const imgElement = getByTestId("responsive-image")

  expect(imgElement).toBeInTheDocument()
  expect(imgElement).toHaveAttribute(
    "srcset",
    "/image.jpg 1x,\n/image.jpg 1.5x,\n/image.jpg 2x,\n/image.jpg 3x"
  )

  expect(imgElement).not.toHaveAttribute("src")

  expect(imgElement).toHaveAttribute("class", "custom-class")
  expect(imgElement).toHaveAttribute("width", "400")
  expect(imgElement).toHaveAttribute("height", "300")
  expect(imgElement).toHaveAttribute("alt", "A responsive image")
  expect(imgElement).toHaveAttribute("title", "A responsive image")
  expect(imgElement).toHaveAttribute("loading", "lazy")
})

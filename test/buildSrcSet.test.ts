import { buildSrcSetW, buildSrcSetX } from "../src/buildSrcSet"
import { URLResolver } from "../src/urlResolvers"

test("srcSet generated correctly with width descriptors", () => {
  const expected = [
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

  expect(buildSrcSetW("https://cdn.shopify.com/s/files/1/image.png")).toBe(
    expected
  )
})

test("srcSet generated correctly with pixel density descriptors", () => {
  const expected = [
    "https://cdn.shopify.com/s/files/1/image_400x.png 1x",
    "https://cdn.shopify.com/s/files/1/image_600x.png 1.5x",
    "https://cdn.shopify.com/s/files/1/image_800x.png 2x",
    "https://cdn.shopify.com/s/files/1/image_1200x.png 3x"
  ].join(",\n")

  expect(
    buildSrcSetX("https://cdn.shopify.com/s/files/1/image.png", {
      minWidth: 400
    })
  ).toBe(expected)
})

test("srcSet generated correctly with extra params", () => {
  const expectedW = [
    "https://images.ctfassets.net/123abc/image.jpg?w=100&q=75&f=left&fit=crop 100w",
    "https://images.ctfassets.net/123abc/image.jpg?w=200&q=75&f=left&fit=crop 200w",
    "https://images.ctfassets.net/123abc/image.jpg?w=300&q=75&f=left&fit=crop 300w",
    "https://images.ctfassets.net/123abc/image.jpg?w=400&q=75&f=left&fit=crop 400w"
  ].join(",\n")

  expect(
    buildSrcSetW("https://images.ctfassets.net/123abc/image.jpg", {
      quality: 75,
      crop: "left",
      srcSetWidths: [100, 200, 300, 400]
    })
  ).toBe(expectedW)

  const expectedX = [
    "https://res.cloudinary.com/test/image/upload/c_fill,g_west,w_100,q_75/image.jpg 1x",
    "https://res.cloudinary.com/test/image/upload/c_fill,g_west,w_150,q_75/image.jpg 1.5x",
    "https://res.cloudinary.com/test/image/upload/c_fill,g_west,w_200,q_75/image.jpg 2x",
    "https://res.cloudinary.com/test/image/upload/c_fill,g_west,w_300,q_75/image.jpg 3x"
  ].join(",\n")

  expect(
    buildSrcSetX("https://res.cloudinary.com/test/image/upload/image.jpg", {
      quality: 75,
      crop: "left",
      minWidth: 100
    })
  ).toBe(expectedX)
})

test("srcSet generated correctly with custom URL resolver", () => {
  const resolveUrl: URLResolver = (url, { width, quality }) =>
    `${url}-${width}-${quality}`

  const expectedW = [
    "/image-200-60 200w",
    "/image-400-60 400w",
    "/image-600-60 600w"
  ].join(",\n")

  expect(
    buildSrcSetW("/image", {
      quality: 60,
      resolveUrl,
      srcSetWidths: [200, 400, 600]
    })
  ).toBe(expectedW)

  const expectedX = [
    "/image-200-70 1x",
    "/image-300-70 1.5x",
    "/image-400-70 2x",
    "/image-600-70 3x"
  ].join(",\n")

  expect(
    buildSrcSetX("/image", {
      quality: 70,
      resolveUrl,
      minWidth: 200
    })
  ).toBe(expectedX)
})

import { buildSrcSetW, buildSrcSetX } from "../src/buildSrcSet"

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

  expect(buildSrcSetX("https://cdn.shopify.com/s/files/1/image.png", 400)).toBe(
    expected
  )
})

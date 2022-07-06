import React from "react"
import { render } from "@testing-library/react"
import "@testing-library/jest-dom"
import { Image } from "../src/index"

test("Correctly renders responsive image with width descriptors (default sizes)", () => {
  const { asFragment, getByTestId } = render(
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

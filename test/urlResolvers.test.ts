import resolveUrlDefault from "../src/urlResolvers"

test("Shopify formatted correctly in various scenarios", () => {
  // Without params
  expect(
    resolveUrlDefault("https://cdn.shopify.com/s/files/1/image.png", {})
  ).toBe("https://cdn.shopify.com/s/files/1/image.png")

  // With single param
  expect(
    resolveUrlDefault("https://cdn.shopify.com/s/files/1/image.png", {
      height: 600
    })
  ).toBe("https://cdn.shopify.com/s/files/1/image_x600.png")

  // With multiple params
  expect(
    resolveUrlDefault("https://cdn.shopify.com/s/files/1/image.png", {
      width: 800,
      height: 600,
      crop: "center",
      quality: 90 // quality not supported by Shopify; shouldn't be in output
    })
  ).toBe("https://cdn.shopify.com/s/files/1/image_800x600_crop_center.png")

  // Single param w/ existing params in input URL stripped
  expect(
    resolveUrlDefault("https://cdn.shopify.com/s/files/1/image_x600.png", {
      width: 800
    })
  ).toBe("https://cdn.shopify.com/s/files/1/image_800x.png")
})

test("Contentful formatted correctly in various scenarios", () => {
  // Without params
  expect(
    resolveUrlDefault(
      "https://images.ctfassets.net/123abc/456xyz/image.jpg",
      {}
    )
  ).toBe("https://images.ctfassets.net/123abc/456xyz/image.jpg")

  // With single param
  expect(
    resolveUrlDefault("https://images.ctfassets.net/123abc/456xyz/image.jpg", {
      width: 800
    })
  ).toBe("https://images.ctfassets.net/123abc/456xyz/image.jpg?w=800")

  // With multiple params
  expect(
    resolveUrlDefault("https://images.ctfassets.net/123abc/456xyz/image.jpg", {
      width: 800,
      height: 600,
      crop: "center",
      quality: 90
    })
  ).toBe(
    "https://images.ctfassets.net/123abc/456xyz/image.jpg?w=800&h=600&q=90&f=center&fit=crop"
  )

  // Single param w/ existing params in input URL stripped
  expect(
    resolveUrlDefault(
      "https://images.ctfassets.net/123abc/456xyz/image.jpg?w=1200&q=80",
      {
        width: 800
      }
    )
  ).toBe("https://images.ctfassets.net/123abc/456xyz/image.jpg?w=800")
})

test("Cloudinary formatted correctly in various scenarios", () => {
  // Without params
  expect(
    resolveUrlDefault(
      "https://res.cloudinary.com/test/image/upload/image.jpg",
      {}
    )
  ).toBe("https://res.cloudinary.com/test/image/upload/image.jpg")

  // With single param
  expect(
    resolveUrlDefault(
      "https://res.cloudinary.com/test/image/upload/image.jpg",
      {
        width: 800
      }
    )
  ).toBe("https://res.cloudinary.com/test/image/upload/w_800/image.jpg")

  // With multiple params
  expect(
    resolveUrlDefault(
      "https://res.cloudinary.com/test/image/upload/image.jpg",
      {
        width: 800,
        height: 600,
        crop: "right",
        quality: 90
      }
    )
  ).toBe(
    "https://res.cloudinary.com/test/image/upload/c_fill,g_east,w_800,h_600,q_90/image.jpg"
  )

  // Single param w/ existing params in input URL stripped
  expect(
    resolveUrlDefault(
      "https://res.cloudinary.com/test/image/upload/w_600,q_100/image.jpg",
      {
        width: 800
      }
    )
  ).toBe("https://res.cloudinary.com/test/image/upload/w_800/image.jpg")

  // Single param w/ existing params in input URL stripped & asset version preserved
  expect(
    resolveUrlDefault(
      "https://res.cloudinary.com/test/image/upload/w_600,q_100/v123456789/image.jpg",
      {
        width: 800
      }
    )
  ).toBe(
    "https://res.cloudinary.com/test/image/upload/w_800/v123456789/image.jpg"
  )
})

test("Protocol-relative URL formatted correctly & converted to HTTPS", () => {
  expect(
    resolveUrlDefault("//images.ctfassets.net/123abc/456xyz/image.jpg", {
      height: 600
    })
  ).toBe("https://images.ctfassets.net/123abc/456xyz/image.jpg?h=600")
})

test("Unrecognized URL returned as-is", () => {
  const url = "https://www.fakesite.com/image.jpg"

  expect(resolveUrlDefault(url, { width: 800 })).toBe(url)
})

test("Invalid URL string returned as-is", () => {
  const str = "not a URL"

  expect(resolveUrlDefault(str, { width: 800 })).toBe(str)
})

test("Empty string returned as-is", () => {
  expect(resolveUrlDefault("", { width: 800 })).toBe("")
})

test("Relative path string returned as-is", () => {
  const path = "/images/image.png"

  expect(resolveUrlDefault(path, { width: 800 })).toBe(path)
})

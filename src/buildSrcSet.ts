import resolveUrlDefault from "./urlResolvers"

export default function buildSrcSet(src?: string) {
  return Array(10)
    .fill(src || "")
    .map(resolveUrlDefault)
    .join(",\n")
}

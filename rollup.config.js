import peerDepsExternal from "rollup-plugin-peer-deps-external"
import commonjs from "@rollup/plugin-commonjs"
import typescript from "rollup-plugin-typescript2"
import packageJson from "./package.json"

export default {
  input: ["src/index.tsx"],
  output: [
    {
      file: packageJson.main,
      format: "cjs",
      sourcemap: true
    }
  ],
  plugins: [
    peerDepsExternal({ includeDependencies: true }),
    commonjs(),
    typescript({ useTsconfigDeclarationDir: true })
  ]
}

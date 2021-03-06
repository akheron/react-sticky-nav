import commonjs from "rollup-plugin-commonjs";
import compiler from "@ampproject/rollup-plugin-closure-compiler";
import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

import pkg from "./package.json";

const production = !process.env.ROLLUP_WATCH;

const external = [...Object.keys(pkg.peerDependencies)];

const plugins = [
  typescript({
    clean: true,
    typescript: require("typescript"),
    tsconfigOverride: {
      exclude: ["example"]
    }
  }),
  production && compiler()
];

export default [
  {
    input: "index.tsx",
    output: [
      { exports: "named", file: pkg.main, format: "cjs" },
      { exports: "named", file: pkg.module, format: "esm" }
    ],
    external,
    plugins
  },
  {
    input: "index.tsx",
    output: {
      exports: "named",
      file: pkg.browser,
      format: "umd",
      globals: {
        react: "React"
      },
      name: "ReactStickyNav"
    },
    external,
    plugins: [resolve(), commonjs(), ...plugins]
  }
];

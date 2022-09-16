import ts from "rollup-plugin-ts"
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import path from 'path'

const babelConfig = require('./babel.config.js')
const extensions = ['.js', '.jsx', '.ts', '.tsx', '.json']
const babelPlugin = babel({
  babelHelpers: 'bundled',
  include: 'src/**/*',
  exclude: 'node_modules/**',
  extensions,
  ...babelConfig,
})

export default [
  {
    input: 'src/index.ts',
    output: {
      exports: 'default',
      format: 'cjs',
      sourcemap: false,
      dir: 'dist/cjs',
    },
    plugins: [
      nodeResolve({ extensions, rootDir: path.resolve(__dirname, "./src") }),
      peerDepsExternal(),
      commonjs(),
      babelPlugin,
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      format: 'esm',
      sourcemap: false,
      dir: `dist/esm`,
      preserveModules: true,
      preserveModulesRoot: "src",
    },
    plugins: [
      nodeResolve({ extensions, rootDir: path.resolve(__dirname, "./src") }),
      peerDepsExternal(),
      ts(),
      commonjs(),
      babelPlugin,
    ],
  },
]

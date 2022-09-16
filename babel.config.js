module.exports = {
  presets: [
    [
      "@babel/env",
      {
        loose: false,
        modules: false,
        targets: {
          node: "current"
        }
      }
    ],
    "@babel/preset-typescript"
  ],
  plugins: [
    [
      "module-resolver",
      {
        extensions: [
          ".js",
          ".jsx",
          ".ts",
          ".tsx"
        ],
        root: [
          "./src"
        ]
      }
    ]
  ],
  ignore: [
    "*/**/types.ts",
    "*/**/*.test.ts"
  ]
}

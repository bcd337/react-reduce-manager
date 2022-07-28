const { NODE_ENV, BABEL_ENV } = process.env
const cjs = NODE_ENV === 'test' || BABEL_ENV === 'commonjs'

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ">1%, not ie 11, not op_mini all, not dead"
        },
        loose: true,
        modules: cjs ? 'cjs' : false
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [cjs && ['@babel/transform-modules-commonjs']].filter(Boolean)
}

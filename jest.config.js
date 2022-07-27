module.exports = () => ({
  rootDir: ".",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc/jest"
    ]
  },
  globals: {
    "__DEV__": true
  },
  modulePathIgnorePatterns: [
    "dist"
  ],
  testRegex: "test.(js|ts|tsx)$",
  coverageDirectory: "./coverage/",
  collectCoverage: true,
  coverageReporters: [
    "json",
    "html",
    "text",
    "text-summary"
  ],
  collectCoverageFrom: [
    "src/**/*.{js,ts,tsx}",
    "tests/**/*.{js,ts,tsx}"
  ]
})

const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jsdom",
  collectCoverage: true, // Enable coverage collection
  collectCoverageFrom: [
    "!/**/*.test.tsx", // Exclude test files if needed
    "!**/.next/**/*", // Exclude all files within the `.next` directory
    "!**/.storybook/**/*",
    "!**/stories/**/*",
    "!**/coverage/**/*",
    "!**/__tests__/**/*",
    "!**/jest.config.js", // Exclude jest.config.js
    "!**/next.config.js", // Exclude next.config.js
    "!**/route.ts", // Exclude all route.ts files
    "!**/_app.tsx", // Exclude all route.ts files
  ],
  coverageDirectory: "coverage", // Directory where the coverage report will be saved
  coverageReporters: ["text", "lcov", "html"], // Include HTML coverage report
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);

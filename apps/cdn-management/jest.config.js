module.exports = {
  displayName: "cdn-management",
  preset: "../../jest.preset.js",
  setupFiles: ["<rootDir>../../tools/config/jest/setupFile.js"],
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
    "^.+\\.(css|less|svg|png)$": "jest-transform-stub",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  coverageDirectory: "../../coverage/apps/cdn-management",
};

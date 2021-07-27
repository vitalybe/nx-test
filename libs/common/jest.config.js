module.exports = {
  displayName: "common",
  preset: "../../jest.preset.js",
  setupFiles: ["<rootDir>/../../tools/config/jest/setupFile.js"],
  transform: {
    "^.+\\.[tj]sx?$": "ts-jest",
    "^.+\\.(css|less|svg|png)$": "jest-transform-stub",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  coverageDirectory: "../../coverage/libs/common",
};

const _ = require("lodash");
const basePreset = require("../../jest.preset.js");

module.exports = {
  displayName: "vitaly-buttons",
  preset: "../../jest.preset.js",
  setupFiles: ["<rootDir>../../tools/config/jest/setupFile.js"],
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
    "^.+\\.(css|less|svg|png)$": "jest-transform-stub",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  coverageDirectory: "../../coverage/libs/vitaly-buttons",
  moduleNameMapper: {
    ..._.mapValues(basePreset.moduleNameMapper, (value) => `../../${value}`),
  },
};

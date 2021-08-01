const nxPreset = require("@nrwl/jest/preset");

module.exports = {
  ...nxPreset,
  moduleNameMapper: {
    "^@qwilt/common(.*)$": "libs/common/src$1",
  },
  globals: {
    "ts-jest": {
      compiler: "ttypescript",
      isolatedModules: true,
    },
  },
};

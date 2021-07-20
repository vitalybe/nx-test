const nxPreset = require("@nrwl/jest/preset");

module.exports = {
  ...nxPreset,
  globals: {
    "ts-jest": {
      compiler: "ttypescript",
      isolatedModules: true,
    },
  },
};

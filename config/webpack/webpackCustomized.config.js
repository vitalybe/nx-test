const webpack = require("webpack");
const nrwlConfig = require("@nrwl/react/plugins/webpack.js");

module.exports = (config, context) => {
  nrwlConfig(config);

  config.resolve.alias["@qwilt/common"] = "/Users/vitalyb/git-temp/nx-test/libs/common/src";
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: "process/browser",
    })
  );

  console.log("CUSTOMIZING CONFIG");
  console.log(JSON.stringify(config, null, 2));

  return {
    ...config,
    plugins: [...config.plugins],
  };
};

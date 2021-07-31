const webpack = require("webpack");
const ReactRefreshPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const IgnoreNotFoundExportPlugin = require("ignore-not-found-export-webpack-plugin");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = (config, context) => {
  nrwlConfig(config);

  config.resolve.alias["@qwilt/common"] = "/Users/vitalyb/git-temp/nx-test/libs/common/src";
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: "process/browser",
    })
  );
  config.plugins.push(new IgnoreNotFoundExportPlugin({ include: [/userStore\.ts$/] }));
  // config.plugins.push(new BundleAnalyzerPlugin());

  return {
    ...config,
    plugins: [...config.plugins],
  };
};

// Copied from: /Users/vitalyb/git-temp/nx/packages/react/plugins/webpack.ts
function nrwlConfig(config) {
  // TODO(jack): Remove in Nx 13
  // const { isWebpack5 } = require('@nrwl/web/src/webpack/entry');
  const isWebpack5 = false;
  config.module.rules.push({
    test: /\.(png|jpe?g|gif|webp|svg)$/,
    loader: require.resolve("url-loader"),
    options: {
      limit: 10000, // 10kB
      name: "[name].[hash:7].[ext]",
      esModule: false,
    },
  });

  // Remove ForkTsCheckerWebpackPlugin - It just slows us down during development
  config.plugins = config.plugins.filter((plugin) => plugin.constructor.name !== "ForkTsCheckerWebpackPlugin");

  // NOTE: Used to list plugins
  // console.log(
  //   JSON.stringify(
  //     config.plugins.map((p) => p.constructor.name),
  //     null,
  //     2
  //   )
  // );

  config.node = {
    dgram: "empty",
    fs: "empty",
    net: "empty",
    tls: "empty",
    child_process: "empty",
    __filename: true,
    __dirname: true,
  };

  return config;
}

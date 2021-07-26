const webpack = require("webpack");
const ReactRefreshPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = (config, context) => {
  nrwlConfig(config);

  config.resolve.alias["@qwilt/common"] = "/Users/vitalyb/git-temp/nx-test/libs/common/src";
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: "process/browser",
    })
  );
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

  // TODO(jack): support webpack 5
  if (!isWebpack5 && config.mode === "development" && config["devServer"]?.hot) {
    // add `react-refresh/babel` to babel loader plugin
    const babelLoader = config.module.rules.find((rule) => rule.loader.toString().includes("babel-loader"));
    if (babelLoader) {
      babelLoader.options["plugins"] = [
        ...(babelLoader.options["plugins"] || []),
        [
          require.resolve("react-refresh/babel"),
          {
            skipEnvCheck: true,
          },
        ],
      ];
    }
    // add https://github.com/pmmmwh/react-refresh-webpack-plugin to webpack plugin
    config.plugins.push(new ReactRefreshPlugin());
  }

  return config;
}

const webpack = require("webpack");
const ReactRefreshPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const IgnoreNotFoundExportPlugin = require("ignore-not-found-export-webpack-plugin");
const createStyledComponentsTransformer = require("typescript-plugin-styled-components").default;
const styledComponentsTransformer = createStyledComponentsTransformer();
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

  config.plugins = config.plugins.filter((plugin) => plugin.constructor.name !== "ForkTsCheckerWebpackPlugin");

  config.node = {
    dgram: "empty",
    fs: "empty",
    net: "empty",
    tls: "empty",
    child_process: "empty",
    __filename: true,
    __dirname: true,
  };

  // Needed since we do port forwarding of 8001 to 443
  config["devServer"] = {
    ...config["devServer"],
    sockPort: 443,
    // Below properties are possibly redundant
    sockHost: "dev-localhost.cqloud.com",
    public: "dev-localhost.cqloud.com:443",
    disableHostCheck: true,
  };

  // NOTE: Used to list plugins
  // console.log(
  //   JSON.stringify(
  //     config.plugins.map((p) => p.constructor.name),
  //     null,
  //     2
  //   )
  // );
  // process.exit(0)

  // NOTE: Used to preview config
  // console.log(JSON.stringify(config, null, 2));
  // process.exit(0);

  return config;
}

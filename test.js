const { getWebConfig } = require("@nrwl/web/src/utils/web.config");
const _ = require("lodash");

const root = "/Users/vitalyb/git-temp/nx-test";
const sourceRoot = "apps/marketplace/src";
const options = {
  outputPath: "/Users/vitalyb/git-temp/nx-test/dist/apps/marketplace",
  index: "apps/marketplace/src/index.html",
  main: "/Users/vitalyb/git-temp/nx-test/apps/marketplace/src/index.tsx",
  polyfills: "/Users/vitalyb/git-temp/nx-test/apps/marketplace/src/polyfills.ts",
  tsConfig: "/Users/vitalyb/git-temp/nx-test/apps/marketplace/tsconfig.app.json",
  assets: [
    { input: "/Users/vitalyb/git-temp/nx-test/apps/marketplace/src", output: "", glob: "favicon.ico" },
    { input: "/Users/vitalyb/git-temp/nx-test/apps/marketplace/src/assets", output: "assets", glob: "**/*" },
  ],
  styles: [],
  scripts: [],
  webpackConfig: "/Users/vitalyb/git-temp/nx-test/tools/config/webpack/webpackCustomized.config.js",
  deleteOutputPath: true,
  watch: false,
  baseHref: "/",
  vendorChunk: true,
  commonChunk: true,
  runtimeChunk: true,
  sourceMap: { scripts: true, styles: true, hidden: false, vendors: false },
  progress: false,
  budgets: [],
  namedChunks: true,
  outputHashing: "none",
  stylePreprocessorOptions: { includePaths: [] },
  extractCss: false,
  subresourceIntegrity: false,
  verbose: false,
  statsJson: false,
  extractLicenses: false,
  showCircularDependencies: false,
  fileReplacements: [],
  buildLibsFromSource: true,
  generateIndexHtml: true,
  root: "/Users/vitalyb/git-temp/nx-test",
  sourceRoot: "apps/marketplace/src",
  optimization: {},
};
const esm = true;
const isScriptOptimizeOn = false;

const nrwlWebConfig = getWebConfig(root, sourceRoot, options, esm, isScriptOptimizeOn);
const nxWebpackConfig = options.webpackConfig
  ? require(options.webpackConfig)(nrwlWebConfig, {
      options,
    })
  : nrwlWebConfig;

module.exports = (storybookWebpackConfig, env) => {
  return nxWebpackConfig;
};

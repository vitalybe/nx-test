const _ = require("lodash");
const { normalizeWebBuildOptions } = require("@nrwl/web/src/utils/normalize");
const { getDevServerConfig } = require("@nrwl/web/src/utils/devserver.config");
const { readTargetOptions, parseTargetString } = require("@nrwl/devkit");

const context = require("./executor-context.temp.json");
const options = require("./executor-options.temp.json");

module.exports = (storybookWebpackConfig, env) => {
  const sourceRoot = context.workspace.projects[context.projectName].sourceRoot;

  const target = parseTargetString(options.buildTarget);
  const buildOptions = normalizeWebBuildOptions(readTargetOptions(target, context), context.root, sourceRoot);
  const webpackConfig = getDevServerConfig(context.root, sourceRoot, buildOptions, options);

  return webpackConfig;
};

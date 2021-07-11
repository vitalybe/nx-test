import {
  formatFiles,
  getWorkspaceLayout,
  installPackagesTask,
  joinPathFragments,
  names,
  normalizePath,
  Tree,
} from '@nrwl/devkit';
import { applicationGenerator } from '@nrwl/react';
import { Linter } from '@nrwl/linter';

interface Schema {
  name: string;
}

export default async function (host: Tree, options: Schema) {
  await applicationGenerator(host, {
    name: options.name,
    style: 'styled-components',
    skipFormat: false,
    strict: true,
    unitTestRunner: 'jest',
    babelJest: false,
    e2eTestRunner: 'none',
    linter: Linter.EsLint,
    routing: false,
  });

  const appDirectory = names(options.name).fileName;
  const { appsDir } = getWorkspaceLayout(host);
  const appProjectRoot = normalizePath(`${appsDir}/${appDirectory}`);
  host.delete(joinPathFragments(appProjectRoot, "src", "app"))

  await formatFiles(host);

  return () => {
    installPackagesTask(host);
  };
}

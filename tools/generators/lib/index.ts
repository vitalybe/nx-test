import {
  Tree,
  formatFiles,
  installPackagesTask,
  joinPathFragments,
  names,
  getWorkspaceLayout,
  normalizePath,
} from '@nrwl/devkit';
import { Linter } from '@nrwl/linter';
import { libraryGenerator } from '@nrwl/react';
import { Schema } from '@nrwl/react/src/generators/library/schema';
import { GeneratorUtils } from '../_utils/generatorUtils';

interface MySchema {
  name: string;
}

export default async function (host: Tree, options: MySchema) {
  const schema: Schema = {
    name: options.name,
    style: 'styled-components',
    skipFormat: false,
    strict: true,
    unitTestRunner: 'jest',
    linter: Linter.EsLint,
    routing: false,
    pascalCaseFiles: true,
    skipTsConfig: true,
  };

  await libraryGenerator(host, schema);

  GeneratorUtils.getAndUpdateProject(options.name, host, (projectConfig) => {
    const tsConfigPath = joinPathFragments(
      projectConfig.root,
      'tsconfig.lib.json'
    );
    projectConfig.targets['tsc'] = {
      executor: '@nrwl/workspace:run-commands',
      options: {
        command: `yarn run tsc -- -b ${tsConfigPath} --incremental`,
      },
    };
  });

  await formatFiles(host);
  return () => {
    installPackagesTask(host);
  };
}

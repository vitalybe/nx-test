import {
  formatFiles,
  generateFiles,
  getProjects,
  getWorkspaceLayout,
  installPackagesTask,
  joinPathFragments,
  names,
  normalizePath,
  offsetFromRoot,
  Tree,
  updateJson,
  updateProjectConfiguration,
} from '@nrwl/devkit';
import { applicationGenerator } from '@nrwl/react';
import { Linter } from '@nrwl/linter';
import { addCypress } from '@nrwl/react/src/generators/application/lib/add-cypress';
import { Schema } from '@nrwl/react/src/generators/application/schema';
import { normalizeOptions } from '@nrwl/react/src/generators/application/lib/normalize-options';
import { cypressProjectGenerator } from '@nrwl/cypress';

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
    babelJest: false,
    e2eTestRunner: 'none',
    linter: Linter.EsLint,
    routing: false,
  };

  await applicationGenerator(host, schema);

  const appDirectory = names(options.name).fileName;
  const { appsDir } = getWorkspaceLayout(host);
  const appProjectRoot = normalizePath(`${appsDir}/${appDirectory}`);
  host.delete(joinPathFragments(appProjectRoot, 'src', 'app'));

  generateFiles(
    host,
    joinPathFragments(__dirname, './files/src'),
    joinPathFragments(appProjectRoot, 'src'),
    {
      tmpl: '',
    }
  );

  const e2eProjectRoot = joinPathFragments(appProjectRoot, 'e2e');
  generateFiles(
    host,
    joinPathFragments(__dirname, './files/e2e'),
    e2eProjectRoot,
    {
      ...options,
      tmpl: '',
      linter: 'eslint',
      project: options.name,
      projectRoot: e2eProjectRoot,
      offsetFromRoot: offsetFromRoot(e2eProjectRoot),
    }
  );

  updateJson(
    host,
    joinPathFragments(appProjectRoot, 'tsconfig.app.json'),
    (json) => {
      json['exclude'].push('e2e/**/*');
      return json;
    }
  );

  const currentWorkspaceJson = getProjects(host);
  const projectConfig = currentWorkspaceJson.get(options.name);
  projectConfig.targets['e2e'] = {
    executor: '@nrwl/cypress:cypress',
    options: {
      cypressConfig: joinPathFragments(e2eProjectRoot, 'cypress.json'),
      tsConfig: joinPathFragments(e2eProjectRoot, 'tsconfig.e2e.json'),
      devServerTarget: `${options.name}:serve`,
    },
    configurations: {
      production: {
        devServerTarget: `${options.name}:serve:production`,
      },
    },
  };
  updateProjectConfiguration(host, options.name, projectConfig);

  await formatFiles(host);
  return () => {
    installPackagesTask(host);
  };
}

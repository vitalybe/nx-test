import { NormalizedSchema, Schema } from './schema';
import { createApplicationFiles } from './lib/create-application-files';
import { updateJestConfig } from './lib/update-jest-config';
import { normalizeOptions } from './lib/normalize-options';
import { addProject } from './lib/add-project';
import { addCypress } from './lib/add-cypress';
import { addJest } from './lib/add-jest';
import { setDefaults } from './lib/set-defaults';
import {
  addDependenciesToPackageJson,
  convertNxGenerator,
  formatFiles,
  GeneratorCallback,
  joinPathFragments,
  Tree,
  updateJson,
} from '@nrwl/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { lintProjectGenerator } from '@nrwl/linter';

async function addLinting(host: Tree, options: NormalizedSchema) {
  const tasks: GeneratorCallback[] = [];
  const lintTask = await lintProjectGenerator(host, {
    linter: options.linter,
    project: options.projectName,
    tsConfigPaths: [
      joinPathFragments(options.appProjectRoot, 'tsconfig.app.json'),
    ],
    eslintFilePatterns: [`${options.appProjectRoot}/**/*.{ts,tsx,js,jsx}`],
    skipFormat: true,
  });
  tasks.push(lintTask);

  return runTasksInSerial(...tasks);
}

export async function applicationGenerator(host: Tree, schema: Schema) {
  const options = normalizeOptions(host, schema);

  createApplicationFiles(host, options);
  addProject(host, options);
  const lintTask = await addLinting(host, options);
  const cypressTask = await addCypress(host, options);
  const jestTask = await addJest(host, options);
  updateJestConfig(host, options);
  setDefaults(host, options);

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(
    lintTask,
    cypressTask,
    jestTask,
  );
}

export default applicationGenerator;
export const applicationSchematic = convertNxGenerator(applicationGenerator);

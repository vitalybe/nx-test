import {
  getProjects,
  ProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nrwl/devkit';

export class GeneratorUtils {
  static getAndUpdateProject(
    name: string,
    host: Tree,
    onMutateProject: (projectConfig: ProjectConfiguration) => void
  ) {
    const currentWorkspaceJson = getProjects(host);
    const projectConfig = currentWorkspaceJson.get(name);
    onMutateProject(projectConfig);
    updateProjectConfiguration(host, name, projectConfig);
  }
}

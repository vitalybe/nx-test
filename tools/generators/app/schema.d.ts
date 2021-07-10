import { Linter } from '@nrwl/linter';

export interface Schema {
  name: string;
  skipFormat: boolean;
  directory?: string;
  tags?: string;
  unitTestRunner: 'jest' | 'none';
  babelJest: boolean;
  e2eTestRunner: 'cypress' | 'none';
  linter: Linter;
  pascalCaseFiles?: boolean;
  classComponent?: boolean;
  routing?: boolean;
  skipWorkspaceJson?: boolean;
  js?: boolean;
  globalCss?: boolean;
  strict?: boolean;
  setParserOptionsProject?: boolean;
  standaloneConfig?: boolean;
}

export interface NormalizedSchema extends Schema {
  projectName: string;
  appProjectRoot: string;
  e2eProjectName: string;
  parsedTags: string[];
  fileName: string;
  hasStyles: boolean;
}

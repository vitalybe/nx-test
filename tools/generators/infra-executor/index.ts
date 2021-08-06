import { Tree, formatFiles, installPackagesTask, names, generateFiles, joinPathFragments } from "@nrwl/devkit";
import { libraryGenerator } from "@nrwl/workspace/generators";

interface Schema {
  name: string;
  description: string;
}

export default async function (host: Tree, schema: Schema) {
  const cleanedUpNameParam = schema.name.replace(/executor/i, "");
  console.log(`Generating executor: ${cleanedUpNameParam}`);

  const { propertyName: camelCaseName, className: pascalName } = names(cleanedUpNameParam);
  const nameOnly = `${camelCaseName}`;
  const nameExecutorOptions = `${pascalName}ExecutorOptions`;
  const nameExecutorFunction = `${camelCaseName}Executor`;

  generateFiles(host, joinPathFragments(__dirname, "./files"), joinPathFragments("tools/executors", nameOnly), {
    tmpl: "",
    description: schema.description,
    nameOnly,
    nameExecutorOptions,
    nameExecutorFunction,
  });
}

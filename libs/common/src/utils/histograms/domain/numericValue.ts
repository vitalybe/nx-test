import { loggerCreator } from "../../logger";
const moduleLogger = loggerCreator("__filename");

export class NumericValue {
  constructor(public readonly source: string, public readonly value: number) {}
}

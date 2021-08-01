import { loggerCreator } from "@qwilt/common/utils/logger";

const moduleLogger = loggerCreator("__filename");

export class StepMetadataEntity {
  id!: string;
  name!: string;

  constructor(data: Required<StepMetadataEntity>) {
    Object.assign(this, data);
  }
}

import { loggerCreator } from "common/utils/logger";

const moduleLogger = loggerCreator(__filename);

export interface QwiltMultiSelectItem {
  id: string;
  isSelected: boolean;
}

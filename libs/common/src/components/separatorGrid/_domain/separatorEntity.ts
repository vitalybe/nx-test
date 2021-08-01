import { loggerCreator } from "../../../utils/logger";
import { ReactNode } from "react";

const moduleLogger = loggerCreator("__filename");
export class SeparatorEntity<T> {
  value!: string | undefined;
  children!: T[];
  customValue?: ReactNode;

  get displayValue(): ReactNode {
    return this.customValue ?? this.value;
  }

  constructor(data: Omit<SeparatorEntity<T>, "displayValue">) {
    Object.assign(this, data);
  }
}

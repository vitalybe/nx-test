import { loggerCreator } from "../utils/logger";
import { mockUtils } from "../utils/mockUtils";

const moduleLogger = loggerCreator("__filename");

export class NameWithId<ID_TYPE = string> {
  id: ID_TYPE;
  name: string | undefined;

  // if there is no name, it is an error
  readonly isError: boolean;

  constructor(data: { id: ID_TYPE; name: string | undefined }) {
    this.id = data.id;
    this.name = data.name;

    this.isError = !this.name;
  }

  // Mock
  static createMock(overrides?: Partial<NameWithId>, id: number = mockUtils.sequentialId()) {
    return new NameWithId({
      id: id.toString(),
      name: `name_${id}`,
      ...overrides,
    });
  }
}

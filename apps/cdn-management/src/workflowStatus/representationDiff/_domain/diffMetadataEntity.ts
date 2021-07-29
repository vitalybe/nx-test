import { loggerCreator } from "@qwilt/common/utils/logger";
import { WorkflowEntity } from "../../_domain/workflowEntity";
import { DiffSection } from "./diffSection";
import * as _ from "lodash";
import { JsonDiffEntity } from "../../_domain/jsonDiffEntity";
import { UnknownObject } from "@qwilt/common/utils/typescriptUtils";

const moduleLogger = loggerCreator("__filename");

export class DiffMetadataEntity {
  stepId!: string;
  left!: WorkflowEntity | undefined;
  right!: WorkflowEntity;
  sections!: DiffSection[];

  constructor(data: Required<DiffMetadataEntity>) {
    Object.assign(this, data);
  }

  static createDiffSection(
    leftObject: UnknownObject | undefined,
    rightObject: UnknownObject,
    name: string,
    idGetter?: (obj: Record<string, string>) => string | undefined
  ): DiffSection {
    const leftRoot = leftObject;
    const rightRoot: UnknownObject | undefined = rightObject;

    const leftSection = leftRoot?.[name] ?? {};
    const rightSection = rightRoot?.[name];

    return {
      name: name,
      diff: new JsonDiffEntity({ left: leftSection, right: rightSection, idGetter: idGetter }),
    };
  }

  private static countChanges(obj: object) {
    let arrayCount = 0;

    if (_.isArray(obj)) {
      arrayCount++;
    } else if (_.isObject(obj)) {
      for (const value of Object.values(obj)) {
        if (_.isArray(value)) {
          arrayCount++;
        } else if (_.isObject(value)) {
          arrayCount += this.countChanges(value);
        }
      }
    }

    return arrayCount;
  }

  // Mock
  static createMock(overrides?: Partial<DiffMetadataEntity>) {
    const oldCode = {
      main: {
        "all-servers": [
          {
            hostName: "qn-1234-qn-e1-1",
            id: "14083b32-7e38-4ca4-b6fb-c8fc498c04ac-1",
            virtualReferenceSystemId: "QW1020252221",
          },
          {
            hostName: "qn-1234-qn-02-1",
            id: "17cf214c-d1b3-4e2d-bff4-43e73ce195eb-1",
            virtualReferenceSystemId: "QW1020012033",
          },
        ],
      },
    };
    const newCode = {
      main: {
        "all-servers": [
          {
            hostName: "qn-1234-qn-e1-1",
            id: "14083b32-7e38-4ca4-b6fb-c8fc498c04ac-1",
            virtualReferenceSystemId: "QW1020252222",
          },
          {
            hostName: "qn-1234-qn-02-1",
            id: "17cf214c-d1b3-4e2d-bff4-43e73ce195eb-1",
            virtualReferenceSystemId: "QW1020012033",
          },
        ],
      },
    };

    return new DiffMetadataEntity({
      stepId: "snapshotRepresentation",
      left: WorkflowEntity.createMock(),
      right: WorkflowEntity.createMock(),
      sections: [this.createDiffSection(oldCode, newCode, "all-servers", (obj) => obj["id"])],
      ...overrides,
    });
  }
}

import * as React from "react";
import { loggerCreator } from "common/utils/logger";
import { FormikContainer } from "common/components/configuration/formik/formikContainer/FormikContainer";
import { DeliveryServiceEntity, Revision } from "src/_domain/deliveryServiceEntity";
import {
  DsAssignmentsProvider,
  EMPTY_VALUE,
  UNASSIGNED_VALUE,
} from "src/selectedCdn/tabs/tabDsAssignment/_providers/dsAssignmentsProvider";
import { DropDownOption } from "common/components/configuration/qwiltForm/qwiltReactSelect/QwiltReactSelect";
import _ from "lodash";
import { Notifier } from "common/utils/notifications/notifier";
import { DsRuleEntity } from "src/selectedCdn/tabs/tabDsAssignment/_domain/dsRuleEntity";
import { EditorDsAssignmentFields } from "src/selectedCdn/tabs/tabDsAssignment/editorDsAssignment/editorDsAssignmentFields/EditorDsAssignmentFields";
import {
  DsAssignmentFormData,
  DsAssignmentFormSchema,
} from "src/selectedCdn/tabs/tabDsAssignment/_domain/dsAssignmentFormData";
import { ValidationError } from "yup";
import { useSelectedCdn } from "src/_stores/selectedCdnStore";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

//endregion

//region [[ Props ]]

export interface Props {
  deliveryService: DeliveryServiceEntity;
  dsRuleEntity: DsRuleEntity;
  onClose: () => void;

  className?: string;
}

//endregion

export const EditorDsAssignment = React.memo(({ ...props }: Props) => {
  const assignmentOptions = getAssignmentOptions(props.dsRuleEntity, props.deliveryService);
  const cdn = useSelectedCdn();

  async function onOKCallback(formData: DsAssignmentFormData) {
    await updateRule(formData, props.dsRuleEntity);
    DsAssignmentsProvider.instance.prepareQuery(cdn.id, cdn.name).invalidateWithChildren();
    props.onClose();
  }

  return (
    <FormikContainer<DsAssignmentFormData>
      title={"Delivery Service assignment"}
      isEdit={true}
      initialValues={toFormData(props.dsRuleEntity)}
      initialValidation={true}
      onOk={onOKCallback}
      onCancel={props.onClose}
      validate={onValidate}
      className={props.className}>
      {() => {
        return (
          <EditorDsAssignmentFields
            assignmentFieldOptions={{
              field: "assignment",
              dropDownOptions: assignmentOptions,
              defaultValue: EMPTY_VALUE,
            }}
            routingFieldOptions={{
              field: "routing",
              defaultValue: "true",
              showField: true,
            }}
          />
        );
      }}
    </FormikContainer>
  );
});

//region [[ Functions ]]

export function toFormData(rule: DsRuleEntity): DsAssignmentFormData {
  let assignment: string;
  if (rule.assignmentRule.assignmentBlocked) {
    assignment = UNASSIGNED_VALUE;
  } else if (rule.assignmentRule.assignment) {
    assignment = rule.assignmentRule.assignment;
  } else {
    assignment = EMPTY_VALUE;
  }

  return {
    assignment: assignment,
    routing: rule.routingRule.routingEnabled ? "true" : "false",
  };
}

function getAssignmentOptions(
  dsRuleEntity: DsRuleEntity,
  deliveryService: DeliveryServiceEntity
): DropDownOption<string>[] {
  const labelByRevision = new Map<string, Revision>();

  const hasParent = dsRuleEntity.parent !== undefined;
  const isParentCacheGroupMid = dsRuleEntity.parent?.ruleType === "cache-group-both";

  let emptyLabel: string;
  if (isParentCacheGroupMid) {
    emptyLabel = "(computed)";
  } else if (hasParent) {
    emptyLabel = "(inherits from parent)";
  } else {
    emptyLabel = "---";
  }

  const defaultOptions: DropDownOption<string>[] = [{ label: emptyLabel, value: EMPTY_VALUE }];

  if (hasParent && !isParentCacheGroupMid) {
    defaultOptions.unshift({ label: _.capitalize(UNASSIGNED_VALUE), value: UNASSIGNED_VALUE });
  }

  for (const revision of deliveryService.revisions) {
    for (const label of revision.labels) {
      labelByRevision.set(label, revision);
    }
  }

  const revisionOptions = [...labelByRevision].map(([label, revision]) => ({
    value: label,
    label: label,
    subLabel: revision.creationTimeFormatted,
  }));

  return defaultOptions.concat(revisionOptions);
}

export async function updateRule(
  formData: DsAssignmentFormData,
  initialRule: DsRuleEntity,
  onOk = () => {},
  onCatch = (e: Error) => Notifier.error("Failed to update assignment", e)
) {
  const initialFormData = toFormData(initialRule);
  const modifiedRule = new DsRuleEntity({ ...initialRule });

  try {
    const promises: Promise<void>[] = [];
    //assignment promise
    if (formData.assignment !== initialFormData.assignment) {
      if (formData.assignment === EMPTY_VALUE) {
        promises.push(DsAssignmentsProvider.instance.deleteAssignmentRule(modifiedRule));
      } else {
        const isAssignmentBlocked = formData.assignment === UNASSIGNED_VALUE;
        modifiedRule.assignmentRule.assignmentBlocked = isAssignmentBlocked;
        modifiedRule.assignmentRule.assignment = isAssignmentBlocked ? undefined : formData.assignment;
        promises.push(DsAssignmentsProvider.instance.updateAssignmentRule(modifiedRule));
      }
    }

    //routing promise
    if (formData.routing !== initialFormData.routing) {
      if (formData.routing === "true") {
        promises.push(DsAssignmentsProvider.instance.deleteRoutingRule(modifiedRule));
      } else {
        modifiedRule.routingRule.routingEnabled = false;
        promises.push(DsAssignmentsProvider.instance.updateRoutingRule(modifiedRule));
      }
    }

    await Promise.all(promises);
    onOk();
  } catch (e) {
    onCatch(e);
  }
}

function onValidate(formData: DsAssignmentFormData) {
  const errors: { [key: string]: string } = {};

  try {
    DsAssignmentFormSchema.validateSync(formData, { abortEarly: false });
  } catch (e) {
    if (e instanceof ValidationError) {
      const validationErrors = Object.fromEntries(e.inner.map((e) => [e.path, e.message]));
      Object.assign(errors, validationErrors);
    }
  }

  return errors;
}

//endregion

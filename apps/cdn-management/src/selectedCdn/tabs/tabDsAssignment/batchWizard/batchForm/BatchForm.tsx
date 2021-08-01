import * as React from "react";
import { ReactElement } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import {
  FormikContainer,
  OverrideButtons,
  Props as FormikContainerProps,
} from "common/components/configuration/formik/formikContainer/FormikContainer";
import { EditorDsAssignmentFields } from "src/selectedCdn/tabs/tabDsAssignment/editorDsAssignment/editorDsAssignmentFields/EditorDsAssignmentFields";
import { DeliveryServiceEntity, Revision } from "src/_domain/deliveryServiceEntity";
import { DropDownOption } from "common/components/configuration/qwiltForm/qwiltReactSelect/QwiltReactSelect";
import { EMPTY_VALUE, UNASSIGNED_VALUE } from "src/selectedCdn/tabs/tabDsAssignment/_providers/dsAssignmentsProvider";
import _ from "lodash";
import { DsAssignmentFormData } from "src/selectedCdn/tabs/tabDsAssignment/_domain/dsAssignmentFormData";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const BatchFormView = (styled(FormikContainer)`
  width: 100%;
` as unknown) as <T extends unknown>(props: FormikContainerProps<T>) => ReactElement;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  deliveryService: DeliveryServiceEntity;
  onCancel: () => void;
  onNext: (dsAssignmentsRulesType: DsAssignmentFormData) => void;
  onBack: () => void;
  className?: string;
}

//endregion [[ Props ]]

export const BatchForm = (props: Props) => {
  const initialValues: DsAssignmentFormData = {
    assignment: EMPTY_VALUE,
    routing: "true",
  };

  const buttons: OverrideButtons<DsAssignmentFormData>[] = [
    {
      label: "Cancel",
      onClick: props.onCancel,
    },
    {
      label: "< Back",
      onClick: props.onBack,
    },
    {
      label: "Update >",
      onClick: (dsAssignmentRulesType: DsAssignmentFormData) => props.onNext(dsAssignmentRulesType),
    },
  ];

  return (
    <BatchFormView<DsAssignmentFormData>
      className={props.className}
      title={"Batch Editor - Form"}
      isEdit={false}
      onCancel={props.onCancel}
      initialValues={initialValues}
      overrideButtons={buttons}
      onOk={async (dsAssignmentsRulesType: DsAssignmentFormData) => props.onNext(dsAssignmentsRulesType)}
      formikProps={{ enableReinitialize: false }}>
      {() => {
        return (
          <EditorDsAssignmentFields
            assignmentFieldOptions={{
              field: "assignment",
              dropDownOptions: getAssignmentOptions(props.deliveryService),
              defaultValue: EMPTY_VALUE,
            }}
            routingFieldOptions={{
              field: "routing",
            }}
          />
        );
      }}
    </BatchFormView>
  );
};

function getAssignmentOptions(deliveryService: DeliveryServiceEntity): DropDownOption<string>[] {
  const labelByRevision = new Map<string, Revision>();

  const defaultOptions: DropDownOption<string>[] = [
    { label: "(inherits from parent) / ---", value: EMPTY_VALUE },
    { label: _.capitalize(UNASSIGNED_VALUE) + " / ---", value: UNASSIGNED_VALUE },
  ];

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

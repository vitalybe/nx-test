import * as React from "react";
import { useMemo } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { FormikReactSelect } from "common/components/configuration/formik/formikReactSelect/FormikReactSelect";
import { EMPTY_VALUE, UNASSIGNED_VALUE } from "src/selectedCdn/tabs/tabDsAssignment/_providers/dsAssignmentsProvider";
import { OptionProps } from "react-select/src/components/Option";
import { DropDownOption } from "common/components/configuration/qwiltForm/qwiltReactSelect/QwiltReactSelect";
import _ from "lodash";
import { SelectOption } from "src/selectedCdn/tabs/tabDsAssignment/editorDsAssignment/selectOption/SelectOption";
import { faTag } from "@fortawesome/free-solid-svg-icons/faTag";
import { transparentize } from "polished";
import { Colors } from "src/_styling/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const EditorDsAssignmentFieldsView = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: min-content;
  grid-auto-flow: row;
  row-gap: 1em;
  margin-bottom: 100px;
`;

const OptionContainer = styled.div``;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const Label = styled.div<{ color?: string }>`
  color: ${(props) => (props.color ? props.color : "black")};
  margin-bottom: 0.3em;
`;
const Revision = styled.div`
  font-size: 0.9em;
  color: ${transparentize(0.5, Colors.NEVADA)};
`;

const FontAwesomeIconStyled = styled(FontAwesomeIcon)`
  margin-right: 0.5em;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  assignmentFieldOptions: AssignmentsFieldOptions;
  routingFieldOptions: RoutingFieldOptions;
  className?: string;
}

interface FieldOptions {
  field: string;
  label?: string;
  defaultValue?: string;

  showField?: boolean;
}

interface AssignmentsFieldOptions extends FieldOptions {
  dropDownOptions: DropDownOption<string>[];
}

interface RoutingFieldOptions extends FieldOptions {
  defaultValue?: "true" | "false";
}

//endregion [[ Props ]]

const noAssignmentValues = [UNASSIGNED_VALUE, EMPTY_VALUE];

export const EditorDsAssignmentFields = ({ routingFieldOptions, assignmentFieldOptions, ...props }: Props) => {
  const routingOptions: DropDownOption<"true" | "false">[] = useMemo(
    () => [
      { label: "Enabled", value: "true" },
      { label: "Disabled", value: "false" },
    ],
    []
  );

  return (
    <EditorDsAssignmentFieldsView className={props.className}>
      {(assignmentFieldOptions.showField === undefined || assignmentFieldOptions.showField) && (
        <FormikReactSelect<string>
          field={assignmentFieldOptions.field}
          label={assignmentFieldOptions.label ?? "Assignment"}
          defaultValue={assignmentFieldOptions.defaultValue}
          components={{
            Option: (dropdownOption: OptionProps<DropDownOption<string>, false>) => {
              const isTag = !noAssignmentValues.includes(dropdownOption.data.value);
              const isUnassigned = dropdownOption.data.label === _.capitalize(UNASSIGNED_VALUE);
              return (
                <SelectOption<DropDownOption<string>> {...dropdownOption} isDisabled={false}>
                  <OptionContainer>
                    <TitleContainer>
                      {isTag && <FontAwesomeIconStyled icon={faTag} />}
                      <Label color={isUnassigned ? "red" : "black"}>
                        <span>{dropdownOption.data.label}</span>
                      </Label>
                    </TitleContainer>
                    {isTag && <Revision>Revision: {dropdownOption.data.subLabel}</Revision>}
                  </OptionContainer>
                </SelectOption>
              );
            },
          }}
          options={assignmentFieldOptions.dropDownOptions}
        />
      )}

      {(routingFieldOptions.showField === undefined || routingFieldOptions.showField) && (
        <FormikReactSelect<"true" | "false">
          field={routingFieldOptions.field}
          label={routingFieldOptions.label ?? "Routing"}
          defaultValue={routingFieldOptions.defaultValue}
          options={routingOptions}
        />
      )}
    </EditorDsAssignmentFieldsView>
  );
};

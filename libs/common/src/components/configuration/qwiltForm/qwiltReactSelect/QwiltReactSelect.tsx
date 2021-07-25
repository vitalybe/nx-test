import * as React from "react";
import { ReactElement } from "react";
import { loggerCreator } from "../../../../utils/logger";
import Select, { SingleValueProps } from "react-select";
import SelectCreatable, { CreatableProps } from "react-select/creatable";
import { ActionMeta, ValueType } from "react-select/src/types";
import styled from "styled-components";
import { ConfigurationStyles } from "../../_styles/configurationStyles";
import { CommonColors } from "../../../../styling/commonColors";
import { Props as SelectProps } from "react-select/base";
import { SelectOption } from "./selectOption/SelectOption";
import { OptionProps } from "react-select/src/components/Option";
import { TextTooltip } from "../../../textTooltip/TextTooltip";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const Container = styled.div<{ isError: boolean }>`
  position: relative;
  width: 100%;
  border: ${(props) => (props.isError ? `1px solid ${CommonColors.ROYAL_RED}` : `auto`)};
  border-radius: 5px;
`;

const Label = styled.label<{ floatLabel: boolean }>`
  ${ConfigurationStyles.STYLE_EDITOR_LABEL};
  ${ConfigurationStyles.STYLE_EDITOR_LABEL_FLOATING};
`;

const ErrorIcon = styled.div`
  position: absolute;
  right: 3rem;
  top: 50%;
  transform: translateY(-50%);

  background-color: ${CommonColors.ROYAL_RED};
  color: ${CommonColors.LILY_WHITE};
  border-radius: 50%;
  font-size: 0.8rem;
  font-weight: bold;
  height: 1rem;
  width: 1rem;
  line-height: 1rem;
  text-align: center;
`;

const OptionContainer = styled.div``;

const ValueContainer = styled.div`
  padding: 0.5rem 0;
`;

const IconContainer = styled.span`
  margin-right: 0.5em;
`;

const OptionLabel = styled.div``;

const SubLabel = styled.div`
  font-size: 0.9em;
  color: ${CommonColors.ROLLING_STONE};
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface DropDownOption<T> {
  value: T;
  label: string;
  subLabel?: string;
  icon?: ReactElement;
  isDisabled?: boolean;
}

export type SelectComponentProps<T> = SelectProps<DropDownOption<T>> & CreatableProps<DropDownOption<T>, false>;
type SelectComponentType<T> = React.FC<SelectComponentProps<T>>;

export interface Props<T> {
  label: string;
  idGetter?: (entity: T) => string;
  value?: T;
  disabled?: boolean;
  required?: boolean;
  isClearable?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  components?: any;
  onChange: (value: T | undefined) => void;
  onSearch?: (value: string) => void;
  onCreateNew?: (input: string, actionMeta?: ActionMeta<T>) => T;
  options: DropDownOption<T>[];
  error?: { text: string | undefined };
  className?: string;
  isMenuPositionFixed?: boolean;
  // default: true. Suggest to downgrade react-select to 3.0.3 and set it to false
  // in that case, keyboard selection will be used to highlight the current selection on dropdown.
  // this behavior got broken in 3.0.4 - see here: https://github.com/JedWatson/react-select/issues/3656
  highlightCurrentSelection?: boolean;

  // the original options of ReactSelect
  reactSelectProps?: SelectComponentProps<T>;
}

//endregion [[ Props ]]

//region [[ Functions ]]
function getValue<T>(
  value: T,
  options: DropDownOption<T>[],
  idGetter: (entity: T) => string
): DropDownOption<T> | undefined {
  return options.find((option) => idGetter(option.value) === idGetter(value));
}

//endregion [[ Functions ]]

export const QwiltReactSelect = <T extends unknown>({
  idGetter = (entity: T) => JSON.stringify(entity),
  ...props
}: Props<T>) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SelectComponent: SelectComponentType<T> = (props.onCreateNew ? SelectCreatable : Select) as any;
  const highlightCurrentSelection = props.highlightCurrentSelection ?? false;

  return (
    <Container isError={!!props.error} className={props.className}>
      <SelectComponent
        required
        isDisabled={props.disabled}
        menuPosition={props.isMenuPositionFixed === false ? undefined : "fixed"}
        onInputChange={props.onSearch}
        isSearchable={true}
        isClearable={props.isClearable !== undefined ? props.isClearable : false}
        value={props.value && getValue(props.value, props.options, idGetter)}
        onChange={(dropDownOptionValue: ValueType<DropDownOption<T>, false>) => {
          const dropDownOption = dropDownOptionValue as DropDownOption<T>;
          if (props.onChange && dropDownOption) {
            props.onChange(dropDownOption.value);
          } else {
            props.onChange(undefined);
          }
        }}
        onCreateOption={(input: string) => {
          if (props.onCreateNew) {
            const newEntity = props.onCreateNew(input);
            props.onChange(newEntity);
          }
        }}
        options={props.options}
        components={
          props.components
            ? props.components
            : {
                SingleValue: (props: SingleValueProps<DropDownOption<T>>) => {
                  const dropdownOption: DropDownOption<T> = props.data;

                  return (
                    <ValueContainer>
                      <OptionLabel>
                        {dropdownOption.icon && <IconContainer>{dropdownOption.icon}</IconContainer>}
                        <span>{dropdownOption.label}</span>
                      </OptionLabel>
                      {dropdownOption.subLabel ? <SubLabel>{dropdownOption.subLabel}</SubLabel> : null}
                    </ValueContainer>
                  );
                },
                Option: (optionProps: OptionProps<DropDownOption<T>, false>) => {
                  const dropdownOption: DropDownOption<T> = optionProps.data;

                  return (
                    <SelectOption<DropDownOption<T>>
                      {...optionProps}
                      isSelected={highlightCurrentSelection ? optionProps.isSelected : false}>
                      <OptionContainer>
                        <OptionLabel>
                          {dropdownOption.icon && <IconContainer>{dropdownOption.icon}</IconContainer>}
                          <span>{dropdownOption.label}</span>
                        </OptionLabel>
                        <SubLabel>{dropdownOption.subLabel}</SubLabel>
                      </OptionContainer>
                    </SelectOption>
                  );
                },
              }
        }
        {...props.reactSelectProps}
      />
      <Label floatLabel={true}>{props.label}</Label>
      {props.error && (
        <TextTooltip content={props.error?.text ?? ""} isEnabled={true}>
          <ErrorIcon>!</ErrorIcon>
        </TextTooltip>
      )}
    </Container>
  );
};

import * as _ from "lodash";
import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../../utils/logger";
import { ArrayHelpers, FieldArray, FormikProps } from "formik";
import { QwiltFormGroup } from "../../qwiltForm/qwiltFormGroup/QwiltFormGroup";
import { openConfirmModal } from "../../../qwiltModal/QwiltModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "../../../../styling/icons";
import { TextTooltip } from "../../../textTooltip/TextTooltip";
import { Clickable } from "../../clickable/Clickable";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const VERTICAL_GAP = "1rem";
const PADDING = "1rem";

const QwiltFormGroupStyled = styled(QwiltFormGroup)`
  min-height: 0;

  padding: 1rem 0;
  border-radius: 3px;

  display: grid;
  grid-template-rows: 1fr auto;
  grid-auto-flow: row;
  gap: ${VERTICAL_GAP};
`;

const ItemsContainer = styled.div`
  display: grid;
  grid-auto-flow: row;
  gap: ${VERTICAL_GAP};
  overflow-y: auto;
  overflow-x: hidden;
  align-content: start;
  padding: 1rem ${PADDING};
`;

const Item = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
`;

const DeleteButton = styled(Clickable)`
  font-size: 1.5em;
  padding: 0 0.3em 0 0.5em;
`;

const AddButton = styled(Clickable)`
  margin-left: ${PADDING};
`;

const AddButtonText = styled.span`
  margin-right: 0.3em;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props<FormikType, CollectionType> {
  label: string;
  field: string;
  formikProps: FormikProps<FormikType>;
  getNewItem: () => CollectionType;

  disabled?: boolean;
  showDeletePrompt?: boolean;
  getIsAddDisabled?: () => boolean;
  disabledTooltip?: string;
  onAddItemOverride?: (arrayHelpers: ArrayHelpers, newItem: CollectionType) => void;
  onRemoveItemOverride?: (arrayHelpers: ArrayHelpers, removedIndex: number) => void;

  children: (index: number) => React.ReactNode;

  className?: string;
}

//endregion [[ Props ]]

export const FormikAddRemoveItems = <FormikType extends unknown, CollectionType extends unknown>(
  props: Props<FormikType, CollectionType>
) => {
  const children = props.children;
  const isAddButtonDisabled = props.getIsAddDisabled && props.getIsAddDisabled();

  return (
    <FieldArray name={props.field as string}>
      {(arrayHelpers: ArrayHelpers) => {
        const collection: CollectionType[] = _.get(props.formikProps.values, props.field);

        return (
          <QwiltFormGroupStyled label={props.label} className={props.className}>
            <ItemsContainer>
              {collection.map((obj: CollectionType, i: number) => (
                <Item key={i}>
                  {children(i)}
                  {(props.disabled === undefined || !props.disabled) && (
                    <DeleteButton
                      onClick={async () => {
                        let toDelete = true;
                        if (props.showDeletePrompt !== undefined && props.showDeletePrompt) {
                          toDelete = await openConfirmModal(`Are you sure want to delete item?`);
                        }

                        if (toDelete) {
                          if (props.onRemoveItemOverride) {
                            props.onRemoveItemOverride(arrayHelpers, i);
                          } else {
                            arrayHelpers.remove(i);
                          }
                        }
                      }}>
                      <FontAwesomeIcon icon={Icons.DELETE} />
                    </DeleteButton>
                  )}
                </Item>
              ))}
            </ItemsContainer>
            {(props.disabled === undefined || !props.disabled) && (
              <AddButton
                onClick={() => {
                  if (props.onAddItemOverride) {
                    props.onAddItemOverride(arrayHelpers, props.getNewItem());
                  } else {
                    arrayHelpers.push(props.getNewItem());
                  }
                }}
                isDisabled={isAddButtonDisabled}>
                <TextTooltip content={props.disabledTooltip ?? ""} isEnabled={isAddButtonDisabled}>
                  <>
                    <AddButtonText>ADD</AddButtonText>
                    <FontAwesomeIcon icon={Icons.ADD} />
                  </>
                </TextTooltip>
              </AddButton>
            )}
          </QwiltFormGroupStyled>
        );
      }}
    </FieldArray>
  );
};

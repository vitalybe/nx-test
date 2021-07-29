import * as React from "react";
import { ReactElement, useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import {
  FormikContainer,
  Props as HttpRouterGroupsEditorFormProps,
} from "common/components/configuration/formik/formikContainer/FormikContainer";
import { FormikInput } from "common/components/configuration/formik/formikInput/FormikInput";
import {
  HttpRouterGroupsFormData,
  HttpRouterGroupsFormSchema,
} from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/httpRouterGroupsTab/_domain/httpRouterGroupsFormData";
import { ValidationError } from "yup";
import { HttpRouterGroupEntity } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/httpRouterGroupsTab/_domain/httpRouterGroupEntity";
import { ArrayHelpers } from "formik";
import { FormikAddRemoveItems } from "common/components/configuration/formik/formikAddRemoveItems/FormikAddRemoveItems";
import { FormikSelect } from "common/components/configuration/formik/formikSelect/FormikSelect";
import { HttpRouterGroupsProvider } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/httpRouterGroupsTab/_providers/httpRouterGroupsProvider";
import { CdnEntity } from "src/_domain/cdnEntity"; // for everything

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const HttpRouterGroupsEditorForm = (styled(FormikContainer)`
  width: 700px;
  height: 90vh;
` as unknown) as <T extends {}>(props: HttpRouterGroupsEditorFormProps<T>) => ReactElement;

const Content = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1em;
`;

const FormikAddRemoveItemsStyled = styled(FormikAddRemoveItems)`
  flex: 1;
` as typeof FormikAddRemoveItems;

const FormikSelectStyled = styled(FormikSelect)`
  flex: 1;
  margin-bottom: 0;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  editedItem: HttpRouterGroupEntity | undefined;
  existingGroups: HttpRouterGroupEntity[];
  cdn: CdnEntity;

  onClose(): void;
  className?: string;
}

//endregion [[ Props ]]

export const HttpRouterGroupsEditor = (props: Props) => {
  const [fallbacksCollection, setFallbacksCollection] = useState(props.editedItem?.fallbackGroups ?? []);
  const availableGroups = props.existingGroups.filter((group) => group.id !== props.editedItem?.id);

  const onAddFallbackGroup = (arrayHelpers: ArrayHelpers, newItem: string) => {
    arrayHelpers.push(newItem);
    setFallbacksCollection([...fallbacksCollection, availableGroups[0]]);
  };

  const onRemoveFallbackGroup = (arrayHelpers: ArrayHelpers, deletedIndex: number) => {
    arrayHelpers.remove(deletedIndex);
    const currentFallbacksCollection = fallbacksCollection;
    currentFallbacksCollection.splice(deletedIndex, 1);
    setFallbacksCollection(currentFallbacksCollection);
  };

  const onValidate = (formData: Partial<HttpRouterGroupsFormData>) => {
    const errors: Record<string, string> = {};

    try {
      HttpRouterGroupsFormSchema.validateSync(formData, { abortEarly: false });
    } catch (e) {
      if (e instanceof ValidationError) {
        const validationErrors = Object.fromEntries(e.inner.map((e) => [e.path, e.message]));
        Object.assign(errors, validationErrors);
      }
    }

    //validates no conflict exists in HTTP Router Groups names
    if (props.existingGroups.some((group) => group.name !== props.editedItem?.name && group.name === formData.name)) {
      errors["httpRouterGroupsNameConflict"] = `HTTP Router Group (${formData.name}) with the same name already exists`;
    }

    //validates no conflict exists in fallback groups ids
    const fallbackGroupsIds: string[] | undefined = formData.fallbackGroupsIds;
    const fallbackGroupIdsMap = new Map();
    let isConflict = false;
    if (fallbackGroupsIds) {
      isConflict = fallbackGroupsIds.some((id) => {
        const isExistsInMap = fallbackGroupIdsMap.has(id);
        if (isExistsInMap) {
          return true;
        } else {
          fallbackGroupIdsMap.set(id, undefined);
          return false;
        }
      });
    }

    if (isConflict) {
      errors["fallbackGroupsIdConflict"] = "Fallback group is assigned more than once";
    }

    return errors;
  };

  async function onSave(formData: HttpRouterGroupsFormData) {
    if (props.editedItem) {
      await HttpRouterGroupsProvider.instance.update(props.cdn.id, props.editedItem.id, formData);
    } else {
      await HttpRouterGroupsProvider.instance.create(props.cdn.id, formData);
    }
    props.onClose();
  }

  const initialValues: Partial<HttpRouterGroupsFormData> = props.editedItem
    ? {
        name: props.editedItem.name,
        ttl: props.editedItem.ttl,
        dnsName: props.editedItem.dnsName,
        fallbackGroupsIds: props.editedItem.fallbackGroups.flatMap((fallbackGroup) => fallbackGroup.id),
      }
    : {
        name: "",
        ttl: 30,
        dnsName: "",
        fallbackGroupsIds: [],
      };

  return (
    <HttpRouterGroupsEditorForm<Partial<HttpRouterGroupsFormData>>
      title={"Edit - HTTP Router Group"}
      isEdit={true}
      onCancel={props.onClose}
      onOk={(partialFormData) => onSave(partialFormData as HttpRouterGroupsFormData)}
      initialValues={initialValues}
      validate={onValidate}
      className={props.className}>
      {(formikProps) => (
        <Content>
          <FormikInput field={"name"} type={"string"} label={"Name"} />
          <FormikInput field={"ttl"} type={"number"} label={"TTL"} />
          <FormikInput field={"dnsName"} label={"DNS Name"} />
          <FormikAddRemoveItemsStyled<Partial<HttpRouterGroupsFormData>, string>
            formikProps={formikProps}
            label={"Fallbacks"}
            field={"fallbackGroupsIds"}
            getNewItem={() => availableGroups[0].id}
            onAddItemOverride={onAddFallbackGroup}
            onRemoveItemOverride={onRemoveFallbackGroup}
            getIsAddDisabled={() => availableGroups.length === 0}
            disabledTooltip={"No available groups"}>
            {(index: number) => (
              <FormikSelectStyled field={`fallbackGroupsIds[${index}]`} label={"Group"}>
                {availableGroups.map((fallbackGroup) => (
                  <option key={fallbackGroup.id} value={fallbackGroup.id}>
                    {fallbackGroup.name}
                  </option>
                ))}
              </FormikSelectStyled>
            )}
          </FormikAddRemoveItemsStyled>
        </Content>
      )}
    </HttpRouterGroupsEditorForm>
  );
};

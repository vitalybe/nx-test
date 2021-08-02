/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as _ from "lodash";
import * as React from "react";
import { useRef } from "react";
import styled from "styled-components";
import { Props, QwiltMultiSelect } from "common/components/configuration/qwiltForm/qwiltMultiSelect/QwiltMultiSelect";
import { Utils } from "common/utils/utils";
import { QwiltMultiSelectItem } from "common/components/configuration/qwiltForm/qwiltMultiSelect/_domain/QwiltMultiSelectItem";
import { FixtureWithResults } from "common/utils/cosmos/FixtureWithResults";
import { Field, FieldProps, Formik } from "formik";
import { QwiltInput } from "common/components/configuration/qwiltForm/qwiltInput/QwiltInput";

const View = styled(FixtureWithResults)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
  width: 400px;
  height: 200px;
  display: grid;
`;

const Title = styled.div`
  flex: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const QwiltInputStyled = styled(QwiltInput)`
  margin-top: 0.5em;
`;

interface StringMultiSelect extends QwiltMultiSelectItem {
  title: string;
}

interface ComplexMultiSelect extends QwiltMultiSelectItem {
  title: string;
  value: number;
}

export default {
  "string data": () => {
    const props = useRef<Props<StringMultiSelect>>({
      onItemsChanged: (items) => console.log(JSON.stringify(items, null, 2)),
      initialItems: [
        { title: "Verizon Wireless", id: "1", isSelected: false },
        { title: "Verizon FiOS", id: "2", isSelected: true },
        { title: "MediaCom", id: "3", isSelected: false },
        { title: "Universities", id: "4", isSelected: false },
        { title: "Other Network 5", id: "6", isSelected: false },
        { title: "Other Network 7", id: "8", isSelected: true },
        { title: "Other Network 9", id: "10", isSelected: false },
      ],
      itemRenderer: (item) => <Title title={item.title}>{item.title}</Title>,
      itemFilterPredicate: (item, filter) => Utils.includesCaseInsensitive(item.title, filter),
    }).current;

    return <View>{(onResults) => <QwiltMultiSelect<StringMultiSelect> {...props} onItemsChanged={onResults} />}</View>;
  },
  "object data": () => {
    const props = useRef<Props<ComplexMultiSelect>>({
      onItemsChanged: (items) => console.log(JSON.stringify(items, null, 2)),
      initialItems: [
        { title: "Verizon Wireless", value: 14, id: "15", isSelected: false },
        { title: "Verizon FiOS", value: 16, id: "17", isSelected: false },
        { title: "MediaCom", value: 18, id: "19", isSelected: true },
        { title: "Universities", value: 20, id: "21", isSelected: false },
        { title: "Other Network 22", value: 23, id: "24", isSelected: false },
      ],
      itemRenderer: (item) => (
        <div>
          <div>Title: {item.title}</div>
          <div>Value: {item.value}</div>
        </div>
      ),
      itemFilterPredicate: (item, filter) => Utils.includesCaseInsensitive(item.title, filter),
    }).current;

    return <View>{(onResults) => <QwiltMultiSelect<ComplexMultiSelect> {...props} onItemsChanged={onResults} />}</View>;
  },
  "with form": () => {
    const items = [
      { title: "Verizon Wireless", value: 14, id: "15", isSelected: false },
      { title: "Verizon FiOS", value: 16, id: "17", isSelected: false },
      { title: "MediaCom", value: 18, id: "19", isSelected: true },
      { title: "Universities", value: 20, id: "21", isSelected: false },
      { title: "Other Network 22", value: 23, id: "24", isSelected: false },
    ];

    return (
      <View>
        {(onResults) => (
          <Formik
            onSubmit={() => {}}
            validate={(values) => onResults(values)}
            validateOnChange={true}
            initialValues={{ networks: items }}>
            {() => (
              <Field>
                {(fieldProps: FieldProps<ComplexMultiSelect>) => (
                  <QwiltMultiSelect<ComplexMultiSelect>
                    initialItems={items}
                    itemFilterPredicate={(item, filter) => Utils.includesCaseInsensitive(item.title, filter)}
                    itemRenderer={(item, onRenderedItemChanged) => (
                      <div>
                        <div>Title: {item.title}</div>
                        <QwiltInputStyled
                          label={"Value"}
                          type={"number"}
                          value={item.value.toString()}
                          onChange={(newValue) => onRenderedItemChanged({ ...item, value: _.toNumber(newValue) })}
                          inputProps={{
                            onClick: (e) => {
                              // This is needed to prevent downshift from stealing focus
                              ((e.target as unknown) as { focus: () => void }).focus();
                              // This is needed to marking the item as checking when clicking the textbox
                              e.stopPropagation();
                            },
                          }}
                        />
                      </div>
                    )}
                    onItemsChanged={(items) => fieldProps.form.setFieldValue("networks", items)}
                  />
                )}
              </Field>
            )}
          </Formik>
        )}
      </View>
    );
  },
};

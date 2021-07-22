/* eslint-disable react-hooks/rules-of-hooks,no-console */
import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { Props, QwiltReactSelect } from "common/components/configuration/qwiltForm/qwiltReactSelect/QwiltReactSelect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

import { faDog } from "@fortawesome/free-solid-svg-icons/faDog";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
  width: 300px;
`;

function getProps<T>(): Partial<Props<T>> {
  return {
    label: "Test",
  };
}

interface Dog {
  id: string;
  name: string;
  age: number;
}

export default {
  "String value": (
    <View>
      <QwiltReactSelect<string>
        {...getProps()}
        label={"Test"}
        options={[
          {
            label: "Value1",
            value: "id_1",
          },
          {
            label:
              "very very very long value very very very long value very very very long value very very very long value",
            value: "id_2",
          },
          {
            label: "Value1",
            value: "id_1",
          },
          {
            label: "Value2",
            value: "id_2",
          },
          {
            label: "Value3",
            value: "id_3",
          },
          {
            label: "Value4",
            value: "id_4",
          },
          {
            label: "Value5",
            value: "id_5",
          },
          {
            label: "Value6",
            value: "id_6",
          },
          {
            label: "Value7",
            value: "id_7",
          },
          {
            label: "Value8",
            value: "id_8",
          },
          {
            label: "Value9",
            value: "id_9",
          },
          {
            label: "Value10",
            value: "id_10",
          },
        ]}
        value={""}
        onChange={() => console.log("selection changed")}
      />
    </View>
  ),
  "String pre-selected": (
    <View>
      <QwiltReactSelect<string>
        {...getProps()}
        label={"Test"}
        options={[
          { label: "Value1", value: "id_1" },
          {
            label:
              "very very very long value very very very long value very very very long value very very very long value",
            value: "id_2",
          },
          { label: "Value3", value: "id_3" },
          { label: "Value4", value: "id_4" },
          { label: "Value6", value: "id_6" },
          { label: "Value7", value: "id_7" },
          { label: "Value8", value: "id_8" },
          { label: "Value9", value: "id_9" },
          { label: "Value10", value: "id_10" },
          { label: "Value11", value: "id_11" },
          { label: "Value12", value: "id_12" },
          { label: "Value13", value: "id_13" },
          { label: "Value14", value: "id_14" },
          { label: "Value15", value: "id_15" },
          { label: "Value16", value: "id_16" },
          { label: "Value17", value: "id_17" },
          { label: "Value18", value: "id_18" },
          { label: "Value19", value: "id_19" },
          { label: "Value20", value: "id_20" },
          { label: "Value21", value: "id_21" },
          { label: "Value22", value: "id_22" },
          { label: "Value23", value: "id_23" },
        ]}
        value={"id_2"}
        onChange={() => console.log("selection changed")}
      />
    </View>
  ),
  "Item with sub-label pre-selected": (
    <View>
      <QwiltReactSelect<string>
        {...getProps()}
        label={"Test"}
        options={[
          { label: "Value1", value: "id_1", subLabel: "sub label 1" },
          { label: "Value2", value: "id_2", subLabel: "sub label 2" },
          { label: "Value3", value: "id_3", subLabel: "sub label 3" },
        ]}
        value={"id_2"}
        onChange={() => console.log("selection changed")}
      />
    </View>
  ),
  "Fully styled": (
    <View>
      <QwiltReactSelect<string>
        {...getProps()}
        label={"Test"}
        options={[
          {
            label: "Value1",
            value: "id_1",
            icon: <FontAwesomeIcon icon={faDog} />,
            subLabel: "Testing sub-labels",
          },
          {
            label: "Value2",
            value: "id_2",
            icon: <FontAwesomeIcon icon={faDog} />,
            subLabel: "Testing sub-labels",
          },
          {
            label: "Value3",
            value: "id_3",
            icon: <FontAwesomeIcon icon={faDog} />,
            subLabel: "Testing sub-labels",
          },
        ]}
        onChange={() => console.log("selection changed")}
      />
    </View>
  ),
  "Object pre-selected": () => {
    const dogs: Dog[] = [
      {
        id: "1",
        age: 1,
        name: "Dog1",
      },
      {
        id: "2",
        age: 2,
        name: "Dog2",
      },
      {
        id: "3",
        age: 3,
        name: "Dog3",
      },
    ];
    return (
      <View>
        {" "}
        <QwiltReactSelect<Dog>
          {...getProps()}
          label={"Test"}
          options={dogs.map((dog) => ({
            label: dog.name,
            value: dog,
          }))}
          value={dogs[1]}
          idGetter={(dog) => dog.id}
          onChange={() => console.log("selection changed")}
        />
      </View>
    );
  },
  "Clear selection": () => {
    const dogs: Dog[] = [
      {
        id: "1",
        age: 1,
        name: "Dog1",
      },
      {
        id: "2",
        age: 2,
        name: "Dog2",
      },
      {
        id: "3",
        age: 3,
        name: "Dog3",
      },
    ];
    const [value, setValue] = useState<Dog | undefined>(dogs[0]);

    return (
      <View>
        <button onClick={() => setValue(undefined)}>Clear</button>
        <QwiltReactSelect<Dog>
          {...getProps()}
          label={"Test"}
          options={dogs.map((dog) => ({
            label: dog.name,
            value: dog,
          }))}
          value={value}
          idGetter={(dog) => dog.id}
          onChange={() => console.log("selection changed")}
        />
      </View>
    );
  },
  "Object creatable": () => {
    const dogs: Dog[] = [
      {
        id: "1",
        age: 1,
        name: "Dog1",
      },
      {
        id: "2",
        age: 2,
        name: "Dog2",
      },
      {
        id: "3",
        age: 3,
        name: "Dog3",
      },
    ];
    return (
      <View>
        {" "}
        <QwiltReactSelect<Dog>
          {...getProps()}
          label={"Test"}
          options={dogs.map((dog) => ({
            label: dog.name,
            value: dog,
          }))}
          value={dogs[1]}
          idGetter={(dog) => dog.id}
          onChange={() => console.log("selection changed")}
          onCreateNew={(userInput) => ({
            id: "new",
            age: 999,
            name: userInput,
          })}
        />
      </View>
    );
  },
  "Error state": (
    <View>
      <QwiltReactSelect<string>
        {...getProps()}
        label={"Test"}
        error={{ text: "I have an error" }}
        options={[
          {
            label: "Value1",
            value: "id_1",
          },
          {
            label:
              "very very very long value very very very long value very very very long value very very very long value",
            value: "id_2",
          },
          {
            label: "Value1",
            value: "id_1",
          },
          {
            label: "Value2",
            value: "id_2",
          },
          {
            label: "Value3",
            value: "id_3",
          },
          {
            label: "Value4",
            value: "id_4",
          },
          {
            label: "Value5",
            value: "id_5",
          },
          {
            label: "Value6",
            value: "id_6",
          },
          {
            label: "Value7",
            value: "id_7",
          },
          {
            label: "Value8",
            value: "id_8",
          },
          {
            label: "Value9",
            value: "id_9",
          },
          {
            label: "Value10",
            value: "id_10",
          },
        ]}
        value={""}
        onChange={() => console.log("selection changed")}
      />
    </View>
  ),
};

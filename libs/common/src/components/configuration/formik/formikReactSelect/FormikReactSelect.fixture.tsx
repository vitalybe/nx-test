/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import { FormikReactSelect, Props } from "common/components/configuration/formik/formikReactSelect/FormikReactSelect";
import { Formik } from "formik";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { mockUtils } from "common/utils/mockUtils";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
  width: 300px;
`;

function getProps<T>(): Props<T> {
  return {
    field: "test",
    label: "Test",
    onChange: mockUtils.mockAction("onChange"),
    options: [],
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
      <Formik
        onSubmit={() => {}}
        initialValues={{
          id: "",
        }}>
        <FormikReactSelect<string>
          {...getProps()}
          options={[
            {
              label: "Value1",
              value: "id_1",
            },
          ]}
        />
      </Formik>
    </View>
  ),
  "String pre-selected": (
    <View>
      <Formik
        onSubmit={() => {}}
        initialValues={{
          myValue: "id_1",
        }}>
        <FormikReactSelect<string>
          {...getProps()}
          field={"myValue"}
          options={[
            {
              label: "Value1",
              value: "id_1",
            },
          ]}
        />
      </Formik>
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
        <Formik
          onSubmit={() => {}}
          initialValues={{
            myValue: dogs[2],
          }}>
          <FormikReactSelect<Dog>
            {...getProps()}
            field={"myValue"}
            options={dogs.map((dog) => ({
              label: dog.name,
              value: dog,
            }))}
            idGetter={(dog) => dog.id}
            onChange={() => console.log("On dog selected")}
          />
        </Formik>
      </View>
    );
  },
};

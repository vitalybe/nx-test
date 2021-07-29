/* eslint-disable react-hooks/rules-of-hooks */
import * as _ from "lodash";
import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import {
  getDeleteAction,
  getEditAction,
  GridReactRenderer,
  GridValueRenderer,
  Props,
  QwiltGrid,
  QwiltGridColumnDef,
} from "common/components/qwiltGrid/QwiltGrid";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

import { DateTime } from "luxon";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  width: 900px;
  height: 500px;
  border: 3px dashed lightgrey;
`;

const QwiltGridStyled = styled(QwiltGrid)<{}>`
  .green-header {
    background-color: #c7d9d9;
    border-top-width: 0;
  }
` as typeof QwiltGrid;

class DogEntity {
  id!: string;
  name!: string;
  breed!: string;
  size!: "big" | "small";
  birthdate!: DateTime;

  constructor(data: Partial<DogEntity>) {
    Object.assign(this, data);
  }
}

class NestedDogEntity {
  name!: string;
  breed!: string;
  puppies!: NestedDogEntity[];

  constructor(data: Partial<NestedDogEntity>) {
    Object.assign(this, data);
  }
}

class Manager {
  name!: string;
  id!: string;
  employees!: Employee[];

  constructor(data: Required<Manager>) {
    Object.assign(this, data);
  }
}

class Employee {
  name!: string;
  id!: string;
  skillLevel!: number;

  constructor(data: Required<Employee>) {
    Object.assign(this, data);
  }
}

function getPropsTree() {
  return {
    rows: [
      new NestedDogEntity({
        name: "Dad 1",
        breed: "Breed2",
        puppies: [
          new NestedDogEntity({ name: "Puppy 1", breed: "Breed4" }),
          new NestedDogEntity({ name: "Puppy 2", breed: "Breed6" }),
        ],
      }),
      new NestedDogEntity({ name: "Dad 2", breed: "Breed8" }),
    ],
    onEditAction: (dog: DogEntity) => alert("Edit: " + JSON.stringify(dog, null, 2)),
    onDeleteAction: (dog: DogEntity) => alert("Delete: " + JSON.stringify(dog, null, 2)),
  };
}

function getProps(): Props<DogEntity> {
  return {
    rows: [
      new DogEntity({
        id: "2",
        name: "Name1",
        breed: "Breed2",
        size: "big",
        birthdate: DateTime.fromISO("2018-10-08T21:00:00.000+03:00"),
      }),
      new DogEntity({
        id: "1",
        name: "Name3",
        breed: "Breed4",
        size: "small",
        birthdate: DateTime.fromISO("2018-11-08T21:00:00.000+03:00"),
      }),
      new DogEntity({
        id: "10",
        name: "Name5",
        breed: "Breed6",
        size: "big",
        birthdate: DateTime.fromISO("2018-10-09T21:00:00.000+03:00"),
      }),
      new DogEntity({
        id: "20",
        name: "Name7",
        breed: "Breed8",
        size: "small",
        birthdate: DateTime.fromISO("2018-10-10T21:00:00.000+03:00"),
      }),
    ],
    columns: [
      { headerName: "Name", renderer: new GridValueRenderer<DogEntity>({ valueGetter: (o) => o.name }) },
      { headerName: "Breed", renderer: new GridValueRenderer<DogEntity>({ valueGetter: (o) => o.breed }) },
      { headerName: "Size", renderer: new GridValueRenderer<DogEntity>({ valueGetter: (o) => o.size }) },
      {
        headerName: "Birthday",
        renderer: new GridValueRenderer<DogEntity>({ valueGetter: (o) => o.birthdate.toFormat("D") }),
        sortValueGetter: (value) => value.birthdate.valueOf(),
      },
    ],
    actions: [
      getEditAction((dog: DogEntity) => alert("Edit: " + JSON.stringify(dog, null, 2))),
      getDeleteAction((dog: DogEntity) => alert("Delete: " + JSON.stringify(dog, null, 2))),
    ],
  };
}

export default {
  "-Regular": (
    <View>
      <QwiltGrid<DogEntity> {...getProps()} />
    </View>
  ),
  "Not all columns": (
    <View>
      <QwiltGrid<DogEntity>
        {...getProps()}
        columns={[
          {
            headerName: "breed",
            renderer: new GridValueRenderer<DogEntity>({ valueGetter: (o) => o.breed }),
          },
          {
            headerName: "size",
            renderer: new GridValueRenderer<DogEntity>({ valueGetter: (o) => o.size }),
          },
        ]}
      />
    </View>
  ),
  "Custom header": (
    <View>
      <QwiltGrid<DogEntity>
        {...getProps()}
        columns={[
          {
            headerName: "breed",
            renderer: new GridValueRenderer<DogEntity>({ valueGetter: (o) => o.breed }),
          },
          {
            headerName: "size",
            renderer: new GridValueRenderer<DogEntity>({ valueGetter: (o) => o.size }),
            colDefOptions: {
              headerName: "Awesome Size",
            },
          },
        ]}
      />
    </View>
  ),
  "No delete": (
    <View>
      <QwiltGrid<DogEntity>
        {...getProps()}
        actions={[getEditAction((dog: DogEntity) => alert("Edit: " + JSON.stringify(dog, null, 2)))]}
      />
    </View>
  ),
  "No actions": (
    <View>
      <QwiltGrid<DogEntity> {...getProps()} actions={[]} />
    </View>
  ),
  "Custom cell renderer": () => {
    const [filter, setFilter] = useState("");

    return (
      <View>
        <input placeholder={"Filter"} onChange={({ target: { value } }) => setFilter(value)} />
        <QwiltGrid<DogEntity>
          {...getProps()}
          filter={filter}
          columns={[
            {
              headerName: "id",
              renderer: new GridValueRenderer<DogEntity>({ valueGetter: (o) => o.id }),
            },
            {
              headerName: "id+1 - custom render",
              renderer: new GridReactRenderer<DogEntity>({
                valueGetter: (o) => (+o.id + 1).toString(),
                reactRender: ({ entity, value }) => {
                  const icon = entity.size === "big" ? "🦁" : "🐭";
                  return (
                    <div>
                      {icon}
                      {value}
                      {icon}
                    </div>
                  );
                },
              }),
            },
            {
              headerName: "breed",
              renderer: new GridValueRenderer<DogEntity>({ valueGetter: (o) => o.breed }),
            },
            {
              headerName: "size",
              renderer: new GridReactRenderer<DogEntity>({
                valueGetter: (entity) => entity.size,
                reactRender: ({ value }) => {
                  return <div onClick={() => alert("Bark!")}>🐕 {value} (Click me)</div>;
                },
              }),
            },
          ]}
        />
      </View>
    );
  },
  "Callbacks on re-render - Custom renderer": () => {
    const [currentData, setCurrentData] = useState(1);
    const [dogCount, setDogCount] = useState(3000);
    const columns: QwiltGridColumnDef<DogEntity>[] = [
      {
        headerName: "name",
        renderer: new GridValueRenderer<DogEntity>({ valueGetter: (o) => o.name }),
      },
      {
        headerName: "size",
        renderer: new GridReactRenderer<DogEntity>({
          valueGetter: () => "",
          reactRender: () => <button onClick={() => alert("I'm in data: " + currentData)}>Button</button>,
        }),
        sortValueGetter: (entity) => entity.size,
      },
    ];

    return (
      <div
        style={{
          height: "100%",
        }}>
        <h1>Current data - {currentData}</h1>
        <button onClick={() => setCurrentData(1)}>Change data to 1</button>
        <button onClick={() => setCurrentData(2)}>Change data to 2</button>
        <button onClick={() => setDogCount((prevCount) => prevCount + 1)}>Add dog row</button>

        <View>
          <QwiltGrid<DogEntity>
            rows={_.range(dogCount).map(
              (i) =>
                new DogEntity({
                  name: `Name${i}_${currentData}`,
                  breed: "Breed" + i,
                  size: "big",
                })
            )}
            columns={columns}
          />
        </View>
      </div>
    );
  },
  "Callbacks on re-render - Actions": () => {
    const [currentData, setCurrentData] = useState(1);
    const [dogCount, setDogCount] = useState(3000);
    const columns: QwiltGridColumnDef<DogEntity>[] = [
      {
        headerName: "name",
        renderer: new GridValueRenderer<DogEntity>({ valueGetter: (o) => o.name }),
      },
    ];

    const actions = [getEditAction(() => alert("Edit: " + currentData))];
    return (
      <div
        style={{
          height: "100%",
        }}>
        <h1>Current data - {currentData}</h1>
        <button onClick={() => setCurrentData(1)}>Change data to 1</button>
        <button onClick={() => setCurrentData(2)}>Change data to 2</button>
        <button onClick={() => setDogCount((prevCount) => prevCount + 1)}>Add dog row</button>

        <View>
          <QwiltGrid<DogEntity>
            rows={_.range(dogCount).map(
              (i) =>
                new DogEntity({
                  name: `Name${i}_${currentData}`,
                  breed: "Breed" + i,
                  size: "big",
                })
            )}
            columns={columns}
            actions={actions}
          />
        </View>
      </div>
    );
  },
  "Styling headers": (
    <View>
      <QwiltGridStyled<DogEntity>
        {...getProps()}
        columns={[
          {
            headerName: "name",
            renderer: new GridValueRenderer<DogEntity>({ valueGetter: (o) => o.name }),
          },
          {
            headerName: "breed",
            renderer: new GridValueRenderer<DogEntity>({ valueGetter: (o) => o.breed }),
          },
          {
            headerName: "size",
            colDefOptions: { headerClass: "green-header" },
            renderer: new GridValueRenderer<DogEntity>({ valueGetter: (o) => o.size }),
          },
        ]}
      />
    </View>
  ),
  "Tree Data": (
    <View>
      <QwiltGrid<NestedDogEntity>
        {...getPropsTree()}
        columns={[
          {
            headerName: "breed",
            renderer: new GridValueRenderer<NestedDogEntity>({ valueGetter: (o) => o.breed }),
          },
        ]}
        treeData={{
          treeColumn: {
            headerName: "name",
            renderer: new GridValueRenderer<NestedDogEntity>({ valueGetter: (o) => o.name }),
          },
          getChildItems: (dog: NestedDogEntity) => dog.puppies,
        }}
      />
    </View>
  ),
  "Tree Data - Different types (Manager and Employees)": (
    <View>
      <QwiltGrid<Manager | Employee>
        rows={[
          new Manager({
            id: "M1",
            name: "Manager1",
            employees: [
              new Employee({
                id: "1",
                name: "Employee1",
                skillLevel: 10,
              }),
              new Employee({
                id: "3",
                name: "Employee3",
                skillLevel: 15,
              }),
            ],
          }),
          new Manager({
            id: "M2",
            name: "Manager2",
            employees: [
              new Employee({
                id: "2",
                name: "Employee2",
                skillLevel: 20,
              }),
            ],
          }),
        ]}
        treeData={{
          treeColumn: {
            headerName: "id",
            renderer: new GridValueRenderer<Manager | Employee>({ valueGetter: (o) => o.id }),
          },
          getChildItems: (row: Manager | Employee) => (row instanceof Manager ? row.employees : []),
        }}
        columns={[
          {
            headerName: "Name",
            renderer: new GridValueRenderer<Manager | Employee>({ valueGetter: (row: Manager | Employee) => row.name }),
          },
          {
            headerName: "Skill",
            renderer: new GridValueRenderer({
              valueGetter: (row: Manager | Employee) => (row instanceof Employee ? row.skillLevel.toString() : ""),
            }),
          },
        ]}
      />
    </View>
  ),
  "Tree Data - Custom Renderer": (
    <View>
      <QwiltGrid<NestedDogEntity>
        {...getPropsTree()}
        columns={[
          {
            headerName: "breed",
            renderer: new GridValueRenderer<NestedDogEntity>({ valueGetter: (o) => o.breed }),
          },
        ]}
        treeData={{
          treeColumn: {
            headerName: "name",
            renderer: new GridReactRenderer<NestedDogEntity>({
              valueGetter: (o) => o.breed,
              reactRender: ({ entity }) => <div>Hello 🌲: {entity.breed}</div>,
            }),
          },
          treeColumnIdGetter: (o) => o.name,
          getChildItems: (dog: NestedDogEntity) => dog.puppies,
        }}
      />
    </View>
  ),
  "Column groups": (
    <View>
      <QwiltGridStyled<DogEntity>
        {...getProps()}
        columns={[
          {
            headerName: "name",
            renderer: new GridValueRenderer<DogEntity>({ valueGetter: (o) => o.name }),
          },
          {
            headerName: "Other Details",
            colDefOptions: {
              headerClass: "green-header",
            },
            renderer: undefined,
            children: [
              {
                headerName: "green-header",
                renderer: new GridValueRenderer<DogEntity>({ valueGetter: (o) => o.breed }),
                colDefOptions: {
                  headerName: "green-header",
                },
              },
              {
                headerName: "green-header",
                renderer: new GridValueRenderer<DogEntity>({ valueGetter: (o) => o.size }),
                colDefOptions: {
                  headerName: "green-header",
                },
              },
            ],
          },
        ]}
      />
    </View>
  ),
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonDsEntity } from "common/components/_projectSpecific/dsDashboardComponents/_domain/commonDsEntity";
import { Props } from "common/components/_projectSpecific/dsDashboardComponents/dsGrid/DsGrid";

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type ValueOf<T> = T[keyof T];
export type Optional<T> = { [k in keyof T]: T[k] | undefined };

// from: https://stackoverflow.com/questions/50829805/get-keyof-non-optional-property-names-in-typescript
type NonOptionalKeys<T> = { [K in keyof T]-?: T extends { [K1 in K]: any } ? K : never }[keyof T];
export type NonOptional<T> = { [k in NonOptionalKeys<T>]: T[k] };

//based on : https://github.com/DefinitelyTyped/DefinitelyTyped/issues/37087#issuecomment-542793243
// NX-TRANSITION: This shouldn't be here in utils or shouldn't have CommonDsEntity
export type GenericMemoHOC = <T>(
  component: T,
  propsAreEqual: (prevProps: Readonly<Props<CommonDsEntity>>, props: Readonly<Props<CommonDsEntity>>) => boolean
) => T;

// based on : https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c
type FilterFlags<Base, Condition> = { [Key in keyof Base]: Base[Key] extends Condition ? never : Key };
type AllowedNames<Base, Condition> = FilterFlags<Base, Condition>[keyof Base];
type SubType<Base, Condition> = Pick<Base, AllowedNames<Base, Condition>>;
export type OnlyData<T> = SubType<T, (..._: any[]) => any>;
export function enumValues<T extends { [key: string]: any }>(enumeration: T): Array<T[keyof T]> {
  return Object.keys(enumeration)
    .filter((k) => isNaN(Number(k)))
    .map((k) => enumeration[k]);
}

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends Record<string, unknown>
    ? RecursivePartial<T[P]>
    : T[P];
};

// When you really need an ANY but don't won't ugly eslint comments
export type UnknownObject = any;

// https://fettblog.eu/typescript-hasownproperty/
type Prop = string | number | symbol;
export function hasOwnProperty<X extends Record<string, unknown>, Y extends Prop>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  // eslint-disable-next-line no-prototype-builtins
  return obj.hasOwnProperty(prop);
}

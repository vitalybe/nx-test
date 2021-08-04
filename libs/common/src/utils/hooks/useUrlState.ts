import { CommonUrlParams } from "../../urlParams/commonUrlParams";
import { useDisposable } from "mobx-react-lite";
import { reaction } from "mobx";
import { UrlStore } from "../../stores/urlStore/urlStore";
import { useState } from "react";
import { useEventCallback } from "./useEventCallback";
//to avoid useLayoutEffect warning
import React from "react";
import _ from "lodash";
React.useLayoutEffect = React.useEffect;

type HookReturnType<T> = [T, (value: T) => void];

export function useUrlState<T extends string = string, K extends string = CommonUrlParams>(
  param: K,
  shouldRemoveEmpty = true
): HookReturnType<T | undefined> {
  const [value, setValue] = useState<T | undefined>(UrlStore.getInstance().getParam(param) as T | undefined);

  useDisposable(() => reaction(() => UrlStore.getInstance().getParam(param) as T | undefined, setValue));

  const setValueCallback = useEventCallback((value: string | undefined) => {
    if (value || !shouldRemoveEmpty) {
      UrlStore.getInstance().setParam(param, value);
    } else {
      UrlStore.getInstance().removeParam(param);
    }
  });

  return [value, setValueCallback];
}

export function useUrlArrayState<T extends string = string, K extends string = CommonUrlParams>(
  param: K
): HookReturnType<T[] | undefined> {
  const [value, setValue] = useState<T[] | undefined>(
    resolveSetValue(UrlStore.getInstance().getArrayParam(param) as Set<T>)
  );

  useDisposable(() =>
    reaction(
      () => UrlStore.getInstance().getArrayParam(param) as Set<T>,
      (value) =>
        setValue((prevState) => {
          const nextState = resolveSetValue(value);
          if (_.isEqual(prevState, nextState)) {
            return prevState;
          } else {
            return nextState;
          }
        })
    )
  );

  const setValueCallback = useEventCallback((values: string[] | undefined) => {
    if (values) {
      UrlStore.getInstance().setArrayParam(param, new Set<string>(values ?? []));
    } else {
      UrlStore.getInstance().removeParam(param);
    }
  });

  return [value, setValueCallback];
}

export function useUrlSetState<T extends string = string, K extends string = CommonUrlParams>(
  param: K
): HookReturnType<Set<T>> {
  const [value, setValue] = useState<Set<T>>(UrlStore.getInstance().getArrayParam(param) as Set<T>);

  useDisposable(() =>
    reaction(
      () => UrlStore.getInstance().getArrayParam(param) as Set<T>,
      (value) => setValue(value)
    )
  );

  const setValueCallback = useEventCallback((values: Set<string>) => {
    if (values.size > 0) {
      UrlStore.getInstance().setArrayParam(param, values);
    } else {
      UrlStore.getInstance().removeParam(param);
    }
  });

  return [value, setValueCallback];
}

export function useUrlBooleanState<T extends string = CommonUrlParams>(param: T): HookReturnType<boolean> {
  const [value, setValue] = useState(UrlStore.getInstance().getParamExists(param));

  useDisposable(() => reaction(() => UrlStore.getInstance().getParamExists(param), setValue));

  const setValueCallback = useEventCallback((isTrue: boolean) => {
    if (isTrue) {
      UrlStore.getInstance().setBooleanParam(param, isTrue);
    } else {
      UrlStore.getInstance().removeParam(param);
    }
  });

  return [value, setValueCallback];
}

// Array util:
// URL store will return an empty set when param is undefined, here we want to have a state which can be undefined.
function resolveSetValue<T>(value: Set<T>) {
  return value.size > 0 ? [...value] : undefined;
}

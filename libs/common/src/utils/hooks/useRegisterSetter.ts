import { useCallback, useEffect, useRef, useState } from "react";
import { useMountedRef } from "./useMountedRef";

export type SetterRegisterFn<T> = (setter: (data: T) => void) => void;

/*
 this hook takes any data that we want to keep track of its changes.
 it returns a callback that receives a setter (setState) function and stores it.
 on every data change, if a setter had been stored, we call it with updated data.
 use this hook inside a parent component's render cycle where a local scope state is being used by a detached component
 e.g: when using a callback to render a detached modal component that takes data of a state that is changing during modal activity.
*/
export function useRegisterSetter<T>(data: T): SetterRegisterFn<T> {
  const registeredRef = useRef<(data: T) => void>();

  useEffect(() => {
    if (registeredRef.current && data) {
      registeredRef.current(data);
    }
  }, [data]);

  return useCallback((setter: (data: T) => void) => {
    registeredRef.current = setter;
  }, []);
}
/*
  this hook takes a register callback (one that stores setters) and initial data for inner state.
  on mount setData is registered as a setter.
  data inner state is returned and will get updates from the registered setter.
  use this hook inside a component that is detached from the render cycle.
  e.g: in a detached modal component that takes data that is changing during modal activity.
*/
export function useRegisteredData<T>(register: SetterRegisterFn<T> | undefined, initialData?: T) {
  const [data, setData] = useState<T | undefined>(initialData);
  const isMounted = useMountedRef();

  useEffect(() => {
    if (register) {
      register(newData => {
        if (isMounted.current) {
          setData(newData);
        }
      });
    }
  }, [isMounted, register]);

  return data;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { useLayoutEffect, useMemo, useRef } from "react";

// From here: https://github.com/facebook/react/issues/14099
export function useEventCallback<T>(fn: T): T {
  const ref: any = useRef();
  useLayoutEffect(() => {
    ref.current = fn;
  });

  // @ts-ignore
  const memoizedFn = useMemo(() => (...args: any[]) => ref.current && (0, ref.current)(...args), []);

  if (fn === undefined) {
    throw new Error(`fn is undefined`);
  } else {
    return (memoizedFn as any) as T;
  }
}

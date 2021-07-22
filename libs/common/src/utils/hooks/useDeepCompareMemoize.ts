import * as _ from "lodash";
import { useRef } from "react";

// usage: useEffect(() => {...}, [useDeepCompareMemoize(obj)])
export function useDeepCompareMemoize<T>(value: T): T {
  const ref = useRef<T>(value);
  // it can be done by using useMemo as well
  // but useRef is rather cleaner and easier

  if (!_.isEqual(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

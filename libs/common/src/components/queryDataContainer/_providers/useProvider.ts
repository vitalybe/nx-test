import { DependencyList, useEffect, useRef, useState } from "react";
import { loggerCreator } from "../../../utils/logger";
import { AjaxMetadata, AjaxMetadataUsedUrl } from "../../../utils/ajax";
import { Notifier } from "../../../utils/notifications/notifier";

const moduleLogger = loggerCreator("__filename");

interface State<T> {
  providedData: T | undefined;
  isLoading: boolean;
  isError: boolean;
  sources: AjaxMetadataUsedUrl[];
}

type CancellableToken = { cancelled: boolean };

export interface UseProviderOptions {
  onAjaxStart?: () => void;
  onAjaxEnd?: () => void;
  onProviderStart?: () => void;
  onProviderEnd?: () => void;
}
export interface ProviderReturnType<T> {
  data: T | undefined;
  metadata: ProviderMetadata;
  reload: () => void;
}
export function useProvider<T>(
  provideFn: (metadata: AjaxMetadata) => Promise<T>,
  shouldUseCache: boolean,
  dependencies: DependencyList,
  options?: UseProviderOptions
): ProviderReturnType<T> {
  const [state, setState] = useState<State<T>>({
    isError: false,
    isLoading: true,
    providedData: undefined,
    sources: [],
  });

  const isMountedRef = useRef(true);
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  function getIsCancelled(cancellableToken: CancellableToken | undefined) {
    return !!(cancellableToken && cancellableToken.cancelled);
  }

  function callbackIfNotCancelled(callback: undefined | (() => void), cancellableToken: CancellableToken | undefined) {
    const isCancelled: boolean = getIsCancelled(cancellableToken);
    if (!isCancelled && callback) {
      callback();
    }
  }

  const provideData = async (cancellableToken?: CancellableToken) => {
    try {
      if (!state.isLoading) {
        setState({ ...state, isLoading: true });
      }

      if (options && options.onProviderStart) {
        options.onProviderStart();
      }

      const metadata = new AjaxMetadata(shouldUseCache, {
        onAjaxStart: () => callbackIfNotCancelled(options && options.onAjaxStart, cancellableToken),
        onAjaxEnd: () => callbackIfNotCancelled(options && options.onAjaxEnd, cancellableToken),
      });
      const data = await provideFn(metadata);
      // can't set state on unmounted components
      if (isMountedRef.current && !getIsCancelled(cancellableToken)) {
        setState({ ...state, sources: metadata.usedUrls, isLoading: false, isError: false, providedData: data });
      }
    } catch (e) {
      Notifier.error("Failed to provide backend data", e as Error);
      setState({ ...state, isLoading: false, isError: true });
    } finally {
      if (options && options.onProviderEnd) {
        options.onProviderEnd();
      }
    }
  };

  useEffect(() => {
    const cancellableToken = { cancelled: false };
    provideData(cancellableToken);
    return () => {
      cancellableToken.cancelled = true;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return {
    data: state.providedData,
    metadata: {
      sources: state.sources,
      isLoading: state.isLoading,
      isError: state.isError,
    },
    reload: provideData,
  };
}

export interface ProviderMetadata {
  sources: AjaxMetadataUsedUrl[];
  isLoading: boolean;
  isError: boolean;
}

interface StreamApiType {
  sourceIp: string;
  collectorIds: string[];
}

export interface BgpInputBaseApiType {
  inputSourceId: string;
  streams: Record<string, StreamApiType>;
  processorName?: string;
  asn: number;
}

export interface BgpInputActiveNoProcessorApiType extends BgpInputBaseApiType {
  processorType: null;
}

export const ACTIVE_PASSIVE_PROCESSOR = "active-passive";

export interface BgpInputActivePassiveApiType extends BgpInputBaseApiType {
  processorType: typeof ACTIVE_PASSIVE_PROCESSOR;
  activePassiveProcessorConfig: {
    activeStreamId: string;
    activeCollectorId: string;
  };
  asn: number;
}

export type BgpInputApiType = BgpInputActiveNoProcessorApiType | BgpInputActivePassiveApiType;

export interface BgpInputResultApiType {
  configVersion?: string;
  bgpInputSources: BgpInputApiType[];
}

export interface FootprintElementsApiResult {
  "footprint-elements": Record<string, FootprintElementsApiType>;
}

export interface FootprintElementsApiType {
  name: string;
  directives: {
    asn: number;
    "isp-file"?: {
      device: string;
      source: string;
    };
    wire?: { source: string };
    "manual-override"?: { subnets: string[] };
    "manual-fallback"?: { subnets: string[] };
    "rest-of-asn": boolean;
  };
}

export interface FootprintApiType {
  id: string;
}

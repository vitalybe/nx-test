export interface DltApiEditType {
  dltName: string;
  hostToken: string;
}

interface DltApiType extends DltApiEditType {
  id: string;
}

export interface DltsApiResult {
  dlts: Record<string, DltApiType>;
}

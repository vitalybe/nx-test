export type KeyTypeApiType = "urlsigning" | "g2o";

export type KeyTagApiType = { [key in "nonce" | "kn" | "ko"]?: string };

export type KeyApiType = {
  type: KeyTypeApiType;
  description: string;
  name: string;
  tags: KeyTagApiType;
  keySetId?: number;
};

export type KeyApiReadType = KeyApiType & {
  id: number;
  sha512: string;
  ownerOrgId?: string;
};

export type KeyApiCreateType = KeyApiType & {
  key: string;
};

export interface KeysManagerKeysApiResult {
  keys: KeyApiReadType[];
}

export type KeysSetApiType = {
  type: KeyTypeApiType;
  description: string;
  name: string;
};

export type KeysSetApiReadType = KeysSetApiType & {
  id: number;
  ownerOrgId?: string;
};

export interface KeysManagerKeysSetsApiResult {
  keySets: KeysSetApiReadType[];
}

export enum SnowBallPermissionsEnum {
  readWrite = "readWrite",
  overwriteCreationValue = "snowball-overwrite-creation-value",
}
export interface CapabilitiesApiType {
  permissions: {
    qcServices: { [key: string]: boolean };
    snowball: { [key in SnowBallPermissionsEnum]?: boolean };
  };
}

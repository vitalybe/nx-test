import { ParamsMetadataType } from "common/components/applicationParameters/_types/paramsMetadataTypes";

export enum Params {
  selectedRoleId = "selectedRoleId",
  selectedTenantId = "selectedTenantId",
  selectedUserId = "selectedUserId",
  isGroupsView = "isGroupsView",
  groupSearch = "groupSearch",
  usersSearch = "usersSearch",
}

export const Metadata: { [key in Params]?: ParamsMetadataType } = {};

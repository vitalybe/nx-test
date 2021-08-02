export interface FootprintAssignmentsApiResult {
  ["footprint-assignments"]: Record<string, FootprintAssignmentsApiType>;
}

export interface FootprintAssignmentsApiType {
  ["assigned-dug"]: string;
  ["footprint-element-id"]: string;
}

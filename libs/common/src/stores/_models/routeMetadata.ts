import { loggerCreator } from "../../utils/logger";

const moduleLogger = loggerCreator("__filename");

interface ChildRouteMetadata {
  // use group label when a route is a single visible child of a group.
  useGroupLabel?: boolean;
}
export interface RouteMetadata {
  // 2 levels tree, children do not have children and include child interface
  children?: Array<Omit<RouteMetadata, "children"> & ChildRouteMetadata>;
  capabilityId?: string;
  path?: string;
  label: string;
  image?: string;
  // The parameters that this project supports, will be carried over from current URL
  projectPersistentParams?: string[];
}

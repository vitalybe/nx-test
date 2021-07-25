import * as React from "react";

declare module "react-treebeard" {
  export interface TreebeardNode {
    name: string;
    toggled: boolean;
    children?: TreebeardNode[] | undefined;
  }

  export interface TreebeardProps {
    data: TreebeardNode | TreebeardNode[];
    style?: object;
    onToggle?: (node: TreebeardNode, isToggled: boolean) => void;
    decorators?: {
      Loading?: () => React.ReactElement;
      Toggle?: () => React.ReactElement;
      Header?: (props: { node: TreebeardNode }) => React.ReactElement;
      Container?: () => React.ReactElement;
    };
  }

  export const decorators: {
    Loading: () => React.ReactElement;
    Toggle: () => React.ReactElement;
    Header: ({ node: TreebeardNode }) => React.ReactElement;
    Container: () => React.ReactElement;
  };

  // eslint-disable-next-line unused-imports/no-unused-vars
  class Treebeard extends React.Component<TreebeardProps, unknown> {}
}

import * as React from "react";

//region [[ Props ]]

export interface Props {
  color?: string;
  className?: string;
}

//endregion [[ Props ]]
const DEFAULT_COLOR = "#133049";

export const SearchIcon = ({ color = DEFAULT_COLOR, ...props }: Props) => {
  return (
    <svg className={props.className} xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16">
      <path
        fill={color}
        fillRule="evenodd"
        d="M7.833 11.333c2.37 0 4.29-1.94 4.29-4.333 0-2.393-1.92-4.333-4.29-4.333S3.543 4.607 3.543 7c0 2.393 1.92 4.333 4.29 4.333zm0-10.666c3.463 0 6.27 2.835 6.27 6.333 0 1.388-.441 2.672-1.191 3.716l2.512 2.536c.388.392.388 1.023 0 1.415-.383.386-1.007.39-1.393.007l-.007-.007-2.512-2.537c-1.034.757-2.305 1.203-3.68 1.203-3.463 0-6.27-2.835-6.27-6.333S4.369.667 7.832.667z"
      />
    </svg>
  );
};

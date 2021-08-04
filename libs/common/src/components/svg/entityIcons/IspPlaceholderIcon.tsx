import React from "react";

interface Props {
  color?: string;
  className?: string;
}
export const IspPlaceholderIcon = ({ className, color = "#73808B" }: Props) => {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
      <defs>
        <linearGradient id="a" x1="25.746%" x2="50%" y1="91.294%" y2="19.085%">
          <stop offset="0%" stopColor="#FFF" stopOpacity=".2" />
          <stop offset="0%" stopColor="#FFF" stopOpacity=".5" />
          <stop offset="100%" stopColor="#FFF" />
        </linearGradient>
        <linearGradient id="b" x1="22.927%" x2="40.033%" y1="91.294%" y2="16.338%">
          <stop offset="0%" stopColor="#FFF" stopOpacity="0" />
          <stop offset="9.987%" stopColor="#FFF" stopOpacity=".5" />
          <stop offset="100%" stopColor="#FFF" />
        </linearGradient>
        <linearGradient id="c" x1="0%" x2="0%" y1="-2.719%" y2="106.069%">
          <stop offset="0%" stopColor={color} stopOpacity=".1" />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>
      <g fill="none" fillRule="evenodd">
        <g transform="scale(-1 1) rotate(-13 7.777 68.438)">
          <circle cx="6" cy="6" r="4" fill={color} />
          <path stroke="url(#a)" d="M7 1a5 5 0 0 0-4.502 7.179" transform="rotate(-64 4.5 4.59)" />
          <path stroke="url(#b)" d="M6.935 1.14c-2.708.118-3.891 2.137-2.508 4.199" transform="rotate(-65 5.39 3.24)" />
        </g>
        <g transform="translate(0 1)">
          <ellipse cx="1.5" cy="7" fill={color} rx="1.5" ry="2" />
          <path stroke={color} d="M1 7a7 7 0 0 0 7 7" />
          <path stroke="url(#c)" d="M8 14c3.326 0 7-3.134 7-7a7 7 0 0 0-7-7" />
        </g>
      </g>
    </svg>
  );
};

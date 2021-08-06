import styled from "styled-components";
import * as React from "react";

export const IconStyled = styled.img`
  width: 4rem;
`;

export const DeleteIcon = styled(IconStyled).attrs<React.ImgHTMLAttributes<HTMLImageElement>>({
  src: require("../_media/trash-delete-x.svg"),
  alt: "trash icon",
})``;

export const AlertIcon = styled(IconStyled).attrs<React.ImgHTMLAttributes<HTMLImageElement>>({
  src: require("../_media/error-line.svg"),
  alt: "alert icon",
})``;

export const DuplicateIcon = styled(IconStyled).attrs<React.ImgHTMLAttributes<HTMLImageElement>>({
  src: require("../_media/duplicate.svg"),
  alt: "duplicate icon",
})``;

import styled from "styled-components";

export const LayoutMoveBarWrapper = styled.div<{
  $top: number;
  $left: number;
  $width: number;
  $height: number;
  $orientation: "W" | "H";
}>`
  position: absolute;
  top: ${({ $top }) => $top}px;
  left: ${({ $left }) => $left}px;
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
  box-sizing: border-box;
  //   background-color: red;
  z-index: 2;
  cursor: ${({ $orientation }) =>
    $orientation === "W" ? "n-resize" : "w-resize"};
`;

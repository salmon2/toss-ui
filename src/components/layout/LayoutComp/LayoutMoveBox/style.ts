import styled from "styled-components";

export const LayoutMoveBoxWrapper = styled.div<{
  $top: number;
  $left: number;
  $width: number;
  $height: number;
  $isHovered: boolean;
}>`
  position: absolute;
  top: ${({ $top }) => $top}px;
  left: ${({ $left }) => $left}px;
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
  box-sizing: border-box;

  ${({ $isHovered }) =>
    $isHovered &&
    `.item{
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
  `}
  .item {
    transition: all 0.3s ease;
  }
`;

export const GrapDiv = styled.div`
  position: absolute;
  top: 2px;
  left: 2px;
  width: 100%;
  height: 30px;
  cursor: move;
`;

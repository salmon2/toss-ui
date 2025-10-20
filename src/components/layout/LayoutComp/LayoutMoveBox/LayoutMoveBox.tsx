import React from "react";

import { useEffect, useRef, useState } from "react";
import * as Styled from "./style";

type LayoutMoveBoxProps = {
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
  parentRef: HTMLDivElement;
  children: React.ReactNode;
  onChangeBox: (
    id: string,
    prevTop: number,
    prevLeft: number,
    newTop: number,
    newLeft: number
  ) => void;
};

const LayoutMoveBox = ({
  id,
  top,
  left,
  width,
  height,
  parentRef,
  children,
  onChangeBox,
}: LayoutMoveBoxProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const [position, setPosition] = useState({
    top: top,
    left: left,
  });

  const [dragOffset, setDragOffset] = useState({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    setPosition({
      top: top,
      left: left,
    });
  }, [top, left]);

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const lastUpdateRef = useRef(0);

  // 좌표 계산 block method
  const calculateClampedPosition = (
    e: MouseEvent,
    newLeft: number,
    newTop: number
  ) => {
    const clampedTop = e.clientY - newTop;
    const clampedLeft = e.clientX - newLeft;
    return { clampedTop, clampedLeft };
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.left,
      y: e.clientY - position.top,
    };

    setDragOffset({
      top: 0,
      left: 0,
    });
  };

  // 전역 마우스 이벤트 핸들러
  const handleGlobalMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    e.preventDefault();

    // 좌표 계산 메서드 사용
    const { clampedTop, clampedLeft } = calculateClampedPosition(
      e,
      dragStartRef.current.x,
      dragStartRef.current.y
    );

    const topOffset = clampedTop - position.top;
    const leftOffset = clampedLeft - position.left;
    //    console.log(`x:${clampedLeft}, y:${clampedTop}`);

    setDragOffset({
      top: topOffset,
      left: leftOffset,
    });

    // 성능 최적화: 16ms마다 한 번만 콜백 호출 (60fps)
    const now = Date.now();
    if (now - lastUpdateRef.current > 16) {
      lastUpdateRef.current = now;
    }
  };

  const handleGlobalMouseUp = (e: MouseEvent) => {
    // console.log("전역 onMouseUp 이벤트 발생!");
    e.preventDefault();

    // 좌표 계산 메서드 사용
    const { clampedTop, clampedLeft } = calculateClampedPosition(
      e,
      dragStartRef.current.x,
      dragStartRef.current.y
    );

    setDragOffset({
      top: 0,
      left: 0,
    });

    if (isDragging) {
      onChangeBox(id, position.top, position.left, clampedTop, clampedLeft);
    }
    // 드래그 종료 시 원래 자리로 돌아가기 (position은 그대로 유지)
    setIsDragging(false);
  };

  // 전역 이벤트 리스너 등록/해제
  useEffect(() => {
    if (isDragging) {
      parentRef.addEventListener("mousemove", handleGlobalMouseMove);
      parentRef.addEventListener("mouseup", handleGlobalMouseUp);
    } else {
      parentRef.removeEventListener("mousemove", handleGlobalMouseMove);
      parentRef.removeEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      parentRef.removeEventListener("mousemove", handleGlobalMouseMove);
      parentRef.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging]);

  return (
    <Styled.LayoutMoveBoxWrapper
      $top={position.top + (isDragging ? dragOffset.top : 0)}
      $left={position.left + (isDragging ? dragOffset.left : 0)}
      $width={width}
      $height={height}
      $isHovered={isHovered}
      id={id}
      style={{
        zIndex: isDragging ? 50 : 1,
      }}
    >
      <Styled.GrapDiv
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={onMouseDown}
      >
        {/* x: {position.left} y: {position.top}, x-max: {position.left + width},
        y-max: {position.top + height} */}
      </Styled.GrapDiv>

      {children}
    </Styled.LayoutMoveBoxWrapper>
  );
};
export default LayoutMoveBox;

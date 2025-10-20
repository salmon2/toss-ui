import React from "react";
import { useState, useRef, useEffect } from "react";
import * as Styled from "./style";

type LayoutMoveBarProps = {
  id: string;
  parentRef: HTMLDivElement;
  top: number;
  left: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
  orientation: "W" | "H";
  onChangePosition: (id: string, newRatio: number) => void;
};

const LayoutMoveBar = ({
  id,
  parentRef,
  top: initialTop,
  left: initialLeft,
  width,
  height,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
  orientation,
  onChangePosition,
}: LayoutMoveBarProps) => {
  const [position, setPosition] = useState({
    top: initialTop,
    left: initialLeft,
  });

  useEffect(() => {
    setPosition({
      top: initialTop,
      left: initialLeft,
    });
  }, [initialTop, initialLeft]);

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const lastUpdateRef = useRef(0);

  // 좌표 계산 메서드
  const calculateClampedPosition = (newLeft: number, newTop: number) => {
    const clampedTop = Math.max(
      minHeight * 0.8,
      Math.min(newTop, maxHeight * 0.8)
    );
    const clampedLeft = Math.max(
      minWidth * 0.8,
      Math.min(newLeft, maxWidth * 0.8)
    );
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
  };

  // 전역 마우스 이벤트 핸들러
  const handleGlobalMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    e.preventDefault();

    const newLeft = e.clientX - dragStartRef.current.x;
    const newTop = e.clientY - dragStartRef.current.y;

    // 좌표 계산 메서드 사용
    const { clampedTop, clampedLeft } = calculateClampedPosition(
      newLeft,
      newTop
    );

    if (orientation === "W") {
      // W(Width): top만 움직임 (세로 방향 드래그)
      setPosition((prev) => ({
        ...prev,
        top: clampedTop,
      }));
    } else if (orientation === "H") {
      // H(Height): left만 움직임 (가로 방향 드래그)
      setPosition((prev) => ({
        ...prev,
        left: clampedLeft,
      }));
    }

    // 성능 최적화: 16ms마다 한 번만 콜백 호출 (60fps)
    const now = Date.now();
    if (now - lastUpdateRef.current > 16) {
      const ratio =
        orientation === "W" ? clampedTop / maxHeight : clampedLeft / maxWidth;

      onChangePosition(id, ratio);
      lastUpdateRef.current = now;
    }
  };

  const handleGlobalMouseUp = (e: MouseEvent) => {
    console.log("전역 onMouseUp 이벤트 발생!");
    e.preventDefault();

    // 드래그 종료 시 최종 위치로 한 번 더 콜백 호출
    const finalLeft = e.clientX - dragStartRef.current.x;
    const finalTop = e.clientY - dragStartRef.current.y;

    // 좌표 계산 메서드 사용
    const { clampedTop: clampedFinalTop, clampedLeft: clampedFinalLeft } =
      calculateClampedPosition(finalLeft, finalTop);

    const finalRatio =
      orientation === "W"
        ? clampedFinalTop / maxHeight
        : clampedFinalLeft / maxWidth;

    onChangePosition(id, finalRatio);

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
    <Styled.LayoutMoveBarWrapper
      onMouseDown={onMouseDown}
      id={id}
      $top={position.top}
      $left={position.left}
      $width={width}
      $height={height}
      $orientation={orientation}
      style={
        {
          // backgroundColor: "red",
        }
      }
    >
      {/* <div style={{ position: "absolute", top: 0, left: 0 }}>{id}</div> */}
    </Styled.LayoutMoveBarWrapper>
  );
};
export default LayoutMoveBar;

import React from "react";
import { useState } from "react";
import * as Styled from "./style";
import {
  LayoutComponent,
  LayoutNode,
  PanelNode,
} from "../../../type/type-layout";
import {
  deleteNode,
  InsertNode,
  panelSearch,
  preOrderTraversal,
} from "../../../utils/layout";
import LayoutMoveBar from "./LayoutMoveBar";
import LayoutMoveBox from "./LayoutMoveBox";
import { cloneDeep } from "lodash";

type LayoutCompProps = {
  initialLayout: LayoutNode;
  parentRef: HTMLDivElement;
  layoutComponentList: LayoutComponent[];
};

const preOrderTraversalCallback = ({
  layout,
  width,
  height,
}: {
  layout: LayoutNode;
  width: number;
  height: number;
}) => {
  const newNodes: any[] = [];

  preOrderTraversal({
    node: layout,
    parentNode: null,
    x: 0,
    width: width,
    y: 0,
    height: height,
    minWidth: width * 0.2,
    minHeight: height * 0.2,
    maxWidth: width,
    maxHeight: height,
    depth: 0,
    callback: (
      node,
      parentNode,
      x,
      width,
      y,
      height,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight
    ) => {
      newNodes.push({
        ...node,
        orientation:
          node?.type === "split"
            ? node.orientation
            : parentNode?.type === "split"
            ? parentNode.orientation
            : null,
        parentNode: parentNode?.id || null,
        x: node.type === "split" ? x : x,
        y: node.type === "split" ? y : y,
        width,
        height,
        minWidth,
        minHeight,
        maxWidth,
        maxHeight,
      });
    },
  });

  return { newNodes };
};

const LayoutComp = ({
  initialLayout,
  layoutComponentList,
  parentRef,
}: LayoutCompProps) => {
  const [layout, setLayout] = useState<LayoutNode>(initialLayout);
  const { newNodes: nodes = [] } = preOrderTraversalCallback({
    layout,
    width: parentRef.clientWidth,
    height: parentRef.clientHeight,
  });

  const panalNode = nodes.filter((node: any) => node.type === "panel");
  const splitNode = nodes.filter((node: any) => node.type === "split");

  const onChangeBar = (id: string, newRatio: number) => {
    const newLayout = cloneDeep(layout);

    preOrderTraversal({
      node: newLayout,
      parentNode: null,
      x: 0,
      width: parentRef.clientWidth,
      y: 0,
      height: parentRef.clientHeight,
      minWidth: parentRef.clientWidth * 0.2,
      minHeight: parentRef.clientHeight * 0.2,
      maxWidth: parentRef.clientWidth,
      maxHeight: parentRef.clientHeight,
      depth: 0,
      callback: (node) => {
        if (node.id === id) {
          if (node.type === "split") {
            node.ratio = newRatio;
          }
        }
      },
    });

    setLayout(newLayout);
  };

  const onChangeBox = (
    id: string,
    prevTop: number,
    prevLeft: number,
    newTop: number,
    newLeft: number
  ) => {
    // 이동 거리 계산
    const deltaX = Math.abs(newLeft - prevLeft);
    const deltaY = Math.abs(newTop - prevTop);

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // 이동 반경이 10 이하면 함수 강제 종료
    if (distance < 50) {
      return;
    }

    // console.log(`newLeft: ${newLeft}, newTop: ${newTop}`);

    const { findedNode, insertPosition } = panelSearch({
      layout: layout,
      x: newLeft,
      y: newTop,
      maxWidth: parentRef.clientWidth,
      maxHeight: parentRef.clientHeight,
    });

    if (!findedNode) {
      return;
    }
    //alert(`${findedNode?.id} ${insertPosition}`);

    const { newLayout: deleteLayout, deletedNode } = deleteNode({
      layout: layout,
      deleteNodeId: id,
    });

    if (!deletedNode) {
      return;
    }

    if (findedNode) {
      const newLayout = cloneDeep(deleteLayout);
      const newInsertNode = InsertNode({
        layout: newLayout,
        insertNode: deletedNode as PanelNode, // 삭제된 노드를 삽입
        targetId: findedNode.id, // 찾은 노드의 ID를 타겟으로 사용
        insertPosition: insertPosition,
      });
      setLayout(newInsertNode);
    }
  };

  return (
    <Styled.LayoutCompWrapper>
      {panalNode.map((node: any) => {
        return (
          <LayoutMoveBox
            key={node.id}
            id={node.id}
            top={node.y}
            left={node.x}
            width={
              node.x + node.width === parentRef.clientWidth
                ? node.width
                : node.width - 10
            }
            height={
              node.y + node.height === parentRef.clientHeight
                ? node.height
                : node.height - 10
            }
            parentRef={parentRef}
            onChangeBox={onChangeBox}
          >
            {
              layoutComponentList.find((component) => component.id === node.id)
                ?.component
            }
          </LayoutMoveBox>
        );
      })}
      {splitNode.map((node: any) => {
        const barTop =
          node.orientation === "W"
            ? node.y + node.height * node.ratio - 10
            : node.y;
        const barLeft =
          node.orientation === "W"
            ? node.x
            : node.x + node.width * node.ratio - 10;

        return (
          <LayoutMoveBar
            key={node.id}
            id={node.id}
            parentRef={parentRef}
            onChangePosition={onChangeBar}
            top={barTop}
            left={barLeft}
            width={node.orientation === "W" ? node.width : 10}
            height={node.orientation === "W" ? 10 : node.height}
            minWidth={node.minWidth}
            minHeight={node.minHeight}
            maxWidth={node.maxWidth}
            maxHeight={node.maxHeight}
            orientation={node.orientation}
          />
        );
      })}
    </Styled.LayoutCompWrapper>
  );
};
export default LayoutComp;

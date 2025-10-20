import { LayoutNode, SplitNode, PanelNode } from "../type/type-layout";

// 공통 유틸리티 함수들
export const findNodeById = (
  node: LayoutNode,
  id: string
): LayoutNode | null => {
  if (node.id === id) return node;

  if (node.type === "split") {
    const leftResult = findNodeById(node.left, id);
    if (leftResult) return leftResult;

    const rightResult = findNodeById(node.right, id);
    if (rightResult) return rightResult;
  }

  return null;
};

export const findParentNode = (
  node: LayoutNode,
  targetId: string,
  parent: LayoutNode | null = null
): LayoutNode | null => {
  if (node.id === targetId) return parent;

  if (node.type === "split") {
    const leftResult = findParentNode(node.left, targetId, node);
    if (leftResult) return leftResult;

    const rightResult = findParentNode(node.right, targetId, node);
    if (rightResult) return rightResult;
  }

  return null;
};

/**
 * LayoutNode를 전위순회(pre-order traversal)하는 함수
 * 루트 -> 왼쪽 -> 오른쪽 순서로 방문
 */

type PreOrderTraversalProps = {
  node: LayoutNode;
  parentNode: LayoutNode | null;
  x: number;
  width: number;
  y: number;
  height: number;
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
  depth: number;
  callback: (
    node: LayoutNode,
    parentNode: LayoutNode | null,
    x: number,
    width: number,
    y: number,
    height: number,
    minWidth: number,
    minHeight: number,
    maxWidth: number,
    maxHeight: number
  ) => void;
};

export const preOrderTraversal = ({
  node,
  parentNode,
  x,
  width,
  y,
  height,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
  depth,
  callback,
}: PreOrderTraversalProps): void => {
  console.log(`method id ${node.id} x :${x}, y :${y}`);

  callback(
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
  );

  if (node.type === "split") {
    if (node.orientation === "H") {
      // 수평 분할: width를 나누고, height는 그대로
      const leftWidth = width * node.ratio;
      const rightWidth = width - leftWidth;

      const limitWidth = width * 0.2;

      const leftX = x;
      const rightX = x + leftWidth;

      preOrderTraversal({
        node: node.left,
        parentNode: node,
        x: leftX,
        width: leftWidth,
        y: y,
        height: height,
        minWidth: limitWidth,
        minHeight: minHeight,
        maxWidth: width,
        maxHeight: height,
        depth: depth + 1,
        callback,
      });
      preOrderTraversal({
        node: node.right,
        parentNode: node,
        x: rightX,
        width: rightWidth,
        y: y,
        height: height,
        minWidth: limitWidth,
        minHeight: minHeight,
        maxWidth: width,
        maxHeight: height,
        depth: depth + 1,
        callback,
      });
    } else {
      // 수직 분할: height를 나누고, width는 그대로
      const topHeight = height * node.ratio;
      const bottomHeight = height - topHeight;

      const limitHeight = height * 0.2;

      const topY = y;
      const bottomY = y + topHeight;

      // console.log(`method id ${node.id} leftX :${x}, `);

      preOrderTraversal({
        node: node.left,
        parentNode: node,
        x: x,
        width: width,
        y: topY,
        height: topHeight,
        minWidth: minWidth,
        minHeight: limitHeight,
        maxWidth: width,
        maxHeight: height,
        depth: depth + 1,
        callback,
      });
      preOrderTraversal({
        node: node.right,
        parentNode: node,
        x: x,
        width: width,
        y: bottomY,
        height: bottomHeight,
        minWidth: minWidth,
        minHeight: limitHeight,
        maxWidth: width,
        maxHeight: height,
        depth: depth + 1,
        callback,
      });
    }
  }
};

type InsertNodeProps = {
  layout: LayoutNode;
  insertNode: PanelNode;
  targetId: string; // 삽입할 위치의 부모 노드 ID
  insertPosition: "left" | "right" | "top" | "bottom"; // 삽입 위치
};

export const InsertNode = ({
  layout,
  insertNode,
  targetId,
  insertPosition,
}: InsertNodeProps): LayoutNode => {
  // 깊은 복사로 새로운 레이아웃 생성
  const newLayout = JSON.parse(JSON.stringify(layout));

  // 타겟 노드 찾기
  const targetNode = findNodeById(newLayout, targetId);
  if (!targetNode) {
    return layout;
  }

  // 부모 노드 찾기
  const parentNode = findParentNode(newLayout, targetId);

  // 새로운 SplitNode 생성
  const newSplitNode: SplitNode = {
    id: `split-${Date.now()}`,
    type: "split",
    orientation:
      insertPosition === "left" || insertPosition === "right" ? "H" : "W",
    ratio: 0.5, // 기본 비율
    left:
      insertPosition === "left" || insertPosition === "top"
        ? insertNode
        : targetNode,
    right:
      insertPosition === "right" || insertPosition === "bottom"
        ? insertNode
        : targetNode,
  };

  // 루트 노드인 경우
  if (!parentNode) {
    return newSplitNode;
  }

  // 부모 노드의 자식 교체
  if (parentNode.type === "split") {
    if (parentNode.left.id === targetId) {
      parentNode.left = newSplitNode;
    } else if (parentNode.right.id === targetId) {
      parentNode.right = newSplitNode;
    }
  }

  return newLayout;
};

type DeleteNodeProps = {
  layout: LayoutNode;
  deleteNodeId: string; // 삭제할 노드의 ID
};

export const deleteNode = ({
  layout,
  deleteNodeId,
}: DeleteNodeProps): {
  newLayout: LayoutNode;
  deletedNode: LayoutNode | null;
} => {
  // 깊은 복사로 새로운 레이아웃 생성
  const newLayout = JSON.parse(JSON.stringify(layout));

  // 삭제할 노드 찾기
  const nodeToDelete = findNodeById(newLayout, deleteNodeId);
  if (!nodeToDelete) {
    return { newLayout: newLayout, deletedNode: null };
  }

  // 부모 노드 찾기
  const parentNode = findParentNode(newLayout, deleteNodeId);

  // 루트 노드인 경우 (삭제할 노드가 루트)
  if (!parentNode) {
    // 루트 노드가 PanelNode인 경우, 삭제하면 빈 레이아웃이 됨
    if (nodeToDelete.type === "panel") {
      return { newLayout: nodeToDelete, deletedNode: nodeToDelete };
    }
    // 루트 노드가 SplitNode인 경우, 남은 자식 중 하나를 루트로 설정
    if (nodeToDelete.type === "split") {
      // 기본적으로 왼쪽 자식을 루트로 설정
      return { newLayout: nodeToDelete.left, deletedNode: nodeToDelete };
    }
  }

  // 부모 노드가 있는 경우
  if (parentNode && parentNode.type === "split") {
    // 삭제할 노드가 부모의 왼쪽 자식인 경우
    if (parentNode.left.id === deleteNodeId) {
      // 오른쪽 자식을 부모의 왼쪽 자식으로 이동
      parentNode.left = parentNode.right;
      // 부모를 오른쪽 자식으로 설정 (부모의 부모가 있으면)
      const grandParent = findParentNode(newLayout, parentNode.id);
      if (grandParent && grandParent.type === "split") {
        if (grandParent.left.id === parentNode.id) {
          grandParent.left = parentNode.right;
        } else if (grandParent.right.id === parentNode.id) {
          grandParent.right = parentNode.right;
        }
      } else {
        // 부모가 루트인 경우
        return { newLayout: parentNode.right, deletedNode: nodeToDelete };
      }
    }
    // 삭제할 노드가 부모의 오른쪽 자식인 경우
    else if (parentNode.right.id === deleteNodeId) {
      // 왼쪽 자식을 부모의 오른쪽 자식으로 이동
      parentNode.right = parentNode.left;
      // 부모를 왼쪽 자식으로 설정 (부모의 부모가 있으면)
      const grandParent = findParentNode(newLayout, parentNode.id);
      if (grandParent && grandParent.type === "split") {
        if (grandParent.left.id === parentNode.id) {
          grandParent.left = parentNode.left;
        } else if (grandParent.right.id === parentNode.id) {
          grandParent.right = parentNode.left;
        }
      } else {
        // 부모가 루트인 경우
        return { newLayout: parentNode.left, deletedNode: nodeToDelete };
      }
    }
  }

  return { newLayout, deletedNode: nodeToDelete };
};

type PanelSearchProps = {
  layout: LayoutNode;
  x: number;
  y: number;
  maxWidth: number;
  maxHeight: number;
};

export const panelSearch = ({
  layout,
  x,
  y,
  maxWidth,
  maxHeight,
}: PanelSearchProps): {
  findedNode: PanelNode | null;
  findedParentNode: LayoutNode | null;
  insertPosition: "left" | "right" | "top" | "bottom";
} => {
  let foundNode: PanelNode | null = null;
  let foundParentNode: LayoutNode | null = null;
  let insertPosition: "left" | "right" | "top" | "bottom" = "right";

  // 각 노드의 위치와 크기를 계산하여 좌표가 어느 패널에 속하는지 찾기
  const searchNode = (
    node: LayoutNode,
    nodeX: number,
    nodeY: number,
    nodeWidth: number,
    nodeHeight: number,
    parent: LayoutNode | null = null
  ): boolean => {
    // 현재 노드가 패널인 경우
    if (node.type === "panel") {
      // 좌표가 현재 패널 영역 내에 있는지 확인
      if (
        x >= nodeX &&
        x <= nodeX + nodeWidth &&
        y >= nodeY &&
        y <= nodeY + nodeHeight
      ) {
        foundNode = node;
        foundParentNode = parent;

        // 패널 내에서의 상대적 위치 계산 (0~1 범위)
        const relativeX = (x - nodeX) / nodeWidth;
        const relativeY = (y - nodeY) / nodeHeight;

        // 두 대각선의 방정식
        // 파란색 직선: (0,1) → (1,0) → y = -x + 1
        // 초록색 직선: (0,0) → (1,1) → y = x

        // 마우스 포인터가 파란색 직선 아래에 있는지 확인 (y > -x + 1)
        const isBelowBlueLine = relativeY > -relativeX + 1;

        // 마우스 포인터가 초록색 직선 위에 있는지 확인 (y < x)
        const isAboveGreenLine = relativeY < relativeX;

        // 4개의 삼각형 영역 판단
        if (isAboveGreenLine && !isBelowBlueLine) {
          insertPosition = "top"; // 좌상단 삼각형
        } else if (!isAboveGreenLine && !isBelowBlueLine) {
          insertPosition = "left"; // 우상단 삼각형
        } else if (isAboveGreenLine && isBelowBlueLine) {
          insertPosition = "right"; // 좌하단 삼각형
        } else {
          insertPosition = "bottom"; // 우하단 삼각형
        }

        return true;
      }
      return false;
    }

    // SplitNode인 경우
    if (node.type === "split") {
      const leftWidth = nodeWidth * node.ratio;
      const rightWidth = nodeWidth * (1 - node.ratio);
      const leftHeight = nodeHeight * node.ratio;
      const rightHeight = nodeHeight * (1 - node.ratio);

      if (node.orientation === "H") {
        // 가로 분할
        const leftResult = searchNode(
          node.left,
          nodeX,
          nodeY,
          leftWidth,
          nodeHeight,
          node
        );
        if (leftResult) return true;

        const rightResult = searchNode(
          node.right,
          nodeX + leftWidth,
          nodeY,
          rightWidth,
          nodeHeight,
          node
        );
        return rightResult;
      } else {
        // 세로 분할
        const leftResult = searchNode(
          node.left,
          nodeX,
          nodeY,
          nodeWidth,
          leftHeight,
          node
        );
        if (leftResult) return true;

        const rightResult = searchNode(
          node.right,
          nodeX,
          nodeY + leftHeight,
          nodeWidth,
          rightHeight,
          node
        );
        return rightResult;
      }
    }

    return false;
  };

  // 루트 노드부터 검색 시작 (전체 영역을 1000x1000으로 가정)
  searchNode(layout, 0, 0, maxWidth, maxHeight);

  //console.log(`foundNode: ${foundNode?.id}, insertPosition: ${insertPosition}`);
  return {
    findedNode: foundNode,
    findedParentNode: foundParentNode,
    insertPosition,
  };
};

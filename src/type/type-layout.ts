export interface PanelNode {
  type: "panel";
  id: string;
}

export interface SplitNode {
  type: "split";
  id: string;
  left: LayoutNode;
  right: LayoutNode;
  orientation: "H" | "W"; // H: 수평, W: 수직
  ratio: number;
}

export type LayoutNode = PanelNode | SplitNode;

export const sampleLayout: SplitNode = {
  type: "split",
  id: "split-1",
  left: {
    type: "split",
    id: "split-1-1",
    left: {
      type: "split",
      id: "split-1-1-1",
      left: {
        type: "panel",
        id: "panel-1-1-1-1",
      },
      right: {
        type: "panel",
        id: "panel-1-1-1-2",
      },
      orientation: "W",
      ratio: 0.5,
    },

    right: {
      type: "panel",
      id: "panel-1-1-2",
    },
    orientation: "H",
    ratio: 0.5,
  },
  right: {
    type: "panel",
    id: "panel-1-2",
  },
  orientation: "W",
  ratio: 0.7,
};

export type LayoutComponent = {
  id: string;
  component: React.ReactNode;
};

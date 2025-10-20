import Card from "./components/card";
import LayoutComp from "./components/layout/LayoutComp/LayoutComp";
import "./styles.css";
import { LayoutComponent, LayoutNode, sampleLayout } from "./type/type-layout";
import { useState } from "react";

export default function App() {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  const layoutComponentList: LayoutComponent[] = [
    {
      id: "panel-1-2",
      component: (
        <Card className="item" style={{ width: "100%", height: "100%" }}>
          <div>panel-1-2</div>
        </Card>
      ),
    },
    {
      id: "panel-1-1-2",
      component: (
        <Card className="item" style={{ width: "100%", height: "100%" }}>
          <div>panel-1-1-2</div>
        </Card>
      ),
    },
    {
      id: "panel-1-1-1-2",
      component: (
        <Card className="item" style={{ width: "100%", height: "100%" }}>
          <div>panel-1-1-1-2</div>
        </Card>
      ),
    },
    {
      id: "panel-1-1-1-1",
      component: (
        <Card className="item" style={{ width: "100%", height: "100%" }}>
          <div>panel-1-1-1-1</div>
        </Card>
      ),
    },
  ];
  return (
    <div className="App">
      <h1 style={{ marginBottom: "100px" }}>Hello CodeSandbox</h1>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{ width: "900px", height: "700px" }}
          ref={(ref) => setRef(ref)}
        >
          {ref && (
            <LayoutComp
              initialLayout={sampleLayout}
              parentRef={ref}
              layoutComponentList={layoutComponentList}
            />
          )}
        </div>
      </div>
    </div>
  );
}

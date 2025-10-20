import React from "react";
import * as Styled from "./style";

type CardProps = {
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

const Card = ({ className, children, style }: CardProps) => {
  return (
    <Styled.CardWrapper className={className ?? ""} style={style}>
      <div className="inner">{children}</div>
    </Styled.CardWrapper>
  );
};
export default Card;

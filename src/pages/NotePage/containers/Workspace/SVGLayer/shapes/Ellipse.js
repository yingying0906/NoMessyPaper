import React from "react";
import SelectionHandle from './SelectionHandle/SelectionHandle'; 

export default ({
  id,
  cx,
  cy,
  rx,
  ry,
  x,
  y, 
  width,
  height,
  fillColor,
  borderColor,
  borderWidth,
  selected,
  handleStartResizing,
}) => {
  return (
    <g>
      <ellipse
        id={id}
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        fill={fillColor}
        stroke={borderColor}
        strokeWidth={borderWidth}
        // filter={filter}
      />
      {selected ?
        <SelectionHandle
          x={x}
          y={y}
          width={width}
          height={height}
          changeSizeHandler={handleStartResizing}
        /> : null}
    </g>
    
  );
};

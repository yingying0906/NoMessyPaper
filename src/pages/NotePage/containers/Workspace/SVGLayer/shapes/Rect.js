import React from "react";
import SelectionHandle from './SelectionHandle/SelectionHandle'; 

export default ({
  id,
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
      <rect
        id={id}
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fillColor}
        stroke={borderColor}
        strokeWidth={borderWidth}
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

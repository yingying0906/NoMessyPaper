import React from "react";
import LineSelectionHandle from './SelectionHandle/LineSelectionHandle';

export default ({ id, x1, x2, y1, y2, borderColor, borderWidth, selected, handleStartResizing }) => {
  return (
    <g>
      <line
        id={id}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={borderColor}
        strokeWidth={borderWidth}
      />
      {selected ?
        <LineSelectionHandle
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          changeSizeHandler={handleStartResizing}
        /> : null}
    </g>
    
  );
};

import React, { useState } from "react";

import "./SelectionHandle.css";

const LineSelectionHandle = ({x1, y1, x2, y2, changeSizeHandler}) => {
    // x = 5;
    // y -= 5;
    // width += 10;
    // height += 10;
    // const x2 = Number(x)+Number(width);
    // const y2 = Number(y)+Number(height);
    // const xMid = Number(Number(x2)+Number(x))/2;
    // const yMid = Number(Number(y2)+Number(y))/2;
    
    // const [movePoint, setMovePoint] = useState(-1);

    // const changeSizeHandler = (point) => {
    //     console.log('point ' + point);
    //     setMovePoint(point);
    // }

    return(
      <g>
        <circle cx={x1} cy={y1} r='5px' className='selection-handler dots' 
            onMouseDown={(e) => {
                changeSizeHandler(0, e.nativeEvent.offsetX, e.nativeEvent.offsetY); 
                e.stopPropagation();
            }} 
        />
        <circle cx={x2} cy={y2} r='5px' className='selection-handler dots' 
            onMouseDown={(e) => {
                changeSizeHandler(3, e.nativeEvent.offsetX, e.nativeEvent.offsetY); 
                e.stopPropagation();
            }}
        />
      </g>
    )
  }

  export default LineSelectionHandle;
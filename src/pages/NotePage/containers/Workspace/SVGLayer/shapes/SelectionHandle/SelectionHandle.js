import React, { useState } from "react";

import "./SelectionHandle.css";

const SelectionHandle = ({x, y, width, height, changeSizeHandler}) => {
    x -= 5;
    y -= 5;
    width += 10;
    height += 10;
    const x2 = Number(x)+Number(width);
    const y2 = Number(y)+Number(height);
    const xMid = Number(Number(x2)+Number(x))/2;
    const yMid = Number(Number(y2)+Number(y))/2;
    
    // const [movePoint, setMovePoint] = useState(-1);

    // const changeSizeHandler = (point) => {
    //     console.log('point ' + point);
    //     setMovePoint(point);
    // }

    return(
      <g onClick={(e) => {console.log(e.target.tagName)}}>
        <line x1={x} y1={y} x2={x+width} y2={y} className='selection-handler' />
        <line x1={x} y1={y} x2={x} y2={y+height} className='selection-handler' />
        <line x1={x} y1={y+height} x2={x+width} y2={y+height} className='selection-handler' />
        <line x1={x+width} y1={y} x2={x+width} y2={y+height} className='selection-handler' />
        <circle cx={x} cy={y} r='5px' className='selection-handler c0 dots' 
            onMouseDown={(e) => {
                changeSizeHandler(0, e.nativeEvent.offsetX, e.nativeEvent.offsetY); 
                e.stopPropagation();
            }} 
        />
        <circle cx={x2} cy={y} r='5px' className='selection-handler c1 dots' 
            onMouseDown={(e) => {
                changeSizeHandler(1, e.nativeEvent.offsetX, e.nativeEvent.offsetY); 
                e.stopPropagation();
            }}
        />
        <circle cx={x} cy={y2} r='5px' className='selection-handler c2 dots' 
            onMouseDown={(e) => {
                changeSizeHandler(2, e.nativeEvent.offsetX, e.nativeEvent.offsetY); 
                e.stopPropagation();
            }}
        />
        <circle cx={x2} cy={y2} r='5px' className='selection-handler c3 dots' 
            onMouseDown={(e) => {
                changeSizeHandler(3, e.nativeEvent.offsetX, e.nativeEvent.offsetY); 
                e.stopPropagation();
            }}
        />
      </g>
    )
  }

  export default SelectionHandle;
import React, { useState } from "react";
import { TextField } from "@mui/material";
import "./TextBox.css";
import SelectionHandle from "./SelectionHandle/SelectionHandle";

const TextBox = ({
  id,
  x,
  y,
  width,
  height,
  fillColor,
  textColor,
  borderColor,
  borderWidth,
  selected,
  textValue,
  changeTextValue,
  changeTextValueFin,
  handleStartResizing,
  texting,
}) => {
  // const [localvalue, setTextValue] = useState(textValue);

  // const handleFocus = (e) => {
  //   setTextValue(e.target.value);
  // };

  // const handleBlur = (e) => {
  //   if (localvalue !== e.target.value) {
  //     console.log(e.target.value);
  //     changeTextValueFin(id, e.target.value);
  //     setTextValue(e.target.value);
  //   }
  // };

  const handleChangeValue = (e) => {
    changeTextValue(id, e.target.value);
  }

  return (
    <g>
      <foreignObject
        id={id}
        x={x}
        y={y}
        width={width}
        height={height}
        // filter={filter}
        // style={{boxShadow: filter!== null ? '0 8px 16px 0 rgba(0, 0, 0, 0.2)' : null}}
      >
        <textarea
          name="mytext"
          // rows="6"
          // cols="40"
          className="text-box"
          defaultValue={textValue}
          // required
          style={{
            width: Number(width) + "px",
            height: Number(height) + "px",
            backgroundColor: fillColor,
            color: textColor,
            border: `solid ${borderWidth}px ${borderColor}`,
            resize: 'none',
          }}
          disabled={!texting}
          // onFocus={handleFocus}
          // onBlur={handleBlur}
          // onInput={() => {console.log('onInput')}}
          onChange={handleChangeValue}
        ></textarea>
      </foreignObject>
      {selected ? (
        <SelectionHandle
          x={x}
          y={y}
          width={width}
          height={height}
          changeSizeHandler={handleStartResizing}
        />
      ) : null}
    </g>
  );
};

export default TextBox;

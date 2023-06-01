import React, { useState, useContext } from "react";
import reactCSS from "reactcss";
import { SketchPicker } from "react-color";

import ControlContext from "../../contexts/control-context";
import { IconButton } from "@mui/material";

const ColorSelector = ({
  currColorContex,
  setCurrColorContex,
  setCurrColorContexFin,
  IconObj,
}) => {
  // console.log(currColorContex.split('rgba(')[1].split(')')[0].split(','));
  const {
    currFillColor,
    changeCurrFillColor,
    shapes,
    shapesMap,
    selectedShapeId,
  } = useContext(ControlContext);
  const [displayColorPicker, setdisplayColorPicker] = useState(false);
  const [currColor, setCurrColor] = useState({
    r: currColorContex.split("rgba(")[1].split(")")[0].split(",")[0],
    g: currColorContex.split("rgba(")[1].split(")")[0].split(",")[1],
    b: currColorContex.split("rgba(")[1].split(")")[0].split(",")[2],
    a: currColorContex.split("rgba(")[1].split(")")[0].split(",")[3],
  });
  const handleClick = () => {
    setdisplayColorPicker(!displayColorPicker);
  };
  const handleClose = () => {
    setdisplayColorPicker(false);
  };

  const handleChange = (color) => {
    // console.log(currColorContex);
    setCurrColor(color.rgb);
    setCurrColorContex(
      `rgba(${currColor.r}, ${currColor.g}, ${currColor.b}, ${currColor.a})`
    );
  };

  const handleChangeFin = (color) => {
    setCurrColor(color.rgb);
    setCurrColorContex(
      `rgba(${currColor.r}, ${currColor.g}, ${currColor.b}, ${currColor.a})`
    );
    setCurrColorContexFin(
      `rgba(${currColor.r}, ${currColor.g}, ${currColor.b}, ${currColor.a})`
    );
  };

  const styles = reactCSS({
    default: {
      color: {
        width: "36px",
        height: "14px",
        borderRadius: "2px",
        background: currColorContex,
      },
      swatch: {
        padding: "5px",
        background: "#fff",
        borderRadius: "1px",
        boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
        display: "inline-block",
        cursor: "pointer",
      },
      popover: {
        position: "absolute",
        zIndex: "2",
      },
      cover: {
        position: "fixed",
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px",
      },
    },
  });

  return (
    <div>
      {/* <div style={ styles.swatch } onClick={ handleClick }>
          <div style={ styles.color } />
        </div> */}

      <div className="Mode" onClick={handleClick}>
        <IconButton sx={{ color: currColorContex }}>
          <IconObj />
        </IconButton>
      </div>
      {displayColorPicker ? (
        <div style={styles.popover}>
          <div style={styles.cover} onClick={handleClose} />
          <SketchPicker
            color={currColor}
            onChange={handleChange}
            onChangeComplete={handleChangeFin}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ColorSelector;

// class ColorSelector extends React.Component {

//   state = {
//     displayColorPicker: false,
//     color: {
//       r: '241',
//       g: '112',
//       b: '19',
//       a: '1',
//     },
//   };

//   handleClick = () => {
//     this.setState({ displayColorPicker: !this.state.displayColorPicker })
//   };

//   handleClose = () => {
//     this.setState({ displayColorPicker: false })
//   };

//   handleChange = (color) => {
//     this.setState({ color: color.rgb })
//   };

//   render() {

//     const styles = reactCSS({
//       'default': {
//         color: {
//           width: '36px',
//           height: '14px',
//           borderRadius: '2px',
//           background: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`,
//         },
//         swatch: {
//           padding: '5px',
//           background: '#fff',
//           borderRadius: '1px',
//           boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
//           display: 'inline-block',
//           cursor: 'pointer',
//         },
//         popover: {
//           position: 'absolute',
//           zIndex: '2',
//         },
//         cover: {
//           position: 'fixed',
//           top: '0px',
//           right: '0px',
//           bottom: '0px',
//           left: '0px',
//         },
//       },
//     });

//     return (
//       <div>
//         <div style={ styles.swatch } onClick={ this.handleClick }>
//           <div style={ styles.color } />
//         </div>
//         { this.state.displayColorPicker ? <div style={ styles.popover }>
//           <div style={ styles.cover } onClick={ this.handleClose }/>
//           <SketchPicker color={ this.state.color } onChange={ this.handleChange } />
//         </div> : null }

//       </div>
//     )
//   }
// }

// export default ColorSelector;

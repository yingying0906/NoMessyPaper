import { createContext } from "react";

// create a context with default values
const controlContext = createContext({
  currMode: "",
  changeCurrMode: () => {},
  currAction: "",
  changeCurrAction: () => {},

  currBorderColor: "",
  changeCurrBorderColor: () => {},
  changeCurrBorderColorFin: () => {},

  currBorderWidth: 1,
  changeCurrBorderWidth: () => {},
  changeCurrBorderWidthFin: () => {},

  currFillColor: "",
  changeCurrFillColor: () => {},
  changeCurrFillColorFin: () => {},

  currTextColor: "",
  changeCurrTextColor: () => {},
  changeCurrTextColorFin: () => {},

  changeTextValueFin: () => {},

  anchorPoint: {},
  shapes: [],
  shapesMap: {},

  addShape: () => {},
  moveShape: () => {},
  moveShapeFin: () => {},
  grabLayer: () => {},
  resizeShape: () => {},
  resizeShapeFin: () => {},

  selectedShapeId: "", // a string or undefined
  selectedShapeType: "", // a string or undefined
  currCommand: -1,
  lastCommand: -1,
  commandList: [],
  selectShape: () => {},
  deleteSelectedShape: () => {},

  undo: () => {},
  redo: () => {},

  // setShapes: () => {},
  // setShapesMap: () => {},
  // setAnchorPoint: () => {},
});

export default controlContext;

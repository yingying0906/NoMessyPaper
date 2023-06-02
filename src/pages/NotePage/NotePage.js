import "./NotePage.css";

import { Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { getFileUrl, updateMindmap } from "../../database/controlDatabase";

import { AuthUserContext } from "../../auth/AuthUserContext";
import { ReferenceContext } from "../../database/ReferenceContext";
import { SnackBarContext } from "../../containers/SnackBars/SnackBarContext";
import ControlContext from "./contexts/control-context";

import { Grid } from "@mui/material";
import PdfViewer from "./PdfViewer/PdfViewer";

import NoteBord from "./NoteBord";

import ChangeFillColorCommandObject from "./shared/commandObjects/ChangeFillColorCommandObject";
import ChangeTextColorCommandObject from "./shared/commandObjects/ChangeTextColorCommandObject";
import ChangeBorderColorCommandObject from "./shared/commandObjects/ChangeBorderColorCommandObject";
import ChangeBorderWidthCommandObject from "./shared/commandObjects/ChangeBorderWidthCommandObject";
import AddShapeCommandObject from "./shared/commandObjects/AddShapeCommandObject";
import DeleteShapeCommandObject from "./shared/commandObjects/DeleteShapeCommandObject";
import MoveShapeCommandObject from "./shared/commandObjects/MoveShapeCommandObject";
import ChangeTextValueCommandObject from "./shared/commandObjects/ChangeTextValueCommandObject";

import { genId, defaultValues } from "./shared/util";

export let selectedObj = null;

let oriBorderWidth = defaultValues.borderWidth;
let oriBorderColor = defaultValues.borderColor;
let oriFillColor = defaultValues.fillColor;
let oriTextColor = defaultValues.textColor;
let oriPosition = null;
let oriTextValue = "";
let isMoved = false;

const NotePage = () => {
  const { noteId } = useParams();
  const [pdfUrl, setPdfUrl] = React.useState(null);
  const { authUser } = React.useContext(AuthUserContext);
  const { references, mindmaps } = React.useContext(ReferenceContext);
  // const { setShapes, setShapesmap, setAnchor } =
  //   React.useContext(controlContext);

  // controls
  const [ currMode, setCurrMode ] = React.useState(defaultValues.mode);
  const [ currAction, setCurrAction ] = React.useState(defaultValues.action);
  const [ currBorderColor, setCurrBorderColor ] = React.useState(defaultValues.borderColor);
  const [ currBorderWidth, setCurrBorderWidth ] = React.useState(defaultValues.borderWidth);
  const [ currFillColor, setCurrFillColor ] = React.useState(defaultValues.fillColor);
  const [ currTextColor, setCurrTextColor ] = React.useState(defaultValues.textColor);
  const [ currTextValue, setCurrTextValue ] = React.useState("");

  // workspace
  const [ anchorPoint, setAnchorPoint ] = React.useState({ x: 0, y: 0 });
  const [ shapes, setShapes ] = React.useState([]);
  const [ shapesMap, setShapesMap ] = React.useState({});
  const [ selectedShapeId, setSelectedShapeId ] = React.useState(undefined);
  const [ selectedShapeType, setSelectedShapeType ] = React.useState(undefined);

  // handling undo/redo
  const [ commandList, setCommandList ] = React.useState([]);
  const [ currCommand, setCurrCommand ] = React.useState(-1);
  const [ lastCommand, setLastCommand ] = React.useState(-1);

  const registerExecution = (commandObject) => {
    let _commandList = [...commandList];
    if (_commandList[currCommand + 1]) {
      _commandList.splice(currCommand + 1);
    }
    _commandList.push(commandObject);
    setCommandList(_commandList);
    setCurrCommand(currCommand+1);
    setLastCommand(currCommand+1);
    // const lastCommand = this.state.currCommand + 1;
    // const currCommand = this.state.currCommand + 1;
    // this.setState({ commandList, currCommand, lastCommand });
  };

  const selectShape = (id) => {
    setSelectedShapeId(id);
    // this.setState({ selectedShapeId: id });
    if (id) {
      const {
        type,
        borderColor,
        borderWidth,
        fillColor,
        textColor,
        textValue,
      } =
        shapesMap[
          shapes.filter((shapeId) => shapeId === id)[0]
        ];
      setSelectedShapeType(type);
      // this.setState({ selectedShapeType: type });
      setCurrMode(type);
      setCurrAction("select");
      // this.setState({ currMode: type });
      // this.setState({ currAction: "select" });
      if (type === "line") {
        setCurrBorderColor(borderColor);
        setCurrBorderWidth(borderWidth);
        // this.setState({
        //   currBorderColor: borderColor,
        //   currBorderWidth: borderWidth,
        // });
      } else if (type === "textbox") {
        setCurrBorderColor(borderColor);
        setCurrBorderWidth(borderWidth);
        setCurrFillColor(fillColor);
        setCurrTextColor(textColor);
        
        // this.setState({
        //   currBorderColor: borderColor,
        //   // currBorderWidth: borderWidth,
        //   currFillColor: fillColor,
        //   currTextColor: textColor,
        //   // customElements: textValue,
        // });
      } else {
        setCurrBorderColor(borderColor);
        setCurrBorderWidth(borderWidth);
        setCurrFillColor(fillColor);
        // this.setState({
        //   currBorderColor: borderColor,
        //   currBorderWidth: borderWidth,
        //   currFillColor: fillColor,
        // });
      }

      selectedObj = {
        selectedShapeId: id,
        ...shapesMap[
          shapes.filter((shapeId) => shapeId === id)[0]
        ],
      };
      oriBorderWidth = borderWidth;
      oriPosition = {
        initCoords: selectedObj.initCoords,
        finalCoords: selectedObj.finalCoords,
      };
    } else {
      selectedObj = null;
      if (currAction !== "add") {
        setCurrAction("none");
        // this.setState({ currAction: "none" });
      }
    }
  };

  const undo = () => {
    if (currCommand >= 0) {
      changeCurrMode("grab");
      // this.changeCurrMode('select');
      commandList[currCommand].undo();
      setCurrCommand(currCommand - 1);
      // const currCommand = this.state.currCommand - 1;
      // this.setState({ currCommand });
    }
  };

  const redo = () => {
    if (currCommand < lastCommand) {
      changeCurrMode("grab");
      // this.changeCurrMode('select');
      commandList[currCommand + 1].redo();
      setCurrCommand(currCommand + 1);
      // const currCommand = this.state.currCommand + 1;
      // this.setState({ currCommand });
    }
  };

  // add the shapeId to the array, and the shape itself to the map
  const addShape = (shapeData) => {
    let _shapes = [...shapes];
    let _shapesMap = { ...shapesMap };
    const id = genId();
    _shapesMap[id] = {
      ...shapeData,
      id,
    };
    _shapes.push(id);
    setShapes(_shapes);
    setShapesMap(_shapesMap);
    setSelectedShapeId(id);
    // this.setState({ shapes, shapesMap, selectedShapeId: id });
    selectedObj = {
      selectedShapeId: id,
      ...shapeData,
    };
    undoHandler.selectedObj = selectedObj;
    let cmdObj = new AddShapeCommandObject(undoHandler);
    cmdObj.execute();
    selectShape(undefined);
  };

  const UndoAddShape = (_selectedShapeId) => {
    let _shapesMap = { ...shapesMap };
    _shapesMap[_selectedShapeId].visible = false;
    selectedObj = null;
    setShapesMap(_shapesMap);
    setSelectedShapeId(undefined);
    // this.setState({ shapesMap, selectedShapeId: undefined });
  };

  const RedoAddShape = (_selectedShapeId) => {
    let _shapesMap = { ...shapesMap };
    _shapesMap[_selectedShapeId].visible = true;
    selectedObj = {
      selectedShapeId: _selectedShapeId,
      ..._shapesMap[_selectedShapeId],
    };
    setShapesMap(_shapesMap);
    setSelectedShapeId(_selectedShapeId);
    // this.setState({ shapesMap, selectedShapeId: selectedShapeId });
    selectShape(_selectedShapeId);
  };

  // get the shape by its id, and update its properties
  const updateShape = (shapeId, newData) => {
    let _shapesMap = { ...shapesMap };
    let targetShape = _shapesMap[shapeId];
    _shapesMap[shapeId] = { ...targetShape, ...newData };
    selectedObj = { ...selectedObj, ...newData };
    setShapesMap(_shapesMap);
    // this.setState({ shapesMap });
  };

  const moveShape = (newData) => {
    if (selectedShapeId) {
      isMoved = true;
      updateShape(selectedShapeId, newData);
    }
  };

  const moveShapeFin = (newData) => {
    if (!isMoved) return;
    isMoved = false;
    if (selectedShapeId) {
      selectedObj = {
        ...selectedObj,
        ...oriPosition,
      };
      oriPosition = newData;
      undoHandler.selectedObj = selectedObj;
      let cmdObj = new MoveShapeCommandObject(undoHandler);
      cmdObj.execute(newData);
      updateShape(selectedShapeId, newData);
    }
  };

  const DoMoveShape = (_selectedShapeId, newData) => {
    selectedObj = {
      ...selectedObj,
      ...newData,
    };
    oriPosition = newData;
    updateShape(_selectedShapeId, newData);
    selectShape(_selectedShapeId);
  };

  const grabLayer = (newAnchor) => {
    setAnchorPoint(newAnchor);
    // this.setState({ anchorPoint: newAnchor });
  };

  // deleting a shape sets its visibility to false, rather than removing it
  const deleteSelectedShape = () => {
    let _shapesMap = { ...shapesMap };
    _shapesMap[selectedShapeId].visible = false;
    selectedObj = {
      selectedShapeId: selectedShapeId,
      ..._shapesMap[selectedShapeId],
    };
    undoHandler.selectedObj = selectedObj;
    let cmdObj = new DeleteShapeCommandObject(undoHandler);
    cmdObj.execute();
    selectedObj = null;
    setShapesMap(_shapesMap);
    setSelectedShapeId(undefined);
    // this.setState({ shapesMap, selectedShapeId: undefined });
  };

  const changeCurrMode = (mode) => {
    setCurrMode(mode);
    setCurrAction("none");
    // this.setState({ currMode: mode, currAction: "none" });
    selectShape(undefined);
  };

  const changeCurrAction = (action) => {
    setCurrAction(action);
    // this.setState({ currAction: action });
    if (action === "add") {
      selectedObj = null;
      setSelectedShapeId(undefined);
      // this.setState({ selectedShapeId: undefined });
    }
  };

  const changeCurrBorderColor = (borderColor) => {
    setCurrBorderColor(borderColor);
    // this.setState({ currBorderColor: borderColor });
    if (selectedShapeId) {
      updateShape(selectedShapeId, { borderColor });
    }
  };

  const changeCurrBorderColorFin = (borderColor) => {
    setCurrBorderColor(borderColor);
    // this.setState({ currBorderColor: borderColor });
    if (selectedShapeId) {
      selectedObj.borderColor = oriBorderColor;
      oriBorderColor = borderColor;
      undoHandler.selectedObj = selectedObj;
      let cmdObj = new ChangeBorderColorCommandObject(undoHandler);
      cmdObj.execute(borderColor);
      updateShape(selectedShapeId, { borderColor });
    }
  };

  const changeCurrBorderColorState = (_selectedShapeId, borderColor) => {
    selectShape(_selectedShapeId);
    setCurrBorderColor(borderColor);
    // this.setState({ currBorderColor: borderColor });
    selectedObj.borderColor = borderColor;
    updateShape(_selectedShapeId, { borderColor });
  };

  const changeCurrBorderWidth = (borderWidth) => {
    setCurrBorderWidth(borderWidth);
    // this.setState({ currBorderWidth: borderWidth });
    if (selectedShapeId) {
      updateShape(selectedShapeId, { borderWidth });
    }
  };

  const changeCurrBorderWidthFin = (borderWidth) => {
    setCurrBorderWidth(borderWidth);
    // this.setState({ currBorderWidth: borderWidth });
    if (selectedShapeId) {
      selectedObj.borderWidth = oriBorderWidth;
      oriBorderWidth = borderWidth;
      undoHandler.selectedObj = selectedObj;
      let cmdObj = new ChangeBorderWidthCommandObject(undoHandler);
      cmdObj.execute(borderWidth);
      updateShape(selectedShapeId, { borderWidth });
    }
  };

  const changeCurrBorderWidthState = (_selectedShapeId, borderWidth) => {
    selectShape(_selectedShapeId);
    setCurrBorderWidth(borderWidth);
    // this.setState({ currBorderWidth: borderWidth });
    oriBorderWidth = borderWidth;
    selectedObj.borderWidth = borderWidth;
    updateShape(selectedShapeId, { borderWidth });
  };

  const changeCurrFillColor = (fillColor) => {
    setCurrFillColor(fillColor);
    // this.setState({ currFillColor: fillColor });
    if (selectedShapeId) {
      updateShape(selectedShapeId, { fillColor });
    }
  };

  const changeCurrFillColorFin = (fillColor) => {
    setCurrFillColor(fillColor);
    // this.setState({ currFillColor: fillColor });
    if (
      selectedShapeId &&
      shapesMap[selectedObj.selectedShapeId].type !== "line"
    ) {
      selectedObj.fillColor = oriFillColor;
      oriFillColor = fillColor;
      undoHandler.selectedObj = selectedObj;
      let cmdObj = new ChangeFillColorCommandObject(undoHandler);
      cmdObj.execute(fillColor);
      updateShape(selectedShapeId, { fillColor });
    }
  };

  const changeCurrFillColorState = (_selectedShapeId, fillColor) => {
    selectShape(_selectedShapeId);
    setCurrFillColor(fillColor);
    // this.setState({ currFillColor: fillColor });
    oriFillColor = fillColor;
    selectedObj.fillColor = fillColor;
    updateShape(_selectedShapeId, { fillColor });
  };

  const changeCurrTextColor = (textColor) => {
    setCurrTextColor(textColor);
    // this.setState({ currTextColor: textColor });
    if (selectedShapeId) {
      updateShape(selectedShapeId, { textColor });
    }
  };

  const changeCurrTextColorFin = (textColor) => {
    setCurrTextColor(textColor);
    // this.setState({ currTextColor: textColor });
    if (selectedShapeId) {
      selectedObj.textColor = oriTextColor;
      oriTextColor = textColor;
      undoHandler.selectedObj = selectedObj;
      let cmdObj = new ChangeTextColorCommandObject(undoHandler);
      cmdObj.execute(textColor);
      updateShape(selectedShapeId, { textColor });
    }
  };

  const changeCurrTextColorState = (_selectedShapeId, textColor) => {
    selectShape(_selectedShapeId);
    setCurrTextColor(textColor);
    // this.setState({ currTextColor: textColor });

    oriTextColor = textColor;
    selectedObj.textColor = textColor;
    updateShape(_selectedShapeId, { textColor });
  };

  const changeTextValueFin = (textValue) => {
    console.log("changeCurrTextValueFin");
    if (selectedShapeId) {
      selectedObj.textValue = oriTextValue;
      oriTextValue = textValue;
      undoHandler.selectedObj = selectedObj;
      let cmdObj = new ChangeTextValueCommandObject(undoHandler);
      cmdObj.execute(textValue);
      updateShape(selectedShapeId, { textValue });
    }
  };

  const DoChangeTextValue = (_selectedShapeId, textValue) => {
    console.log("DoChangeTextValue " + textValue);
    selectShape(_selectedShapeId);
    oriTextValue = textValue;
    selectedObj.textValue = textValue;
    updateShape(_selectedShapeId, { textValue });
  };

  

  /*
  * pass this undoHandler into command object constructors:
  *  e.g. let cmdObj = new ChangeFillColorCommandObject(this.undoHandler);
  */
  const undoHandler = {
    registerExecution: registerExecution,
    selectedObj: selectedObj,
    changeCurrFillColorState: changeCurrFillColorState,
    changeCurrTextColorState: changeCurrTextColorState,
    changeCurrBorderColorState: changeCurrBorderColorState,
    changeCurrBorderWidthState: changeCurrBorderWidthState,
    UndoAddShape: UndoAddShape,
    RedoAddShape: RedoAddShape,
    DoMoveShape: DoMoveShape,
    DoChangeTextValue: DoChangeTextValue,
  };


  console.log("noteId: ", noteId);

  React.useEffect(() => {
    // get pdf url
    if (authUser === null) return;
    const note = references.find((ref) => ref.id === noteId);
    if (note !== undefined && note !== null) {
      getFileUrl(authUser.uid, noteId, note.fileName)
        .then((url) => {
          setPdfUrl(url);
        })
        .catch((err) => {
          console.log("url erro", err);
          setPdfUrl(null);
        });
    }

    console.log("pdfURL: ", pdfUrl);

    // get mindmap info
    const mindmapNow = mindmaps.find((mindmap) => mindmap.id === noteId);
    console.log("mindmapNow: ", mindmapNow);

    if (mindmapNow === undefined || mindmapNow === null) {
      setShapes([]);
      setShapesMap({});
      setAnchorPoint(null);
    } else {
      setShapes(mindmapNow.shapes);
      setShapesMap(mindmapNow.shapesMap);
      setAnchorPoint(mindmapNow.anchorPoint);
    }
    console.log('500');
    console.log(shapes);
    console.log(shapesMap);
    console.log(anchorPoint);

  }, []);

  console.log('507');
  console.log(shapes);
  console.log(shapesMap);
  console.log(anchorPoint);

  return (
    <div>
      <h1>NotePage</h1>
      <div style={{ height: "80vh" }}>
        <Grid container spacing={1} sx={{ height: "100%" }}>
          {pdfUrl && (
            <Grid item xs={6}>
              <PdfViewer pdfUrl={pdfUrl} />
            </Grid>
          )}

          <Grid item xs={pdfUrl ? 6 : 12}>
            {/* WORKSPACE */}
            <ControlContext.Provider
              value={{
                currMode,
                changeCurrMode: changeCurrMode,
                currAction,
                changeCurrAction: changeCurrAction,

                currBorderColor,
                changeCurrBorderColor: changeCurrBorderColor,
                changeCurrBorderColorFin: changeCurrBorderColorFin,

                currBorderWidth,
                changeCurrBorderWidth: changeCurrBorderWidth,
                changeCurrBorderWidthFin: changeCurrBorderWidthFin,

                currFillColor,
                changeCurrFillColor: changeCurrFillColor,
                changeCurrFillColorFin: changeCurrFillColorFin,

                currTextColor,
                changeCurrTextColor: changeCurrTextColor,
                changeCurrTextColorFin: changeCurrTextColorFin,

                currTextValue,
                changeTextValueFin: changeTextValueFin,

                anchorPoint,
                shapes,
                shapesMap,
                addShape: addShape,
                moveShape: moveShape,
                moveShapeFin: moveShapeFin,
                grabLayer: grabLayer,
                selectedShapeId,
                selectedShapeType,
                currCommand,
                lastCommand,
                commandList,
                selectShape: selectShape,
                deleteSelectedShape: deleteSelectedShape,

                undo: undo,
                redo: redo,

                setShapes: setShapes,
                setShapesmap: setShapesMap,
                setAnchorPoint: setAnchorPoint,
              }}
            >
              <NoteBord className="note-space" />
            </ControlContext.Provider>
            
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default NotePage;

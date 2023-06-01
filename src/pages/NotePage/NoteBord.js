import React, { Component } from "react";

import ControlPanel from "./containers/ControlPanel/ControlPanel";
import Workspace from "./containers/Workspace/Workspace";

import ControlContext from "./contexts/control-context";
import { genId, defaultValues } from "./shared/util";

import ChangeFillColorCommandObject from "./shared/commandObjects/ChangeFillColorCommandObject";
import ChangeTextColorCommandObject from "./shared/commandObjects/ChangeTextColorCommandObject";
import ChangeBorderColorCommandObject from "./shared/commandObjects/ChangeBorderColorCommandObject";
import ChangeBorderWidthCommandObject from "./shared/commandObjects/ChangeBorderWidthCommandObject";
import AddShapeCommandObject from "./shared/commandObjects/AddShapeCommandObject";
import DeleteShapeCommandObject from "./shared/commandObjects/DeleteShapeCommandObject";
import MoveShapeCommandObject from "./shared/commandObjects/MoveShapeCommandObject";
import ChangeTextValueCommandObject from "./shared/commandObjects/ChangeTextValueCommandObject";

// import "./App.css";

export let selectedObj = null;

let oriBorderWidth = defaultValues.borderWidth;
let oriBorderColor = defaultValues.borderColor;
let oriFillColor = defaultValues.fillColor;
let oriTextColor = defaultValues.textColor;
let oriPosition = null;
let oriTextValue = "";
let isMoved = false;

class NoteBord extends Component {
  state = {
    // controls
    currMode: defaultValues.mode,
    currAction: defaultValues.action,
    currBorderColor: defaultValues.borderColor,
    currBorderWidth: defaultValues.borderWidth,
    currFillColor: defaultValues.fillColor,
    currTextColor: defaultValues.textColor,
    currTextValue: "",

    // workspace
    anchorPoint: { x: 0, y: 0 },
    shapes: [],
    shapesMap: {},
    selectedShapeId: undefined,
    selectedShapeType: undefined,

    // handling undo/redo
    commandList: [],
    currCommand: -1,
    lastCommand: -1,
  };

  constructor() {
    super();

    /*
     * pass this undoHandler into command object constructors:
     *  e.g. let cmdObj = new ChangeFillColorCommandObject(this.undoHandler);
     */
    this.undoHandler = {
      registerExecution: this.registerExecution,
      selectedObj: selectedObj,
      changeCurrFillColorState: this.changeCurrFillColorState,
      changeCurrTextColorState: this.changeCurrTextColorState,
      changeCurrBorderColorState: this.changeCurrBorderColorState,
      changeCurrBorderWidthState: this.changeCurrBorderWidthState,
      UndoAddShape: this.UndoAddShape,
      RedoAddShape: this.RedoAddShape,
      DoMoveShape: this.DoMoveShape,
      DoChangeTextValue: this.DoChangeTextValue,
    };
  }

  registerExecution = (commandObject) => {
    let commandList = [...this.state.commandList];
    if (this.state.commandList[this.state.currCommand + 1]) {
      commandList.splice(this.state.currCommand + 1);
    }
    commandList.push(commandObject);
    const lastCommand = this.state.currCommand + 1;
    const currCommand = this.state.currCommand + 1;
    this.setState({ commandList, currCommand, lastCommand });
  };

  undo = () => {
    if (this.state.currCommand >= 0) {
      this.changeCurrMode("grab");
      // this.changeCurrMode('select');
      this.state.commandList[this.state.currCommand].undo();
      const currCommand = this.state.currCommand - 1;
      this.setState({ currCommand });
    }
  };

  redo = () => {
    if (this.state.currCommand < this.state.lastCommand) {
      this.changeCurrMode("grab");
      // this.changeCurrMode('select');
      this.state.commandList[this.state.currCommand + 1].redo();
      const currCommand = this.state.currCommand + 1;
      this.setState({ currCommand });
    }
  };

  // add the shapeId to the array, and the shape itself to the map
  addShape = (shapeData) => {
    let shapes = [...this.state.shapes];
    let shapesMap = { ...this.state.shapesMap };
    const id = genId();
    shapesMap[id] = {
      ...shapeData,
      id,
    };
    shapes.push(id);
    this.setState({ shapes, shapesMap, selectedShapeId: id });
    selectedObj = {
      selectedShapeId: id,
      ...shapeData,
    };
    this.undoHandler.selectedObj = selectedObj;
    let cmdObj = new AddShapeCommandObject(this.undoHandler);
    cmdObj.execute();
    this.selectShape(undefined);
  };

  UndoAddShape = (selectedShapeId) => {
    let shapesMap = { ...this.state.shapesMap };
    shapesMap[selectedShapeId].visible = false;
    selectedObj = null;
    this.setState({ shapesMap, selectedShapeId: undefined });
  };

  RedoAddShape = (selectedShapeId) => {
    let shapesMap = { ...this.state.shapesMap };
    shapesMap[selectedShapeId].visible = true;
    selectedObj = {
      selectedShapeId,
      ...shapesMap[selectedShapeId],
    };
    this.setState({ shapesMap, selectedShapeId: selectedShapeId });
    this.selectShape(selectedShapeId);
  };

  // get the shape by its id, and update its properties
  updateShape = (shapeId, newData) => {
    let shapesMap = { ...this.state.shapesMap };
    let targetShape = shapesMap[shapeId];
    shapesMap[shapeId] = { ...targetShape, ...newData };
    selectedObj = { ...selectedObj, ...newData };
    this.setState({ shapesMap });
  };

  moveShape = (newData) => {
    if (this.state.selectedShapeId) {
      isMoved = true;
      this.updateShape(this.state.selectedShapeId, newData);
    }
  };

  moveShapeFin = (newData) => {
    if (!isMoved) return;
    isMoved = false;
    if (this.state.selectedShapeId) {
      selectedObj = {
        ...selectedObj,
        ...oriPosition,
      };
      oriPosition = newData;
      this.undoHandler.selectedObj = selectedObj;
      let cmdObj = new MoveShapeCommandObject(this.undoHandler);
      cmdObj.execute(newData);
      this.updateShape(this.state.selectedShapeId, newData);
    }
  };

  grabLayer = (newAnchor) => {
    this.setState({ anchorPoint: newAnchor });
  };

  DoMoveShape = (selectedShapeId, newData) => {
    selectedObj = {
      ...selectedObj,
      ...newData,
    };
    oriPosition = newData;
    this.updateShape(selectedShapeId, newData);
    this.selectShape(selectedShapeId);
  };

  // deleting a shape sets its visibility to false, rather than removing it
  deleteSelectedShape = () => {
    let shapesMap = { ...this.state.shapesMap };
    shapesMap[this.state.selectedShapeId].visible = false;
    selectedObj = {
      selectedShapeId: this.state.selectedShapeId,
      ...shapesMap[this.state.selectedShapeId],
    };
    this.undoHandler.selectedObj = selectedObj;
    let cmdObj = new DeleteShapeCommandObject(this.undoHandler);
    cmdObj.execute();
    selectedObj = null;
    this.setState({ shapesMap, selectedShapeId: undefined });
  };

  changeCurrMode = (mode) => {
    this.setState({ currMode: mode, currAction: "none" });
    // if (mode === "line") {
    //   this.setState({
    //     currMode: mode,
    //     currBorderColor: defaultValues.borderColor,
    //   });
    // } else {
    //   this.setState({ currMode: mode });
    // }
    this.selectShape(undefined);
  };

  changeCurrAction = (action) => {
    // if (action === "line") {
    //   this.setState({
    //     currMode: mode,
    //     currBorderColor: defaultValues.borderColor,
    //   });
    // } else {
    //   this.setState({ currMode: mode });
    // }
    this.setState({ currAction: action });
    // this.selectShape(undefined);
    if (action === "add") {
      selectedObj = null;
      this.setState({ selectedShapeId: undefined });
    }
  };

  changeCurrBorderColor = (borderColor) => {
    this.setState({ currBorderColor: borderColor });
    if (this.state.selectedShapeId) {
      // this.undoHandler.selectedObj = selectedObj;
      // let cmdObj = new ChangeBorderColorCommandObject(this.undoHandler);
      // cmdObj.execute(borderColor);
      this.updateShape(this.state.selectedShapeId, { borderColor });
    }
  };

  changeCurrBorderColorFin = (borderColor) => {
    this.setState({ currBorderColor: borderColor });
    if (this.state.selectedShapeId) {
      selectedObj.borderColor = oriBorderColor;
      oriBorderColor = borderColor;
      this.undoHandler.selectedObj = selectedObj;
      let cmdObj = new ChangeBorderColorCommandObject(this.undoHandler);
      cmdObj.execute(borderColor);
      this.updateShape(this.state.selectedShapeId, { borderColor });
    }
  };

  changeCurrBorderColorState = (selectedShapeId, borderColor) => {
    this.selectShape(selectedShapeId);
    this.setState({ currBorderColor: borderColor });
    selectedObj.borderColor = borderColor;
    this.updateShape(selectedShapeId, { borderColor });
  };

  changeCurrBorderWidth = (borderWidth) => {
    this.setState({ currBorderWidth: borderWidth });
    if (this.state.selectedShapeId) {
      this.updateShape(this.state.selectedShapeId, { borderWidth });
    }
  };

  changeCurrBorderWidthFin = (borderWidth) => {
    this.setState({ currBorderWidth: borderWidth });
    if (this.state.selectedShapeId) {
      selectedObj.borderWidth = oriBorderWidth;
      oriBorderWidth = borderWidth;
      this.undoHandler.selectedObj = selectedObj;
      let cmdObj = new ChangeBorderWidthCommandObject(this.undoHandler);
      cmdObj.execute(borderWidth);
      this.updateShape(this.state.selectedShapeId, { borderWidth });
    }
  };

  changeCurrBorderWidthState = (selectedShapeId, borderWidth) => {
    this.selectShape(selectedShapeId);
    this.setState({ currBorderWidth: borderWidth });
    oriBorderWidth = borderWidth;
    selectedObj.borderWidth = borderWidth;
    this.updateShape(selectedShapeId, { borderWidth });
  };

  changeCurrFillColor = (fillColor) => {
    this.setState({ currFillColor: fillColor });
    if (this.state.selectedShapeId) {
      this.updateShape(this.state.selectedShapeId, { fillColor });
    }
  };

  changeCurrFillColorFin = (fillColor) => {
    this.setState({ currFillColor: fillColor });
    if (
      this.state.selectedShapeId &&
      this.state.shapesMap[selectedObj.selectedShapeId].type !== "line"
    ) {
      selectedObj.fillColor = oriFillColor;
      oriFillColor = fillColor;
      this.undoHandler.selectedObj = selectedObj;
      let cmdObj = new ChangeFillColorCommandObject(this.undoHandler);
      cmdObj.execute(fillColor);
      this.updateShape(this.state.selectedShapeId, { fillColor });
    }
  };

  changeCurrFillColorState = (selectedShapeId, fillColor) => {
    this.selectShape(selectedShapeId);
    this.setState({ currFillColor: fillColor });
    oriFillColor = fillColor;
    selectedObj.fillColor = fillColor;
    this.updateShape(selectedShapeId, { fillColor });
  };

  changeCurrTextColor = (textColor) => {
    this.setState({ currTextColor: textColor });
    if (this.state.selectedShapeId) {
      this.updateShape(this.state.selectedShapeId, { textColor });
    }
  };

  changeCurrTextColorFin = (textColor) => {
    this.setState({ currTextColor: textColor });
    if (this.state.selectedShapeId) {
      selectedObj.textColor = oriTextColor;
      oriTextColor = textColor;
      this.undoHandler.selectedObj = selectedObj;
      let cmdObj = new ChangeTextColorCommandObject(this.undoHandler);
      cmdObj.execute(textColor);
      this.updateShape(this.state.selectedShapeId, { textColor });
    }
  };

  changeCurrTextColorState = (selectedShapeId, textColor) => {
    this.selectShape(selectedShapeId);
    this.setState({ currTextColor: textColor });

    oriTextColor = textColor;
    selectedObj.textColor = textColor;
    this.updateShape(selectedShapeId, { textColor });
  };

  changeTextValueFin = (textValue) => {
    // if(!isMoved) return;
    // isMoved = false;
    console.log("changeCurrTextValueFin");
    if (this.state.selectedShapeId) {
      selectedObj.textValue = oriTextValue;
      oriTextValue = textValue;
      this.undoHandler.selectedObj = selectedObj;
      let cmdObj = new ChangeTextValueCommandObject(this.undoHandler);
      cmdObj.execute(textValue);
      this.updateShape(this.state.selectedShapeId, textValue);
    }
  };

  DoChangeTextValue = (selectedShapeId, textValue) => {
    console.log("DoChangeTextValue " + textValue);
    this.selectShape(selectedShapeId);
    oriTextValue = textValue;
    selectedObj.textValue = textValue;
    this.updateShape(selectedShapeId, { textValue });
  };

  selectShape = (id) => {
    this.setState({ selectedShapeId: id });
    if (id) {
      const {
        type,
        borderColor,
        borderWidth,
        fillColor,
        textColor,
        textValue,
      } =
        this.state.shapesMap[
          this.state.shapes.filter((shapeId) => shapeId === id)[0]
        ];
      this.setState({ selectedShapeType: type });
      this.setState({ currMode: type });
      this.setState({ currAction: "select" });
      if (type === "line") {
        this.setState({
          currBorderColor: borderColor,
          currBorderWidth: borderWidth,
          // currFillColor: fillColor,
        });
      } else if (type === "textbox") {
        this.setState({
          currBorderColor: borderColor,
          // currBorderWidth: borderWidth,
          currFillColor: fillColor,
          currTextColor: textColor,
          customElements: textValue,
        });
      } else {
        this.setState({
          currBorderColor: borderColor,
          currBorderWidth: borderWidth,
          currFillColor: fillColor,
        });
      }

      selectedObj = {
        selectedShapeId: id,
        ...this.state.shapesMap[
          this.state.shapes.filter((shapeId) => shapeId === id)[0]
        ],
      };
      oriBorderWidth = borderWidth;
      oriPosition = {
        initCoords: selectedObj.initCoords,
        finalCoords: selectedObj.finalCoords,
      };
    } else {
      selectedObj = null;
      if (this.state.currAction !== "add") {
        this.setState({ currAction: "none" });
      }
    }
  };

  render() {
    const {
      currMode,
      currAction,
      currBorderColor,
      currBorderWidth,
      currFillColor,
      currTextColor,
      currTextValue,
      anchorPoint,
      shapes,
      shapesMap,
      selectedShapeId,
      selectedShapeType,
      currCommand,
      lastCommand,
      commandList,
    } = this.state;

    // update the context with the functions and values defined above and from state
    // and pass it to the structure below it (control panel and workspace)
    return (
      <ControlContext.Provider
        value={{
          currMode,
          changeCurrMode: this.changeCurrMode,
          currAction,
          changeCurrAction: this.changeCurrAction,

          currBorderColor,
          changeCurrBorderColor: this.changeCurrBorderColor,
          changeCurrBorderColorFin: this.changeCurrBorderColorFin,

          currBorderWidth,
          changeCurrBorderWidth: this.changeCurrBorderWidth,
          changeCurrBorderWidthFin: this.changeCurrBorderWidthFin,

          currFillColor,
          changeCurrFillColor: this.changeCurrFillColor,
          changeCurrFillColorFin: this.changeCurrFillColorFin,

          currTextColor,
          changeCurrTextColor: this.changeCurrTextColor,
          changeCurrTextColorFin: this.changeCurrTextColorFin,

          currTextValue,
          changeTextValueFin: this.changeTextValueFin,

          anchorPoint,
          shapes,
          shapesMap,
          addShape: this.addShape,
          moveShape: this.moveShape,
          moveShapeFin: this.moveShapeFin,
          grabLayer: this.grabLayer,
          selectedShapeId,
          selectedShapeType,
          currCommand,
          lastCommand,
          commandList,
          selectShape: this.selectShape,
          deleteSelectedShape: this.deleteSelectedShape,

          undo: this.undo,
          redo: this.redo,
        }}
      >
        <div className="note-space">
          <ControlPanel />
          <Workspace />
        </div>

        {/* <CommandList/> */}
      </ControlContext.Provider>
    );
  }
}

export default NoteBord;

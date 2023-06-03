import React, { useEffect, useContext, useCallback } from "react";
// import { SwatchesPicker } from 'react-color';

import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";

import OpenWithOutlinedIcon from "@mui/icons-material/OpenWithOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import SaveIcon from "@mui/icons-material/Save";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import CursorImg from "../../../../assets/cursor.png";
import LineImg from "../../../../assets/line.png";
import supportedColors from "../../shared/supportedColors";
import ControlContext from "../../contexts/control-context";
import { SnackBarContext } from "../../../../containers/SnackBars/SnackBarContext";
import ColorSelector from "./ColorSelector";

import "./ControlPanel.css";
import { IconButton } from "@mui/material";
import { updateMindmap } from "../../../../database/controlDatabase";
import { AuthUserContext } from "../../../../auth/AuthUserContext";
import { useParams } from "react-router-dom";

const TextBoxUI = ({
  currAction,
  changeCurrAction,
  currBorderColor,
  changeCurrBorderColor,
  changeCurrBorderColorFin,
  currFillColor,
  changeCurrFillColor,
  changeCurrFillColorFin,
  currTextColor,
  changeCurrTextColor,
  changeCurrTextColorFin,
}) => {

  return (
    <div className="Details">
      <div
        className={["Mode", currAction === "add" ? "Active" : null].join(" ")}
        onClick={() => changeCurrAction("add")}
      >
        <AddCircleOutlineIcon className="ButtonIcon" />
      </div>
      <ColorSelector
        currColorContex={currBorderColor}
        setCurrColorContex={changeCurrBorderColor}
        setCurrColorContexFin={changeCurrBorderColorFin}
        IconObj={BorderColorOutlinedIcon}
      />

      <ColorSelector
        currColorContex={currFillColor}
        setCurrColorContex={changeCurrFillColor}
        setCurrColorContexFin={changeCurrFillColorFin}
        IconObj={FormatColorFillIcon}
      />

      <ColorSelector
        currColorContex={currTextColor}
        setCurrColorContex={changeCurrTextColor}
        setCurrColorContexFin={changeCurrTextColorFin}
        IconObj={FormatColorTextIcon}
      />
      {/* <div
        className="Mode"
      >
        <MdOutlineFormatColorFill className="ButtonIcon" color="green"/>
      </div> */}
    </div>
  );
};

const LineUI = ({
  currAction,
  changeCurrAction,
  currBorderColor,
  changeCurrBorderColor,
  changeCurrBorderColorFin,
}) => {
  return (
    <div className="Details">
      <div
        className={["Mode", currAction === "add" ? "Active" : null].join(" ")}
        onClick={() => changeCurrAction("add")}
      >
        <AddCircleOutlineIcon className="ButtonIcon" />
      </div>
      <ColorSelector
        currColorContex={currBorderColor}
        setCurrColorContex={changeCurrBorderColor}
        setCurrColorContexFin={changeCurrBorderColorFin}
        IconObj={BorderColorOutlinedIcon}
      />
    </div>
  );
};

const RectUI = ({
  currAction,
  changeCurrAction,
  currBorderColor,
  changeCurrBorderColor,
  changeCurrBorderColorFin,
  currFillColor,
  changeCurrFillColor,
  changeCurrFillColorFin,
}) => {
  return (
    <div className="Details">
      <div
        className={["Mode", currAction === "add" ? "Active" : null].join(" ")}
        onClick={() => changeCurrAction("add")}
      >
        <AddCircleOutlineIcon className="ButtonIcon" />
      </div>
      <ColorSelector
        currColorContex={currBorderColor}
        setCurrColorContex={changeCurrBorderColor}
        setCurrColorContexFin={changeCurrBorderColorFin}
        IconObj={BorderColorOutlinedIcon}
      />

      <ColorSelector
        currColorContex={currFillColor}
        setCurrColorContex={changeCurrFillColor}
        setCurrColorContexFin={changeCurrFillColorFin}
        IconObj={FormatColorFillIcon}
      />
    </div>
  );
};

const EllipseUI = ({
  currAction,
  changeCurrAction,
  currBorderColor,
  changeCurrBorderColor,
  changeCurrBorderColorFin,
  currFillColor,
  changeCurrFillColor,
  changeCurrFillColorFin,
}) => {
  return (
    <div className="Details">
      <div
        className={["Mode", currAction === "add" ? "Active" : null].join(" ")}
        onClick={() => changeCurrAction("add")}
      >
        <AddCircleOutlineIcon className="ButtonIcon" />
      </div>
      <ColorSelector
        currColorContex={currBorderColor}
        setCurrColorContex={changeCurrBorderColor}
        setCurrColorContexFin={changeCurrBorderColorFin}
        IconObj={BorderColorOutlinedIcon}
      />

      <ColorSelector
        currColorContex={currFillColor}
        setCurrColorContex={changeCurrFillColor}
        setCurrColorContexFin={changeCurrFillColorFin}
        IconObj={FormatColorFillIcon}
      />
    </div>
  );
};

const ControlPanel = () => {
  // use useContext to access the functions & values from the provider
  const {
    currMode,
    changeCurrMode,
    currAction,
    changeCurrAction,
    currBorderColor,
    changeCurrBorderColor,
    changeCurrBorderColorFin,
    currFillColor,
    changeCurrFillColor,
    changeCurrFillColorFin,
    currTextColor,
    changeCurrTextColor,
    changeCurrTextColorFin,
    currBorderWidth,
    changeCurrBorderWidth,
    changeCurrBorderWidthFin,

    // shapes,
    // shapesMap,
    selectedShapeId,
    selectedShapeType,
    currCommand,
    lastCommand,
    deleteSelectedShape,
    undo,
    redo,

    // database
    anchorPoint,
    shapes,
    shapesMap,
  } = useContext(ControlContext);

  const { noteId } = useParams();
  const { setSnackMessage, setOpenSnack } = React.useContext(SnackBarContext);
  const { authUser } = React.useContext(AuthUserContext);

  const ctrlKeyDownHandler = useCallback((e) => {
    if (e.ctrlKey && e.key === "z") {
      // console.log('Undo!!!!!');
      undo();
    } else if (e.ctrlKey && e.key === "y") {
      // console.log('Redo!!!!!');
      redo();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", ctrlKeyDownHandler, false);
    return () =>
      window.removeEventListener("keydown", ctrlKeyDownHandler, true);
  }, [ctrlKeyDownHandler]);

  return (
    <div className="ControlPanel">
      <div className="Control">
        {/* <h3>Mode:</h3> */}
        <div className="Modes">
          {/* cursor */}
          <div
            className={["Mode", currMode === "grab" ? "Active" : null].join(
              " "
            )}
            onClick={() => changeCurrMode("grab")}
          >
            {/* <img src={CursorImg} alt="cursor" /> */}

            <OpenWithOutlinedIcon />
          </div>

          {/* textbox */}
          <div
            className={["Mode", currMode === "textbox" ? "Active" : null].join(
              " "
            )}
            onClick={() => changeCurrMode("textbox")}
          >
            <TextFieldsIcon />
          </div>

          {/* line */}
          <div
            className={["Mode", currMode === "line" ? "Active" : null].join(
              " "
            )}
            onClick={() => changeCurrMode("line")}
          >
            <img src={LineImg} alt="line" />
          </div>
          {/* rect */}
          <div
            className={["Mode", currMode === "rect" ? "Active" : null].join(
              " "
            )}
            onClick={() => changeCurrMode("rect")}
          >
            <div
              style={{
                backgroundColor: currFillColor,
                width: 36,
                height: 20,
                border: `2px solid ${currBorderColor}`,
              }}
            ></div>
          </div>
          {/* ellipse */}
          <div
            className={["Mode", currMode === "ellipse" ? "Active" : null].join(
              " "
            )}
            onClick={() => changeCurrMode("ellipse")}
          >
            <div
              style={{
                backgroundColor: currFillColor,
                width: 36,
                height: 20,
                border: `2px solid ${currBorderColor}`,
                borderRadius: "50%",
              }}
            ></div>
          </div>
          {/* delete */}
          <div className="DeleteButtonsContainer">
            <IconButton
              className="Mode"
              onClick={() => deleteSelectedShape()}
              disabled={!selectedShapeId}
              style={{
                cursor: !selectedShapeId ? "not-allowed" : null,
              }}
            >
              <DeleteIcon />
            </IconButton>
          </div>
          {/* Undo/Redo */}
          <div className="UndoRedoButtonsContainer">
            {/* Undo */}
            <IconButton
              className="Mode"
              onClick={() => undo()}
              disabled={currCommand <= -1}
            >
              <UndoIcon />
            </IconButton>
            {/* Redo */}
            <IconButton
              className="Mode"
              onClick={() => redo()}
              disabled={currCommand >= lastCommand}
            >
              <RedoIcon />
            </IconButton>
          </div>
          <div className="SaveButtonsContainer">
            <IconButton
              className="Mode"
              sx={{ color: "black" }}
              onClick={() => {
                updateMindmap(authUser.uid, noteId, {
                  anchorPoint: anchorPoint,
                  shapes: shapes,
                  shapesMap: shapesMap,
                });
                setSnackMessage("Saved!");
                setOpenSnack(true);
              }}
            >
              <SaveIcon />
            </IconButton>
          </div>
        </div>
      </div>
      {currMode === "textbox" ||
      (selectedShapeId && selectedShapeType === "textbox")
        ? TextBoxUI({
            currAction,
            changeCurrAction,
            currBorderColor,
            changeCurrBorderColor,
            changeCurrBorderColorFin,
            currFillColor,
            changeCurrFillColor,
            changeCurrFillColorFin,
            currTextColor,
            changeCurrTextColor,
            changeCurrTextColorFin,
          })
        : currMode === "line" ||
          (selectedShapeId && selectedShapeType === "line")
        ? LineUI({
            currAction,
            changeCurrAction,
            currBorderColor,
            changeCurrBorderColor,
            changeCurrBorderColorFin,
          })
        : currMode === "rect" ||
          (selectedShapeId && selectedShapeType === "rect")
        ? RectUI({
            currAction,
            changeCurrAction,
            currBorderColor,
            changeCurrBorderColor,
            changeCurrBorderColorFin,
            currFillColor,
            changeCurrFillColor,
            changeCurrFillColorFin,
          })
        : currMode === "ellipse" ||
          (selectedShapeId && selectedShapeType === "ellipse")
        ? EllipseUI({
            currAction,
            changeCurrAction,
            currBorderColor,
            changeCurrBorderColor,
            changeCurrBorderColorFin,
            currFillColor,
            changeCurrFillColor,
            changeCurrFillColorFin,
          })
        : null}
      {/* <div className="Details">
        <ColorSelector />
      </div> */}
    </div>
  );
};

export default ControlPanel;

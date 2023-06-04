import React, { useEffect, useCallback, useContext, useState } from "react";

import TextBox from "./shapes/TextBox";
import Line from "./shapes/Line";
import Rect from "./shapes/Rect";
import Ellipse from "./shapes/Ellipse";

import ControlContext from "../../../contexts/control-context";
import { selectShadowId } from "../../../shared/util";
import { setRef } from "@mui/material";
import { FaPen } from "react-icons/fa";

const SVGLayer = () => {
  const {
    currMode,
    currAction,
    changeCurrAction,
    currBorderColor,
    currBorderWidth,
    currFillColor,
    currTextColor,
    currTextValue,
    changeTextValue,
    changeTextValueFin,
    anchorPoint,
    shapes,
    shapesMap,
    addShape,
    moveShape,
    moveShapeFin,
    grabLayer,
    selectedShapeId,
    selectShape,
  } = useContext(ControlContext);

  // use useState to set elements in the React state directly
  // the first element of the list is the state value
  // the second element of the list is a function to update the state value in the future
  const [drawing, setDrawing] = useState(false);
  // shape start drawing point
  const [initPoint, setInitPoint] = useState({ x: undefined, y: undefined });
  // shape end drawing point
  const [currPoint, setCurrPoint] = useState({ x: undefined, y: undefined });

  const [dragging, setDragging] = useState(false);
  const [draggingShape, setDraggingShape] = useState(undefined);
  const [mouseDownPoint, setMouseDownPoint] = useState({
    x: undefined,
    y: undefined,
  });

  const [resizing, setResizing] = useState(-1);
  const [resizingShape, setResizingShape] = useState(undefined);
  const [resInitPoint, setResInitPoint] = useState({
    x: undefined,
    y: undefined,
  });
  const [texting, setTexting] = useState(false);

  const [grabbing, setGrabbing] = useState(false);

  const handleStartResizing = (point, initX, initY) => {
    setResizing(point);
    setResInitPoint({
      x: Number(initX),
      y: Number(initY),
    });
    setResizingShape(
      shapesMap[shapes.filter((shapeId) => shapeId === selectedShapeId)[0]]
    );
  };

  const handleMouseDown = (e) => {
    console.log("Mode: " + currMode + " , Act: " + currAction);
    // if (currMode !== "select") {
    if (currAction === "add") {
      if (e.target.nodeName === "TEXTAREA") return;
      // should create
      setDrawing(true);
      setInitPoint({
        x: e.nativeEvent.offsetX - anchorPoint.x,
        y: e.nativeEvent.offsetY - anchorPoint.y,
      });
      setCurrPoint({
        x: e.nativeEvent.offsetX - anchorPoint.x,
        y: e.nativeEvent.offsetY - anchorPoint.y,
      });
      e.preventDefault();
    } else {
      // should select
      if (e.target.nodeName === "svg") {
        // deselect
        selectShape(undefined);
        setTexting(false);
        if (currMode === "grab") {
          setGrabbing(true);
          setMouseDownPoint({
            x: e.nativeEvent.offsetX,
            y: e.nativeEvent.offsetY,
          });
        }
      } else {
        // select
        if (e.target.nodeName === "TEXTAREA") {
          // e.target.getAttribute()
          const targetId = e.target.parentNode.id;
          if (texting && targetId === selectedShapeId) return;
          if (targetId !== selectedShapeId) setTexting(false);
          // e.target.blur();
          selectShape(targetId);
          setDragging(true);
          setMouseDownPoint({
            x:
              Number(e.nativeEvent.offsetX) +
              Number(e.target.parentNode.getAttribute("x")),
            y:
              Number(e.nativeEvent.offsetY) +
              Number(e.target.parentNode.getAttribute("y")),
          });
          setDraggingShape(
            shapesMap[shapes.filter((shapeId) => shapeId === targetId)[0]]
          );
        } else {
          const targetId = e.target.id;
          setTexting(false);
          selectShape(targetId);
          setDragging(true);
          setMouseDownPoint({
            x: e.nativeEvent.offsetX,
            y: e.nativeEvent.offsetY,
          });
          setDraggingShape(
            shapesMap[shapes.filter((shapeId) => shapeId === targetId)[0]]
          );
        }
      }
    }
  };

  const handleMouseMove = (e) => {
    if (drawing) {
      if (e.target.nodeName === "TEXTAREA") {
        setCurrPoint({
          x:
            Number(e.nativeEvent.offsetX) +
            Number(e.target.parentNode.getAttribute("x")) -
            anchorPoint.x,
          y:
            Number(e.nativeEvent.offsetY) +
            Number(e.target.parentNode.getAttribute("y")) -
            anchorPoint.y,
        });
      } else
        setCurrPoint({
          x: e.nativeEvent.offsetX - anchorPoint.x,
          y: e.nativeEvent.offsetY - anchorPoint.y,
        });
    } else if (dragging && draggingShape) {
      if (e.target.nodeName === "TEXTAREA") {
        const deltaX =
          Number(e.nativeEvent.offsetX) +
          Number(e.target.parentNode.getAttribute("x")) -
          mouseDownPoint.x;
        const deltaY =
          Number(e.nativeEvent.offsetY) +
          Number(e.target.parentNode.getAttribute("y")) -
          mouseDownPoint.y;
        moveShape({
          initCoords: {
            x: draggingShape.initCoords.x + deltaX,
            y: draggingShape.initCoords.y + deltaY,
          },
          finalCoords: {
            x: draggingShape.finalCoords.x + deltaX,
            y: draggingShape.finalCoords.y + deltaY,
          },
        });
      } else {
        const deltaX = e.nativeEvent.offsetX - mouseDownPoint.x;
        const deltaY = e.nativeEvent.offsetY - mouseDownPoint.y;

        moveShape({
          initCoords: {
            x: draggingShape.initCoords.x + deltaX,
            y: draggingShape.initCoords.y + deltaY,
          },
          finalCoords: {
            x: draggingShape.finalCoords.x + deltaX,
            y: draggingShape.finalCoords.y + deltaY,
          },
        });
      }
    } else if (resizing !== -1) {
      let deltaX, deltaY;
      if (e.target.nodeName === "TEXTAREA") {
        deltaX =
          Number(e.nativeEvent.offsetX) +
          Number(e.target.parentNode.getAttribute("x")) -
          resInitPoint.x;
        deltaY =
          Number(e.nativeEvent.offsetY) +
          Number(e.target.parentNode.getAttribute("y")) -
          resInitPoint.y;
      } else {
        deltaX = e.nativeEvent.offsetX - resInitPoint.x;
        deltaY = e.nativeEvent.offsetY - resInitPoint.y;
      }
      switch (resizing) {
        case 0: {
          // top-left
          let newX = resizingShape.initCoords.x + deltaX;
          let newY = resizingShape.initCoords.y + deltaY;
          if (currMode !== "line") {
            if (resizingShape.finalCoords.x - newX < 10)
              newX = resizingShape.finalCoords.x - 10;
            if (resizingShape.finalCoords.y - newY < 10)
              newY = resizingShape.finalCoords.y - 10;
          }
          moveShape({
            initCoords: {
              x: newX,
              y: newY,
            },
          });
          break;
        }
        case 1: {
          // top-right
          let newX = resizingShape.finalCoords.x + deltaX;
          if (newX - resizingShape.initCoords.x < 10)
            newX = resizingShape.initCoords.x + 10;
          let newY = resizingShape.initCoords.y + deltaY;
          if (resizingShape.finalCoords.y - newY < 10)
            newY = resizingShape.finalCoords.y - 10;
          moveShape({
            initCoords: {
              x: resizingShape.initCoords.x,
              y: newY,
            },
            finalCoords: {
              x: newX,
              y: resizingShape.finalCoords.y,
            },
          });
          break;
        }
        case 2: {
          // bottom-left
          let newX = resizingShape.initCoords.x + deltaX;
          if (resizingShape.finalCoords.x - newX < 10)
            newX = resizingShape.finalCoords.x - 10;
          let newY = resizingShape.finalCoords.y + deltaY;
          if (newY - resizingShape.initCoords.y < 10)
            newY = resizingShape.initCoords.y + 10;
          moveShape({
            initCoords: {
              x: newX,
              y: resizingShape.initCoords.y,
            },
            finalCoords: {
              x: resizingShape.finalCoords.x,
              y: newY,
            },
          });
          break;
        }
        case 3: {
          // bottom-right
          let newX = resizingShape.finalCoords.x + deltaX;
          let newY = resizingShape.finalCoords.y + deltaY;
          if (currMode !== "line") {
            if (newX - resizingShape.initCoords.x < 10)
              newX = resizingShape.initCoords.x + 10;
            if (newY - resizingShape.initCoords.y < 10)
              newY = resizingShape.initCoords.y + 10;
          }
          moveShape({
            finalCoords: {
              x: newX,
              y: newY,
            },
          });
          break;
        }
        default: {
          break;
        }
      }
    } else if (grabbing) {
      const deltaX = e.nativeEvent.offsetX - mouseDownPoint.x;
      const deltaY = e.nativeEvent.offsetY - mouseDownPoint.y;
      grabLayer({
        x: anchorPoint.x + deltaX,
        y: anchorPoint.y + deltaY,
      });
      setMouseDownPoint({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    }
  };

  const handleMouseUp = (e) => {
    // if (currMode !== "select") {
    if (currAction === "add") {
      changeCurrAction("none");
      if (!(initPoint.x === currPoint.x && initPoint.y === currPoint.y)) {
        // check if it's too small
        const threshold = 10;
        let shouldCreate = true;
        const deltaX = Math.abs(initPoint.x - currPoint.x);
        const deltaY = Math.abs(initPoint.y - currPoint.y);
        if (currMode === "line") {
          if (Math.sqrt(deltaX ** 2 + deltaY ** 2) < threshold) {
            shouldCreate = false;
          }
        } else {
          if (deltaX < threshold || deltaY < threshold) {
            shouldCreate = false;
          }
        }

        if (shouldCreate) {
          // create
          addShape({
            type: currMode,
            visible: true,
            initCoords: initPoint,
            finalCoords: currPoint,
            borderColor: currBorderColor,
            borderWidth: currBorderWidth,
            fillColor: currFillColor,
            textColor: currTextColor,
          });
        }
      }

      setDrawing(false);
      setInitPoint({ x: undefined, y: undefined });
      setCurrPoint({ x: undefined, y: undefined });
    } else {
      if (dragging && draggingShape) {
        if (e.target.nodeName === "TEXTAREA") {
          const deltaX =
            Number(e.nativeEvent.offsetX) +
            Number(e.target.parentNode.getAttribute("x")) -
            mouseDownPoint.x;
          const deltaY =
            Number(e.nativeEvent.offsetY) +
            Number(e.target.parentNode.getAttribute("y")) -
            mouseDownPoint.y;

          moveShapeFin({
            initCoords: {
              x: draggingShape.initCoords.x + deltaX,
              y: draggingShape.initCoords.y + deltaY,
            },
            finalCoords: {
              x: draggingShape.finalCoords.x + deltaX,
              y: draggingShape.finalCoords.y + deltaY,
            },
          });
        } else {
          const deltaX = e.nativeEvent.offsetX - mouseDownPoint.x;
          const deltaY = e.nativeEvent.offsetY - mouseDownPoint.y;

          moveShapeFin({
            initCoords: {
              x: draggingShape.initCoords.x + deltaX,
              y: draggingShape.initCoords.y + deltaY,
            },
            finalCoords: {
              x: draggingShape.finalCoords.x + deltaX,
              y: draggingShape.finalCoords.y + deltaY,
            },
          });
        }
      } else if (resizing !== -1) {
        let deltaX, deltaY;
        if (e.target.nodeName === "TEXTAREA") {
          deltaX =
            Number(e.nativeEvent.offsetX) +
            Number(e.target.parentNode.getAttribute("x")) -
            resInitPoint.x;
          deltaY =
            Number(e.nativeEvent.offsetY) +
            Number(e.target.parentNode.getAttribute("y")) -
            resInitPoint.y;
        } else {
          deltaX = e.nativeEvent.offsetX - resInitPoint.x;
          deltaY = e.nativeEvent.offsetY - resInitPoint.y;
        }
        switch (resizing) {
          case 0: {
            // top-left
            let newX = resizingShape.initCoords.x + deltaX;
            let newY = resizingShape.initCoords.y + deltaY;
            if (currMode !== "line") {
              if (resizingShape.finalCoords.x - newX < 10)
                newX = resizingShape.finalCoords.x - 10;
              if (resizingShape.finalCoords.y - newY < 10)
                newY = resizingShape.finalCoords.y - 10;
            }
            moveShapeFin({
              initCoords: {
                x: newX,
                y: newY,
              },
              finalCoords: {
                x: resizingShape.finalCoords.x,
                y: resizingShape.finalCoords.y,
              },
            });
            break;
          }
          case 1: {
            // top-right
            let newX = resizingShape.finalCoords.x + deltaX;
            if (newX - resizingShape.initCoords.x < 10)
              newX = resizingShape.initCoords.x + 10;
            let newY = resizingShape.initCoords.y + deltaY;
            if (resizingShape.finalCoords.y - newY < 10)
              newY = resizingShape.finalCoords.y - 10;
            moveShapeFin({
              initCoords: {
                x: resizingShape.initCoords.x,
                y: newY,
              },
              finalCoords: {
                x: newX,
                y: resizingShape.finalCoords.y,
              },
            });
            break;
          }
          case 2: {
            // bottom-left
            let newX = resizingShape.initCoords.x + deltaX;
            if (resizingShape.finalCoords.x - newX < 10)
              newX = resizingShape.finalCoords.x - 10;
            let newY = resizingShape.finalCoords.y + deltaY;
            if (newY - resizingShape.initCoords.y < 10)
              newY = resizingShape.initCoords.y + 10;
            moveShapeFin({
              initCoords: {
                x: newX,
                y: resizingShape.initCoords.y,
              },
              finalCoords: {
                x: resizingShape.finalCoords.x,
                y: newY,
              },
            });
            break;
          }
          case 3: {
            // bottom-right
            let newX = resizingShape.finalCoords.x + deltaX;
            let newY = resizingShape.finalCoords.y + deltaY;
            if (currMode !== "line") {
              if (newX - resizingShape.initCoords.x < 10)
                newX = resizingShape.initCoords.x + 10;
              if (newY - resizingShape.initCoords.y < 10)
                newY = resizingShape.initCoords.y + 10;
            }
            moveShapeFin({
              initCoords: {
                x: resizingShape.initCoords.x,
                y: resizingShape.initCoords.y,
              },
              finalCoords: {
                x: newX,
                y: newY,
              },
            });
            break;
          }
        }
      } else if (grabbing) {
        const deltaX = e.nativeEvent.offsetX - mouseDownPoint.x;
        const deltaY = e.nativeEvent.offsetY - mouseDownPoint.y;
        grabLayer({
          x: anchorPoint.x + deltaX,
          y: anchorPoint.y + deltaY,
        });
      }
      setDragging(false);
      setDraggingShape(undefined);
      setMouseDownPoint({ x: undefined, y: undefined });

      setGrabbing(false);

      setResizing(-1);
      setDraggingShape(undefined);
      setResInitPoint({ x: undefined, y: undefined });
    }
  };

  const handleDbclick = (e) => {
    if (e.target.nodeName === "TEXTAREA") {
      setTexting(true);
    }
  };
  // useCallback gives a memoized version of the callback that changes when one of its dependencies change
  // the first argument is the function that will be run
  // the second is the dependencies that the function relies on
  const escKeyDownHandler = useCallback(
    (e) => {
      if (e.key === "Escape") {
        // abort
        if (drawing) {
          setDrawing(false);
          setInitPoint({ x: undefined, y: undefined });
          setCurrPoint({ x: undefined, y: undefined });
        } else if (dragging) {
          moveShape({
            initCoords: {
              x: draggingShape.initCoords.x,
              y: draggingShape.initCoords.y,
            },
            finalCoords: {
              x: draggingShape.finalCoords.x,
              y: draggingShape.finalCoords.y,
            },
          });
          setDragging(false);
          setDraggingShape(undefined);
          setMouseDownPoint({ x: undefined, y: undefined });
        } else if (resizing !== -1) {
          moveShape({
            initCoords: {
              x: resizingShape.initCoords.x,
              y: resizingShape.initCoords.y,
            },
            finalCoords: {
              x: resizingShape.finalCoords.x,
              y: resizingShape.finalCoords.y,
            },
          });
          setResizing(-1);
          setResizingShape(undefined);
          setResInitPoint({ x: undefined, y: undefined });
        }
      }
    },
    [drawing, dragging, draggingShape, moveShape]
  );

  // useEffect will run after the render is committed to the screen
  // the first argument is the function that will run
  // the second argument are the dependencies, meaning this will only run when there is a change in these values
  useEffect(() => {
    window.addEventListener("keydown", escKeyDownHandler, true);
    return () => window.removeEventListener("keydown", escKeyDownHandler, true);
  }, [escKeyDownHandler]);

  const genShape = (shapeData, key = undefined) => {
    const {
      initCoords,
      finalCoords,
      borderColor,
      borderWidth,
      fillColor,
      textColor,
      textValue,
      id,
    } = shapeData;
    // const filter =
    //   selectedShapeId && selectedShapeId === id
    //     ? `url(#${selectShadowId})`
    //     : null;
    const selected = selectedShapeId && selectedShapeId === id;

    switch (shapeData.type) {
      case "textbox": {
        return React.createElement(TextBox, {
          x: Math.min(initCoords.x, finalCoords.x) + anchorPoint.x,
          y: Math.min(initCoords.y, finalCoords.y) + anchorPoint.y,
          width: Math.abs(finalCoords.x - initCoords.x),
          height: Math.abs(finalCoords.y - initCoords.y),
          fillColor,
          textColor,
          borderColor,
          borderWidth,
          id,
          key,
          selected,
          textValue,
          changeTextValue,
          changeTextValueFin,
          handleStartResizing,
          texting,
        });
      }
      case "line": {
        return React.createElement(Line, {
          x1: initCoords.x + anchorPoint.x,
          y1: initCoords.y + anchorPoint.y,
          x2: finalCoords.x + anchorPoint.x,
          y2: finalCoords.y + anchorPoint.y,
          borderColor,
          borderWidth,
          id,
          key,
          selected,
          handleStartResizing,
        });
      }
      case "rect": {
        return React.createElement(Rect, {
          x: Math.min(initCoords.x, finalCoords.x) + anchorPoint.x,
          y: Math.min(initCoords.y, finalCoords.y) + anchorPoint.y,
          width: Math.abs(finalCoords.x - initCoords.x),
          height: Math.abs(finalCoords.y - initCoords.y),
          fillColor,
          borderColor,
          borderWidth,
          id,
          key,
          selected,
          handleStartResizing,
        });
      }
      case "ellipse": {
        let x = Math.min(finalCoords.x, initCoords.x) + anchorPoint.x;
        let y = Math.min(finalCoords.y, initCoords.y) + anchorPoint.y;
        let w = Math.abs(finalCoords.x - initCoords.x);
        let h = Math.abs(finalCoords.y - initCoords.y);

        return React.createElement(Ellipse, {
          cx: x + w / 2,
          cy: y + h / 2,
          rx: w / 2,
          ry: h / 2,
          x: x,
          y: y,
          width: w,
          height: h,
          fillColor,
          borderColor,
          borderWidth,
          id,
          key,
          selected,
          handleStartResizing,
        });
      }
      default: {
        return null;
      }
    }
  };

  const renderShape = (shapeData, key) => {
    if (shapeData.visible) {
      return genShape(shapeData, key);
    } else {
      return null;
    }
  };

  const renderTempShape = () => {
    if (
      initPoint.x !== undefined &&
      initPoint.y !== undefined &&
      currPoint.x !== undefined &&
      currPoint.y !== undefined
    ) {
      return genShape({
        type: currMode,
        initCoords: initPoint,
        finalCoords: currPoint,
        borderColor: currBorderColor,
        borderWidth: currBorderWidth,
        fillColor: currFillColor,
        textColor: currTextColor,
        // new shape don't have init textValue
        textValue: currTextValue,
      });
    }
  };

  return (
    <svg
      id="workspace-svg"
      width="100%"
      height="100%"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDoubleClick={handleDbclick}
      style={
        currMode === "grab" ? { cursor: "-webkit-grab", cursor: "grab" } : {}
      }
    >
      {/* shadow */}
      <filter
        id={selectShadowId}
        x="-100%"
        y="-100%"
        width="400%"
        height="400%"
      >
        <feDropShadow
          dx="0"
          dy="0"
          stdDeviation="15"
          floodColor="rgba(0, 0, 0, 0.7)"
        />
      </filter>
      {shapes ? shapes.map((shapeId, idx) => {
        return renderShape(shapesMap[shapeId], idx);
      }) : null }
      {drawing && renderTempShape()}

      {/* temp text-box text */}
      {/* <foreignObject x="100" y="100" width="500" height="300">
        <textarea name="mytext"
          className="text-box"
        >
        </textarea>
      </foreignObject> */}
    </svg>
  );
};

export default SVGLayer;

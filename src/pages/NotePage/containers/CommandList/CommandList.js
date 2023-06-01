import React, { useEffect, useContext, useCallback } from "react";
import ScrollToBottom from 'react-scroll-to-bottom';
import ControlContext from "../../contexts/control-context";

import "./CommandList.css";

const CommandList = () => {
  const {
    currCommand,
    lastCommand,
    commandList,
  } = useContext(ControlContext);

  return (
    <ScrollToBottom className="CommandList">
      {/* <a>hi</a> */}
      {
        commandList.map((cmd, index) => {
          let classname;
          if(index === currCommand) classname = "CommandBox-curr";
          else if(index > currCommand) classname = "CommandBox-undo";
          else classname = "CommandBox";

          let operation;
          switch(cmd.oper){
            case 'Add':
              operation = 'Create ' + cmd.targetObject.type;
              return (<div className={classname} key={index}>{operation}</div>);
              break;
            case 'Delete':
              operation = 'Delete ' + cmd.targetObject.type;
              return (<div className={classname} key={index}>{operation}</div>);
              break;
            case 'Move':
              operation = 'Move ' + cmd.targetObject.type;
              return (<div className={classname} key={index}>{operation}</div>);
              break;
            case 'BorderColor':
              operation = 'Change ' + cmd.targetObject.type + ' border color to ';
              return (<div className={classname} key={index}>{operation}<span style={{backgroundColor:cmd.newValue, color: "gray"}}>{cmd.newValue}</span></div>);
              
              break;
            case 'BorderWidth':
              operation = 'Change ' + cmd.targetObject.type + ' border width to ' + cmd.newValue;
              return (<div className={classname} key={index}>{operation}</div>);
              break;
            case 'FillColor':
              operation = 'Change ' + cmd.targetObject.type + ' fill color to ';
              return (<div className={classname} key={index}>{operation}<span style={{backgroundColor:cmd.newValue, color: "gray"}}>{cmd.newValue}</span></div>);
              break;
            default:
              break;
          }
          if(index === currCommand) return (<div className="CommandBox-curr" key={index}>{operation}</div>);
          else if(index > currCommand) return (<div className="CommandBox-undo" key={index}>{operation}</div>);
          else return (<div className="CommandBox" key={index}>{operation}</div>);
        })
      }
    </ScrollToBottom >
  );
};

export default CommandList;

import React, { Component } from "react";

import ControlPanel from "./containers/ControlPanel/ControlPanel";
import Workspace from "./containers/Workspace/Workspace";

class NoteBord extends Component {

  constructor() {
    super();
  }

  render() {
    return (
        <div className="note-space">
          <ControlPanel />
          <Workspace />
        </div>
    );
  }
}

export default NoteBord;

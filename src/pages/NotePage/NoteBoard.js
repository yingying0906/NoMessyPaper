import React, { Component } from "react";

import ControlPanel from "./containers/ControlPanel/ControlPanel";
import Workspace from "./containers/Workspace/Workspace";

class NoteBoard extends Component {

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

export default NoteBoard;

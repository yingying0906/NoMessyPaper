import CommandObject from "./CommandObject";
import { selectedObj } from "../../contexts/control-context";


export default class ChangeFillColorCommandObject extends CommandObject {
  constructor(undoHandler) {
    super(undoHandler, true);
    this.oper = 'FillColor';
  }

  /* override to return true if this command can be executed,
   *  e.g., if there is an object selected
   */
  canExecute() {
    return selectedObj !== null; // global variable for selected
  }

  /* override to execute the action of this command.
   * pass in false for addToUndoStack if this is a command which is NOT
   * put on the undo stack, like Copy, or a change of selection or Save
   */
  execute(newColor) {
    // console.log('execute fill?');
    if (selectedObj !== null) {
      this.targetObject = selectedObj; // global variable for selected
      this.oldValue = selectedObj.fillColor; // object's current color
      this.newValue = newColor; //fillColorWidget.currFillColor; // get the color widget's current color
      // selectedObj.fillColor = this.newValue; // actually change
      console.log('execute fill color: ' + this.oldValue + " to " + this.newValue);

      // Note that this command object must be a NEW command object so it can be
      // registered to put it onto the stack
      if (this.addToUndoStack) {
        this.undoHandler.registerExecution(this);
      }
    }
  }

  /* override to undo the operation of this command
   */
  undo() {
    console.log('undo fill color: from ' + this.newValue + " to " + this.oldValue);
    this.targetObject.fillColor = this.oldValue;
    // maybe also need to fix the palette to show this object's color?
    // becomeSelected(this.targetObject);
    this.undoHandler.changeCurrFillColorState(this.targetObject.selectedShapeId ,this.oldValue);
  }

  /* override to redo the operation of this command, which means to
   * undo the undo. This should ONLY be called if the immediate
   * previous operation was an Undo of this command. Anything that
   * can be undone can be redone, so there is no need for a canRedo.
   */
  redo() {
    console.log('redo fill color');
    this.targetObject.fillColor = this.newValue;
    // maybe also need to fix the palette to show this object's color?
    // becomeSelected(this.targetObject);
    this.undoHandler.changeCurrFillColorState(this.targetObject.selectedShapeId ,this.newValue);
  }

  /* override to return true if this operation can be repeated in the
   * current context
   */
  canRepeat() {
    return selectedObj !== null;
  }

  /* override to execute the operation again, this time possibly on
   * a new object. Thus, this typically uses the same value but a new
   * selectedObject.
   */
  repeat() {
    if (selectedObj !== null) {
      this.targetObject = selectedObj; // get new selected obj
      this.oldValue = selectedObj.fillColor; // object's current color
      // no change to newValue since reusing the same color
      selectedObj.fillColor = this.newValue; // actually change

      // Note that this command object must be a NEW command object so it can be
      // registered to put it onto the stack
      if (this.addToUndoStack) this.undoHandler.registerExecution({...this});
    }
  }
}

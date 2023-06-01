import CommandObject from "./CommandObject";
import { selectedObj } from "../../NoteBord";


export default class AddShapeCommandObject extends CommandObject {
  constructor(undoHandler) {
    super(undoHandler, true);
    this.oper = 'Add';
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
  execute() {
    if (selectedObj !== null) {
      this.targetObject = selectedObj; // global variable for selected
      // this.oldValue = selectedObj.borderWidth; // object's current color
      // this.newValue = newWidth; //fillColorWidget.currFillColor; // get the color widget's current color
      // selectedObj.fillColor = this.newValue; // actually change
      console.log('execute add shape');

      // Note that this command object must be a NEW command object so it can be
      // registered to put it onto the stack
      if (this.addToUndoStack) {
        // this.undoHandler.ChangeFillColorCommandObject(selectedObj.selectedShapeId ,fillColorWidget.currFillColor);
        this.undoHandler.registerExecution(this);
      }
    }
  }

  /* override to undo the operation of this command
   */
  undo() {
    console.log('undo add shape');
    // this.targetObject.borderWidth = this.oldValue;
    // maybe also need to fix the palette to show this object's color?
    this.undoHandler.UndoAddShape(this.targetObject.selectedShapeId);
  }

  /* override to redo the operation of this command, which means to
   * undo the undo. This should ONLY be called if the immediate
   * previous operation was an Undo of this command. Anything that
   * can be undone can be redone, so there is no need for a canRedo.
   */
  redo() {
    console.log('redo add shape');
    // this.targetObject.borderWidth = this.newValue;
    // maybe also need to fix the palette to show this object's color?
    // becomeSelected(this.targetObject);
    this.undoHandler.RedoAddShape(this.targetObject.selectedShapeId);
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

import { v4 as uuidv4 } from "uuid";

export const genId = () => {
  // return new Date().getTime().toString();
  return uuidv4();
};

export const selectShadowId = "select-shadow";

export const defaultValues = {
  mode: "textbox", // 'grab', 'line', 'rect', 'ellipse',
  action: "none", // 'none', 'select', 'add'
  // borderColor: "#000",
  borderColor: "rgba(100,100,100,1)",
  borderWidth: 1,
  // fillColor: "#9fce63",
  fillColor: "rgba(200,200,200,1)",
  textColor: "rgba(0,0,0,1)",
};

import { v4 as uuidv4 } from "uuid";

export const genId = () => {
  // return new Date().getTime().toString();
  return uuidv4();
};

export const selectShadowId = "select-shadow";

export const defaultValues = {
  mode: "line", // 'grab', 'line', 'rect', 'ellipse',
  action: "none",   // 'none', 'select', 'add'
  // borderColor: "#000",
  borderColor: "rgba(0,0,0,1)",
  borderWidth: 3,
  // fillColor: "#9fce63",
  fillColor: "rgba(80,227,194,1)",
  textColor: "rgba(0,0,0,1)",
};

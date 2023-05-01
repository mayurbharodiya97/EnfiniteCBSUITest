import { forwardRef } from "react";
import Slide from "@material-ui/core/Slide";

export const Transition = forwardRef(function Transition(props, ref) {
  //@ts-ignore
  return <Slide direction="up" ref={ref} {...props} />;
});

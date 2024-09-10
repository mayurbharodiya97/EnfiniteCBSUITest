import { useEffect } from "react";

export const InvalidAction = ({ closeDialog }) => {
  useEffect(() => {
    closeDialog();
  }, [closeDialog]);
  return null;
};

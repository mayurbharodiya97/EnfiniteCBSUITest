import Button from "@material-ui/core/Button";
import { Fragment } from "react";

export const ActionCell = ({
  requestRowEdit,
  currentEditRow,
  saveCurrentRow,
  cancelCurrentRowEdit,
  row: { id },
}) => {
  return (
    <div style={{ display: "flex", alignItems: "start" }}>
      {currentEditRow === id ? (
        <Fragment>
          <Button
            onClick={() => saveCurrentRow(id)}
            size="small"
            variant="outlined"
            disableRipple={true}
          >
            Done
          </Button>
          <Button
            onClick={() => cancelCurrentRowEdit(id)}
            size="small"
            variant="outlined"
            disableRipple={true}
          >
            Cancel
          </Button>
        </Fragment>
      ) : (
        <Button
          onClick={() => requestRowEdit(id)}
          size="small"
          variant="outlined"
          disableRipple={true}
        >
          Edit
        </Button>
      )}
    </div>
  );
};

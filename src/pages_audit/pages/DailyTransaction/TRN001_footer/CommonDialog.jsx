import React, { useEffect, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Button } from "@mui/material";

const CommonDialog = ({ dialogBox, handleClose, handleSave }) => {
  return (
    <>
      <Dialog
        open={dialogBox.open}
        // onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"> {dialogBox.title}</DialogTitle>

        <DialogActions>
          <Button variant="contained" onClick={() => handleClose()}>
            Cancel
          </Button>
          <Button
            color="success"
            variant="contained"
            onClick={() => handleSave()}
            autoFocus
          >
            {dialogBox.saveBtn}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CommonDialog;

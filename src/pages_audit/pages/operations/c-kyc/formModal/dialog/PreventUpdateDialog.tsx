import * as React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { GradientButton } from 'components/styledComponent/button';

export const PreventUpdateDialog = ({open, onClose}) => {
    return <Dialog open={open} maxWidth="sm"
    PaperProps={{
        style: {
            minWidth: "40%",
            width: "40%",
        }
    }}>
        <DialogTitle
            sx={{
                background: "var(--theme-color3)",
                color: "var(--theme-color2)",
                letterSpacing: "1.3px",
                margin: "10px",
                boxShadow:
                "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;",
                fontWeight: 500,
                borderRadius: "inherit",
                minWidth: "450px",
                py: 1,
            }}
            id="responsive-dialog-title"
        >
            Update Required
            {/* {isLoading ? "Updating..." : "Updated Successfully"} */}
            {/* {"Updating..."} */}
        </DialogTitle>
        <DialogContent>
        <DialogContentText
            sx={{ fontSize: "19px", display: "flex" }}
        >
            <p>You have not made any changes yet.</p>
            {/* {isLoading ? "Please Wait.. Your Data is getting updated.." : "Data Updated Successfully."}                 */}
            {/* <HelpIcon color="secondary" fontSize="large" /> */}
        </DialogContentText>
        <DialogContentText
            sx={{ fontSize: "19px", display: "flex" }}
        >
            <p>Please kindly make any changes and update.</p>
            {/* {isLoading ? "Please Wait.. Your Data is getting updated.." : "Data Updated Successfully."}                 */}
            {/* <HelpIcon color="secondary" fontSize="large" /> */}
        </DialogContentText>
        <DialogActions>
          <GradientButton
              autoFocus
              onClick={onClose}
          >
              Close
          </GradientButton>
        </DialogActions>      
    </DialogContent>  
    </Dialog>
  }
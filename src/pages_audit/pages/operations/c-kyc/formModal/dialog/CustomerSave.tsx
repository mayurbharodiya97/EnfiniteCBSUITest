import React, { useContext, useRef } from "react";
import { CkycContext } from "../../CkycContext";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { GradientButton } from "components/styledComponent/button";

export const CustomerSaveDialog = ({open, onClose, onFormClose}) => {
    const {state, handleFormModalClosectx, handleCurrFormctx} = useContext(CkycContext);
    return <Dialog open={open} maxWidth="sm"
        PaperProps={{
            style: {
                minWidth: "40%",
                width: "40%",
            }
        }}
    >
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
            Customer Saved!
            {/* {isLoading ? "Updating..." : "Updated Successfully"} */}
            {/* {"Updating..."} */}
        </DialogTitle>
        <DialogContent>
            <DialogContentText
                sx={{ fontSize: "19px", display: "flex" }}
            >
                Customer Saved SuccessFully!
                {/* {isLoading ? "Please Wait.. Your Data is getting updated.." : "Data Updated Successfully."}                 */}
                {/* <HelpIcon color="secondary" fontSize="large" /> */}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <GradientButton
                autoFocus
                onClick={() => {
                    handleCurrFormctx({
                        currentFormSubmitted: null,
                        isLoading: false,
                    })
                    handleFormModalClosectx()
                    onFormClose()
                }}
            >
                OK
            </GradientButton>
        </DialogActions>
    </Dialog>
}
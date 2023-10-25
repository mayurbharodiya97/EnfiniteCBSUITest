import { Dialog } from "@mui/material";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const EditDoc = ({
    // rowsData,
    // open,
    // onClose,
}) => {
    const { state: rows }: any = useLocation();
    useEffect(() => {
        console.log("rowwws", rows)
    }, [rows])
    return (
        <Dialog
            open={true}
            onClose={() => {}}
            fullWidth={true}
            PaperProps={{
                style: {
                    maxWidth: "900px",
                },
            }}
        >
            <h1>edwedweds</h1>
        </Dialog>
    )
}

export default EditDoc;
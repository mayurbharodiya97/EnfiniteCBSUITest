import { useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import FdPrintDynamicRetrieve from "./fdPrintRetrieve/retrieveFdPrint";
import { Box } from "@mui/system";
import { Grid, Typography } from "@mui/material";
import { utilFunction } from "components/utils";
import { GradientButton } from "components/styledComponent/button";

const FdPrintDynamicNew = ({SelectedRowData,handleClose,navigate})=>{
    return (
        <>
        <GradientButton onClick={handleClose}>Retrieve</GradientButton>
        <h1>Testing</h1>
        </>
    )
}
export default FdPrintDynamicNew
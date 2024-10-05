import {
  AppBar,
  Box,
  Dialog,
  Grid,
  List,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { t } from "i18next";
import { ListItemData } from "../inwardClearing/inwardClearing";
import {
  ActionTypes,
  GradientButton,
  GridMetaDataType,
  GridWrapper,
} from "@acuteinfo/common-base";
import { DDtransactionsMetadata } from "./paySlipMetadata";
import { useCallback, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { RetrieveEntryGrid } from "./entries/entryGrid";
const actions: ActionTypes[] = [
  {
    actionName: "close",
    actionLabel: t("Close"),
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
];
export const PayslipDDTransaction = () => {
  const navigate = useNavigate();
  const [componentTorender, setComponetToRender] = useState([]);
  const [screenOpen, setScreenOpen] = useState(false);

  const setCurrentAction = useCallback(async (data) => {
    if (data?.name === "close") {
      console.log("closed");

      navigate("/cbsenfinity/dashboard");
    }
  }, []);
  const screens = [
    { DOCCD: "RPT/14", DOCURL: "Payslip Issue Entry", SCREENREF: "ISSUE" },
    {
      DOCCD: "RPT/17",
      DOCURL: "Payslip Realize Entry",
      SCREENREF: "REALIZE",
      TRAN_TYPE: "RE",
    },
    {
      DOCCD: "RPT/20",
      DOCURL: "Payslip Cancel Entry",
      SCREENREF: "CANCEL",
      TRAN_TYPE: "TE",
    },
    {
      DOCCD: "RPT/22",
      DOCURL: "Payslip Stop Payment",
      SCREENREF: "STOPPAYMENT",
      TRAN_TYPE: "S",
    },
  ];
  const close = () => {
    setScreenOpen(false);
  };
  return (
    <>
      <Dialog
        open={true}
        fullScreen
        //@ts-ignore
        PaperProps={{
          style: {
            width: "32%",
            height: "auto",
            // padding: "5px",
            overflow: "hidden",
          },
        }}
        maxWidth="md"
      >
        {/* <AppBar
          position="relative"
          color="secondary"
          style={{
            margin: "11px",
            width: "auto",
            background: "var(--theme-color5)",
          }}
        >
          <Toolbar variant={"dense"}>
            <Typography
              // className={headerClasses.title}
              color="inherit"
              variant={"h6"}
              component="div"
            >
              {t("PayslipDDTransaction")}
            </Typography>
          </Toolbar>
        </AppBar> */}
        <Paper sx={{ p: 2 }}>
          <GridWrapper
            key={"DDtransactionsMetadata"}
            finalMetaData={DDtransactionsMetadata as GridMetaDataType}
            data={screens ?? []}
            setData={() => null}
            actions={actions}
            loading={undefined}
            setAction={setCurrentAction}
            refetchData={null}
            onClickActionEvent={(index, id, currentData) => {
              if (id === "OPEN") {
                console.log(componentTorender);
                setComponetToRender([
                  //@ts-ignore
                  currentData?.DOCCD, //@ts-ignore
                  currentData?.DOCURL, //@ts-ignore
                  currentData?.SCREENREF, //@ts-ignore
                  currentData?.TRAN_TYPE, //@ts-ignore
                ]);
                setScreenOpen(true);
              }
            }}
            variant="contained"
          />
        </Paper>
        {screenOpen && (
          <RetrieveEntryGrid
            screenFlag={componentTorender[2]}
            open={screenOpen}
            close={close}
            headerLabel={`${componentTorender[1]} (${componentTorender[0]})`}
            apiReqFlag={componentTorender[0]}
            trans_type={componentTorender[3]}
          />
        )}
      </Dialog>
    </>
  );
};

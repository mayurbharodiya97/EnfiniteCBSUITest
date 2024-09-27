import {
  AppBar,
  Box,
  Dialog,
  Grid,
  List,
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
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
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

  const setCurrentAction = useCallback(
    async (data) => {
      if (data?.name === "Delete") {
      }
      navigate(data?.name, {
        state: data?.rows,
      });
    },
    [navigate]
  );
  const screens = [
    { DOCCD: "RPT/14", DOCURL: "Payslip Issue Entry" },
    { DOCCD: "RPT/15", DOCURL: "Payslip Issue Entry Confirmation" },
    { DOCCD: "RPT/17", DOCURL: "Payslip Realize Entry" },
    { DOCCD: "RPT/18", DOCURL: "Payslip Realize Confirmation" },
    { DOCCD: "RPT/20", DOCURL: "Payslip Cancel Entry" },
    { DOCCD: "RPT/21", DOCURL: "Payslip Cancel Confirmation" },
    { DOCCD: "RPT/22", DOCURL: "Payslip Stop Payment" },
  ];

  return (
    <>
      <Dialog
        open={true}
        //@ts-ignore
        PaperProps={{
          style: {
            width: "100%",
            minHeight: "auto",
            height: "auto",
          },
        }}
        maxWidth="sm"
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
        <GridWrapper
          key={"modeMasterGrid"}
          finalMetaData={DDtransactionsMetadata as GridMetaDataType}
          data={screens ?? []}
          setData={() => null}
          actions={actions}
          loading={undefined}
          setAction={() => {}}
          refetchData={null}
          variant="contained"
          controlsAtBottom
        />
      </Dialog>
    </>
  );
};

import {
  AppBar,
  Box,
  Dialog,
  Divider,
  Toolbar,
  Typography,
} from "@mui/material";
import { GradientButton } from "components/styledComponent/button";
import { useRef } from "react";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { FromUserMetadata, ToUserMetadata } from "./viewDetailMetadata";
import { InitialValuesType } from "packages/form";
import { usePopupContext } from "components/custom/popupContext";
import CashierExchangeTable from "../../tableComponent.tsx/tableComponent";
import { CashierConfirmationMetaData } from "./viewTableMetadata";
import { useMutation } from "react-query";
import * as API from "../api";
import { enqueueSnackbar } from "notistack";
import { t } from "i18next";

const CashierEntryViewDetail = ({ open, onClose, stateData, rowsData }) => {
  const TableRef = useRef<any>([]);
  const fromUserData = stateData?.fromData?.[0] ?? {};
  const toUserData = stateData?.toData?.[0] ?? {};
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const buttonStyles = {
    display: "flex",
    justifyContent: "center",
    margin: "20px 0",
  };
  const cashierEntryConf: any = useMutation(
    "getCashierExchangeEntryConfirmation",
    API.getCashierExchangeEntryConfirmation,
    {
      onError: () => {
        CloseMessageBox();
      },
      onSuccess: (data, variables) => {
        console.log("data", data);

        CloseMessageBox();
        onClose();
        if (variables?._isDeleteRow === "false") {
          enqueueSnackbar(t("DataConfirmMessage"), {
            variant: "success",
          });
        } else if (variables?._isDeleteRow === "true") {
          enqueueSnackbar(t("DataRejectMessage"), {
            variant: "success",
          });
        }
      },
    }
  );
  const HandleConfirm = async () => {
    const MapFrom = stateData?.fromData?.map((row) => ({
      ENTERED_COMP_CD: row?.ENTERED_COMP_CD,
      ENTERED_BRANCH_CD: row?.ENTERED_BRANCH_CD,
      SCROLL1: row?.SCROLL1,
      TYPE_CD: row?.TYPE_CD,
      TRAN_CD: row?.TRAN_CD,
    }));

    const request = {
      _isDeleteRow: "false",
      FROM_USER: rowsData?.[0]?.data?.MODIFIED_BY,
      TO_USER: stateData?.toData?.[0]?.MODIFIED_BY,
      AMOUNT: rowsData?.[0]?.data?.AMOUNT,
      DETAILS_DATA: { isUpdateRow: MapFrom },
    };
    console.log("request for confirm", request);

    const Confirmation = await MessageBox({
      message: "SaveData",
      messageTitle: "Confirmation",
      buttonNames: ["Yes", "No"],
      loadingBtnName: ["Yes"],
    });
    if (Confirmation === "Yes") {
      cashierEntryConf.mutate({
        ...request,
      });
    }
  };

  const handleDelete = async () => {
    const request = {
      _isDeleteRow: "true",
      ENTERED_COMP_CD: rowsData?.[0]?.data?.COMP_CD,
      ENTERED_BRANCH_CD: rowsData?.[0]?.data?.BRANCH_CD,
      SCROLL1: rowsData?.[0]?.data?.SCROLL1,
    };
    console.log("request for delete", request);

    const Confirmation = await MessageBox({
      message: "deleteTitle",
      messageTitle: "Confirmation",
      buttonNames: ["Yes", "No"],
      loadingBtnName: ["Yes"],
    });
    if (Confirmation === "Yes") {
      cashierEntryConf.mutate({
        ...request,
      });
    }
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: "auto", height: "auto", padding: "8px" },
      }}
      maxWidth="lg"
    >
      <AppBar
        position="static"
        sx={{ background: "var(--theme-color5)", minHeight: "44px" }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: 700, color: "var(--theme-color2)" }}
          >
            Cashier Denomination Exchange
          </Typography>
        </Toolbar>
      </AppBar>

      <Box display="flex" justifyContent="center">
        <Box sx={{ flex: 1 }}>
          <FormWrapper
            key={"CashierExchangeEntryFormFrom" + fromUserData.id}
            metaData={FromUserMetadata as MetaDataType}
            hideHeader
            formStyle={{ height: "auto" }}
            initialValues={fromUserData as InitialValuesType}
          />
          <CashierExchangeTable
            data={stateData?.fromData}
            metadata={CashierConfirmationMetaData}
            TableLabel={"Cashier Exchange Table"}
            hideHeader={true}
            showFooter={true}
            ref={TableRef}
          />
        </Box>

        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

        <Box sx={{ flex: 1 }}>
          <FormWrapper
            key={"CashierExchangeEntryFormTo" + toUserData.id}
            metaData={ToUserMetadata as MetaDataType}
            hideHeader
            formStyle={{ height: "auto" }}
            initialValues={toUserData as InitialValuesType}
          />
          <CashierExchangeTable
            data={stateData?.toData}
            metadata={CashierConfirmationMetaData}
            TableLabel={"Cashier Exchange Table"}
            hideHeader={true}
            showFooter={true}
            ref={TableRef}
          />
        </Box>
      </Box>

      <Box sx={buttonStyles}>
        <GradientButton onClick={HandleConfirm}>Ok</GradientButton>
        <GradientButton onClick={onClose}>Cancel</GradientButton>
        <GradientButton onClick={handleDelete}>Delete</GradientButton>
      </Box>
    </Dialog>
  );
};

export default CashierEntryViewDetail;

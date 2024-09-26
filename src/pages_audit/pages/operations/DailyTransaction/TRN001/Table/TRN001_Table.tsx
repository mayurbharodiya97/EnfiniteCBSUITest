import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { TRN001_TableMetaData } from "./gridMetadata";
import * as API from "../api";
import * as CommonApi from "../../TRNCommon/api";
import { useSnackbar } from "notistack";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import { AuthContext } from "pages_audit/auth";
import { useContext } from "react";

import Scroll from "pages_audit/pages/dashboard/Today'sTransactionGrid/openScroll/scroll";

import { useLocation } from "react-router-dom";
import { DynFormHelperText, PaperComponent } from "../components";
import {
  GridWrapper,
  GradientButton,
  Alert,
  ActionTypes,
  queryClient,
  GridMetaDataType,
  RemarksAPIWrapper,
} from "@acuteinfo/common-base";
const actions: ActionTypes[] = [
  // {
  //   actionName: "view-detail",
  //   actionLabel: "",
  //   multiple: false,
  //   rowDoubleClick: true,
  // },
  {
    actionName: "Delete",
    actionLabel: "Remove",
    multiple: false,
    rowDoubleClick: false,
    // alwaysAvailable: true,
  },
];

export const TRN001_Table = ({
  handleGetHeaderTabs,
  handleSetCards,
  handleSetAccInfo,
  setViewOnly,
}) => {
  const [remarks, setRemarks] = useState<any>(
    "WRONG ENTRY FROM DAILY TRAN MAKER (TRN/001)"
  );
  const [dataRow, setDataRow] = useState<any>({});
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
  const [scrollDialog, setScrollDialog] = useState<boolean>(false);
  const [scrollNo, setScrollNo] = useState<any>();
  const [gridData, setGridData] = useState<any>([]);
  const [originalData, setOriginalData] = useState([]);
  const [errors, setErrors] = useState<any>({
    scrollErr: "",
    remarkErr: "",
  });
  const [isConfirmed, setIsConfirmed] = useState<any>(false);
  const { enqueueSnackbar } = useSnackbar();
  const myGridRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const controllerRef = useRef<AbortController>();

  let objData = {
    USER_NAME: authState?.user?.id,
    COMP_CD: authState?.companyID,
    BRANCH_CD: authState?.user?.branchCode,
  };

  let {
    data: trnGridData,
    isLoading,
    isFetching,
    refetch,
    error,
    isError,
  } = useQuery<any, any>(["getTrnListF1", { objData }], () =>
    API?.getTRN001List(objData)
  );

  useEffect(() => {
    return () => {
      queryClient?.removeQueries("getTrnListF1");
    };
  }, [queryClient]);

  const getCarousalCards = useMutation(CommonApi.getCarousalCards, {
    onSuccess: (data) => {
      if (Boolean(data?.length > 0)) {
        handleSetCards(data);
      }
    },
    onError: (error: any) => {
      if (Boolean(error?.error_msg)) {
        enqueueSnackbar(error?.error_msg, {
          variant: "error",
        });
      }
      handleSetCards([]);
    },
  });

  const deleteScrollByVoucher = useMutation(CommonApi.deleteScrollByVoucherNo, {
    onSuccess: (res) => {
      if (Boolean(res?.message)) {
        enqueueSnackbar(res?.message, {
          variant: "success",
        });
      }
      setDeleteDialog(false);
      refetch();
    },
    onError: (error: any) => {
      if (Boolean(error?.error_msg)) {
        enqueueSnackbar(error?.error_msg, {
          variant: "error",
        });
      }
      setDeleteDialog(false);
    },
  });

  const deleteByScrollNo = useMutation(CommonApi.deleteScrollByScrollNo, {
    onSuccess: (data: any) => {
      if (Boolean(data?.message)) {
        enqueueSnackbar(data?.message, {
          variant: "success",
        });
      }
      setScrollDialog(false);
      setScrollNo("");
      refetch();
    },
    onError: (error: any) => {
      if (Boolean(error?.error_msg)) {
        enqueueSnackbar(error?.error_msg, {
          variant: "error",
        });
      }
      setScrollDialog(false);
      setScrollNo("");
    },
  });

  // fn define-----------------------------
  const setCurrentAction = useCallback((data) => {
    let row = data?.rows[0]?.data;
    setDataRow(row);

    if (data.name === "Delete") {
      setDeleteDialog(true);
    } else if (data.name === "_rowChanged") {
      let obj = {
        COMP_CD: row?.COMP_CD,
        ACCT_TYPE: row?.ACCT_TYPE,
        ACCT_CD: row?.ACCT_CD,
        PARENT_TYPE: row?.PARENT_TYPE ?? "",
        BRANCH_CD: row?.BRANCH_CD,
      };

      handleSetAccInfo(obj);
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      controllerRef.current = new AbortController();
      getCarousalCards.mutate({
        reqData: obj,
        controllerFinal: controllerRef.current,
      });
      handleGetHeaderTabs(obj ?? "");
    }
  }, []);

  useEffect(() => {
    if (trnGridData?.length > 0) {
      setGridData(trnGridData);
      setOriginalData(trnGridData);
    }
  }, [trnGridData, scrollNo]);

  const handleFilterByScroll = (scroll?: any) => {
    if (!Boolean(scroll)) {
      setGridData(originalData);
    } else if (gridData?.length > 0) {
      const result = gridData?.filter((item: any) =>
        item?.SCROLL1?.includes(scroll)
      );

      setGridData(result?.length > 0 ? result : originalData);
    }
  };

  const handleDelete = (input) => {
    if (Boolean(input?.length < 5)) {
      enqueueSnackbar(`Remarks should be greater than 5 characters`, {
        variant: "error",
      });
    } else {
      let obj = {
        TRAN_CD: dataRow?.TRAN_CD ?? "",
        ENTERED_COMP_CD: dataRow?.COMP_CD ?? "",
        ENTERED_BRANCH_CD: dataRow?.BRANCH_CD ?? "",
        COMP_CD: dataRow?.COMP_CD ?? "",
        BRANCH_CD: dataRow?.BRANCH_CD ?? "",
        ACCT_TYPE: dataRow?.ACCT_TYPE ?? "",
        ACCT_CD: dataRow?.ACCT_CD ?? "",
        TRAN_AMOUNT: dataRow?.AMOUNT ?? "",
        ACTIVITY_TYPE: "DAILY TRANSACTION" ?? "",
        TRAN_DT: dataRow?.TRAN_DT ?? "",
        CONFIRMED: dataRow?.CONFIRMED ?? "",
        USER_DEF_REMARKS: input ?? "",
      };
      deleteScrollByVoucher?.mutate(obj);
    }
  };
  const handleScroll = (event) => {
    const { value } = event?.target;
    const stringVal = value?.toString();
    setScrollNo(stringVal);
    handleFilterByScroll(value);
  };

  const handleDeletByScroll = () => {
    let hasError = false;

    if (!Boolean(scrollNo)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        scrollErr: "Scroll Is Required",
      }));
      hasError = true;
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        scrollErr: "",
      }));
    }

    if (Boolean(remarks?.length < 5)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        remarkErr: "Remarks should be greater than 5 characters",
      }));
      hasError = true;
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        remarkErr: "",
      }));
    }

    if (!Boolean(gridData?.length > 0)) {
      enqueueSnackbar("No records found", {
        variant: "error",
      });
      hasError = true;
    }

    if (!hasError) {
      let reqPara = {
        COMP_CD: authState.companyID,
        BRANCH_CD: authState?.user?.branchCode,
        SCROLL_NO: gridData[0]?.SCROLL1,
        USER_DEF_REMARKS: remarks,
        ACCT_TYPE: gridData[0]?.ACCT_TYPE,
        ACCT_CD: gridData[0]?.ACCT_CD,
        TRAN_AMOUNT: gridData[0]?.AMOUNT,
        ENTERED_COMP_CD: gridData[0]?.COMP_CD,
        ENTERED_BRANCH_CD: gridData[0]?.BRANCH_CD,
        ACTIVITY_TYPE: "DAILY TRANSACTION",
        TRAN_DT: gridData[0]?.TRAN_DT,
        CONFIRM_FLAG: gridData[0]?.CONFIRMED,
        CONFIRMED: gridData[0]?.CONFIRMED,
      };
      deleteByScrollNo?.mutate(reqPara);
    }
  };

  useEffect(() => {
    refetch();
  }, [setViewOnly]);

  useEffect(() => {
    if (gridData?.length > 0) {
      const confirRec = gridData?.some((record) => {
        return record?.CONFIRMED === "Y";
      });
      setIsConfirmed(confirRec);
    }
  }, [gridData]);

  return (
    <>
      <Paper sx={{ margin: "8px", padding: "8px" }}>
        {isError ? (
          <Fragment>
            <div style={{ width: "100%", paddingTop: "10px" }}>
              <Alert
                severity={error?.severity ?? "error"}
                errorMsg={error?.error_msg ?? "Error"}
                errorDetail={error?.error_detail ?? ""}
              />
            </div>
          </Fragment>
        ) : null}
        <GridWrapper
          key={`TRN001_TableMetaData${trnGridData}`}
          finalMetaData={TRN001_TableMetaData as GridMetaDataType}
          data={gridData ?? []}
          setData={() => null}
          loading={
            Boolean(isLoading) ||
            Boolean(isFetching) ||
            Boolean(getCarousalCards.isLoading)
          }
          refetchData={() => refetch()}
          ref={myGridRef}
          actions={actions}
          setAction={setCurrentAction}
          disableMultipleRowSelect={true}
          variant={"outlined"}
          defaultSelectedRowId={
            trnGridData?.[0]?.TRAN_CD ? trnGridData?.[0]?.TRAN_CD : ""
          }
        />

        {/* <Grid
          item
          xs={12}
          sm={12}
          sx={{
            right: "30px",
            float: "right",
            position: "relative",
            top: "-2.67rem",
            display: "flex",
            gap: "4rem",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontWeight: "bold" }} variant="subtitle1">
            Total Records : {trnGridData?.length ?? 0}
          </Typography>
          <Typography sx={{ fontWeight: "bold" }} variant="subtitle1">
            Debit : ₹ {debit ?? 0}
          </Typography>
          <Typography sx={{ fontWeight: "bold" }} variant="subtitle1">
            Credit : ₹ {credit ?? 0}
          </Typography>
        </Grid> */}
      </Paper>
      <Box padding={"8px"}>
        <GradientButton onClick={() => window.open("Calculator:///")}>
          Calculator
        </GradientButton>
        <GradientButton onClick={() => setViewOnly(false)}>
          Go Back
        </GradientButton>
        <GradientButton onClick={() => setScrollDialog(true)}>
          Scroll Remove
        </GradientButton>
      </Box>
      {Boolean(deleteDialog) ? (
        <RemarksAPIWrapper
          TitleText={`Do you want to Delete the transaction - VoucherNo. ${dataRow?.TRAN_CD} ?`}
          onActionYes={(input) => handleDelete(input)}
          onActionNo={() => {
            setDeleteDialog(false);
          }}
          isLoading={deleteScrollByVoucher?.isLoading}
          isEntertoSubmit={true}
          AcceptbuttonLabelText="Ok"
          CanceltbuttonLabelText="Cancel"
          open={deleteDialog}
          rows={dataRow}
          isRequired={true}
        />
      ) : null}

      {Boolean(scrollDialog) ? (
        <Dialog
          maxWidth="lg"
          open={scrollDialog}
          aria-describedby="alert-dialog-description"
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle
            style={{
              cursor: "move",
            }}
            id="draggable-dialog-title"
          >
            <Typography
              variant="h5"
              className="dialogTitle"
              style={{
                padding: "10px",
                fontSize: "1.5rem",
                letterSpacing: "1px",
                fontWeight: 500,
                color: "var(--theme-color2)",
              }}
            >
              Scroll Remove
            </Typography>
          </DialogTitle>
          <DialogContent>
            <TextField
              style={{ minWidth: "300px" }}
              fullWidth={true}
              value={scrollNo}
              placeholder="Enter ScrollNo"
              type="number"
              onChange={(event) => handleScroll(event)}
              onBlur={(event) => handleScroll(event)}
              label="Scroll No."
              variant="outlined"
              color="secondary"
            />
            <DynFormHelperText msg={errors?.scrollErr} />
            {/* {Boolean(isConfirmed) && Boolean(scrollNo) && (
              <Typography variant="body2" sx={{color"red"}}>
                Scroll No. {scrollNo} has been confirmed. Are you sure you want
                to delete this record?
              </Typography>
            )} */}
            <TextField
              style={{ minWidth: "400px", marginTop: "20px" }}
              fullWidth={true}
              value={remarks}
              placeholder="Enter Remarks"
              onChange={(event) => setRemarks(event?.target?.value ?? "")}
              label="Remarks"
              variant="outlined"
              color="secondary"
            />
            <DynFormHelperText msg={errors?.remarkErr} />
          </DialogContent>
          <DialogActions className="dialogFooter">
            <GradientButton
              onClick={() => handleDeletByScroll()}
              endIcon={
                Boolean(deleteByScrollNo?.isLoading) && (
                  <CircularProgress size={22} />
                )
              }
            >
              Remove
            </GradientButton>
            <GradientButton
              onClick={() => {
                setScrollDialog(false);
                setScrollNo("");
              }}
            >
              Cancel
            </GradientButton>
          </DialogActions>
        </Dialog>
      ) : null}
    </>
  );
};

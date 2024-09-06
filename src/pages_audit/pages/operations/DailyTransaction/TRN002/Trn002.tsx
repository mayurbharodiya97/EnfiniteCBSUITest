//UI
import {
  Box,
  Button,
  Card,
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

import "./Trn002.css";

//logic
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useContext,
  Fragment,
} from "react";
import { useLocation } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { useSnackbar } from "notistack";
import { format } from "date-fns";

import { TRN002_TableMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import * as trn2Api from "./api";
import * as CommonApi from "../TRNCommon/api";
import { AuthContext } from "pages_audit/auth";
import { AccDetailContext } from "pages_audit/auth";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import DailyTransTabs from "../TRNHeaderTabs";
import CommonFooter from "../TRNCommon/CommonFooter";
import { RemarksAPIWrapper } from "components/custom/Remarks";
import { useCacheWithMutation } from "../TRNHeaderTabs/cacheMutate";
import { queryClient } from "cache";
import { GradientButton } from "components/styledComponent/button";
import { DynFormHelperText, PaperComponent } from "../TRN001/components";
import { Alert } from "components/common/alert";
import { TRN001Context } from "../TRN001/Trn001Reducer";
import { usePopupContext } from "components/custom/popupContext";

const actions: ActionTypes[] = [
  {
    actionName: "Delete",
    actionLabel: "Remove",
    multiple: false,
    rowDoubleClick: true,
  },
  {
    actionName: "view",
    actionLabel: "Confirm",
    actionIcon: "detail",
    multiple: false,
    rowDoubleClick: true,
  },
];

export const Trn002 = () => {
  const { authState } = useContext(AuthContext);
  const { getConfirmValidationCtx } = useContext(TRN001Context);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const myGridRef = useRef<any>(null);
  const cardsDataRef = useRef<any>(null);
  const controllerRef = useRef<AbortController>();
  const [rows, setRows] = useState<any>([]);
  const [rows2, setRows2] = useState<any>([]);
  const [refRows, setRefRows] = useState<any>([]);
  const [filteredRows, setFilteredRows] = useState<any>([]);

  const [tabsData, setTabsData] = useState<any>([]);
  const [dataRow, setDataRow] = useState<any>({});
  const [credit, setCredit] = useState<number>(0);
  const [debit, setDebit] = useState<number>(0);
  const [confirmed, setConfirmed] = useState<number>(0);
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
  const [confirmDialog, setConfirmDialog] = useState<boolean>(false);
  // const [remarks, setRemarks] = useState<any>("");
  const [cardsData, setCardsData] = useState([]);
  const [reqData, setReqData] = useState([]);
  /////////newNEW//////////
  const [gridData, setGridData] = useState<any>([]);
  const [filteredGridDdata, setFilteredGrdData] = useState<any>([]);
  const [filteredbyScroll, setFilteredByScroll] = useState<any>([]);
  const [scrollDelDialog, setScrollDelDialog] = useState<any>(false);
  const [scrollConfDialog, setScrollConfDialog] = useState<any>(false);
  const [scrollNo, setScrollNo] = useState<any>([]);
  const [errors, setErrors] = useState<any>({
    scrollErr: "",
    remarkErr: "",
  });
  const [remarks, setRemarks] = useState<any>(
    "WRONG ENTRY FROM DAILY TRAN MAKER (TRN/001)"
  );
  const { enqueueSnackbar } = useSnackbar();

  const {
    clearCache: clearTabsCache,
    error: tabsErorr,
    data: tabsDetails,
    fetchData: fetchTabsData,
    isError: isTabsError,
    isLoading: isTabsLoading,
  } = useCacheWithMutation(
    "getTabsByParentTypeKeyTrn002",
    CommonApi.getTabsByParentType
  );

  let dataObj = {
    COMP_CD: authState?.companyID,
    BRANCH_CD: authState?.user?.branchCode,
  };

  let {
    data: trn2GridData,
    isLoading,
    isFetching,
    refetch,
    error,
    isError,
  } = useQuery<any, any>(["getTrnListF2", { dataObj }], () =>
    trn2Api?.getTRN002List(dataObj)
  );

  useEffect(() => {
    if (trn2GridData?.length > 0) {
      setGridData(trn2GridData);
      const filtredData = trn2GridData?.filter((record) => {
        if (Boolean(record?.CONFIRMED === "0")) {
          return record;
        }
      });
      if (filtredData?.length > 0) {
        setFilteredByScroll(filtredData);
        setFilteredGrdData(filtredData);
      }
    }
  }, [trn2GridData, scrollNo]);

  const handleFilterByScroll = (inputVal) => {
    if (!Boolean(inputVal)) {
      setFilteredGrdData(filteredbyScroll);
    } else if (filteredGridDdata?.length > 0) {
      const result = filteredGridDdata?.filter((item: any) =>
        item?.SCROLL1?.includes(inputVal)
      );
      setFilteredGrdData(result?.length > 0 ? result : filteredbyScroll);
    }
  };
  const getConfirmDataValidation = useMutation(
    trn2Api.getConfirmDataValidation,
    {
      onSuccess: async (data: any, variables: any) => {
        setScrollNo("");
        CloseMessageBox();
        const getBtnName = async (msgObj) => {
          let btnNm = await MessageBox(msgObj);
          return { btnNm, msgObj };
        };
        const returnFlg = await getConfirmValidationCtx({ data, getBtnName });
        if (Boolean(returnFlg)) {
          if (variables?.FLAG === "VOUCHER") {
            setConfirmDialog(true);
          } else {
            const cardData: any = await getCardColumnValue();
            let data = {
              TRAN_CD: filteredGridDdata[0]?.TRAN_CD ?? "",
              COMP_CD: filteredGridDdata[0]?.COMP_CD ?? "",
              BRANCH_CD: filteredGridDdata[0]?.BRANCH_CD ?? "",
              ENTERED_COMP_CD: filteredGridDdata[0]?.COMP_CD ?? "",
              ENTERED_BRANCH_CD: filteredGridDdata[0]?.BRANCH_CD ?? "",
              scrollNo: scrollNo ?? "",
              ACCT_TYPE: filteredGridDdata[0]?.ACCT_TYPE ?? "",
              ACCT_CD: filteredGridDdata[0]?.ACCT_CD ?? "",
              CONFIRMED: filteredGridDdata[0]?.CONFIRMED ?? "",
              TYPE_CD: filteredGridDdata[0]?.TYPE_CD ?? "",
              AMOUNT: filteredGridDdata[0]?.AMOUNT ?? "",
              TRN_FLAG: filteredGridDdata[0]?.TRN_FLAG ?? "",
              TRAN_DT: filteredGridDdata[0]?.TRAN_DT ?? "",
              TRAN_BAL: cardData?.TRAN_BAL,
            };
            confirmScroll.mutate(data);
          }
        }
      },
      onError: (error: any) => {
        setScrollNo("");
        setConfirmDialog(false);
        CloseMessageBox();
      },
    }
  );

  const getCarousalCards = useMutation(CommonApi.getCarousalCards, {
    onSuccess: (data) => {
      // setCardStore({ ...cardStore, cardsInfo: data });
      setCardsData(data);
    },
    onError: (error: any) => {
      if (
        error?.error_msg !==
        "Timeout : Your request has been timed out or has been cancelled by the user."
      ) {
        enqueueSnackbar(error?.error_msg, {
          variant: "error",
        });
      }
      setCardsData([]);
      // setCardStore({ ...cardStore, cardsInfo: [] });
    },
  });

  const confirmScroll = useMutation(trn2Api.confirmScroll, {
    onSuccess: (res, variables: any) => {
      if (Boolean(res?.message)) {
        enqueueSnackbar(res?.message, {
          variant: "success",
        });
      }
      setConfirmDialog(false);
      refetch();
    },
    onError: (error: any, variables: any) => {
      setConfirmDialog(false);
    },
  });

  useEffect(() => {
    if (cardsData?.length > 0) {
      cardsDataRef.current = cardsData;
    }
  }, [cardsData]);

  const getCardColumnValue = () => {
    const keys = [
      "WITHDRAW_BAL",
      "TRAN_BAL",
      "LIEN_AMT",
      "CONF_BAL",
      "UNCL_BAL",
      "DRAWING_POWER",
      "LIMIT_AMOUNT",
      "HOLD_BAL",
      "AGAINST_CLEARING",
      "MIN_BALANCE",
      "OD_APPLICABLE",
      "CUSTOMER_ID",
      "INST_DUE_DT",
      "OP_DATE",
      "STATUS",
    ];

    const cardValues = keys?.reduce((acc, key) => {
      const item: any = cardsDataRef?.current?.find(
        (entry: any) => entry?.COL_NAME === key
      );
      acc[key] = item?.COL_VALUE;
      return acc;
    }, {});
    return cardValues;
  };

  const deleteScrollByVoucher = useMutation(CommonApi.deleteScrollByVoucherNo, {
    onSuccess: (res) => {
      if (Boolean(res?.message)) {
        enqueueSnackbar(res?.message, {
          variant: "success",
        });
      }
      setDeleteDialog(false);
      // handleGetTRN002List();
      refetch();
    },
    onError: (error: any) => {
      setDeleteDialog(false);
    },
  });
  // const getTabsByParentType = useMutation(CommonApi.getTabsByParentType, {
  //   onSuccess: (data) => {
  //     setTabsData(data);
  //   },
  //   onError: (error: any) => {
  //     enqueueSnackbar(error?.error_msg, {
  //       variant: "error",
  //     });
  //   },
  // });
  // function define  ======================================================================

  const setCurrentAction = useCallback(async (data) => {
    let row = data.rows[0]?.data;
    setDataRow(row);
    // getConfirmDataValidation.mutate(row);
    if (data.name === "_rowChanged") {
      let obj: any = {
        COMP_CD: row?.COMP_CD,
        ACCT_TYPE: row?.ACCT_TYPE,
        ACCT_CD: row?.ACCT_CD,
        PARENT_TYPE: row?.PARENT_TYPE ?? "",
        PARENT_CODE: row?.PARENT_CODE ?? "",
        BRANCH_CD: row?.BRANCH_CD,
        // authState: authState,
      };
      setReqData(obj);
      let reqData = {
        COMP_CD: obj?.COMP_CD,
        ACCT_TYPE: obj?.ACCT_TYPE,
        BRANCH_CD: obj?.BRANCH_CD,
      };
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      // Create a new AbortController
      controllerRef.current = new AbortController();
      fetchTabsData({
        cacheId: reqData?.ACCT_TYPE,
        reqData: reqData,
        controllerFinal: controllerRef.current,
      });
      getCarousalCards.mutate({
        reqData: obj,
        controllerFinal: controllerRef.current,
      });
    }

    if (data?.name === "view") {
      const cardData: any = await getCardColumnValue();
      if (row?.CONFIRMED == "0") {
        const cardDataReq = {
          CUSTOMER_ID: cardData?.CUSTOMER_ID,
          AVALIABLE_BAL: cardData?.WITHDRAW_BAL,
          SHADOW_CL: cardData?.TRAN_BAL,
          HOLD_BAL: cardData?.HOLD_BAL,
          LEAN_AMT: cardData?.LIEN_AMT,
          AGAINST_CLEARING: cardData?.AGAINST_CLEARING,
          MIN_BALANCE: cardData?.MIN_BALANCE,
          CONF_BAL: cardData?.CONF_BAL,
          TRAN_BAL: cardData?.TRAN_BAL,
          UNCL_BAL: cardData?.UNCL_BAL,
          LIMIT_AMOUNT: cardData?.LIMIT_AMOUNT,
          DRAWING_POWER: cardData?.DRAWING_POWER,
          OD_APPLICABLE: cardData?.OD_APPLICABLE,
          INST_DUE_DT: cardData?.INST_DUE_DT,
          OP_DATE: cardData?.OP_DATE,
          STATUS: cardData?.STATUS,
          FLAG: "VOUCHER",
        };
        getConfirmDataValidation?.mutate({ ...row, ...cardDataReq });
      } else {
        enqueueSnackbar("Transaction Already Confirmed", {
          variant: "error",
        });
      }
    }

    if (data?.name === "Delete") {
      setDeleteDialog(true);
    }
  }, []);

  const handleViewAll = () => {
    if (gridData?.length > 0) {
      setFilteredGrdData(gridData);
      handleUpdateSum(gridData);
    }
  };

  const handleUpdateSum = (arr) => {
    let crSum = 0;
    let drSum = 0;
    arr?.map((a) => {
      if (
        a.TYPE_CD.includes("1") ||
        a.TYPE_CD.includes("2") ||
        a.TYPE_CD.includes("3")
      ) {
        crSum = crSum + Number(a?.AMOUNT);
      }
      if (
        a.TYPE_CD.includes("4") ||
        a.TYPE_CD.includes("5") ||
        a.TYPE_CD.includes("6")
      ) {
        drSum = drSum + Number(a?.AMOUNT);
      }
    });
    setCredit(crSum);
    setDebit(drSum);
  };

  const handleDeleteByVoucher = (input) => {
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
        ACTIVITY_TYPE: "DAILY TRANSACTION CONFIRMATION" ?? "",
        TRAN_DT: dataRow?.TRAN_DT ?? "",
        CONFIRMED: dataRow?.CONFIRMED ?? "",
        USER_DEF_REMARKS: input ?? "",
      };

      deleteScrollByVoucher.mutate(obj);
    }
  };

  const handleConfirm = async () => {
    const cardData: any = await getCardColumnValue();
    confirmScroll.mutate({
      ...dataRow,
      TRAN_BAL: cardData?.TRAN_BAL ?? "0",
      FLAG: "VOUCHER",
    });
  };

  const handleConfirmByScroll = async () => {
    setScrollConfDialog(false);
    const msgBoxRes = await MessageBox({
      messageTitle: "Alert",
      message: `Are you sure you want to confirm ${
        filteredGridDdata?.length ?? ""
      } records?`,
      defFocusBtnName: "Yes",
      icon: "INFO",
      buttonNames: ["Yes", "No"],
      loadingBtnName: ["Yes"],
    });

    if (msgBoxRes === "Yes") {
      const cardData: any = await getCardColumnValue();

      const validateReq = {
        BRANCH_CD: filteredGridDdata[0]?.BRANCH_CD ?? "",
        ACCT_TYPE: filteredGridDdata[0]?.ACCT_TYPE ?? "",
        ACCT_CD: filteredGridDdata[0]?.ACCT_CD ?? "",
        TYPE_CD: filteredGridDdata[0]?.TYPE_CD ?? "",
        TRAN_CD: filteredGridDdata[0]?.TRAN_CD ?? "",
        CUSTOMER_ID: cardData?.CUSTOMER_ID,
        AVALIABLE_BAL: cardData?.WITHDRAW_BAL,
        SHADOW_CL: cardData?.TRAN_BAL,
        HOLD_BAL: cardData?.HOLD_BAL,
        LEAN_AMT: cardData?.LIEN_AMT,
        AGAINST_CLEARING: cardData?.AGAINST_CLEARING,
        MIN_BALANCE: cardData?.MIN_BALANCE,
        CONF_BAL: cardData?.CONF_BAL,
        TRAN_BAL: cardData?.TRAN_BAL,
        UNCL_BAL: cardData?.UNCL_BAL,
        LIMIT_AMOUNT: cardData?.LIMIT_AMOUNT,
        DRAWING_POWER: cardData?.DRAWING_POWER,
        OD_APPLICABLE: cardData?.OD_APPLICABLE,
        AMOUNT: filteredGridDdata[0]?.AMOUNT,
        OP_DATE: format(new Date(cardData?.OP_DATE), "dd/MMM/yyyy"),
        ENTERED_COMP_CD: filteredGridDdata[0]?.ENTERED_COMP_CD,
        ENTERED_BRANCH_CD: filteredGridDdata[0]?.ENTERED_BRANCH_CD,
        ENTERED_BY: filteredGridDdata[0]?.ENTERED_BY,
        INST_DUE_DT: cardData?.INST_DUE_DT,
        STATUS: cardData?.STATUS,
        FLAG: "SCROLL",
      };
      getConfirmDataValidation?.mutate(validateReq);
    } else if (msgBoxRes === "No") {
      CloseMessageBox();
    }
  };

  useEffect(() => {
    if (Boolean(isTabsError)) {
      enqueueSnackbar((tabsErorr as any)?.error_msg, {
        variant: "error",
      });
    }
  }, [isTabsError]);

  useEffect(() => {
    const queries = [
      "getSIDetailList",
      "getLienDetailList",
      "getOWChqList",
      "getTempList",
      "getATMList",
      "getASBAList",
      "getACH_IWList",
      "getACH_OWList",
      "getInstructionList",
      "getGroupList",
      "getAPYList",
      "getAPBSList",
      "getPMBYList",
      "getJointDetailsList",
      "getTodayTransList",
      "getCheckDetailsList",
      "getSnapShotList",
      "getHoldChargeList",
      "getDocTemplateList",
      "getStopPayList",
      "getInsuranceList",
      "getDisbursementList",
      "getSubsidyList",
      "getSearchList",
      "getLimitList",
      "getStockList",
      "getTrnListF2",
    ];
    return () => {
      clearTabsCache();
      queries?.forEach((query) => queryClient?.removeQueries(query));
    };
  }, [queryClient]);

  const handleScroll = (event) => {
    const { value } = event?.target;
    const stringVal = value?.toString();
    setScrollNo(stringVal);
    handleFilterByScroll(value);
  };

  const deleteByScrollNo = useMutation(CommonApi.deleteScrollByScrollNo, {
    onSuccess: (data: any) => {
      if (Boolean(data?.message)) {
        enqueueSnackbar(data?.message, {
          variant: "success",
        });
      }
      setScrollNo("");
      refetch();
      CloseMessageBox();
    },
    onError: (error: any) => {
      setScrollNo("");
      CloseMessageBox();
    },
  });

  const handleDeletByScroll = async () => {
    setScrollDelDialog(false);
    const msgBoxRes = await MessageBox({
      messageTitle: "Alert",
      message: `Are you sure you want to delete ${
        filteredGridDdata?.length ?? ""
      } records?`,
      defFocusBtnName: "Yes",
      icon: "INFO",
      buttonNames: ["Yes", "No"],
      loadingBtnName: ["Yes"],
    });

    if (msgBoxRes === "Yes") {
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
          SCROLL_NO: filteredGridDdata[0]?.SCROLL1,
          USER_DEF_REMARKS: remarks,
          ACCT_TYPE: filteredGridDdata[0]?.ACCT_TYPE,
          ACCT_CD: filteredGridDdata[0]?.ACCT_CD,
          TRAN_AMOUNT: filteredGridDdata[0]?.AMOUNT,
          ENTERED_COMP_CD: filteredGridDdata[0]?.COMP_CD,
          ENTERED_BRANCH_CD: filteredGridDdata[0]?.BRANCH_CD,
          ACTIVITY_TYPE: "DAILY TRANSACTION CONFIRMATION",
          TRAN_DT: filteredGridDdata[0]?.TRAN_DT,
          CONFIRM_FLAG: filteredGridDdata[0]?.CONFIRMED,
          CONFIRMED: filteredGridDdata[0]?.CONFIRMED,
        };
        deleteByScrollNo?.mutate(reqPara);
      }
    } else if (msgBoxRes === "No") {
      CloseMessageBox();
    }
  };

  const onCancle = () => {
    if (Boolean(scrollDelDialog)) {
      setScrollDelDialog(false);
      setScrollNo("");
    } else {
      setScrollConfDialog(false);
      setScrollNo("");
    }
  };

  return (
    <>
      <DailyTransTabs
        heading=" Daily Transaction Confirmation (F2) (TRN/002)"
        tabsData={tabsDetails}
        cardsData={cardsData}
        reqData={reqData}
      />
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
        ) : getConfirmDataValidation?.isError ? (
          <Fragment>
            <div style={{ width: "100%", paddingTop: "10px" }}>
              <Alert
                severity={getConfirmDataValidation?.error?.severity ?? "error"}
                errorMsg={getConfirmDataValidation?.error?.error_msg ?? "Error"}
                errorDetail={
                  getConfirmDataValidation?.error?.error_detail ?? ""
                }
              />
            </div>
          </Fragment>
        ) : confirmScroll?.isError ? (
          <Fragment>
            <div style={{ width: "100%", paddingTop: "10px" }}>
              <Alert
                severity={confirmScroll?.error?.severity ?? "error"}
                errorMsg={confirmScroll?.error?.error_msg ?? "Error"}
                errorDetail={confirmScroll?.error?.error_detail ?? ""}
              />
            </div>
          </Fragment>
        ) : deleteScrollByVoucher?.isError ? (
          <Fragment>
            <div style={{ width: "100%", paddingTop: "10px" }}>
              <Alert
                severity={deleteScrollByVoucher?.error?.severity ?? "error"}
                errorMsg={deleteScrollByVoucher?.error?.error_msg ?? "Error"}
                errorDetail={deleteScrollByVoucher?.error?.error_detail ?? ""}
              />
            </div>
          </Fragment>
        ) : deleteByScrollNo?.isError ? (
          <Fragment>
            <div style={{ width: "100%", paddingTop: "10px" }}>
              <Alert
                severity={deleteByScrollNo?.error?.severity ?? "error"}
                errorMsg={deleteByScrollNo?.error?.error_msg ?? "Error"}
                errorDetail={deleteByScrollNo?.error?.error_detail ?? ""}
              />
            </div>
          </Fragment>
        ) : null}
        <GridWrapper
          key={`TRN002_TableMetaData${isLoading}${filteredGridDdata}`}
          finalMetaData={TRN002_TableMetaData as GridMetaDataType}
          data={filteredGridDdata ?? []}
          setData={() => null}
          loading={
            Boolean(isFetching) ||
            Boolean(isLoading) ||
            Boolean(getCarousalCards?.isLoading) ||
            Boolean(isTabsLoading) ||
            Boolean(getConfirmDataValidation?.isLoading) ||
            Boolean(confirmScroll.isLoading)
          }
          ref={myGridRef}
          refetchData={() => refetch()}
          actions={actions}
          setAction={setCurrentAction}
          onlySingleSelectionAllow={true}
          isNewRowStyle={true}
          defaultSelectedRowId={
            filteredbyScroll?.length > 0 ? filteredbyScroll?.[0]?.TRAN_CD : ""
          }
        />
        {/* <Grid
          item
          xs={12}
          sm={12}
          sx={{
            height: "23px",
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
            Confirmed Records : {confirmed}
          </Typography>
          <Typography
            sx={{ fontWeight: "bold" }}
            variant="subtitle1"
            // style={{ color: "green" }}
          >
            Credit : ₹ {credit}
          </Typography>
          <Typography
            sx={{ fontWeight: "bold" }}
            variant="subtitle1"
            // style={{ color: "tomato" }}
          >
            Debit : ₹ {debit}
          </Typography>
        </Grid> */}
      </Paper>
      <Box padding={"8px"}>
        <GradientButton onClick={() => window.open("Calculator:///")}>
          Calculator
        </GradientButton>
        <GradientButton onClick={() => handleViewAll()}>
          View All
        </GradientButton>
        <GradientButton onClick={() => setScrollDelDialog(true)}>
          Scroll Remove
        </GradientButton>
        <GradientButton onClick={() => setScrollConfDialog(true)}>
          Scroll Confirm
        </GradientButton>
      </Box>
      {/* <CommonFooter
        viewOnly={true}
        filteredRows={filteredRows}
        handleFilterByScroll={handleFilterByScroll}
        handleViewAll={handleViewAll}
        handleRefresh={() => handleGetTRN002List()}
      /> */}

      {Boolean(scrollDelDialog) || Boolean(scrollConfDialog) ? (
        <Dialog
          maxWidth="lg"
          open={scrollDelDialog || scrollConfDialog}
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
              {Boolean(scrollDelDialog) ? "Scroll Remove" : "Scroll Confirm"}
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
            {/* {Boolean(isConfirmed) && (
              <Typography variant="h6">
                Scroll No. {scrollNo} has been confirmed. Are you sure you want
                to delete this record?
              </Typography>
            )} */}
            {Boolean(scrollDelDialog) ? (
              <>
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
              </>
            ) : null}
          </DialogContent>
          <DialogActions className="dialogFooter">
            <GradientButton
              onClick={() =>
                Boolean(scrollDelDialog)
                  ? handleDeletByScroll()
                  : handleConfirmByScroll()
              }
            >
              {Boolean(scrollDelDialog) ? "Remove" : "Confirm"}
            </GradientButton>
            <GradientButton onClick={() => onCancle()}>Cancel</GradientButton>
          </DialogActions>
        </Dialog>
      ) : null}

      <>
        {Boolean(deleteDialog) ? (
          <RemarksAPIWrapper
            TitleText={
              "Do you want to Delete the transaction - VoucherNo." +
              dataRow?.TRAN_CD +
              " ?"
            }
            onActionYes={(input) => handleDeleteByVoucher(input)}
            onActionNo={() => setDeleteDialog(false)}
            isLoading={deleteScrollByVoucher.isLoading}
            isEntertoSubmit={true}
            AcceptbuttonLabelText="Ok"
            CanceltbuttonLabelText="Cancel"
            open={deleteDialog}
            rows={dataRow}
          />
        ) : null}

        {Boolean(confirmDialog) ? (
          <PopupMessageAPIWrapper
            MessageTitle="Transaction Confirmation"
            Message={
              "Do you wish to Confirm this Transaction - Voucher No. " +
              dataRow?.TRAN_CD +
              " ?"
            }
            onActionYes={() => handleConfirm()}
            onActionNo={() => setConfirmDialog(false)}
            rows={[]}
            open={confirmDialog}
            loading={confirmScroll.isLoading}
          />
        ) : null}
      </>
    </>
  );
};

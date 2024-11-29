import { Button, Card, Dialog } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import LinearProgress from "@mui/material/LinearProgress";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { format, parse } from "date-fns";
import { useEffect, useState, useContext, useRef } from "react";
import { useMutation, useQueries, useQuery } from "react-query";
import * as API from "./api";
import * as CommonApi from "../TRNCommon/api";
import { AuthContext } from "pages_audit/auth";
import "./Trn001.css";
import TRN001_Table from "./Table";
import DailyTransTabs from "../TRNHeaderTabs";
import { GeneralAPI } from "registry/fns/functions";
import { useCacheWithMutation } from "../TRNHeaderTabs/cacheMutate";
import { TRN001Context } from "./Trn001Reducer";
import RowsTable from "./rowsTable";

import {
  queryClient,
  usePopupContext,
  Alert,
  GradientButton,
  utilFunction,
} from "@acuteinfo/common-base";
import { useLocation } from "react-router-dom";
import { DateRetrival } from "./DateRetrival/DataRetrival";
import { SingleAccountInterestReport } from "./DateRetrival/singleAccountInterestReport";
import { ViewStatement } from "pages_audit/acct_Inquiry/viewStatement";
export const Trn001 = () => {
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { authState } = useContext(AuthContext);
  const {
    state,
    dispatch,
    handleSetDefaultBranch,
    handleAccTypeBlurCtx,
    handleAcctNoBlurCtx,
    getAcctNoValidationCtx,
    handleTrxCtx,
    getChqValidationCtx,
    handleDebitBlurCtx,
    handleDebitCtx,
    handleCreditCtx,
    handleCreditBlurCtx,
    getDateValidationCtx,
    getAmountValidationCtx,
    checkErrorsFn,
    deleteRowCtx,
    commonStateUpdate,
    handleScrollBlurCtx,
    getTokenValidation,
    setFieldsError,
  } = useContext(TRN001Context);

  const [trxOptions, setTrxOptions] = useState<any>([]);
  const [trxOptions2, setTrxOptions2] = useState<any>([]);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [loadingStates, setLoadingStates] = useState<any>([]);
  const [viewOnly, setViewOnly] = useState(false);
  const [cardsData, setCardsData] = useState<any>([]);
  const [reqData, setReqData] = useState<any>([]);
  const [status, setStatus] = useState<any>(false);
  const lastRowUnqID = useRef(null);
  const isBatchEntry = useRef(false);
  const acctNoRef = useRef<any>(null);
  const interestCalculateParaRef = useRef<any>(null);
  const [interestCalReportDTL, setInterestCalReportDTL] = useState([]);
  const carousalCrdLastReq = useRef<any>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [dateDialog, setDateDialog] = useState(false);
  const [singleAccountInterest, setSingleAccountInterest] = useState(false);
  const [isOpenPassbookStatement, setOpenPassbookStatement] = useState(false);
  const [passbookStatementPara, setPassbookStatementPara] = useState<any>({});
  const {
    clearCache: clearTabsCache,
    error: tabsErorr,
    data: tabsDetails,
    setData: setTabsDetails,
    fetchData: fetchTabsData,
    isError: isTabsError,
    isLoading: isTabsLoading,
  } = useCacheWithMutation(
    "getTabsByParentTypeKeyTrn001",
    CommonApi.getTabsByParentType
  );

  useEffect(() => {
    setCardsData([]);
    setTabsDetails([]);
  }, []);

  const { id: userId, branchCode } = authState?.user ?? {};
  const { companyID } = authState ?? {};

  const queriesResult = useQueries([
    {
      queryKey: ["getBranchList"],
      queryFn: () =>
        API.getBranchList({
          COMP_CD: companyID ?? "",
        }),
    },
    {
      queryKey: ["getAccTypeList"],
      queryFn: () =>
        API.getAccTypeList({
          COMP_CD: authState?.companyID ?? "",
          BRANCH_CD: authState?.user?.branchCode ?? "",
          USER_NAME: authState?.user?.id ?? "",
          DOC_CD: "TRN/001",
        }),
    },
    {
      queryKey: ["getSDCList"],
      queryFn: () =>
        API.getSDCList({
          USER_ID: userId ?? "",
          BRANCH_CD: branchCode ?? "",
          COMP_CD: companyID ?? "",
        }),
    },
    {
      queryKey: ["getTRXList"],
      queryFn: () =>
        API.getTRXList({
          USER_ID: userId ?? "",
        }),
    },
  ]);

  useEffect(() => {
    if (queriesResult?.[0]?.data?.length > 0) {
      handleSetDefaultBranch(queriesResult?.[0]?.data, authState, 0);
    }
  }, [queriesResult?.[0]?.data]);

  useEffect(() => {
    if (queriesResult?.[3]?.data?.length > 0) {
      setTrxOptions(queriesResult?.[3]?.data);
      let result = queriesResult?.[3]?.data?.filter(
        (options) => options?.code == "3" || options?.code == "6"
      );
      setTrxOptions2(result);
    }
  }, [queriesResult?.[3]?.data]);

  const { data: parametres } = useQuery<any, any>(
    [
      "getParameters",
      {
        ENT_BRANCH_CD: authState?.user?.branchCode,
        ENT_COMP_CD: authState?.companyID,
      },
    ],
    () =>
      API.getParameters({
        ENT_BRANCH_CD: authState?.user?.branchCode ?? "",
        ENT_COMP_CD: authState?.companyID ?? "",
      })
  );

  const getCarousalCards = useMutation(CommonApi.getCarousalCards, {
    onSuccess: (data: any, variables: any) => {
      setCardsData(data);
      setReqData(variables?.reqData);
      setTimeout(() => {
        if (acctNoRef?.current) {
          acctNoRef?.current?.focusTrxInput();
        }
      }, 50);
    },
    onError: (error: any, variables: any) => {
      if (
        error?.error_msg !==
        "Timeout : Your request has been timed out or has been cancelled by the user."
      ) {
        enqueueSnackbar(error?.error_msg, {
          variant: "error",
        });
      }
      setCardsData([]);
    },
  });

  const getAccNoValidation = useMutation(GeneralAPI.getAccNoValidation, {
    onSuccess: async (data: any, variables: any) => {
      if (Object?.keys(data)?.length > 0) {
        const rowUnqID = variables.unqID;
        setStatus(data?.STATUS);
        const getBtnName = async (msgObj) => {
          let btnNm = await MessageBox(msgObj);
          return { btnNm, msgObj };
        };
        const returnValue = await getAcctNoValidationCtx({
          updUnqId: rowUnqID,
          data,
          variables,
          getBtnName,
          chequeDate: authState?.workingDate,
          setLoadingState,
        });
        if (returnValue) {
          carousalCrdLastReq.current = variables;
          getCarousalCards.mutate({ reqData: variables });
        }
      }
    },
    onError: (error: any, variables: any) => {
      // enqueueSnackbar(error?.error_msg, { variant: "error" });
      const rowUnqID = variables.unqID;
      setLoadingState(rowUnqID, "ACCTNO", false);
      setFieldsError({
        updUnqId: rowUnqID,
        payload: { bugMsgAccNo: error?.error_msg },
      });
    },
  });

  const getInterestCalculatePara = useMutation(API.getInterestCalculatePara, {
    onSuccess: async (data: any, variables: any) => {
      const rowUnqID = variables?.unqID;
      let currentRowData = state?.rows?.find(
        (item) => item?.unqID === rowUnqID
      );
      setLoadingState(rowUnqID, "ACCTNO", false);
      if (data?.[0]?.OPEN_DATE_PARA === "Y") {
        setDateDialog(true);
        const combinedData = { ...currentRowData, ...data?.[0] };
        interestCalculateParaRef.current = [
          ...(interestCalculateParaRef.current || []),
          combinedData,
        ];
      }
    },
    onError: (error: any, variables: any) => {
      const rowUnqID = variables?.unqID;
      setLoadingState(rowUnqID, "ACCTNO", false);
      enqueueSnackbar(error?.error_msg, {
        variant: "error",
      });
    },
  });

  const getChqValidation = useMutation(GeneralAPI.getChequeNoValidation, {
    onSuccess: async (data: any, variables: any) => {
      const rowUnqID = variables?.unqID;
      const getBtnName = async (msgObj) => {
        let btnNm = await MessageBox(msgObj);
        return { btnNm, msgObj };
      };
      const returnValue = await getChqValidationCtx({
        updUnqId: rowUnqID,
        data,
        getBtnName,
        chequeDate: authState?.workingDate,
        setLoadingState,
      });

      if (Boolean(returnValue)) {
        setTimeout(() => {
          if (acctNoRef?.current) {
            acctNoRef?.current?.focusCqDateInput();
          }
        }, 50);
      }
    },
    onError: (error: any, variables: any) => {
      // enqueueSnackbar(error?.error_msg, {
      //   variant: "error",
      // });
      const rowUnqID = variables?.unqID;
      setLoadingState(rowUnqID, "CHQNOVALID", false);
      setFieldsError({
        updUnqId: rowUnqID,
        payload: { bugMsgCNo: error?.error_msg },
      });
    },
  });

  const getAmountValidation = useMutation(API.getAmountValidation, {
    onSuccess: (data: any, variables: any) => {
      const rowUnqID = variables?.unqID;
      const crDbFlag = variables?.FLAG;
      const getBtnName = async (msgObj) => {
        let btnNm = await MessageBox(msgObj);
        return { btnNm, msgObj };
      };
      getAmountValidationCtx({
        updUnqId: rowUnqID,
        data,
        getBtnName,
        setLoadingState,
        totalDebit,
        totalCredit,
        handleAddRow,
        crDbFlag,
      });
    },
    onError: (error: any, variables: any) => {
      // enqueueSnackbar(error?.error_msg, {
      //   variant: "error",
      // });
      const rowUnqID = variables?.unqID;
      const crDbFlag = variables?.FLAG;
      setLoadingState(
        rowUnqID,
        crDbFlag === "D" ? "AMNTVALIDDR" : "AMNTVALIDCR",
        false
      );
      setFieldsError({
        updUnqId: rowUnqID,
        payload: {
          bugMsgDebit: crDbFlag === "D" ? error?.error_msg : "",
          bugMsgCredit: crDbFlag === "D" ? "" : error?.error_msg,
        },
      });
    },
  });

  const getDateValidation = useMutation(API.getChqDateValidation, {
    onSuccess: async (data: any, variables: any) => {
      const rowUnqID = variables?.unqID;
      const getBtnName = async (msgObj) => {
        let btnNm = await MessageBox(msgObj);
        return { btnNm, msgObj };
      };
      const returnFlag = await getDateValidationCtx({
        updUnqId: rowUnqID,
        data,
        getBtnName,
        chequeDate: authState?.workingDate,
        setLoadingState,
      });
      if (Boolean(returnFlag)) {
        setTimeout(() => {
          if (acctNoRef?.current) {
            acctNoRef?.current?.focusDebitInput();
          }
        }, 50);
      }
    },
    onError: (error: any, variables: any) => {
      const rowUnqID = variables?.unqID;
      setLoadingState(rowUnqID, "CHQDATE", false);
      // enqueueSnackbar(error?.error_msg, {
      //   variant: "error",
      // });
      setFieldsError({
        updUnqId: rowUnqID,
        payload: { bugMsgDate: error?.error_msg },
      });
    },
  });

  const saveScroll = useMutation(API.saveScroll, {
    onSuccess: async (res) => {
      CloseMessageBox();

      let finalMessage;
      const scrollNo = res?.data[0]?.SCROLL1 ?? "";
      if (state?.rows?.length > 1) {
        const getVNo = res?.data?.map((ele) => ele?.TRAN_CD).join("\n");

        finalMessage = `Voucher No. :\n${getVNo}\nScroll Successfully Posted`;
        enqueueSnackbar("Scroll Saved Successfully", {
          variant: "success",
        });
      } else {
        finalMessage = "Transaction Successfully Posted";
        enqueueSnackbar("Transaction Saved Successfully", {
          variant: "success",
        });
      }
      const msgBoxRes = await MessageBox({
        messageTitle:
          state?.rows?.length > 1
            ? `Scroll: ${scrollNo}`
            : `Transaction: ${res?.data[0]?.TRAN_CD ?? ""}`,
        message: finalMessage ?? "",
        defFocusBtnName: "Ok",
        icon: "INFO",
      });
      if (msgBoxRes === "Ok") {
        handleReset("RESET");
      }
    },
    onError: (error: any) => {
      CloseMessageBox();
    },
  });

  const handleAccTypeBlur = (unqID) => {
    handleAccTypeBlurCtx({
      updUnqId: unqID,
      chequeDate: authState?.workingDate,
    });
    const row = state?.rows[unqID] ?? {};
    const reqData = {
      COMP_CD: row?.branch?.info?.COMP_CD ?? "",
      ACCT_TYPE: row?.accType?.value ?? "",
      BRANCH_CD: row?.branch?.value ?? "",
    };

    if (row?.accType?.info?.PARENT_TYPE) {
      handleGetHeaderTabs(reqData);
    }
  };

  const handleAccNoBlur = (unqID) => {
    if (state?.rows?.length > 0) {
      const newRow = (state?.rows ?? [])
        ?.map((row) => {
          if (row?.unqID === unqID) {
            if (row?.accNo) {
              const paddedAcctNo = utilFunction?.getPadAccountNumber(
                row.accNo,
                row?.accType?.info
              );
              return {
                ...row,
                accNo: paddedAcctNo,
                bugMsgAccNo: "",
                bugAccNo: false,
                acctNoFlag: { [unqID]: false },
              };
            } else {
              return {
                ...row,
                bugMsgAccNo: "A/C No. Required",
                bugAccNo: true,
                acctNoFlag: { [unqID]: false },
              };
            }
          }
          return row;
        })
        ?.find((row) => row.unqID === unqID); // get the updated row

      handleAcctNoBlurCtx({ updUnqId: unqID, newRow });
      handleGetAccInfo(newRow, unqID);
    }
  };

  const handleTrx = (event, value, unqID) => {
    let defSdc = (queriesResult?.[2]?.data ?? []).find(
      (option) => option?.value?.trim() === value?.code?.trim()
    );
    if (value?.value === "3" || value?.value === "6") {
      isBatchEntry.current = true;
    } else {
      isBatchEntry.current = false;
    }
    const getBtnName = async (msgObj) => {
      let btnNm = await MessageBox(msgObj);
      return { btnNm, msgObj };
    };
    handleTrxCtx({ updUnqId: unqID, value, defSdc, parametres, getBtnName });
  };

  const handleDebit = async (event, unqID) => {
    const { value } = event?.target;
    if (state?.rows?.length > 0) {
      const newRows = (state?.rows ?? [])?.map((row) => {
        if (row?.unqID === unqID) {
          return { ...row, debit: value };
        }
        return row;
      });
      const newRow = newRows?.find((row) => row.unqID === unqID);
      handleDebitCtx({ updUnqId: unqID, newRow });
      handleTotal(newRows ?? []);
    }
  };

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
      "INST_NO",
      "INST_RS",
      "OP_DATE",
      "PENDING_AMOUNT",
    ];

    const cardValues = keys?.reduce((acc, key) => {
      const item: any = cardsData?.find(
        (entry: any) => entry?.COL_NAME === key
      );
      acc[key] = item?.COL_VALUE;
      return acc;
    }, {});
    return cardValues;
  };

  const handleDebitBlur = async (event, unqID) => {
    const cardData: any = await getCardColumnValue();
    if (Boolean(cardData)) {
      if (Number(totalDebit) > Number(cardData?.WITHDRAW_BAL ?? "0")) {
        enqueueSnackbar("Debit more than Withdrawable", {
          variant: "error",
        });
        const newRow = (state?.rows ?? [])
          ?.map((row) => {
            if (row?.unqID === unqID) {
              return { ...row, debit: "" };
            }
            return row;
          })
          ?.find((row) => row.unqID === unqID);
        dispatch({
          type: "UPDATE_ROW_DIRECT",
          payload: { updUnqId: unqID, newRow },
        });
      } else {
        lastRowUnqID.current = unqID;
        handleDebitBlurCtx({
          updUnqId: unqID,
          value: event?.target?.value,
          setLoadingState,
          mutationFn: getAmountValidation,
          authState,
          cardData,
          status,
        });
      }
    }
  };

  const handleCredit = (event, unqID) => {
    const { value } = event?.target;
    if (state?.rows?.length > 0) {
      const newRows = (state?.rows ?? [])?.map((row) => {
        if (row?.unqID === unqID) {
          return { ...row, credit: value };
        }
        return row;
      });
      const newRow = newRows?.find((row) => row.unqID === unqID);
      handleCreditCtx({ updUnqId: unqID, newRow });
      handleTotal(newRows ?? []);
    }
  };

  const handleCreditBlur = async (event, unqID) => {
    lastRowUnqID.current = unqID;
    const cardData: any = await getCardColumnValue();
    handleCreditBlurCtx({
      updUnqId: unqID,
      value: event?.target?.value,
      setLoadingState,
      cardData,
      authState,
      mutationFn: getAmountValidation,
      status,
    });
  };

  const handleAddRow = async (unqID) => {
    const newDataFn = () => {
      const trx3 = queriesResult?.[3]?.data.find(
        (option) => option.code == "3"
      );
      const trx6 = queriesResult?.[3]?.data.find(
        (option) => option.code == "6"
      );
      const isCredit = totalDebit > totalCredit;
      const newRowTrx = isCredit ? trx3 : trx6;
      let defSdc = (queriesResult?.[2]?.data ?? []).find(
        (option) => option?.value?.trim() === newRowTrx?.code?.trim()
      );
      const debitDefer = !isCredit ? totalCredit - totalDebit : 0;
      const cerditDefer = isCredit ? totalDebit - totalCredit : 0;

      const maxUnqID = (state?.rows ?? [])?.reduce(
        (maxID, row) => Math.max(maxID, row?.unqID),
        0
      );

      const defBranch = (queriesResult?.[0]?.data ?? [])?.find(
        (branch) => branch?.value === authState?.user?.branchCode
      );

      return {
        unqID: maxUnqID + 1,
        branch: defBranch,
        bugMsgBranchCode: "",
        accType: { label: "", value: "", info: {} },
        bugMsgAccType: "",
        accNo: "",
        bugAccNo: false,
        bugMsgAccNo: "",
        trx: newRowTrx,
        bugMsgTrx: "",
        scroll: "", //token
        bugMsgScroll: "",
        sdc: defSdc,
        bugMsgSdc: "",
        remark: defSdc?.label,
        bugMsgRemarks: "",
        cNo: "",
        bugCNo: false,
        bugMsgCNo: "",
        date: parse(authState?.workingDate, "dd/MMM/yyyy", new Date()),
        bugDate: false,
        bugMsgDate: "",
        debit: debitDefer,
        bugMsgDebit: "",
        credit: cerditDefer,
        bugMsgCredit: "",
        bug: false,
        isCredit: isCredit,
        viewOnly: false,
      };
    };
    const errors = await checkErrorsFn();
    if (!Boolean(errors)) {
      if (
        lastRowUnqID?.current === state?.rows[state?.rows?.length - 1]?.unqID
      ) {
        const newData = newDataFn();
        dispatch({
          type: "ADD_NEW_ROW",
          payload: {
            newData: newData,
          },
        });
      }
    } else {
      enqueueSnackbar("A required value is missing", {
        variant: "error",
      });
    }
  };

  const handleTotal = (rows) => {
    const calculateSum = (key) =>
      rows.reduce((acc, row) => acc + Number(row[key]), 0);
    const sumDebit = calculateSum("debit");
    const sumCredit = calculateSum("credit");
    setTotalDebit(Number(sumDebit.toFixed(3)));
    setTotalCredit(Number(sumCredit.toFixed(3)));
  };

  const handleReset = async (flag) => {
    if (flag === "OPEN_BOX") {
      const msgBoxRes = await MessageBox({
        messageTitle: "confirmation",
        message: "Are you sure you want to reset the data?",
        buttonNames: ["Yes", "No"],
        defFocusBtnName: "Yes",
        icon: "CONFIRM",
      });

      if (msgBoxRes === "Yes") {
        dispatch({
          type: "RESET_ROWS",
          payload: {},
        });
        setTotalCredit(0);
        setTotalDebit(0);
        setTrxOptions(queriesResult?.[3]?.data);
        setViewOnly(false);
        setTabsDetails([]);
        setReqData({});
        setCardsData([]);
        CloseMessageBox();
        handleSetDefaultBranch(queriesResult?.[0]?.data, authState, 0);
      } else if (msgBoxRes === "No") {
        CloseMessageBox();
      }
    } else {
      dispatch({
        type: "RESET_ROWS",
        payload: {},
      });
      setTotalCredit(0);
      setTotalDebit(0);
      setTrxOptions(queriesResult?.[3]?.data);
      setViewOnly(false);
      setTabsDetails([]);
      setReqData({});
      setCardsData([]);
      handleSetDefaultBranch(queriesResult?.[0]?.data, authState, 0);
    }
  };

  const handleGetAccInfo = (row, unqID) => {
    let prevAcct = state?.rows?.find((item) => item?.unqID === unqID);
    if (prevAcct?.accNo !== row?.accNo) {
      if (
        Boolean(row?.accNo) &&
        Boolean(row?.accType?.value) &&
        Boolean(row?.branch?.value) &&
        !Boolean(dateDialog)
      ) {
        const data = {
          COMP_CD: row?.branch?.info?.COMP_CD ?? "",
          ACCT_TYPE: row?.accType?.value ?? "",
          ACCT_CD: row?.accNo ?? "",
          PARENT_TYPE: row?.accType?.info?.PARENT_TYPE ?? "",
          PARENT_CODE: row?.accType?.info?.PARENT_CODE ?? "",
          BRANCH_CD: row?.branch?.value ?? "",
          SCREEN_REF: "TRN/001",
          unqID: unqID,
        };

        setLoadingState(unqID, "ACCTNO", true);
        getAccNoValidation.mutate(data);
      }
    }
  };

  const setLoadingState = (rowIndex, fieldId, isLoading) => {
    setLoadingStates((prevState) => ({
      ...prevState,
      [rowIndex]: {
        ...(prevState[rowIndex] || {}),
        [fieldId]: isLoading,
      },
    }));
  };

  const checkLoading = Object.keys(state?.loadingStates).some((key) => {
    const loadingItems = [
      "ACCTNO",
      "AMNTVALIDCR",
      "AMNTVALIDDR",
      "CHQDATE",
      "CHQNOVALID",
    ];
    return loadingItems.some((loadingItem) => {
      return Boolean(state?.loadingStates[key][loadingItem]);
    });
  });

  const handleScrollSave1 = async (unqID) => {
    const errors = await checkErrorsFn();

    if (Boolean(errors)) {
      enqueueSnackbar("A required value is missing", { variant: "error" });
      return;
    }
    if (Boolean(isBatchEntry?.current) && Boolean(totalDebit !== totalCredit)) {
      enqueueSnackbar(
        "For posting, the total debit amount must match the total credit amount.",
        { variant: "error" }
      );
      return;
    }

    if (cardsData?.length > 0) {
      const msgBoxRes = await MessageBox({
        messageTitle: "confirmation",
        message: "Are you sure you want to save the data?",
        buttonNames: ["Yes", "No"],
        defFocusBtnName: "Yes",
        loadingBtnName: ["Yes"],
        icon: "CONFIRM",
      });
      if (msgBoxRes === "Yes") {
        handleScrollSave2();
      } else {
        CloseMessageBox();
      }
    }
  };

  const handleScrollSave2 = () => {
    let arr = state?.rows.map((row) => {
      return {
        ENTERED_BRANCH_CD: row?.branch?.value ?? "",
        ENTERED_COMP_CD: authState?.companyID ?? "",
        ACCT_TYPE: row?.accType?.value ?? "",
        ACCT_CD: row?.accNo?.padStart(6, "0").padEnd(20, " "),
        TYPE_CD: row?.trx?.code + "   ",
        SCROLL1: row?.scroll ? row?.scroll : "0",
        SDC: row?.sdc?.value ?? "",
        REMARKS: row?.remark ?? "",
        CHEQUE_NO: row?.cNo ? row?.cNo : "",
        VALUE_DT: format(row?.date, "dd-MMM-yyyy"),
        AMOUNT: row?.isCredit ? row?.credit : row?.debit ?? "",
        BRANCH_CD: row?.branch?.value ?? "",
        COMP_CD: authState?.companyID ?? "",
        CURRENCY_CD: "00  ",
        CONFIRMED: "0",
      };
    });
    saveScroll.mutate(arr);
  };

  const handleGetHeaderTabs = (data) => {
    fetchTabsData({
      cacheId: data,
      reqData: data,
    });
  };

  useEffect(() => {
    if (Boolean(tabsDetails?.length > 0)) {
      if (acctNoRef?.current) {
        acctNoRef?.current?.focusAcctInput();
      }
    }
  }, [tabsDetails]);

  const handleSetCards = (row) => {
    setCardsData(row);
  };
  const handleSetAccInfo = (row) => {
    setReqData(row);
  };

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
    ];
    return () => {
      clearTabsCache();
      queries?.forEach((query) => queryClient?.removeQueries(query));
    };
  }, [queryClient]);

  useEffect(() => {
    if (Boolean(isTabsError)) {
      enqueueSnackbar((tabsErorr as any)?.error_msg, {
        variant: "error",
      });
    }
  }, [isTabsError]);

  const removeRow = (unqID) => {
    deleteRowCtx({ updUnqId: unqID, handleTotal });
  };

  const tokenValidate = useMutation(API.getTokenValidation, {
    onSuccess: (data: any, variables: any) => {
      const rowUpdID = variables?.unqID ?? "";
      const getBtnName = async (msgObj) => {
        let btnNm = await MessageBox(msgObj);
        return { btnNm, msgObj };
      };
      getTokenValidation({
        updUnqId: rowUpdID,
        data,
        getBtnName,
        setLoadingState,
      });
    },
    onError: (error: any, variables: any) => {
      const rowUnqID = variables?.unqID ?? "";
      setFieldsError({
        updUnqId: rowUnqID,
        payload: { bugMsgScroll: error?.error_msg },
      });
    },
  });

  const handleScrollBlur = (event, unqID) => {
    handleScrollBlurCtx({
      updUnqId: unqID,
      value: event?.target?.value ?? "",
      mutationFn: tokenValidate,
      authState,
      setLoadingState,
    });
  };

  const handleKeyUp = (event, unqID) => {
    // Check if Ctrl + I is pressed
    let reqParaDtl = state?.rows?.find((item) => item?.unqID === unqID);

    if (event.ctrlKey && (event.key === "i" || event.key === "I")) {
      setLoadingState(unqID, "ACCTNO", true);
      setInterestCalReportDTL([]);
      interestCalculateParaRef.current = [];
      getInterestCalculatePara.mutate({
        A_COMP_CD: reqParaDtl?.branch?.info?.COMP_CD ?? "",
        A_BRANCH_CD: reqParaDtl?.branch?.value ?? "",
        A_ACCT_TYPE: reqParaDtl?.accType?.value ?? "",
        A_ACCT_CD: reqParaDtl?.accNo ?? "",
        A_SCREEN_REF: "TRN/001",
        WORKING_DATE: authState?.workingDate ?? "",
        USERNAME: authState?.user?.id ?? "",
        USERROLE: authState?.role ?? "",
        unqID: unqID,
      });
    }
  };
  const handleDoubleClick = (event, unqID) => {
    const reqParaDtl = state?.rows?.find((item) => item?.unqID === unqID);
    setPassbookStatementPara(reqParaDtl);
    setOpenPassbookStatement(true);
  };
  const handlePassbookStatementClose = () => {
    setOpenPassbookStatement(false);
    setPassbookStatementPara({});
  };

  const maxUnqID = (state?.rows ?? [])?.reduce(
    (maxID, row) => Math.max(maxID, row?.unqID),
    0
  );

  const row = state?.rows[maxUnqID];

  return (
    <>
      <DailyTransTabs
        heading={utilFunction.getDynamicLabel(
          useLocation().pathname,
          authState?.menulistdata,
          true
        )}
        tabsData={tabsDetails}
        cardsData={cardsData}
        reqData={reqData}
      />
      {!Boolean(viewOnly) && (
        <>
          {saveScroll.isError ? (
            <Alert
              severity={saveScroll.error?.severity ?? "error"}
              errorMsg={
                saveScroll.error?.error_msg ?? "Something went to wrong.."
              }
              errorDetail={saveScroll.error?.error_detail}
              color="error"
            />
          ) : null}
          <Card
            sx={{
              boxShadow: "0px 1px 4px -1px #999999",
              borderRadius: "5px",
              padding: "8px",
              margin: "4px",
              marginBottom: "10px",
            }}
          >
            {Boolean(isTabsLoading) || Boolean(getCarousalCards?.isLoading) ? (
              <LinearProgress color="secondary" />
            ) : null}

            <RowsTable
              rows={state?.rows ?? []}
              queriesResult={queriesResult}
              handleAccTypeBlur={handleAccTypeBlur}
              handleAccNoBlur={handleAccNoBlur}
              loadingStates={loadingStates}
              trxOptions2={trxOptions2}
              trxOptions={trxOptions}
              handleTrx={handleTrx}
              setLoadingState={setLoadingState}
              getChqValidation={getChqValidation}
              getDateValidation={getDateValidation}
              viewOnly={viewOnly}
              handleDebit={handleDebit}
              handleDebitBlur={handleDebitBlur}
              handleCredit={handleCredit}
              handleCreditBlur={handleCreditBlur}
              totalDebit={totalDebit}
              totalCredit={totalCredit}
              cardsData={cardsData}
              tabsDetails={tabsDetails}
              parametres={parametres}
              handleGetHeaderTabs={handleGetHeaderTabs}
              getCarousalCards={getCarousalCards}
              carousalCrdLastReq={carousalCrdLastReq}
              setReqData={setReqData}
              isTabsLoading={isTabsLoading}
              checkLoading={checkLoading}
              isCardsLoading={getCarousalCards?.isLoading}
              ref={acctNoRef}
              removeRow={removeRow}
              handleScrollBlur={handleScrollBlur}
              onKeyUp={handleKeyUp}
              onDoubleClick={handleDoubleClick}
            />
          </Card>
        </>
      )}
      {!viewOnly &&
        !Boolean(isTabsLoading) &&
        !Boolean(checkLoading) &&
        Boolean(getAmountValidation?.isSuccess) &&
        Boolean(row?.branch?.value) &&
        Boolean(row?.accType?.value) &&
        Boolean(row?.accNo) &&
        Boolean(row?.trx?.code) &&
        Boolean(row?.sdc?.value) &&
        Boolean(row?.remark) &&
        (Boolean(row?.debit) || Boolean(row?.credit)) && (
          <div>
            <GradientButton
              sx={{ margin: "8px" }}
              onClick={() => handleScrollSave1(row?.unqID)}
            >
              Post
            </GradientButton>

            <GradientButton onClick={() => handleReset("OPEN_BOX")}>
              <RestartAltIcon /> Reset
            </GradientButton>
          </div>
        )}
      {!Boolean(viewOnly) && (
        <>
          <GradientButton
            onClick={() => (window.location.href = "Calculator:///")}
            sx={{ margin: "5px" }}
          >
            Calculator
          </GradientButton>
          <GradientButton
            onClick={() => setViewOnly(true)}
            sx={{ margin: "5px" }}
          >
            View All
          </GradientButton>
        </>
      )}
      {viewOnly && (
        <TRN001_Table
          handleGetHeaderTabs={handleGetHeaderTabs}
          handleSetCards={handleSetCards}
          handleSetAccInfo={handleSetAccInfo}
          setViewOnly={setViewOnly}
        />
      )}
      {dateDialog && (
        <DateRetrival
          closeDialog={() => {
            setDateDialog(false);
          }}
          open={dateDialog}
          reqData={interestCalculateParaRef?.current}
          reportDTL={setInterestCalReportDTL}
          openReport={() => {
            setDateDialog(false);
            setSingleAccountInterest(true);
          }}
        />
      )}
      {singleAccountInterest && (
        <SingleAccountInterestReport
          open={singleAccountInterest}
          date={interestCalReportDTL?.[0]}
          reportHeading={interestCalReportDTL?.[2]}
          reportDetail={interestCalReportDTL?.[1]}
          acctInfo={interestCalReportDTL?.[3]}
          reqData={interestCalReportDTL}
          closeDialog={() => {
            setSingleAccountInterest(false);
          }}
        />
      )}
      {isOpenPassbookStatement ? (
        <Dialog
          open={isOpenPassbookStatement}
          PaperProps={{
            style: {
              width: "100%",
              overflow: "auto",
            },
          }}
          maxWidth="md"
        >
          <ViewStatement
            rowsData={[
              {
                data: {
                  ACCT_CD: passbookStatementPara?.accNo ?? "",
                  ACCT_TYPE: passbookStatementPara?.accType?.value ?? "",
                  BRANCH_CD: passbookStatementPara?.branch?.value,
                },
              },
            ]}
            open={isOpenPassbookStatement}
            onClose={handlePassbookStatementClose}
            screenFlag={"ACCT_INQ"}
            close={() => {}}
          />
        </Dialog>
      ) : null}
      ;
    </>
  );
};

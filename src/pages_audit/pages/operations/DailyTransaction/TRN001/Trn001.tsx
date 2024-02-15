//UI
import { Button, Card } from "@mui/material";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import LinearProgress from "@mui/material/LinearProgress";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
//date
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
//Logic
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { format } from "date-fns";
import { isValidDate } from "components/utils/utilFunctions/function";

import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { useMutation } from "react-query";
import * as API from "./api";
import * as CommonApi from "../TRNCommon/api";
import { AccDetailContext } from "pages_audit/auth";
import { AuthContext } from "pages_audit/auth";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import "./Trn001.css";
import CommonFooter from "../TRNCommon/CommonFooter";
import TRN001_Table from "./Table";
import DailyTransTabs from "../TRNHeaderTabs";

//mui theme
const ErrTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "#ea3a1b",
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));
export const Trn001 = () => {
  //hooks
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AccDetailContext);
  const { cardStore, setCardStore } = useContext(AccDetailContext);

  //variables
  const [defBranch, setDefBranch] = useState<any>({});

  let defErrMsg = { cNo: "", accNo: "" };
  var defTableValue = {
    branch: defBranch,
    accType: { label: "", value: "", info: "" },
    accNo: "",
    trx: { label: "", value: "", code: "" }, //TYPE_CD
    scroll: "", //token
    sdc: { label: "", value: "", info: "" },
    remark: "",
    cNo: "0",
    date: new Date(),
    debit: "0.00",
    credit: "0.00",

    bug: true,
    bugAccNo: false,
    bugCNo: false,
    bugDate: false,
    bugMsgAccNo: "A/C No. Empty",
    bugMsgCNo: "",
    bugMsgDate: "",
    isCredit: true,
    viewOnly: false,
  };

  //states define
  const [rows, setRows] = useState<any>([defTableValue]);
  const [trxOptions, setTrxOptions] = useState<any>([]);
  const [trxOptions2, setTrxOptions2] = useState<any>([]);
  const [sdcOptions, setSdcOptions] = useState<any>([]);
  const [accTypeOptions, setAccTypeOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState<any>([]);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [isSave, setIsSave] = useState(false);
  const [diff, setDiff] = useState(0);
  const [isArray, setIsArray] = useState(false);
  const [errMsg, setErrMsg] = useState(defErrMsg);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [resetDialog, setResetDialog] = useState(false);
  const [scrollResDialog, setScrollResDialog] = useState([]);
  const [viewOnly, setViewOnly] = useState(false);
  const [saveDialog, setSaveDialog] = useState<boolean>(false);
  const [tabsData, setTabsData] = useState<any>([]);
  const [searchScrollNo, setSearchScrollNo] = useState<any>("");
  const [filteredRows, setFilteredRows] = useState<any>("");
  const [scrollSaveRes, setScrollSaveRes] = useState<any>([]);
  const [scrollSaveDialog, setScrollSaveDialog] = useState<any>(false);
  const [accValidDialog, setAccValidDialog] = useState<any>(false);
  const [accValidMsg, setAccValidMsg] = useState<any>("");

  let scrollSaveHeading =
    "Do you wish to save this " + (isArray ? "Scroll?" : "Transaction?");

  const handleSetDefaultBranch = (data) => {
    let obj = [...rows];
    data &&
      data?.map((a) => {
        if (a.value == authState?.user?.branchCode) {
          setDefBranch(a);
          obj[0].branch = a;
          setRows(obj);
        }
      });
  };

  //useEffects
  useEffect(() => {
    setTempStore({ ...tempStore, accInfo: {} });
    setCardStore({ ...cardStore, cardsInfo: [] });
    setTabsData([]);
  }, []);
  useEffect(() => {
    console.log(index, "index");
  }, [index]);
  useEffect(() => {
    //bug checker on row change
    console.log("rows trn1", rows);
    let i = 0;
    if (rows.length > 0) {
      i = rows.length - 1;
    }
    rows[i].bug = false;
    if (
      !rows[i].trx?.code ||
      !rows[i].branch ||
      !rows[i].accType ||
      !rows[i].accNo
    ) {
      rows[i].bug = true;
    }

    if (!rows[i].isCredit && (!rows[i].date || !rows[i].cNo)) {
      rows[i].bug = true;
    }

    if (rows[i]?.isCredit && !(Number(rows[i]?.credit) > 0)) {
      //credit true
      rows[i].bug = true;
    }
    if (!rows[i]?.isCredit && !(Number(rows[i]?.debit) > 0)) {
      //debit true
      rows[i].bug = true;
    }

    if (rows[i]?.trx?.code == "4" && !rows[i]?.scroll) {
      rows[i].bug = true;
    }
    if (!rows[i]?.isCredit && rows[i].bugCNo) {
      rows[i].bug = true;
    }

    let result = rows && rows.some((a) => a?.bug);
    setIsSave(!result);
  }, [rows]);

  useEffect(() => {
    //getting all options for autocomplete
    getBranchOptions.mutate(authState);
    getSdcOptions.mutate(authState);
    getAccTypeOptions.mutate(authState);
    getTrxOptions.mutate(authState);
  }, []);

  //api define ============================================================
  const getBranchOptions = useMutation(API.getBranchList, {
    onSuccess: (data) => {
      setBranchOptions(data);
      handleSetDefaultBranch(data);
    },
    onError: (error: any) => {},
  });
  const getAccTypeOptions = useMutation(API.getAccTypeList, {
    onSuccess: (data) => {
      setAccTypeOptions(data);
    },
    onError: (error: any) => {},
  });

  const getSdcOptions = useMutation(API.getSDCList, {
    onSuccess: (data) => {
      setSdcOptions(data);
      const obj = [...rows];
      setRows(obj);
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.error_msg, {
        variant: "error",
      });
    },
  });

  const getTrxOptions = useMutation(API.getTRXList, {
    onSuccess: (data) => {
      setTrxOptions2(data);
      setTrxOptions(data);
    },
    onError: (error: any) => {},
  });

  const getCarousalCards = useMutation(CommonApi.getCarousalCards, {
    onSuccess: (data) => {
      setLoading(false);
      setCardStore({ ...cardStore, cardsInfo: data });
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.error_msg, {
        variant: "error",
      });
      setLoading(false);
      setCardStore({ ...cardStore, cardsInfo: [] });
    },
  });

  const getTabsByParentType = useMutation(CommonApi.getTabsByParentType, {
    onSuccess: (data) => {
      setTabsData(data);
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.error_msg, {
        variant: "error",
      });
    },
  });
  const getAccNoValidation = useMutation(API.getAccNoValidation, {
    onSuccess: (data) => {
      if (data?.MESSAGE1) {
        setAccValidMsg(data?.MESSAGE1);
        let abc = accValidMsg?.split("\n")[2];
        setAccValidDialog(true);
      }

      if (data?.RESTRICTION) {
        const obj = [...rows];
        obj[index].bug = true;
        obj[index].bugAccNo = true;
        obj[index].bugMsgAccNo = data?.RESTRICTION;
        setRows(obj);
        setAccValidMsg(data?.RESTRICTION);
        setAccValidDialog(true);
      } else {
        const obj = [...rows];
        obj[index].bug = false;
        obj[index].bugAccNo = false;
        obj[index].bugMsgAccNo = "";
        setRows(obj);
      }
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.error_msg, {
        variant: "error",
      });
    },
  });
  const getChqValidation = useMutation(API.getChqValidation, {
    onSuccess: (data) => {
      if (data.ERR_CODE == "-1") {
        enqueueSnackbar(data?.ERR_MSG, {
          variant: "error",
        });
        const obj = [...rows];
        obj[index].bug = true;
        obj[index].bugCNo = true;
        obj[index].bugMsgCNo = data?.ERR_MSG;
        setRows(obj);
      } else {
        const obj = [...rows];
        obj[index].bug = false;
        obj[index].bugCNo = false;
        obj[index].bugMsgCNo = "";
        setRows(obj);
      }
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.error_msg, {
        variant: "error",
      });
    },
  });
  const saveScroll = useMutation(API.saveScroll, {
    onSuccess: (res) => {
      setScrollSaveRes(res.data);
      console.log(res, "savescrollres");
      let isSuccess = res?.data?.some((a) => a?.TRAN_CD);
      if (isSuccess) {
        setSaveDialog(false);
        setScrollSaveDialog(true);

        let msg = "";
        if (isArray) {
          msg = "Scroll Saved Successfully";
        } else {
          msg = "Transaction Saved Successfully";
        }
        enqueueSnackbar(msg, {
          variant: "success",
        });

        handleReset();
      } else {
        enqueueSnackbar("Some error occured in scroll saving", {
          variant: "error",
        });
      }
    },
    onError: (error: any) => {
      setSaveDialog(false);
      enqueueSnackbar(error?.error_msg, {
        variant: "error",
      });
    },
  });

  //fns define TABLE  ===============================================================
  const handleBranch = (e, value, i) => {
    const obj = [...rows];
    obj[i].branch = value;
    setRows(obj);
    handleTotal(obj);
    handleGetAccInfo(i);
  };

  const handleAccType = (e, value, i) => {
    const obj = [...rows];
    obj[i].accType = value;
    setRows(obj);
    handleGetAccInfo(i);
    value?.info?.PARENT_TYPE && handleGetHeaderTabs(value?.info?.PARENT_TYPE);
  };
  const handleAccNo = (e, i) => {
    setIndex(i);
    let txt = e.target.value;
    if (txt.length <= 20) {
      const obj = [...rows];
      obj[i].accNo = txt;
      setRows(obj);
    }
  };

  const handleAccNoBlur = (e, i) => {
    const obj = [...rows];
    if (obj[i].accNo) {
      let abc = obj[i]?.accNo?.padStart(6, "0");
      obj[i].accNo = abc;
      handleGetAccInfo(i);
      setRows(obj);
    }
  };

  const handleTrx = (e, value, i) => {
    const obj = [...rows];

    let defSdc = sdcOptions.find((a) => a?.value?.trim().includes(value?.code));
    obj?.length == 1 &&
      (value?.code == "3" || value?.code == "6") &&
      handleFilterTrx();

    if (rows.length == 1 && value?.code == "3") {
      let abc = trxOptions.find((a) => a.code == "6");
      value = abc;
    }
    obj[i].trx = value;
    obj[i].credit = "0.00";
    obj[i].debit = "0.00";
    obj[i].cNo = "0";
    obj[i].bugCNo = false;
    obj[i].scroll = "";
    obj[i].sdc = defSdc;
    obj[i].remark = defSdc?.label;
    obj[i].date = new Date();

    if (value?.code == "1" || value?.code == "2" || value?.code == "3") {
      obj[i].isCredit = true;
    } else {
      obj[i].isCredit = false;
    }

    if (value?.code == "3" || value?.code == "6") {
      setIsArray(true);
    } else {
      setIsArray(false);
    }
    setErrMsg({ ...errMsg, cNo: "" });
    setRows(obj);
    handleTotal(obj);
  };

  const handleScroll = (e, i) => {
    const obj = [...rows];
    obj[i].scroll = e.target.value;
    setRows(obj);
  };

  const handleSdc = (e, value, i) => {
    const obj = [...rows];
    obj[i].sdc = value;
    obj[i].remark = value.label;

    setRows(obj);
  };

  const handleRemark = (e, i) => {
    const obj = [...rows];
    obj[i].remark = e.target.value;
    setRows(obj);
  };

  const handleCNo = (e, i) => {
    setErrMsg({ ...errMsg, cNo: "" });
    const obj = [...rows];
    let txt = e.target.value;
    obj[i].cNo = txt;
    setIndex(i);
    setRows(obj);
  };

  const handleCNoBlur = (e, i) => {
    const obj = [...rows];
    if (Number(obj[i].cNo) > 0) {
      obj[i].cNo &&
        obj[i].accNo &&
        obj[i].accType?.value &&
        obj[i].branch?.value &&
        getChqValidation.mutate(obj[i]);
    } else {
      obj[i].bugCNo = false;
      obj[i].bugMsgCNo = "";
    }
    setRows(obj);
  };

  const handleDate = (e, i) => {
    console.log(e, "date e");
    const obj = [...rows];
    obj[i].date = e;
    setRows(obj);
  };

  const handleDateErr = (e, i) => {
    const obj = [...rows];
    if (e) {
      obj[i].bugMsgDate = "Invalid Date ";
      obj[i].bugDate = true;
    } else {
      obj[i].bugMsgDate = "";
      obj[i].bugDate = false;
    }
    setRows(obj);
  };

  const handleDebit = (e, i) => {
    const obj = [...rows];
    let txt = e.target.value;
    if (txt.includes(".")) {
      let a = txt?.split(".")[0];
      let b = txt?.split(".")[1];
      let c = b?.substring(0, 2);
      obj[i].debit = a + "." + c;
    } else {
      obj[i].debit = txt;
    }
    setRows(obj);
    handleTotal(obj);
  };

  const handleCredit = (e, i) => {
    const obj = [...rows];
    let txt = e.target.value;
    if (txt.includes(".")) {
      let a = txt?.split(".")[0];
      let b = txt?.split(".")[1];
      let c = b?.substring(0, 2);
      obj[i].credit = a + "." + c;
    } else {
      obj[i].credit = txt;
    }

    setRows(obj);
    handleTotal(obj);
  };

  const handleDebitBlur = (e, i) => {
    const obj = [...rows];
    obj[i].debit = Number(e.target.value)?.toFixed(2);
    setRows(obj);
    totalDebit != totalCredit &&
      (obj[i].trx?.code == "3" || obj[i].trx?.code == "6") &&
      obj[i].credit != obj[i].debit &&
      handleAddRow();
  };

  const handleCreditBlur = (e, i) => {
    const obj = [...rows];
    obj[i].credit = Number(e.target.value)?.toFixed(2);
    setRows(obj);
    totalDebit != totalCredit &&
      (obj[i].trx?.code == "3" || obj[i].trx?.code == "6") &&
      obj[i].credit != obj[i].debit &&
      handleAddRow();
  };

  //fns > logic> Table=====================================================================

  const handleAddRow = () => {
    let cred = 0;
    let deb = 0;
    let trxx: any = {};
    let isCred = true;
    let trx3 = trxOptions2.find((a) => a.code == "3");
    let trx6 = trxOptions2.find((a) => a.code == "6");

    if (totalDebit > totalCredit) {
      cred = totalDebit - totalCredit;
      trxx = trx3;
      isCred = true;
    } else if (totalDebit < totalCredit) {
      deb = totalCredit - totalDebit;
      trxx = trx6;
      isCred = false;
    }

    let defSdc = sdcOptions.find((a) => a?.value?.trim()?.includes(trxx?.code));

    let defTableValue2 = {
      branch: defBranch,
      accType: { label: "", value: "", info: "" },
      accNo: "",
      trx: trxx,
      scroll: "", //token
      sdc: defSdc,
      remark: defSdc?.label,
      cNo: "0",
      date: new Date(),
      debit: deb?.toFixed(2),
      credit: cred?.toFixed(2),
      bugAccNo: true,
      bugCNo: false,
      bugDate: false,
      bugMsgAccNo: "A/C No. Empty",
      bugMsgCNo: "",
      bugMsgDate: "",

      isCredit: isCred,
    };
    if (
      isSave &&
      totalDebit != totalCredit &&
      errMsg?.accNo == "" &&
      errMsg?.cNo == ""
    ) {
      let obj = [...rows, defTableValue2];
      setRows(obj);
      handleTotal(obj);
    }
  };

  const handleClear = (e, i) => {
    setIndex(i);
    let obj = [...rows];
    if (rows.length > 1) {
      obj.splice(i, 1);
      handleTotal(obj);
      setRows(obj);
    }
    setErrMsg(defErrMsg);
  };

  const handleTotal = (obj) => {
    let sumDebit = 0;
    let sumCredit = 0;

    obj?.map((a) => {
      sumDebit += Number(a.debit);
    });

    obj?.map((a) => {
      sumCredit += Number(a.credit);
    });

    setDiff(sumDebit - sumCredit);
    setTotalDebit(Number(sumDebit.toFixed(3)));
    setTotalCredit(Number(sumCredit.toFixed(3)));
  };

  const handleReset = () => {
    let defaultRows = { ...defTableValue };
    setRows([defaultRows]);
    setTotalCredit(0);
    setTotalDebit(0);
    setTrxOptions(trxOptions2);
    setResetDialog(false);
    setViewOnly(false);
    setTempStore({ ...tempStore, accInfo: {} });
    setCardStore({ ...cardStore, cardsInfo: [] });
    setTabsData([]);
    setErrMsg(defErrMsg);
  };

  const handleFilterTrx = () => {
    //to limit the trxOptions on 3,6
    let result = trxOptions2?.filter((a) => a?.code == "3" || a?.code == "6");
    setTrxOptions(result);
  };

  const handleGetAccInfo = (i) => {
    let data = {
      COMP_CD: rows[i]?.branch?.info?.COMP_CD,
      ACCT_TYPE: rows[i]?.accType?.value,
      ACCT_CD: rows[i]?.accNo?.padEnd(20, " "),
      PARENT_TYPE: rows[i]?.accType?.info?.PARENT_TYPE ?? "",

      BRANCH_CD: rows[i]?.branch?.value,
      authState: authState,
    };

    if (rows[i]?.accNo && rows[i]?.accType?.value && rows[i]?.branch?.value) {
      setLoading(true);
      rows[i]?.accNo && getAccNoValidation.mutate(data);
      rows[i]?.accNo && getCarousalCards.mutate(data);
      setTempStore({ ...tempStore, accInfo: data });
    }
  };

  const handleScrollSave1 = () => {
    console.log(errMsg, "errMsg");
    console.log(isSave, "isSave");
    let isErrCNo = rows.some((a) => a.bugCNo);
    let isErrAccNo = rows.some((a) => a.bugAccNo || a.bugMsgAccNo);
    let isErrDate = rows.some((a) => a.bugDate);
    let isRowBug = rows.some((a) => a.bug);

    if (isRowBug) {
      enqueueSnackbar("Kindly fill all the required Fields", {
        variant: "error",
      });
    }
    if (isArray && diff != 0) {
      enqueueSnackbar("Credit Debit Amount not matched", {
        variant: "error",
      });
    } else if ((!isArray && diff == 0) || (isArray && rows.length == 1)) {
      enqueueSnackbar("Amount cant be Zero", {
        variant: "error",
      });
    }
    if (isErrCNo) {
      enqueueSnackbar("Kindly Check, Error in ChqNo", {
        variant: "error",
      });
    }
    if (isErrAccNo) {
      enqueueSnackbar("Kindly Check, Error in A/C No.", {
        variant: "error",
      });
    }
    if (isErrDate) {
      enqueueSnackbar("Kindly Check, Error in Date", {
        variant: "error",
      });
    }

    if (
      !isSave ||
      (!isArray && diff == 0) ||
      (isArray && diff != 0) ||
      isErrAccNo ||
      isErrCNo
    ) {
    } else {
      setSaveDialog(true);
    }
  };

  const handleScrollSave2 = () => {
    let arr = rows.map((a) => {
      return {
        ENTERED_BRANCH_CD: a.branch?.value,
        ENTERED_COMP_CD: a.branch?.info.COMP_CD,
        ACCT_TYPE: a.accType?.value,
        ACCT_CD: a.accNo.padStart(6, "0").padEnd(20, " "),
        TYPE_CD: a.trx.code + "   ",
        SCROLL1: a.scroll ?? "0",
        SDC: a.sdc.value,
        REMARKS: a.remark,
        CHEQUE_NO: a.cNo ? a.cNo : "0",
        VALUE_DT: format(a.date, "dd-MMM-yyyy"),
        AMOUNT: a.isCredit ? a.credit : a.debit,

        BRANCH_CD: authState?.user?.branchCode,
        COMP_CD: authState?.companyID,
        CURRENCY_CD: "00  ",
        CONFIRMED: "0",
      };
    });
    saveScroll.mutate(arr);
  };

  const handleGetHeaderTabs = (data) => {
    getTabsByParentType.mutate(data);
  };

  const handleViewAll = () => {
    setViewOnly(true);
  };

  const handleFilterByScroll = (scrollNo) => {
    setSearchScrollNo(scrollNo);
  };

  const handleFilteredRows = (rows) => {
    //sending back to commonfooter
    setFilteredRows(rows);
  };

  return (
    <>
      <DailyTransTabs heading="(Maker) (TRN/001)" tabsData={tabsData} />

      <Card
        sx={{
          boxShadow: "0px 1px 4px -1px #999999",
          borderRadius: "5px",
          padding: "8px",
          margin: "4px",
          marginBottom: "10px",
        }}
      >
        {loading && <LinearProgress color="secondary" />}
        {viewOnly && (
          <TRN001_Table
            searchScrollNo={searchScrollNo}
            handleGetHeaderTabs={handleGetHeaderTabs}
            handleFilteredRows={handleFilteredRows}
          />
        )}

        {!viewOnly && (
          <TableContainer>
            <Table aria-label="simple table" padding={"none"}>
              <>
                <caption>
                  <h3>
                    Total ( Debit:{totalDebit} | Credit:{totalCredit} )
                  </h3>
                </caption>
                {errMsg?.cNo ? (
                  <caption style={{ fontSize: "15px", color: "#ea3a1b" }}>
                    {errMsg?.cNo}
                  </caption>
                ) : (
                  <></>
                )}

                {errMsg?.accNo ? (
                  <caption style={{ fontSize: "15px", color: "#ea3a1b" }}>
                    {errMsg?.accNo}
                  </caption>
                ) : (
                  <></>
                )}
              </>

              <TableHead>
                <TableRow id="topHead">
                  <TableCell id="head">{t("Branch")}</TableCell>
                  <TableCell id="head">{t("AcctType")}</TableCell>
                  <TableCell id="head">{t("ACNo")}</TableCell>
                  <TableCell id="head">{t("Trx")}</TableCell>
                  <TableCell id="head">
                    {rows[0]?.trx?.code == "4" ? "Token" : t("Scroll")}
                  </TableCell>
                  <TableCell id="head">{t("SDC")}</TableCell>
                  <TableCell id="head">{t("Remarks")}</TableCell>
                  <TableCell id="head">{t("Chequeno")} </TableCell>
                  <TableCell id="head">Cheque Date</TableCell>
                  <TableCell id="head">{t("DebitAmount")}</TableCell>
                  <TableCell id="head">{t("CreditAmount")}</TableCell>{" "}
                </TableRow>
              </TableHead>

              {rows &&
                rows?.map((a, i) => {
                  return (
                    <TableBody>
                      <TableRow key={i}>
                        <Tooltip
                          disableInteractive={true}
                          title={
                            a?.branch?.label && (
                              <h3>{a?.branch?.info?.BRANCH_NM}</h3>
                            )
                          }
                        >
                          <TableCell sx={{ minWidth: 120 }}>
                            <Autocomplete
                              value={a.branch}
                              fullWidth={true}
                              autoHighlight
                              size="small"
                              options={branchOptions}
                              onChange={(e, value) => handleBranch(e, value, i)}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  error={a.branch?.value ? false : true}
                                />
                              )}
                            />
                          </TableCell>
                        </Tooltip>
                        <Tooltip
                          disableInteractive={true}
                          title={
                            a?.accType?.label && (
                              <h3>{a?.accType?.info?.TYPE_NM}</h3>
                            )
                          }
                        >
                          <TableCell sx={{ minWidth: 130 }}>
                            <Autocomplete
                              value={a.accType}
                              fullWidth={true}
                              autoHighlight
                              size="small"
                              options={accTypeOptions}
                              onChange={(e, value) =>
                                handleAccType(e, value, i)
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  error={a.accType?.value ? false : true}
                                />
                              )}
                            />
                          </TableCell>
                        </Tooltip>
                        <ErrTooltip
                          disableInteractive={true}
                          title={a?.bugMsgAccNo && <h3>{a?.bugMsgAccNo}</h3>}
                        >
                          <TableCell sx={{ minWidth: 120 }}>
                            <TextField
                              value={a.accNo}
                              fullWidth={true}
                              error={!a.accNo || a.bugAccNo ? true : false}
                              size="small"
                              type="number"
                              onChange={(e) => handleAccNo(e, i)}
                              onBlur={(e) => handleAccNoBlur(e, i)}
                            />
                          </TableCell>
                        </ErrTooltip>
                        <Tooltip
                          disableInteractive={true}
                          title={
                            a?.trx?.label && (
                              <h3>{a?.trx?.info?.DESCRIPTION}</h3>
                            )
                          }
                        >
                          <TableCell sx={{ minWidth: 50 }}>
                            <Autocomplete
                              value={a.trx}
                              fullWidth={true}
                              autoHighlight
                              size="small"
                              options={trxOptions}
                              onChange={(e, value) => handleTrx(e, value, i)}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  error={a.trx?.value ? false : true}
                                />
                              )}
                            />{" "}
                          </TableCell>
                        </Tooltip>
                        <TableCell sx={{ minWidth: 60 }}>
                          <TextField
                            value={a.scroll}
                            fullWidth={true}
                            type="number"
                            disabled={
                              a.trx?.code == "3" ||
                              a.trx?.code == "6" ||
                              !a.trx?.code
                                ? true
                                : false
                            }
                            size="small"
                            onChange={(e) => handleScroll(e, i)}
                          />
                        </TableCell>
                        <Tooltip
                          disableInteractive={true}
                          title={
                            a?.sdc?.label && (
                              <h3>{a?.sdc?.info?.DESCRIPTION}</h3>
                            )
                          }
                        >
                          <TableCell sx={{ minWidth: 60 }}>
                            <Autocomplete
                              value={a.sdc}
                              fullWidth={true}
                              autoHighlight
                              size="small"
                              options={sdcOptions}
                              onChange={(e, value) => handleSdc(e, value, i)}
                              renderInput={(params) => (
                                <TextField {...params} label="" />
                              )}
                            />
                          </TableCell>
                        </Tooltip>
                        <TableCell sx={{ minWidth: 130 }}>
                          <TextField
                            value={a.remark}
                            fullWidth={true}
                            size="small"
                            onChange={(e) => handleRemark(e, i)}
                          />
                        </TableCell>
                        <ErrTooltip
                          disableInteractive={true}
                          title={a?.bugMsgCNo && <h3>{a?.bugMsgCNo}</h3>}
                        >
                          <TableCell
                            sx={{
                              minWidth: 50,
                            }}
                          >
                            <TextField
                              value={a.cNo}
                              fullWidth={true}
                              error={!a.cNo || a?.bugCNo ? true : false}
                              id="txtRight"
                              disabled={
                                a.isCredit ||
                                !a.branch ||
                                !a?.accType?.value ||
                                !a.accNo
                                  ? true
                                  : false
                              }
                              size="small"
                              type="number"
                              onChange={(e) => handleCNo(e, i)}
                              onBlur={(e) => handleCNoBlur(e, i)}
                              // helperText={a?.bugMsgCNo ? a?.bugMsgCNo : ""}
                            />
                          </TableCell>
                        </ErrTooltip>
                        <ErrTooltip
                          disableInteractive={true}
                          title={a?.bugMsgDate && <h3>{a?.bugMsgDate}</h3>}
                        >
                          <TableCell sx={{ minWidth: 140, maxWidth: "auto" }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                format="dd/MM/yyyy"
                                disabled={a.isCredit ? true : false}
                                value={a.date}
                                onChange={(e) => handleDate(e, i)}
                                onError={(e) => handleDateErr(e, i)}
                              />
                            </LocalizationProvider>
                          </TableCell>
                        </ErrTooltip>
                        <ErrTooltip
                          disableInteractive={true}
                          title={
                            Number(a.debit) <= 0 &&
                            !a?.isCredit &&
                            a.branch &&
                            a.trx?.code && <h3>Amount can't be zero</h3>
                          }
                        >
                          <TableCell sx={{ minWidth: 80 }}>
                            <TextField
                              value={a.debit}
                              fullWidth={true}
                              error={Number(a.debit) > 0 ? false : true}
                              id="txtRight"
                              size="small"
                              disabled={
                                a?.isCredit ||
                                !a.branch ||
                                !a.trx?.code ||
                                viewOnly
                                  ? true
                                  : false
                              }
                              type="number"
                              onChange={(e) => handleDebit(e, i)}
                              onBlur={(e) => handleDebitBlur(e, i)}
                            />
                          </TableCell>
                        </ErrTooltip>
                        <ErrTooltip
                          disableInteractive={true}
                          title={
                            Number(a.credit) <= 0 &&
                            a?.isCredit &&
                            a.branch &&
                            a.trx?.code && <h3>Amount can't be zero</h3>
                          }
                        >
                          <TableCell sx={{ minWidth: 80 }}>
                            <TextField
                              value={a.credit}
                              fullWidth={true}
                              error={Number(a.credit) > 0 ? false : true}
                              id="txtRight"
                              size="small"
                              disabled={
                                !a?.isCredit ||
                                !a.branch ||
                                !a.trx?.code ||
                                viewOnly
                                  ? true
                                  : false
                              }
                              type="number"
                              onChange={(e) => handleCredit(e, i)}
                              onBlur={(e) => handleCreditBlur(e, i)}
                            />
                          </TableCell>
                        </ErrTooltip>

                        <TableCell
                          style={{ border: "0px" }}
                          // width: "10px"
                          sx={{ minWidth: 20 }}
                        >
                          {(rows[i].trx?.code == "3" ||
                            rows[i].trx?.code == "6") && (
                            <Button
                              color="secondary"
                              onClick={(e) => handleClear(e, i)}
                              size="small"
                            >
                              <CancelIcon />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  );
                })}
            </Table>
          </TableContainer>
        )}
      </Card>
      {!viewOnly && (
        <div>
          {!loading && (
            <Button
              variant="contained"
              color="secondary"
              sx={{ margin: "8px" }}
              onClick={() => handleScrollSave1()}
            >
              Post
              {/* {t("Save")} */}
            </Button>
          )}

          {(rows[0]?.trx?.code == "3" || rows[0]?.trx?.code == "6") && (
            <Button
              variant="outlined"
              color="secondary"
              sx={{ margin: "8px" }}
              onClick={() => handleAddRow()}
            >
              <AddIcon /> new row
            </Button>
          )}

          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setResetDialog(true)}
          >
            <RestartAltIcon /> reset
          </Button>
        </div>
      )}

      <br />
      <CommonFooter
        viewOnly={viewOnly}
        filteredRows={filteredRows}
        handleFilterByScroll={handleFilterByScroll}
        handleViewAll={handleViewAll}
        handleRefresh={handleReset}
      />

      <>
        {Boolean(resetDialog) ? (
          <PopupMessageAPIWrapper
            MessageTitle="Table Reset"
            Message="Do you wish to reset?"
            onActionYes={() => handleReset()}
            onActionNo={() => setResetDialog(false)}
            rows={[]}
            open={resetDialog}
            // loading={getData.isLoading}
          />
        ) : null}
        {Boolean(saveDialog) ? (
          <PopupMessageAPIWrapper
            MessageTitle="Save Confirmation"
            Message={scrollSaveHeading}
            onActionYes={() => handleScrollSave2()}
            onActionNo={() => setSaveDialog(false)}
            rows={[]}
            open={saveDialog}
            loading={saveScroll.isLoading}
          />
        ) : null}
        <Dialog
          maxWidth="sm"
          open={scrollSaveDialog}
          // onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            className="dialogTitle"
            style={{
              cursor: "move",
            }}
          >
            {isArray ? "Scroll" : "Transaction"} Saved
          </DialogTitle>
          <DialogContent>
            <br />
            {isArray && (
              <h4 style={{ minWidth: "250px", textAlign: "center" }}>
                Scroll No. {scrollSaveRes[0]?.SCROLL1}
              </h4>
            )}
            <h4 style={{ textAlign: "center" }}>
              Voucher No.{" "}
              {scrollSaveRes &&
                scrollSaveRes?.map((a) => {
                  return <span>{a?.TRAN_CD}, </span>;
                })}
            </h4>
          </DialogContent>

          <DialogActions className="dialogFooter">
            <Button
              className="dialogBtn"
              color="secondary"
              variant="contained"
              onClick={() => {
                setScrollSaveDialog(false);
                setScrollSaveRes([]);
              }}
            >
              Ok
            </Button>{" "}
          </DialogActions>
        </Dialog>
        <Dialog
          maxWidth="sm"
          open={accValidDialog}
          // onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle className="dialogTitle">A/C Info</DialogTitle>
          <DialogContent>
            <br />

            {accValidMsg?.split("\r")?.map((a, i) => {
              return (
                <>
                  <div style={{ minWidth: "300px" }}>{a}</div>
                  <br />
                </>
              );
            })}
          </DialogContent>

          <DialogActions className="dialogFooter">
            <Button
              className="dialogBtn"
              color="secondary"
              variant="contained"
              onClick={() => {
                setAccValidDialog(false);
                setAccValidMsg("");
              }}
            >
              Ok
            </Button>{" "}
          </DialogActions>
        </Dialog>{" "}
      </>
    </>
  );
};

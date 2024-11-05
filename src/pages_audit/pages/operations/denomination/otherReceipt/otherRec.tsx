import {
  ActionTypes,
  Alert,
  formatCurrency,
  getCurrencySymbol,
  GradientButton,
  GridMetaDataType,
  GridWrapper,
  queryClient,
  usePopupContext,
  usePropertiesConfigContext,
  utilFunction,
} from "@acuteinfo/common-base";
import * as API from "./api";
import { useMutation, useQuery } from "react-query";
import {
  Fragment,
  useCallback,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import { AuthContext } from "pages_audit/auth";
import { otherReceiptMetadata } from "./metadata";
import DailyTransTabs from "../../DailyTransaction/TRNHeaderTabs";
import { useLocation } from "react-router-dom";
import { useCacheWithMutation } from "../../DailyTransaction/TRNHeaderTabs/cacheMutate";
import * as CommonAPI from "../api";
import { format, parse } from "date-fns";
import { enqueueSnackbar } from "notistack";
import { Box, Paper } from "@mui/material";
import TellerDenoTableCalc from "../tellerTransaction/singleTypeTable/tellerDenoTableCalc";
import DualTableCalc from "../tellerTransaction/dualTypeTable/dualTableCalc";

const actions: ActionTypes[] = [
  {
    actionName: "denomination",
    actionLabel: "Denomination",
    multiple: false,
    rowDoubleClick: true,
  },
];

const OtherReceipt = ({ screenFlag, setCloseOthRec }) => {
  const [rowData, setRowData] = useState<any>([]);
  const [cardTabsReq, setCardTabsReq] = useState({});
  const [cardDetails, setCardDetails] = useState([]);
  const [openDeno, setOpenDeno] = useState(false);
  const [denoData, setDenoData] = useState(false);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { authState } = useContext(AuthContext);
  const controllerRef = useRef<AbortController>();
  const currentPath = useLocation()?.pathname;
  const customParameter = usePropertiesConfigContext();
  const { denoTableType, dynamicAmountSymbol, currencyFormat, decimalCount } =
    customParameter;
  const {
    clearCache: clearTabsCache,
    error: tabsErorr,
    data: tabsDetails,
    setData: setTabsDetails,
    fetchData: fetchTabsData,
    isError: isTabsError,
    isLoading: isTabsLoading,
  } = useCacheWithMutation("cashPaymentEntry", CommonAPI.getTabsByParentType);

  const otherRecGridReq = {
    COMP_CD: authState?.companyID ?? "",
    BRANCH_CD: authState?.user?.branchCode ?? "",
    WORKING_DATE: authState?.workingDate ?? "",
  };

  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(["otherReceiptData", otherRecGridReq], () =>
    API?.getOtherReceipt(otherRecGridReq)
  );

  const getCarousalCards = useMutation(CommonAPI.getCarousalCards, {
    onSuccess: (data) => {
      setCardDetails(data);
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
      setCardDetails([]);
    },
  });

  const getDenoData: any = useMutation(CommonAPI.CashReceiptEntrysData, {
    onSuccess: (response: any, variables?: any) => {
      CloseMessageBox();
      setOpenDeno(true);
      if (response?.length > 0) {
        setDenoData(response);
      }
    },
    onError: (error: any, variables?: any) => {
      CloseMessageBox();
    },
  });

  const setCurrentAction = useCallback(async (data) => {
    let row = data?.rows[0]?.data;
    setRowData(row);
    if (data?.name === "_rowChanged") {
      let obj: any = {
        COMP_CD: row?.COMP_CD,
        ACCT_TYPE: row?.ACCT_TYPE,
        ACCT_CD: row?.ACCT_CD,
        PARENT_TYPE: row?.PARENT_TYPE ?? "",
        PARENT_CODE: row?.PARENT_CODE ?? "",
        BRANCH_CD: row?.BRANCH_CD,
      };
      setCardTabsReq(obj);
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
    } else if (data?.name === "denomination") {
      const msgBoxRes = await MessageBox({
        messageTitle: "Confirmation",
        message: "Proceed?",
        defFocusBtnName: "Yes",
        icon: "CONFIRM",
        buttonNames: ["Yes", "No"],
        loadingBtnName: ["Yes"],
      });
      if (msgBoxRes === "Yes") {
        const formattedDate = format(
          parse(authState?.workingDate, "dd/MMM/yyyy", new Date()),
          "dd/MMM/yyyy"
        )?.toUpperCase();
        getDenoData?.mutate({
          COMP_CD: authState?.companyID ?? "",
          BRANCH_CD: authState?.user?.branchCode ?? "",
          USER_NAME: authState?.user?.id ?? "",
          TRAN_DT: formattedDate,
        });
      }
    }
  }, []);

  const onSaveData = (value) => {
    setOpenDeno(value);
    refetch();
  };

  const denoTableClose = () => {
    setOpenDeno(false);
  };

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["otherReceiptData", otherRecGridReq]);
    };
  }, []);

  const getFomattedCurrency = (values) => {
    const formatedValue = formatCurrency(
      parseFloat(values || "0"),
      getCurrencySymbol(dynamicAmountSymbol),
      currencyFormat,
      decimalCount
    );
    return formatedValue;
  };

  const headingWithButton = (
    <Box
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {utilFunction.getDynamicLabel(currentPath, authState?.menulistdata, true)}
      <Box>
        <GradientButton onClick={() => setCloseOthRec(false)}>
          Normal Receipt
        </GradientButton>
      </Box>
    </Box>
  );

  return (
    <>
      <DailyTransTabs
        heading={headingWithButton as any}
        tabsData={tabsDetails}
        cardsData={cardDetails}
        reqData={cardTabsReq}
      />
      {isError ? (
        <Fragment>
          <Alert
            severity={error?.severity ?? "error"}
            errorMsg={error?.error_msg ?? "Error"}
            errorDetail={error?.error_detail ?? ""}
          />
        </Fragment>
      ) : null}
      <Paper sx={{ margin: "10px" }}>
        <GridWrapper
          key={`otherReceipt` + isLoading}
          finalMetaData={otherReceiptMetadata as GridMetaDataType}
          data={data ?? []}
          loading={
            isLoading ||
            isFetching ||
            isTabsLoading ||
            getCarousalCards?.isLoading
          }
          setData={() => {}}
          actions={actions}
          setAction={setCurrentAction}
          hideHeader={false}
          controlsAtBottom={true}
          refetchData={() => refetch()}
          disableMultipleRowSelect={true}
          enableExport={true}
          defaultSelectedRowId={data?.length > 0 ? data?.[0]?.TRAN_CD : ""}
        />
      </Paper>
      {Boolean(openDeno) && denoTableType === "single" ? (
        <TellerDenoTableCalc
          displayTable={openDeno}
          setOpenDenoTable={onSaveData}
          formData={rowData}
          data={denoData ?? []}
          isLoading={false}
          onCloseTable={denoTableClose}
          initRemainExcess={rowData?.AMOUNT ?? "0"}
          gridLable={
            "Cash Receipt" +
            `[${rowData?.TYPE_CD?.trim()}]` +
            "-" +
            "Remarks:" +
            rowData?.REMARKS +
            "-" +
            "A/C No.:" +
            rowData?.COMP_CD?.trim() +
            rowData?.BRANCH_CD?.trim() +
            rowData?.ACCT_TYPE?.trim() +
            rowData?.ACCT_CD?.trim() +
            "-" +
            rowData?.ACCT_NM +
            "-" +
            "Receipt Amount:" +
            getFomattedCurrency(rowData?.AMOUNT)
          }
          // screenRef={"TRN/040"}
          // entityType={"SINGLEPAY"}
          screenFlag={screenFlag}
          typeCode={"1"}
          setCount={() => {}}
        />
      ) : null}
      {Boolean(openDeno) && denoTableType === "dual" ? (
        <DualTableCalc
          data={denoData ?? []}
          displayTableDual={openDeno}
          // displayTable={openDenoTable}
          formData={rowData}
          initRemainExcess={rowData?.AMOUNT ?? "0"}
          gridLable={`Payment Single Denomination : ${getFomattedCurrency(
            rowData?.AMOUNT
          )}`}
          isLoading={false}
          onCloseTable={denoTableClose}
          // screenRef={"TRN/041"}
          // entityType={"MULTIRECPAY"}
          screenFlag={screenFlag}
          typeCode={"1"}
          setCount={() => {}}
          setOpenDenoTable={onSaveData}
        />
      ) : null}
    </>
  );
};

export default OtherReceipt;

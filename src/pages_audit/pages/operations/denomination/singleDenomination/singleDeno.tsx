import { useContext, useEffect, useRef, useState } from "react";
import { denoTableMetadataTotal } from "../metadataTeller";
import { AuthContext } from "pages_audit/auth";
import DailyTransTabs from "../../DailyTransaction/TRNHeaderTabs";
import { useCacheWithMutation } from "../../DailyTransaction/TRNHeaderTabs/cacheMutate";
import * as CommonApi from "pages_audit/pages/operations/DailyTransaction/TRNCommon/api";
import { LinearProgress } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "react-query";
import {
  usePopupContext,
  FormWrapper,
  MetaDataType,
  GridMetaDataType,
  ActionTypes,
  queryClient,
} from "@acuteinfo/common-base";
export const SingleDeno = () => {
  const myFormRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const [cardDetails, setCardDetails] = useState([]);
  const [cardTabsReq, setCardTabsReq] = useState({});
  const [singleDenoRows, setSingleDenoRows] = useState({
    singleDenoRow: [
      {
        BRANCH_CD: authState?.user?.branchCode,
        ACCT_TYPE: "",
        ACCT_CD: "",
      },
    ],
    RECEIPT_TOTAL: "0",
  });
  const [arrFieldData, setArrFieldData] = useState<any>({});
  const {
    clearCache: clearTabsCache,
    error: tabsErorr,
    data: tabsDetails,
    setData: setTabsDetails,
    fetchData: fetchTabsData,
    isError: isTabsError,
    isLoading: isTabsLoading,
  } = useCacheWithMutation(
    "getTabsByParentTypeKeySingleDeno",
    CommonApi.getTabsByParentType
  );
  // console.log(isTabsError, tabsErorr, "rdjnbvoidvkmvdknmvvkmdv");

  const getCarousalCards = useMutation(CommonApi.getCarousalCards, {
    onSuccess: (data) => {
      setCardDetails(data);
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.error_msg, {
        variant: "error",
      });
    },
  });
  useEffect(() => {
    if (Boolean(arrFieldData)) {
      // console.log(arrFieldData, "arrFieldData8008821");
      if (
        Boolean(authState?.companyID) &&
        Boolean(arrFieldData?.BRANCH_CD) &&
        Boolean(arrFieldData?.ACCT_TYPE)
      ) {
        // console.log(arrFieldData, "arrFieldData666666666");
        const req = {
          COMP_CD: authState?.companyID,
          BRANCH_CD: arrFieldData?.BRANCH_CD,
          ACCT_TYPE: arrFieldData?.ACCT_TYPE,
        };
        fetchTabsData({
          cacheId: req,
          reqData: req,
        });
      }
      if (
        Boolean(authState?.companyID) &&
        Boolean(arrFieldData?.BRANCH_CD) &&
        Boolean(arrFieldData?.ACCT_TYPE) &&
        Boolean(arrFieldData?.ACCT_CD)
      ) {
        const req = {
          COMP_CD: authState?.companyID,
          BRANCH_CD: arrFieldData?.BRANCH_CD,
          ACCT_TYPE: arrFieldData?.ACCT_TYPE,
          ACCT_CD: arrFieldData?.ACCT_CD,
          PARENT_TYPE: "",
        };
        getCarousalCards.mutate({ reqData: req });
      }
    }
  }, [arrFieldData]);
  const handleSubmit = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    endSubmit(true);
    // console.log(
    //   "it's work!!",
    //   data,
    //   displayData,
    //   endSubmit,
    //   setFieldError,
    //   actionFlag
    // );
  };

  useEffect(() => {
    if (Boolean(isTabsError)) {
      enqueueSnackbar((tabsErorr as any)?.error_msg, {
        variant: "error",
      });
    }
  }, [isTabsError, tabsErorr]);

  // useEffect(() => {
  //   console.log(arrFieldData, "arrFieldData++>>");
  // }, [arrFieldData]);

  const onArrayFieldRowClickHandle = (rowData) => {
    // console.log("wkiuieufhiweiufhwe", rowData);
    if (Object?.keys(rowData)?.length > 0) {
      setArrFieldData(rowData);
    }
  };

  return (
    <>
      <DailyTransTabs
        heading="Single Denomination(TRN/042)"
        cardsData={cardDetails}
        reqData={cardTabsReq}
        tabsData={tabsDetails}
      />
      {isTabsLoading || getCarousalCards?.isLoading ? (
        <LinearProgress
          color="secondary"
          sx={{ margin: "0px 10px 0px 10px" }}
        />
      ) : null}
      <FormWrapper
        onSubmitHandler={handleSubmit}
        initialValues={singleDenoRows ?? {}}
        key={"single-deno"}
        metaData={denoTableMetadataTotal as MetaDataType}
        formStyle={{}}
        hideHeader={true}
        formState={{
          MessageBox: MessageBox,
          onArrayFieldRowClickHandle: onArrayFieldRowClickHandle,
        }}
        setDataOnFieldChange={(action, payload) => {
          if (action === "ACCT_CD") {
            if (payload?.carousalCardData) {
              setCardDetails(payload?.carousalCardData);
            }
            if (payload) {
              const { dependentFieldValues, accountCode } = payload;
              // console.log(
              //   dependentFieldValues,
              //   "dependentFieldValues",
              //   "payload",
              //   accountCode
              // );
              setCardTabsReq({
                COMP_CD: authState?.companyID,
                ACCT_TYPE:
                  dependentFieldValues?.["singleDenoRow.ACCT_TYPE"]?.value,
                ACCT_CD: accountCode,
                PARENT_TYPE:
                  dependentFieldValues?.["singleDenoRow.ACCT_TYPE"]
                    ?.optionData?.[0]?.PARENT_TYPE,
                PARENT_CODE:
                  dependentFieldValues?.["singleDenoRow.ACCT_TYPE"]
                    ?.optionData?.[0]?.PARENT_CODE,
                BRANCH_CD:
                  dependentFieldValues?.["singleDenoRow.BRANCH_CD"]?.value,
                SCREEN_REF: "TRN/042",
              });
            }
          } else if (action === "ACCT_TYPE") {
            // console.log(action, payload, "polod");
            if (Boolean(payload?.currentField?.value)) {
              const tabApiReqPara = {
                COMP_CD: authState?.companyID,
                BRANCH_CD: payload?.branchCode,
                ACCT_TYPE: payload?.currentField?.value,
              };
              fetchTabsData({
                cacheId: tabApiReqPara,
                reqData: tabApiReqPara,
              });
            }
          } else if (action === "RECEIPT") {
          }
        }}
        ref={myFormRef}
      />
    </>
  );
};

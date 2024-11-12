import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { denoTableMetadataTotal } from "./metadata";
import { AuthContext } from "pages_audit/auth";
import DailyTransTabs from "../../DailyTransaction/TRNHeaderTabs";
import { useCacheWithMutation } from "../../DailyTransaction/TRNHeaderTabs/cacheMutate";
import * as CommonApi from "../api";
import { LinearProgress } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "react-query";
import DualTableCalc from "../tellerTransaction/dualTypeTable/dualTableCalc";
import * as API from "./api";
import TellerDenoTableCalc from "../tellerTransaction/singleTypeTable/tellerDenoTableCalc";
import { format, parse } from "date-fns";
import { formatCurrency } from "@acuteinfo/common-base";
import {
  usePopupContext,
  FormWrapper,
  MetaDataType,
  getCurrencySymbol,
  usePropertiesConfigContext,
} from "@acuteinfo/common-base";
import ReleaseMainGrid from "./release/releaseMainGrid";
import OtherReceipt from "../otherReceipt/otherRec";

////////////////////PENDING TO IMPLEMENT MULTI SROW SELECTION IN OTHER RECEIPT IN SINGLE DENOMINATION SCREEN/////////////////////////////

export const SingleDeno = ({ screenFlag }) => {
  const myFormRef = useRef<any>(null);
  const prevCardReq = useRef<any>(null);
  const endSubmitRef = useRef<any>(null);
  const cardDtlRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const { MessageBox } = usePopupContext();
  const customParameter = usePropertiesConfigContext();
  const [cardDetails, setCardDetails] = useState([]);
  const [cardTabsReq, setCardTabsReq] = useState({});
  const [openDenoTable, setOpenDenoTable] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [singleDenoRows, setSingleDenoRows] = useState({
    singleDenoRow: [
      {
        BRANCH_CD: authState?.user?.branchCode,
      },
    ],
  });
  const [arrFieldData, setArrFieldData] = useState<any>({});
  const [openGrid, setOpenGrid] = useState<any>(false);
  const [openOthRec, setOpenOthRec] = useState<any>(false);
  const [count, setCount] = useState(0);
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
  const { denoTableType, dynamicAmountSymbol, currencyFormat, decimalCount } =
    customParameter;
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
        if (JSON.stringify(req) !== JSON.stringify(prevCardReq.current)) {
          getCarousalCards.mutate({ reqData: req });
          prevCardReq.current = req;
        }
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
    endSubmitRef.current = { endSubmit };
    if (Object?.keys(data)?.length > 0) {
      if (
        (Boolean(data?.FINAL_AMOUNT) &&
          Boolean(Number(data?.FINAL_AMOUNT) > 0)) ||
        (Boolean(data?.FINAL_AMOUNT) && Boolean(Number(data?.FINAL_AMOUNT) < 0))
      ) {
        setFormData(data);
        const formattedDate = format(
          parse(authState?.workingDate, "dd/MMM/yyyy", new Date()),
          "dd/MMM/yyyy"
        ).toUpperCase();
        getData?.mutate({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
          USER_NAME: authState?.user?.id,
          TRAN_DT: formattedDate,
          endSubmit: endSubmit,
        });
      } else {
        endSubmitRef?.current?.endSubmit(true);
        enqueueSnackbar(
          "Final amount must be either greater than or less than zero.",
          { variant: "error" }
        );
      }
    }
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

  const getData: any = useMutation(API.CashReceiptEntrysData, {
    onSuccess: (response: any, variables?: any) => {
      setOpenDenoTable(true);
      // variables?.endSubmit(true);
    },
    onError: (error: any, variables?: any) => {
      // variables?.endSubmit(true);
      enqueueSnackbar(error?.error_msg, {
        variant: "error",
      });
    },
  });

  const data: any = useMemo(() => {
    if (Array.isArray(getData.data)) {
      return [...getData.data];
    }
  }, [getData.data]);
  // useEffect(() => {
  //   // if(formData?.FINAL_AMOUNT && formData?.FINAL_AMOUNT > 0){
  //   //   {...formData,formData.TRN:"P"}
  //   // }
  // }, [formData?.FINAL_AMOUNT, formData]);

  const getFomattedCurrency = (values) => {
    const formatedValue = formatCurrency(
      parseFloat(values || "0"),
      getCurrencySymbol(dynamicAmountSymbol),
      currencyFormat,
      decimalCount
    );
    return formatedValue;
  };

  useEffect(() => {
    if (!getData?.isLoading) {
      endSubmitRef?.current?.endSubmit(true);
    }
  }, [getData?.isLoading]);

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
      "STATUS",
    ];

    const cardValues = keys?.reduce((acc, key) => {
      const item: any = cardDtlRef?.current?.find(
        (entry: any) => entry?.COL_NAME === key
      );
      acc[key] = item?.COL_VALUE;
      return acc;
    }, {});
    return cardValues;
  };

  useEffect(() => {
    if (cardDetails?.length) {
      cardDtlRef.current = cardDetails;
    }
  }, [cardDetails]);

  return (
    <>
      {Boolean(openGrid) ? (
        <ReleaseMainGrid setOpenGrid={setOpenGrid} />
      ) : Boolean(openOthRec) ? (
        <OtherReceipt
          screenFlag={"SINGLERECOTHER"}
          setCloseOthRec={setOpenOthRec}
        />
      ) : (
        <>
          <DailyTransTabs
            heading="Single Denomination(TRN/042)"
            cardsData={cardDetails}
            reqData={cardTabsReq}
            tabsData={tabsDetails}
          />
          {isTabsLoading ||
          getCarousalCards?.isLoading ||
          getData?.isLoading ? (
            <LinearProgress
              color="secondary"
              sx={{ margin: "0px 10px 0px 10px" }}
            />
          ) : null}

          <FormWrapper
            onSubmitHandler={handleSubmit}
            initialValues={singleDenoRows ?? {}}
            key={
              "single-deno" + denoTableMetadataTotal + singleDenoRows + count
            }
            metaData={denoTableMetadataTotal as MetaDataType}
            formStyle={{}}
            hideHeader={true}
            formState={{
              MessageBox: MessageBox,
              onArrayFieldRowClickHandle: onArrayFieldRowClickHandle,
              setCardDetails,
              docCD: "TRN/042",
              getCardColumnValue,
            }}
            onFormButtonClickHandel={(buttonId) => {
              if (buttonId === "DENOBTN") {
                let event: any = { preventDefault: () => {} };
                myFormRef?.current?.handleSubmit(event, "SAVE");
              } else if (buttonId === "RELEASE") {
                setOpenGrid(true);
              } else if (buttonId === "OTHER_REC") {
                setOpenOthRec(true);
              }
              // else if (id === "ADDNEWROW") {
              //   //@ts-ignore
              //   setSingleDenoRows((oldRow) => {
              //     console.log(oldRow,'oldROW>>',oldRow?.singleDenoRow[0]);
              //     return {
              //       ...oldRow,
              //       singleDenoRow: [
              //         ...oldRow?.singleDenoRow,
              //         {
              //           ...oldRow?.singleDenoRow[0],
              //           BRANCH_CD: authState?.user?.branchCode,
              //         },
              //       ],
              //     };
              //   });
              // }
            }}
            setDataOnFieldChange={(action, payload) => {
              if (action === "ACCT_CD") {
                if (payload?.carousalCardData) {
                  setCardDetails(payload?.carousalCardData);
                }
                if (payload) {
                  const { dependentFieldValues, accountCode } = payload;
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
                    SCREEN_REF: "TRN/041",
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
              }
            }}
            ref={myFormRef}
          />
        </>
      )}
      {/* <DialogActions>
        {" "}
        <GradientButton
          // ref={buttonRef}
          style={{ marginRight: "5px", color: "var(--theme-color2)" }}
          onClick={(event) => {
            myFormRef?.current?.handleSubmit(event, "SAVE");
          }}
          color={"primary"}
          disabled={false}
        >
          Denomination
        </GradientButton>
      </DialogActions> */}
      {openDenoTable && denoTableType === "dual" && (
        <DualTableCalc
          data={data ?? []}
          displayTableDual={openDenoTable}
          // displayTable={openDenoTable}
          formData={formData}
          initRemainExcess={Math.abs(formData?.FINAL_AMOUNT ?? "0")}
          gridLable={
            formData?.FINAL_AMOUNT > 0
              ? `Receipt Single Denomination : ${getFomattedCurrency(
                  formData?.FINAL_AMOUNT
                )}`
              : `Payment Single Denomination : ${getFomattedCurrency(
                  formData?.FINAL_AMOUNT
                )}`
          }
          isLoading={false}
          onCloseTable={() => setOpenDenoTable(false)}
          // screenRef={"TRN/041"}
          // entityType={"MULTIRECPAY"}
          screenFlag={screenFlag}
          typeCode={formData?.FINAL_AMOUNT > 0 ? "1" : "4"}
          setCount={setCount}
          setOpenDenoTable={setOpenDenoTable}
        />
      )}
      {openDenoTable && denoTableType === "single" && (
        <TellerDenoTableCalc
          data={data ?? []}
          // displayTableDual={openDenoTable}
          displayTable={openDenoTable}
          setOpenDenoTable={setOpenDenoTable}
          formData={formData}
          initRemainExcess={Math.abs(formData?.FINAL_AMOUNT ?? "0")}
          gridLable={
            formData?.FINAL_AMOUNT > 0
              ? `Receipt Single Denomination : ${getFomattedCurrency(
                  formData?.FINAL_AMOUNT
                )}`
              : `Payment Single Denomination : ${getFomattedCurrency(
                  formData?.FINAL_AMOUNT
                )}`
          }
          isLoading={getData?.isLoading}
          onCloseTable={() => setOpenDenoTable(false)}
          // screenRef={"TRN/041"}
          // entityType={"MULTIRECPAY"}
          screenFlag={screenFlag}
          setCount={setCount}
          typeCode={formData?.FINAL_AMOUNT > 0 ? "1" : "4"}
        />
      )}
    </>
  );
};

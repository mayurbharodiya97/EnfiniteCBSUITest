import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  denoTableMetadataTotal,
  releaseGridMetaData,
  releaseSubGridMetaData,
} from "../metadataTeller";
import { AuthContext } from "pages_audit/auth";
import DailyTransTabs from "../../DailyTransaction/TRNHeaderTabs";
import { useCacheWithMutation } from "../../DailyTransaction/TRNHeaderTabs/cacheMutate";
import * as CommonApi from "pages_audit/pages/operations/DailyTransaction/TRNCommon/api";
import { Box, Dialog, DialogActions, Fab, LinearProgress } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "react-query";
import DualTableCalc from "../dualTableCalc";
import * as API from "../api";
import TellerDenoTableCalc from "../tellerDenoTableCalc";
import { format, parse } from "date-fns";
import { Alert, formatCurrency, GridWrapper } from "@acuteinfo/common-base";
import {
  usePopupContext,
  FormWrapper,
  MetaDataType,
  GridMetaDataType,
  ActionTypes,
  queryClient,
  utilFunction,
  getCurrencySymbol,
  usePropertiesConfigContext,
} from "@acuteinfo/common-base";

const actions: ActionTypes[] = [
  {
    actionName: "cancle",
    actionLabel: "Cancel",
    multiple: false,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "release",
    actionLabel: "Release",
    multiple: true,
    rowDoubleClick: true,
  },
];
const releaseSubActions: ActionTypes[] = [
  {
    actionName: "cancle",
    actionLabel: "Cancel",
    multiple: false,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
];

const releaseAction = {
  actionName: "release",
  actionLabel: "Release",
  multiple: true,
  rowDoubleClick: true,
  alwaysAvailable: true,
};

export const SingleDeno = () => {
  const myFormRef = useRef<any>(null);
  const prevCardReq = useRef<any>(null);
  const endSubmitRef = useRef<any>(null);
  const cardDtlRef = useRef<any>(null);
  const releaseSubRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
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
  const [releaseSubGrid, setReleaseSubGrid] = useState<any>(false);
  const [releaseData, setReleaseData] = useState<any>([]);
  const [releaseSubData, setReleaseSubData] = useState<any>([]);
  const [releaseSubAction, setReleaseSubAction] =
    useState<any>(releaseSubActions);
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
        if (data?.FINAL_AMOUNT > 0) {
          data.TRN = "1";
        } else if (data?.FINAL_AMOUNT < 0) {
          data.TRN = "4";
        }
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
  const releaseGridData: any = useMutation(API?.getReleaseGridData, {
    onSuccess: (response: any, variables?: any) => {
      // variables?.endSubmit(true);
      if (response?.length > 0) {
        setReleaseData(response);
      }
    },
    onError: (error: any, variables?: any) => {
      // variables?.endSubmit(true);
      enqueueSnackbar(error?.error_msg, {
        variant: "error",
      });
    },
  });

  const releaseSubGridData: any = useMutation(API?.getReleaseSubGridData, {
    onSuccess: (response: any, variables?: any) => {
      // variables?.endSubmit(true);
      if (response?.length > 0) {
        setReleaseSubData(response);
      }
    },
    onError: (error: any, variables?: any) => {
      // variables?.endSubmit(true);
      enqueueSnackbar(error?.error_msg, {
        variant: "error",
      });
    },
  });
  const releaseRecords: any = useMutation(API?.releaseRecords, {
    onSuccess: (response: any, variables?: any) => {
      if (response?.length > 0) {
        setReleaseSubGrid(false);
        setReleaseSubData([]);
        CloseMessageBox();
      }
    },
    onError: (error: any, variables?: any) => {
      setReleaseSubGrid(false);
      setReleaseSubData([]);
      CloseMessageBox();
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

  const setCurrentAction = useCallback(
    (data) => {
      const row = data?.rows[0]?.data;
      if (data?.name === "cancle") {
        setOpenGrid(false);
      }
      if (data?.name === "release") {
        setReleaseSubGrid(true);
        releaseSubGridData?.mutate({
          ENTERED_COMP_CD: row?.ENTERED_COMP_CD,
          ENTERED_BRANCH_CD: row?.ENTERED_BRANCH_CD,
          MCT_TRAN_CD: row?.MCT_TRAN_CD,
        });
      }
    },
    [actions]
  );
  const rlsSubCurrentAction = useCallback(
    async (data) => {
      const row = data?.rows;
      if (data?.name === "cancle") {
        setReleaseSubGrid(false);
        setReleaseSubData([]);
      } else if (data?.name === "release") {
        const gridData = releaseSubRef?.current?.cleanData?.();
        const msgBoxRes = await MessageBox({
          messageTitle: "Alert",
          message: `Are you sure to release Reference No.${
            gridData?.[0]?.MCT_TRAN_CD ?? ""
          }?`,
          defFocusBtnName: "Yes",
          icon: "INFO",
          buttonNames: ["Yes", "No"],
          loadingBtnName: ["Yes"],
        });

        if (msgBoxRes === "Yes") {
          // const parsedDate = parse(
          //   gridData?.[0]?.TRAN_DT,
          //   "yyyy/MM/dd",
          //   new Date()
          // );
          // const formattedDate = format(parsedDate, "dd/MMM/yyyy");
          const parsedDate = parse(
            gridData?.[0]?.TRAN_DT,
            "yyyy-MM-dd HH:mm:ss.S",
            new Date()
          );

          // Format the parsed date to your desired format
          const formattedDate = format(parsedDate, "dd/MMM/yyyy");
          const requestPara = {
            TRAN_DT: formattedDate ?? "",
            ENTERED_COMP_CD: gridData?.[0]?.ENTERED_COMP_CD ?? "",
            ENTERED_BRANCH_CD: gridData?.[0]?.ENTERED_BRANCH_CD ?? "",
            SCREEN_REF: "TRN/041",
            TRANSACTION_DTL: gridData
              ?.map((record) => {
                return {
                  DAILY_TRN_CD: record?.DAILY_TRN_CD ?? "",
                  MCT_TRAN_CD: record?.MCT_TRAN_CD ?? "",
                  DELETE_FLAG: record?.DELETE_FLAG ?? "",
                };
              })
              ?.filter((record) => record?.DELETE_FLAG === "Y"),
          };
          releaseRecords?.mutate(requestPara);
        } else {
          CloseMessageBox();
          setReleaseSubGrid(false);
        }
      }
    },
    [releaseSubAction]
  );

  useEffect(() => {
    // console.log(releaseSubData, "console.log");
    // if (releaseSubData?.length > 0) {
    //   const conditionBoolean = releaseSubData?.some(
    //     (item) => item?.DELETE_FLAG === "Y"
    //   );
    //   console.log(conditionBoolean, "conditionBoolean");
    //   const newAction = releaseSubAction;
    //   if (Boolean(conditionBoolean)) {
    //     // if (newAction?.some((item) => item?.actionName !== "release")) {
    //     //   newAction?.push({
    //     //     actionName: "release",
    //     //     actionLabel: "Release",
    //     //     multiple: true,
    //     //     rowDoubleClick: true,
    //     //     alwaysAvailable: true,
    //     //   });
    //     // }
    //     // console.log(newAction, "newAction");
    //     // setReleaseSubAction((pre) => {
    //     //   console.log(pre, "pre");
    //     //   // if (pre?.some((item) => item?.actionName !== "release")) {
    //     //   //   return [
    //     //   //     ...pre,
    //     //   //     {
    //     //   //       actionName: "release",
    //     //   //       actionLabel: "Release",
    //     //   //       multiple: true,
    //     //   //       rowDoubleClick: true,
    //     //   //       alwaysAvailable: true,
    //     //   //     },
    //     //   //   ];
    //     //   // } else {
    //     //   //   return pre;
    //     //   // }
    //     // });

    //     setReleaseSubAction([...releaseSubAction, releaseAction]);
    //   } else {
    //     setReleaseSubAction(releaseSubAction);
    //     // newAction?.pop();
    //     // setReleaseSubAction([
    //     //   {
    //     //     actionName: "cancle",
    //     //     actionLabel: "Cancel",
    //     //     multiple: false,
    //     //     rowDoubleClick: false,
    //     //     alwaysAvailable: true,
    //     //   },
    //     // ]);
    //   }
    //   // setReleaseSubAction(newAction);
    // }

    const conditionBoolean = releaseSubData?.some(
      (item) => item?.DELETE_FLAG === "Y"
    );
    if (conditionBoolean) {
      setReleaseSubAction((prevActions) => {
        const isReleaseActionPresent = prevActions.some(
          (action) => action.actionName === "release"
        );

        if (!isReleaseActionPresent) {
          return [...prevActions, releaseAction];
        }
        return prevActions;
      });
    } else {
      setReleaseSubAction(releaseSubActions);
    }
  }, [releaseSubData]);

  return (
    <>
      <DailyTransTabs
        heading="Single Denomination(TRN/042)"
        cardsData={cardDetails}
        reqData={cardTabsReq}
        tabsData={tabsDetails}
      />
      {isTabsLoading || getCarousalCards?.isLoading || getData?.isLoading ? (
        <LinearProgress
          color="secondary"
          sx={{ margin: "0px 10px 0px 10px" }}
        />
      ) : null}
      {!Boolean(openGrid) ? (
        <FormWrapper
          onSubmitHandler={handleSubmit}
          initialValues={singleDenoRows ?? {}}
          key={"single-deno" + denoTableMetadataTotal + singleDenoRows}
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
              releaseGridData?.mutate({
                COMP_CD: authState?.companyID,
                BRANCH_CD: authState?.user?.branchCode,
              });
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
            }
          }}
          ref={myFormRef}
        />
      ) : (
        <Box margin={"0px 16px"}>
          {releaseGridData?.isError && (
            <Alert
              severity="error"
              errorMsg={
                releaseGridData?.error_msg ?? "Something went to wrong.."
              }
              errorDetail={releaseGridData?.error_detail}
              color="error"
            />
          )}
          <GridWrapper
            key={`releaseGridMetaData`}
            finalMetaData={releaseGridMetaData as GridMetaDataType}
            data={releaseData ?? []}
            loading={releaseGridData?.isLoading}
            setData={() => {}}
            actions={actions}
            setAction={setCurrentAction}
            hideHeader={true}
            controlsAtBottom={true}
          />
        </Box>
      )}
      {Boolean(releaseSubGrid) ? (
        <Dialog open={releaseSubGrid} maxWidth={"xl"}>
          <GridWrapper
            key={`releaseGridMetaData` + releaseSubAction}
            finalMetaData={releaseSubGridMetaData as GridMetaDataType}
            data={releaseSubData ?? []}
            loading={releaseSubGridData?.isLoading}
            setData={setReleaseSubData}
            actions={releaseSubAction}
            setAction={rlsSubCurrentAction}
            hideHeader={false}
            controlsAtBottom={true}
            ref={releaseSubRef}
          />
        </Dialog>
      ) : null}
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
          screenRef={"TRN/041"}
          entityType={"MULTIRECPAY"}
        />
      )}
      {openDenoTable && denoTableType === "single" && (
        <TellerDenoTableCalc
          data={data ?? []}
          // displayTableDual={openDenoTable}
          displayTable={openDenoTable}
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
          screenRef={"TRN/041"}
          entityType={"MULTIRECPAY"}
        />
      )}
    </>
  );
};

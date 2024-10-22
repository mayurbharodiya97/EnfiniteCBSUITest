import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { TellerScreenMetadata } from "./metaData";
import { useMutation } from "react-query";
import { AccDetailContext, AuthContext } from "pages_audit/auth";
import * as API from "../../api";
import { Dialog, Grid, LinearProgress, Paper, Typography } from "@mui/material";
import { cashReportMetaData } from "./metaData";
import { format, parse } from "date-fns";
import AccDetails from "pages_audit/pages/operations/DailyTransaction/TRNHeaderTabs/AccountDetails";
import { enqueueSnackbar } from "notistack";
import * as CommonApi from "../../api";
// import AccDtlCardSkeleton from "./acctDtlCardSkeleton";
// import { getCarousalCards } from "pages_audit/pages/operations/DailyTransaction/TRN001/Trn001";
// import {
//   SingleTableDataReducer,
//   SingleTableInititalState,
//   SingleTableActionTypes,
// } from "";
import { useCacheWithMutation } from "pages_audit/pages/operations/DailyTransaction/TRNHeaderTabs/cacheMutate";
import DailyTransTabs from "pages_audit/pages/operations/DailyTransaction/TRNHeaderTabs";
import { useLocation } from "react-router-dom";
import {
  usePopupContext,
  GradientButton,
  SubmitFnType,
  InitialValuesType,
  ActionTypes,
  FormWrapper,
  MetaDataType,
  usePropertiesConfigContext,
  ReportGrid,
  utilFunction,
} from "@acuteinfo/common-base";
import {
  SingleTableActionTypes,
  SingleTableDataReducer,
  SingleTableInititalState,
} from "../singleTypeTable/denoTableActionTypes";
import TellerDenoTableCalc from "../singleTypeTable/tellerDenoTableCalc";
import DualTableCalc from "../dualTypeTable/dualTableCalc";

const TellerScreen = ({ screenFlag }) => {
  const formRef: any = useRef(null);
  const viewTrnRef = useRef<any>(null);
  const endSubmitRef: any = useRef(null);
  const cardDtlRef = useRef<any>(null);
  const textFieldRef: any = useRef(null);
  const popupReqWrapperRef: any = useRef(null);
  const [state, dispatch] = useReducer(
    SingleTableDataReducer,
    SingleTableInititalState
  );
  const [cardDetails, setCardDetails] = useState([]);
  const [cardTabsReq, setCardTabsReq] = useState({});
  const [extraAccDtl, setExtraAccDtl] = useState<any>({});
  const [count, setCount] = useState(0);
  const { authState }: any = useContext(AuthContext);
  let currentPath = useLocation().pathname;
  const customParameter = usePropertiesConfigContext();
  const { denoTableType } = customParameter;
  // const { cardStore, setCardStore } = useContext(AccDetailContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const [btnLoading, setBtnLoading] = useState({
    table1: false,
    table2: false,
  });
  const {
    clearCache: clearTabsCache,
    error: tabsErorr,
    data: tabsDetails,
    setData: setTabsDetails,
    fetchData: fetchTabsData,
    isError: isTabsError,
    isLoading: isTabsLoading,
  } = useCacheWithMutation("cashReceiptEntry", CommonApi.getTabsByParentType);

  useEffect(() => {
    // Check if cardStore and cardsInfo are present and cardsInfo is an array
    if (cardDetails?.length > 0 && Array.isArray(cardDetails)) {
      // console.log(cardDetails, "cardDetailscardDetailscardDetails58586316352");
      const extraAccDtl = cardDetails.reduce((result, details: any) => {
        if (
          details?.COL_LABEL === "Name" ||
          details?.COL_LABEL === "A/c Number"
        ) {
          result[details?.COL_LABEL] = details?.COL_VALUE ?? "";
        }
        return result;
      }, {});

      setExtraAccDtl(extraAccDtl);
    }
  }, [cardDetails]);

  const getData: any = useMutation(API.CashReceiptEntrysData, {
    onSuccess: (response: any, variables?: any) => {
      // console.log(variables, "variables");
      CloseMessageBox();
      if (variables?.FLAG === "TABLE1") {
        dispatch({
          type: SingleTableActionTypes?.SET_DISP_TABLE,
          payload: true,
        });
        setBtnLoading((pre) => ({ ...pre, table1: false }));
      } else if (variables?.FLAG === "TABLE2") {
        dispatch({
          type: SingleTableActionTypes?.SET_DISP_TABLE_DUAL,
          payload: true,
        });
        setBtnLoading((pre) => ({ ...pre, table2: false }));
      }
    },
    onError: (error: any, variables?: any) => {
      enqueueSnackbar(error?.error_msg, {
        variant: "error",
      });
      if (variables?.FLAG === "TABLE1") {
        dispatch({
          type: SingleTableActionTypes?.SET_DISP_TABLE,
          payload: false,
        });
        setBtnLoading((pre) => ({ ...pre, table1: false }));
      } else if (variables?.FLAG === "TABLE2") {
        dispatch({
          type: SingleTableActionTypes?.SET_DISP_TABLE_DUAL,
          payload: false,
        });
        setBtnLoading((pre) => ({ ...pre, table2: false }));
      }
    },
  });

  const data: any = useMemo(() => {
    if (Array.isArray(getData.data)) {
      endSubmitRef?.current?.endSubmit(true);
      return [...getData.data];
    }
  }, [getData.data]);

  useEffect(() => {
    if (data?.length > 0) {
      // console.log(data?.[0]?.PAYMENT_LIMIT, "data?.[0]?.PAYMENT_LIMIT");
      setExtraAccDtl((prevExtraAccDtl) => ({
        ...prevExtraAccDtl,
        ...extraAccDtl,
        LIMIT: data?.[0]?.PAYMENT_LIMIT ?? "",
      }));
    }
  }, [data]);

  const onSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    // endSubmit(true);
    endSubmitRef.current = {
      data: { data },
      displayData,
      endSubmit,
      setFieldError,
    };
    if (actionFlag === "SAVE") {
      if (Boolean(data)) {
        dispatch({
          type: SingleTableActionTypes?.SET_FIELDS_DATA,
          payload: data,
        });
        // dispatch({
        //   type: SingleTableActionTypes?.SET_OPENACCTDTL_VAL,
        //   payload: true,
        // });

        setExtraAccDtl((prevExtraAccDtl) => ({
          ...prevExtraAccDtl,
          ...extraAccDtl,
          TRN_TYPE: screenFlag === "CASHREC" ? `1` : `4`,
          REMARKS: data?.REMARK ?? "",
        }));
      }
    }
  };

  // useEffect(() => {
  //   console.log(extraAccDtl, "52143215145145");
  // }, [extraAccDtl]);

  //initial value set in available note and balance column
  // useEffect(() => {
  //   let initAvailNote: any = [];
  //   let initBalance: any = [];
  //   data?.map((notes) => {
  //     initAvailNote.push(notes?.AVAIL_QTY);
  //     initBalance.push(notes?.AVAIL_VAL);
  //   });
  //   dispatch({
  //     type: SingleTableActionTypes?.SET_AVAIL_NOTE,
  //     payload: initAvailNote,
  //   });
  //   dispatch({
  //     type: SingleTableActionTypes?.SET_BAL_VAL,
  //     payload: initBalance,
  //   });
  //   // dispatch({
  //   //   type: SET_REMAINEXCESS_VAL,
  //   //   payload: Boolean(state?.fieldsData?.TRN === "R")
  //   //     ? state?.fieldsData?.RECEIPT
  //   //     : Boolean(state?.fieldsData?.TRN === "P")
  //   //     ? state?.fieldsData?.PAYMENT
  //   //     : "0",
  //   // });
  // }, [data, state?.openDeno]);

  // //for common function for set required table column totals
  // const getInitTotals = (getData) => {
  //   const finalTotal = {};

  //   for (let key in getData) {
  //     const newTotalAmount = Object.values(getData[key] || "0").reduce(
  //       (acc: any, val: any) => acc + (parseFloat(val) || 0),
  //       0
  //     );

  //     if (Boolean(state?.inputVal)) {
  //       finalTotal[key] = newTotalAmount;
  //     }
  //   }
  //   return finalTotal;
  // };

  // //set initial totals
  // useEffect(() => {
  //   const dataObj = {
  //     inputVal: "0",
  //     amount: "0",
  //     availNote: state?.availNote,
  //     balance: state?.balance,
  //   };
  //   const newValue = getInitTotals(dataObj);

  //   dispatch({
  //     type: SingleTableActionTypes?.SET_TOTAL_VAL,
  //     payload: newValue,
  //   });
  // }, [state?.availNote, state?.balance, state?.openDeno]);

  // useEffect(() => {
  //   dispatch({
  //     type: SingleTableActionTypes?.SET_INPUT_VAL,
  //     payload: {},
  //   });
  //   dispatch({
  //     type: SingleTableActionTypes?.SET_AMOUNT_VAL,
  //     payload: [],
  //   });
  // }, [state?.openDeno]);

  // //for aceept only numbers (positive and negative) without decimal
  // const sanitizedValue = (inputValue) => {
  //   if (inputValue.startsWith("-")) {
  //     return "-" + inputValue.replace(/[^0-9]/g, "");
  //   } else {
  //     return inputValue.replace(/[^0-9]/g, "");
  //   }
  // };

  // const handleChange = (event, index) => {
  //   //set sanitized value returned by sanitizedValue function (new value have only numbers (positive and negative) without decimal)
  //   let userInput = event.target.value;
  //   const sanitValue = sanitizedValue(userInput);
  //   let updatedValue = { ...state?.inputVal };
  //   updatedValue[index] = sanitValue;
  //   dispatch({
  //     type: SingleTableActionTypes?.SET_INPUT_VAL,
  //     payload: updatedValue,
  //   });

  //   //display Amout column value (multiplied value of denomination * note count)
  //   const multipliedValue = [...state?.amount];
  //   multipliedValue[index] =
  //     parseInt(sanitValue) * parseInt(data?.[index]?.DENO_VAL);
  //   dispatch({
  //     type: SingleTableActionTypes?.SET_AMOUNT_VAL,
  //     payload: multipliedValue,
  //   });
  // };

  const actions: ActionTypes[] = [
    {
      actionName: "Close",
      actionLabel: "Close",
      multiple: false,
      rowDoubleClick: false,
      alwaysAvailable: true,
    },
  ];

  const setCurrentAction = useCallback((data) => {
    if (data?.name === "Close") {
      dispatch({
        type: SingleTableActionTypes?.SET_VIEWACCTDETAILS_VAL,
        payload: false,
      });
    }
  }, []);

  const handleCloseDialog = () => {
    dispatch({
      type: SingleTableActionTypes?.SET_VIEWACCTDETAILS_VAL,
      payload: false,
    });
  };

  // const handleBlurLogic = (event, index) => {
  //   dispatch({
  //     type: SingleTableActionTypes?.SET_DIS_ERR_VAL,
  //     payload: {
  //       index: index,
  //       message: null,
  //     },
  //   });
  // };

  // const handleonBlur = async (event, index) => {
  //   if (Boolean(event?.target?.value === "-")) {
  //     state.inputVal[index] = "";
  //   }
  //   const dataForTotal = {
  //     inputVal: state?.inputVal || "0",
  //     amount: state?.amount || "0",
  //     availNote: state?.availNote || "0",
  //     balance: state?.balance || "0",
  //   };

  //   const newValue = getInitTotals(dataForTotal);
  //   dispatch({
  //     type: SingleTableActionTypes?.SET_TOTAL_VAL,
  //     payload: newValue,
  //   });

  //   // if (state?.remainExcess === 0) {
  //   //   // dispatch({
  //   //   //   type: SingleTableActionTypes?.SET_CONFIRMATION_VAL,
  //   //   //   payload: true,
  //   //   // });
  //   //   const res = await MessageBox({
  //   //     messageTitle: "Confirmation",
  //   //     message: "All Transaction are Completed Want to Proceed ?",
  //   //     //@ts-ignore
  //   //     buttonNames: ["Yes", "No"],
  //   //     defFocusBtnName: "Yes",
  //   //     // loadingBtnName: ["Yes"],
  //   //     icon: "INFO",
  //   //   });
  //   //   if (res === "Yes") {
  //   //     console.log("form Submitted");
  //   //   } else if (res === "No") {
  //   //     CloseMessageBox();
  //   //   }
  //   // } else {
  //   //   // dispatch({
  //   //   //   type: SingleTableActionTypes?.SET_CONFIRMATION_VAL,
  //   //   //   payload: false,
  //   //   // });
  //   //   CloseMessageBox();
  //   // }

  //   if (
  //     state?.fieldsData?.TRN === "R" &&
  //     state?.amount[index] < 0 &&
  //     Math.abs(state?.amount[index]) > data[index]?.AVAIL_VAL
  //   ) {
  //     // setDisplayError(newDisplayErrors);
  //     dispatch({
  //       type: SingleTableActionTypes?.SET_DIS_ERR_VAL,
  //       payload: {
  //         index: index,
  //         message: `Denomination ${data?.[index]?.DENO_VAL} should be less than or equal to Balance`,
  //       },
  //     });

  //     if (Boolean(state?.displayError)) {
  //       state.inputVal[index] = "";
  //       state.amount[index] = "";
  //     }

  //     //set multiplication is `0` when err0 is occurs according to index
  //     // setMultiplicationResult((preVal) => {
  //     //   const updatedRslt = [...preVal];
  //     //   updatedRslt[index] = 0;
  //     //   return updatedRslt;
  //     // });

  //     //for clear input whe error occur according to index
  //     // const updatedInputVal = { ...inputVal };
  //     // updatedInputVal[index] = "";
  //     // setInputVal(updatedInputVal);
  //   }

  //   //condition for if TRN is Payment and values is +(positive) and greater then of TotalAmount
  //   else if (
  //     state?.fieldsData?.TRN === "P" &&
  //     state?.amount[index] > 0 &&
  //     state?.amount[index] > data[index]?.AVAIL_VAL
  //   ) {
  //     dispatch({
  //       type: SingleTableActionTypes?.SET_DIS_ERR_VAL,
  //       payload: {
  //         index: index,
  //         message: `Denomination ${data?.[index]?.DENO_VAL} should be less than or equal to Balance`,
  //       },
  //     });

  //     //set multiplication is `0` when err0 is occurs according to index
  //     // setMultiplicationResult((preVal) => {
  //     //   const updatedRslt = [...preVal];
  //     //   updatedRslt[index] = 0;
  //     //   return updatedRslt;
  //     // });

  //     // //for clear input whe error occur according to index
  //     // const updatedInputVal = { ...inputVal };
  //     // updatedInputVal[index] = "";
  //     // setInputVal(updatedInputVal);
  //   } else {
  //     state.displayError = "";
  //     // dispatch({
  //     //   type: SingleTableActionTypes?.SET_DIS_ERR_VAL,
  //     //   payload: {
  //     //     message: null,
  //     //   },
  //     // });
  //     handleBlurLogic(event, index);
  //   }
  // };

  // function hasError(obj) {
  //   for (const key in obj) {
  //     if (obj[key] !== null) {
  //       return true; // Return true if any non-null value is found
  //     }
  //   }
  //   return false; // Return false if all values are null
  // }

  // const haveerror = hasError(state?.displayError);

  // const handleonFocus = (event, index) => {
  //   // Call the shared logic for the else part
  //   // handleBlurLogic(event,index);
  // };

  // useEffect(() => {
  //   const withdrawAmount: any = Boolean(state?.fieldsData?.TRN === "R")
  //     ? state?.fieldsData?.RECEIPT
  //     : Boolean(state?.fieldsData?.TRN === "P")
  //     ? state?.fieldsData?.PAYMENT
  //     : "";
  //   console.log(withdrawAmount, "withdrawAmount");
  //   const upadatedFinalAmount: any =
  //     parseInt(withdrawAmount) - parseInt(state?.columnTotal?.amount);
  //   if (!Boolean(haveerror)) {
  //     dispatch({
  //       type: SingleTableActionTypes?.SET_REMAINEXCESS_VAL,
  //       payload: upadatedFinalAmount,
  //     });
  //   }
  // }, [state?.columnTotal?.amount, data, haveerror]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (state?.remainExcess === 0 && state?.displayTable) {
  //       // dispatch({
  //       //   type: SingleTableActionTypes?.SET_CONFIRMATION_VAL,
  //       //   payload: true,
  //       // });
  //       const res = await MessageBox({
  //         messageTitle: "Confirmation",
  //         message: "All Transactions are Completed. Do you want to proceed?",
  //         //@ts-ignore
  //         buttonNames: ["Yes", "No"],
  //         defFocusBtnName: "Yes",
  //         // loadingBtnName: ["Yes"],
  //         icon: "INFO",
  //       });
  //       if (res === "Yes") {
  //         console.log("Form Submitted");
  //       } else if (res === "No") {
  //         CloseMessageBox();
  //       }
  //     } else {
  //       CloseMessageBox();
  //     }
  //   };

  //   fetchData();
  // }, [state?.remainExcess]);

  const onCloseTable = (newVal, flag) => {
    if (flag === "TABLE1") {
      dispatch({
        type: SingleTableActionTypes?.SET_DISP_TABLE,
        payload: newVal,
      });
      dispatch({
        type: SingleTableActionTypes?.SET_INPUT_VAL,
        payload: {},
      });
      dispatch({ type: SingleTableActionTypes?.SET_AMOUNT_VAL, payload: [] });
      dispatch({
        type: SingleTableActionTypes?.SET_REMAINEXCESS_VAL,
        payload: "",
      });
    } else if (flag === "TABLE2") {
      dispatch({
        type: SingleTableActionTypes?.SET_DISP_TABLE_DUAL,
        payload: newVal,
      });
    }
    // if (Boolean(endSubmitRef.current?.endSubmit)) {
    //   endSubmitRef.current?.endSubmit(true);
    // }
  };

  let finalScreenRef = "";

  // useEffect(() => {
  //   dispatch({
  //     type: SingleTableActionTypes?.SET_INPUT_VAL,
  //     payload: {},
  //   });
  //   dispatch({ type: SingleTableActionTypes?.SET_AMOUNT_VAL, payload: [] });
  //   dispatch({
  //     type: SingleTableActionTypes?.SET_REMAINEXCESS_VAL,
  //     payload: "",
  //   });
  // }, [onCloseTable]);

  var receiptInput = document.getElementsByName(
    "TellerOperation/RECEIPT"
  )[0] as HTMLInputElement;

  const textField = document.getElementsByName(
    "TellerOperation/RECEIPT"
  )[0] as HTMLInputElement;

  const branchField = document.getElementsByName(
    "TellerOperation/BRANCH_CD"
  )[0] as HTMLInputElement;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab" && viewTrnRef.current) {
        // console.log(viewTrnRef.current, "viewTrnRef.current");
        // viewTrnRef.current.focus();
        branchField.focus();
        // event.preventDefault();
      }
    };

    if (textField) {
      textField.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (textField) {
        textField.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [textField, viewTrnRef]);
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

  const headingWithButton = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {utilFunction.getDynamicLabel(currentPath, authState?.menulistdata, true)}
      <GradientButton
        // ref={buttonRef}
        style={{ marginRight: "5px" }}
        onClick={(event) => {
          dispatch({
            type: SingleTableActionTypes?.SET_VIEWACCTDETAILS_VAL,
            payload: true,
          });
        }}
        color={"primary"}
        disabled={false}
        ref={viewTrnRef}
      >
        View Trn
      </GradientButton>
    </div>
  );

  useEffect(() => {
    setTabsDetails([]);
    setCardDetails([]);
    setCardTabsReq({});
  }, [screenFlag]);

  const setOpenDenoTable = (value) => {
    dispatch({
      type: SingleTableActionTypes?.SET_DISP_TABLE,
      payload: value,
    });
  };

  const setOpenDualTable = (value) => {
    dispatch({
      type: SingleTableActionTypes?.SET_DISP_TABLE_DUAL,
      payload: value,
    });
  };

  return (
    <>
      <DailyTransTabs
        heading={headingWithButton as any}
        tabsData={tabsDetails}
        cardsData={cardDetails}
        reqData={cardTabsReq}
        key={screenFlag}
      />

      {(isTabsLoading || getData?.isLoading) && (
        <LinearProgress
          color="secondary"
          sx={{ margin: "0px 10px 0px 10px" }}
        />
      )}
      <Paper sx={{ margin: "10px", marginBottom: "15px" }}>
        <FormWrapper
          key={`TellerScreen` + screenFlag + count}
          metaData={TellerScreenMetadata as MetaDataType}
          initialValues={{} as InitialValuesType}
          onSubmitHandler={onSubmitHandler}
          hideHeader={true}
          formStyle={{
            background: "white",
            padding: "0px 10px 10px 10px !important",
          }}
          controlsAtBottom={false}
          onFormButtonClickHandel={(id) => {}}
          formState={{
            MessageBox: MessageBox,
            setCardDetails,
            docCd: screenFlag === "CASHREC" ? "TRN/039" : "TRN/040",
            getCardColumnValue,
            screenFlag,
          }}
          setDataOnFieldChange={async (action, payload) => {
            if (action === "RECEIPT" || action === "PAYMENT") {
              let event: any = { preventDefault: () => {} };
              formRef?.current?.handleSubmit(event, "SAVE");
              if (denoTableType === "single") {
                const formattedDate = format(
                  parse(authState?.workingDate, "dd/MMM/yyyy", new Date()),
                  "dd/MMM/yyyy"
                ).toUpperCase();
                setBtnLoading((pre) => ({ ...pre, table1: true }));
                getData.mutate({
                  COMP_CD: authState?.companyID,
                  BRANCH_CD: authState?.user?.branchCode,
                  USER_NAME: authState?.user?.id,
                  // TRAN_DT: "03/FEB/2024",
                  TRAN_DT: formattedDate,
                  FLAG: "TABLE1",
                });
              } else if (denoTableType === "dual") {
                const formattedDate = format(
                  parse(authState?.workingDate, "dd/MMM/yyyy", new Date()),
                  "dd/MMM/yyyy"
                ).toUpperCase();
                setBtnLoading((pre) => ({ ...pre, table2: true }));
                getData.mutate({
                  COMP_CD: authState?.companyID,
                  BRANCH_CD: authState?.user?.branchCode,
                  USER_NAME: authState?.user?.id,
                  // TRAN_DT: "03/FEB/2024",
                  TRAN_DT: formattedDate,
                  FLAG: "TABLE2",
                });
              }
            } else if (action === "ACCT_CD") {
              if (
                Boolean(payload?.carousalCardData) &&
                Boolean(payload?.carousalCardData.length)
              ) {
                setCardDetails(payload?.carousalCardData);
              }
              if (payload) {
                // console.log(payload, "payload");
                const { dependentFieldValues, paddedAcctcode, NPA_CD } =
                  payload;
                setCardTabsReq({
                  COMP_CD: authState?.companyID,
                  ACCT_TYPE: dependentFieldValues?.ACCT_TYPE?.value,
                  ACCT_CD: paddedAcctcode,
                  PARENT_TYPE:
                    dependentFieldValues?.ACCT_TYPE?.optionData?.[0]
                      ?.PARENT_TYPE,
                  PARENT_CODE:
                    dependentFieldValues?.ACCT_TYPE?.optionData?.[0]
                      ?.PARENT_CODE,
                  BRANCH_CD: dependentFieldValues?.BRANCH_CD?.value,
                  SCREEN_REF: screenFlag === "CASHREC" ? "TRN/039" : "TRN/040",
                  NPA_CD: NPA_CD,
                });
              }
            } else if (action === "ACCT_TYPE") {
              setTabsDetails([]);
              setCardDetails([]);
              if (Boolean(payload?.currentField?.value)) {
                const tabApiReqPara = {
                  COMP_CD: authState?.companyID,
                  BRANCH_CD: payload?.branch_cd,
                  ACCT_TYPE: payload?.currentField?.value,
                };
                fetchTabsData({
                  cacheId: tabApiReqPara,
                  reqData: tabApiReqPara,
                });
              }
            }
          }}
          ref={formRef}
        ></FormWrapper>
      </Paper>
      {/* {Boolean(state?.confirmation) && !Boolean(haveerror) ? (
        <PopupRequestWrapper
          MessageTitle={"Confirmation"}
          Message={"All Transaction are Completed Want to Proceed"}
          onClickButton={(rows, buttonNames) => {
            if (Boolean(buttonNames === "Yes")) {
              console.log("form Submitted");
            } else if (Boolean(buttonNames === "No")) {
              dispatch({
                type: SingleTableActionTypes?.SET_CONFIRMATION_VAL,
                payload: false,
              });
            }
          }}
          buttonNames={["Yes", "No"]}
          rows={[]}
          loading={{ Yes: getData?.isLoading, No: false }}
          open={Boolean(state?.confirmation)}
        />
      ) : null} */}
      {/* {Boolean(state?.openDeno) ? (
        <PopupRequestWrapper
          MessageTitle={"Denomination confirmation"}
          Message={"Are you sure to open denomination"}
          onClickButton={(rows, buttonNames) => {
            if (Boolean(buttonNames === "Table 1")) {
              const formattedDate = format(
                parse(authState?.workingDate, "dd/MMM/yyyy", new Date()),
                "dd/MMM/yyyy"
              ).toUpperCase();
              setBtnLoading((pre) => ({ ...pre, table1: true }));
              getData.mutate({
                COMP_CD: authState?.companyID,
                BRANCH_CD: authState?.user?.branchCode,
                USER_NAME: authState?.user?.id,
                // TRAN_DT: "03/FEB/2024",
                TRAN_DT: formattedDate,
                FLAG: "TABLE1",
              });
            } else if (Boolean(buttonNames === "Table 2")) {
              const formattedDate = format(
                parse(authState?.workingDate, "dd/MMM/yyyy", new Date()),
                "dd/MMM/yyyy"
              ).toUpperCase();
              setBtnLoading((pre) => ({ ...pre, table2: true }));
              getData.mutate({
                COMP_CD: authState?.companyID,
                BRANCH_CD: authState?.user?.branchCode,
                USER_NAME: authState?.user?.id,
                // TRAN_DT: "03/FEB/2024",
                TRAN_DT: formattedDate,
                FLAG: "TABLE2",
              });
            } else if (Boolean(buttonNames === "Close")) {
              dispatch({
                type: SingleTableActionTypes?.SET_OPEN_DENO,
                payload: false,
              });
            }
          }}
          buttonNames={["Table 1", "Table 2", "Close"]}
          rows={[]}
          loading={{
            "Table 1": btnLoading?.table1,
            "Table 2": btnLoading?.table2,
          }}
          open={Boolean(state?.openDeno)}
        />
      ) : null} */}
      {/* {state?.displayTable ? (
        <TellerDenoTable
          displayTable={state?.displayTable}
          data={data ?? []}
          handleChange={handleChange}
          inputValue={state?.inputVal}
          amount={state?.amount}
          availNotes={state?.availNote}
          balance={state?.balance}
          handleonBlur={handleonBlur}
          noteCntTotal={state?.columnTotal?.inputVal}
          amountTotal={state?.columnTotal?.amount}
          availNoteTotal={state?.columnTotal?.availNote}
          balanceTotal={state?.columnTotal?.balance}
          remainExcessBal={state?.remainExcess}
          finalLable={state?.remainExcess >= 0 ? "Remaining " : "Excess "}
          onCloseTable={onCloseTable}
          textFieldRef={textFieldRef}
          // openAcctDtl={state?.openAcctDtl}
          displayError={state?.displayError}
          // handleonFocus={handleonFocus}
          gridLable={
            state?.fieldsData?.TRN === "R"
              ? `Cash Receipt [${extraAccDtl?.TRN_TYPE}]- Remarks: ${extraAccDtl?.REMARKS} - A/C No.: ${extraAccDtl?.["A/c Number"]} - ${extraAccDtl?.Name} - Receipt Amount:${state?.fieldsData?.RECEIPT} - Limit:${extraAccDtl?.LIMIT}`
              : `Cash Payment [${extraAccDtl?.TRN_TYPE}]- Remarks: ${extraAccDtl?.REMARKS} - A/C No.: ${extraAccDtl?.["A/c Number"]} - ${extraAccDtl?.Name} - Receipt Amount:${state?.fieldsData?.PAYMENT} - Limit:${extraAccDtl?.LIMIT}`
          }
        />
      ) : null} */}
      {state?.displayTable ? (
        <TellerDenoTableCalc
          displayTable={state?.displayTable}
          setOpenDenoTable={setOpenDenoTable}
          formData={state?.fieldsData}
          data={data ?? []}
          isLoading={getData?.isLoading}
          onCloseTable={onCloseTable}
          initRemainExcess={
            screenFlag === "CASHREC"
              ? state?.fieldsData?.RECEIPT
              : screenFlag === "CASHPAY"
              ? state?.fieldsData?.PAYMENT
              : "0"
          }
          gridLable={
            screenFlag === "CASHREC"
              ? `Cash Receipt [${extraAccDtl?.TRN_TYPE}]- Remarks: ${extraAccDtl?.REMARKS} - A/C No.: ${extraAccDtl?.["A/c Number"]} - ${extraAccDtl?.Name} - Receipt Amount:${state?.fieldsData?.RECEIPT} - Limit:${extraAccDtl?.LIMIT}`
              : `Cash Payment [${extraAccDtl?.TRN_TYPE}]- Remarks: ${extraAccDtl?.REMARKS} - A/C No.: ${extraAccDtl?.["A/c Number"]} - ${extraAccDtl?.Name} - Payment Amount:${state?.fieldsData?.PAYMENT} - Limit:${extraAccDtl?.LIMIT}`
          }
          // screenRef={screenFlag === "CASHREC" ? "TRN/039" : "TRN/040"}
          // entityType={screenFlag === "CASHREC" ? "SINGLEREC" : "SINGLEPAY"}
          screenFlag={screenFlag}
          typeCode={"1"}
          setCount={setCount}
        />
      ) : null}
      {/* <DualTableCalc data={data ?? []} /> */}
      {state?.displayTableDual ? (
        <DualTableCalc
          // columnDefinitions={columnDefinitions}
          // isLoading={false}
          // formData={state?.fieldsData}
          displayTableDual={state?.displayTableDual}
          // openAcctDtl={state?.openAcctDtl}
          formData={state?.fieldsData}
          data={data ?? []}
          isLoading={getData?.isLoading}
          onCloseTable={onCloseTable}
          initRemainExcess={
            (state?.fieldsData?.RECEIPT
              ? state?.fieldsData?.RECEIPT
              : state?.fieldsData?.PAYMENT) || 0
          }
          gridLable={
            screenFlag === "CASHREC"
              ? `Cash Receipt [${extraAccDtl?.TRN_TYPE}]- Remarks: ${extraAccDtl?.REMARKS} - A/C No.: ${extraAccDtl?.["A/c Number"]} - ${extraAccDtl?.Name} - Receipt Amount:${state?.fieldsData?.RECEIPT} - Limit:${extraAccDtl?.LIMIT}`
              : `Cash Payment [${extraAccDtl?.TRN_TYPE}]- Remarks: ${extraAccDtl?.REMARKS} - A/C No.: ${extraAccDtl?.["A/c Number"]} - ${extraAccDtl?.Name} - Receipt Amount:${state?.fieldsData?.PAYMENT} - Limit:${extraAccDtl?.LIMIT}`
          }
          screenFlag={screenFlag}
          typeCode={"1"}
          setOpenDenoTable={setOpenDualTable}
          setCount={setCount}
        />
      ) : null}
      {/* {Boolean(state?.singleDenoShow) ? <SingleDeno /> : null} */}
      {state?.viewAcctDetails ? (
        <Dialog open={state?.viewAcctDetails} maxWidth={"xl"}>
          <ReportGrid
            reportID={"transactionServiceAPI/GETTODAYTRANDATA"}
            reportName={"GETTODAYTRANDATA"}
            dataFetcher={API.cashReportData}
            metaData={cashReportMetaData}
            maxHeight={window.innerHeight - 250}
            title={cashReportMetaData?.title}
            options={{
              disableGroupBy: cashReportMetaData?.disableGroupBy,
            }}
            hideFooter={cashReportMetaData?.hideFooter}
            hideAmountIn={cashReportMetaData?.hideAmountIn}
            retrievalType={cashReportMetaData?.retrievalType}
            initialState={{
              groupBy: cashReportMetaData?.groupBy ?? [],
            }}
            onClose={handleCloseDialog}
            otherAPIRequestPara={{
              COMP_CD: authState?.companyID,
              BRANCH_CD: authState?.user?.branchCode,
            }}
            // dataTransformer={(data) => {
            //   setScrollData(data);
            //   return data;
            // }}
          />
        </Dialog>
      ) : null}
    </>
  );
};

export default TellerScreen;

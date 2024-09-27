import React, { useContext, useEffect, useReducer, useRef } from "react";
import TellerDenoTable from "./tellerDenoTable";
import {
  SingleTableDataReducer,
  SingleTableInititalState,
  SingleTableActionTypes,
} from "./denoTableActionTypes";
import { usePopupContext } from "@acuteinfo/common-base";
import { AuthContext } from "pages_audit/auth";
const TellerDenoTableCalc = ({
  displayTable,
  formData,
  data,
  isLoading,
  onCloseTable,
  gridLable,
  initRemainExcess,
}) => {
  const textFieldRef: any = useRef(null);
  const [state, dispatch] = useReducer(
    SingleTableDataReducer,
    SingleTableInititalState
  );
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { authState } = useContext(AuthContext);
  useEffect(() => {
    dispatch({
      type: SingleTableActionTypes?.SET_INPUT_VAL,
      payload: {},
    });
    dispatch({
      type: SingleTableActionTypes?.SET_AMOUNT_VAL,
      payload: [],
    });
  }, [state?.openDeno]);

  //for aceept only numbers (positive and negative) without decimal
  const sanitizedValue = (inputValue) => {
    if (inputValue.startsWith("-")) {
      return "-" + inputValue.replace(/[^0-9]/g, "");
    } else {
      return inputValue.replace(/[^0-9]/g, "");
    }
  };

  const handleChange = (event, index) => {
    //set sanitized value returned by sanitizedValue function (new value have only numbers (positive and negative) without decimal)
    let userInput = event.target.value;
    const sanitValue = sanitizedValue(userInput);
    let updatedValue = { ...state?.inputVal };
    updatedValue[index] = sanitValue;
    dispatch({
      type: SingleTableActionTypes?.SET_INPUT_VAL,
      payload: updatedValue,
    });

    //display Amout column value (multiplied value of denomination * note count)
    const multipliedValue = [...state?.amount];
    multipliedValue[index] =
      parseInt(sanitValue) * parseInt(data?.[index]?.DENO_VAL);
    dispatch({
      type: SingleTableActionTypes?.SET_AMOUNT_VAL,
      payload: multipliedValue,
    });
  };

  useEffect(() => {
    let initAvailNote: any = [];
    let initBalance: any = [];
    data?.map((notes) => {
      initAvailNote.push(notes?.AVAIL_QTY);
      initBalance.push(notes?.AVAIL_VAL);
    });
    dispatch({
      type: SingleTableActionTypes?.SET_AVAIL_NOTE,
      payload: initAvailNote,
    });
    dispatch({
      type: SingleTableActionTypes?.SET_BAL_VAL,
      payload: initBalance,
    });
    // dispatch({
    //   type: SET_REMAINEXCESS_VAL,
    //   payload: Boolean(formData?.TRN === "R")
    //     ? formData?.RECEIPT
    //     : Boolean(formData?.TRN === "P")
    //     ? formData?.PAYMENT
    //     : "0",
    // });
  }, [data, state?.openDeno]);

  //for common function for set required table column totals
  const getInitTotals = (getData) => {
    const finalTotal = {};

    for (let key in getData) {
      const newTotalAmount = Object.values(getData[key] || "0").reduce(
        (acc: any, val: any) => acc + (parseFloat(val) || 0),
        0
      );

      if (Boolean(state?.inputVal)) {
        finalTotal[key] = newTotalAmount;
      }
    }
    return finalTotal;
  };

  //set initial totals
  useEffect(() => {
    const dataObj = {
      inputVal: "0",
      amount: "0",
      availNote: state?.availNote,
      balance: state?.balance,
    };
    const newValue = getInitTotals(dataObj);

    dispatch({
      type: SingleTableActionTypes?.SET_TOTAL_VAL,
      payload: newValue,
    });
  }, [state?.availNote, state?.balance, state?.openDeno]);

  const handleBlurLogic = (event, index) => {
    dispatch({
      type: SingleTableActionTypes?.SET_DIS_ERR_VAL,
      payload: {
        index: index,
        message: null,
      },
    });
  };

  const handleonBlur = async (event, index) => {
    if (Boolean(event?.target?.value === "-")) {
      state.inputVal[index] = "";
    }
    const dataForTotal = {
      inputVal: state?.inputVal || "0",
      amount: state?.amount || "0",
      availNote: state?.availNote || "0",
      balance: state?.balance || "0",
    };

    const newValue = getInitTotals(dataForTotal);
    dispatch({
      type: SingleTableActionTypes?.SET_TOTAL_VAL,
      payload: newValue,
    });

    // if (state?.remainExcess === 0) {
    //   // dispatch({
    //   //   type: SingleTableActionTypes?.SET_CONFIRMATION_VAL,
    //   //   payload: true,
    //   // });
    //   const res = await MessageBox({
    //     messageTitle: "Confirmation",
    //     message: "All Transaction are Completed Want to Proceed ?",
    //     //@ts-ignore
    //     buttonNames: ["Yes", "No"],
    //     defFocusBtnName: "Yes",
    //     // loadingBtnName: ["Yes"],
    //     icon: "INFO",
    //   });
    //   if (res === "Yes") {
    //     console.log("form Submitted");
    //   } else if (res === "No") {
    //     CloseMessageBox();
    //   }
    // } else {
    //   // dispatch({
    //   //   type: SingleTableActionTypes?.SET_CONFIRMATION_VAL,
    //   //   payload: false,
    //   // });
    //   CloseMessageBox();
    // }

    if (
      formData?.TRN === "1" &&
      state?.amount[index] < 0 &&
      Math.abs(state?.amount[index]) > data[index]?.AVAIL_VAL
    ) {
      // setDisplayError(newDisplayErrors);
      dispatch({
        type: SingleTableActionTypes?.SET_DIS_ERR_VAL,
        payload: {
          index: index,
          message: `Denomination ${data?.[index]?.DENO_VAL} should be less than or equal to Balance`,
        },
      });

      if (Boolean(state?.displayError)) {
        state.inputVal[index] = "";
        state.amount[index] = "";
      }

      //set multiplication is `0` when err0 is occurs according to index
      // setMultiplicationResult((preVal) => {
      //   const updatedRslt = [...preVal];
      //   updatedRslt[index] = 0;
      //   return updatedRslt;
      // });

      //for clear input whe error occur according to index
      // const updatedInputVal = { ...inputVal };
      // updatedInputVal[index] = "";
      // setInputVal(updatedInputVal);
    }

    //condition for if TRN is Payment and values is +(positive) and greater then of TotalAmount
    else if (
      formData?.TRN === "4" &&
      state?.amount[index] > 0 &&
      state?.amount[index] > data[index]?.AVAIL_VAL
    ) {
      dispatch({
        type: SingleTableActionTypes?.SET_DIS_ERR_VAL,
        payload: {
          index: index,
          message: `Denomination ${data?.[index]?.DENO_VAL} should be less than or equal to Balance`,
        },
      });

      //set multiplication is `0` when err0 is occurs according to index
      // setMultiplicationResult((preVal) => {
      //   const updatedRslt = [...preVal];
      //   updatedRslt[index] = 0;
      //   return updatedRslt;
      // });

      // //for clear input whe error occur according to index
      // const updatedInputVal = { ...inputVal };
      // updatedInputVal[index] = "";
      // setInputVal(updatedInputVal);
    } else {
      state.displayError = "";
      // dispatch({
      //   type: SingleTableActionTypes?.SET_DIS_ERR_VAL,
      //   payload: {
      //     message: null,
      //   },
      // });
      handleBlurLogic(event, index);
    }

    // const consoleData = getRowData();
    // console.log(consoleData, "consoleconsoleconsoleconsoleconsole");
  };

  function hasError(obj) {
    for (const key in obj) {
      if (obj[key] !== null) {
        return true; // Return true if any non-null value is found
      }
    }
    return false; // Return false if all values are null
  }

  const haveerror = hasError(state?.displayError);

  const handleonFocus = (event, index) => {
    // Call the shared logic for the else part
    // handleBlurLogic(event,index);
  };
  useEffect(() => {
    const withdrawAmount: any = initRemainExcess;
    const upadatedFinalAmount: any =
      parseInt(withdrawAmount) - parseInt(state?.columnTotal?.amount);
    if (!Boolean(haveerror)) {
      dispatch({
        type: SingleTableActionTypes?.SET_REMAINEXCESS_VAL,
        payload: upadatedFinalAmount,
      });
    }
  }, [state?.columnTotal?.amount, data, haveerror, formData]);

  // const saveDenominationData = useMutation(API.saveDenoData, {
  //   onSuccess: async (data: any, variables: any) => {},
  //   onError: (error: any, variables: any) => {},
  // });

  useEffect(() => {
    const fetchData = async () => {
      if (state?.remainExcess === 0 && displayTable) {
        // dispatch({
        //   type: SingleTableActionTypes?.SET_CONFIRMATION_VAL,
        //   payload: true,
        // });
        const res = await MessageBox({
          messageTitle: "Confirmation",
          message: "All Transactions are Completed. Do you want to proceed?",
          //@ts-ignore
          buttonNames: ["Yes", "No"],
          defFocusBtnName: "Yes",
          // loadingBtnName: ["Yes"],
          icon: "INFO",
        });
        if (res === "Yes") {
          const DDT = getRowData();
          const reqData = {
            TRN_DTL: formData?.singleDenoRow?.map((item) => {
              const parameters = {
                BRANCH_CD: item?.BRANCH_CD ?? "",
                ACCT_TYPE: item?.ACCT_TYPE ?? "",
                ACCT_CD: item?.ACCT_CD ?? "",
                TYPE_CD: item?.TRX ?? "",
                COMP_CD: authState?.companyID ?? "",
                CHEQUE_NO: "",
                SDC: "1",
                SCROLL1: "",
                CHEQUE_DT: "",
                REMARKS: "1 BY CASH -",
                AMOUNT: "1000.00",
              };
              return parameters;
            }),
          };
          // saveDenominationData?.mutate({});
        } else if (res === "No") {
          CloseMessageBox();
        }
      } else {
        CloseMessageBox();
      }
    };

    fetchData();
  }, [state?.remainExcess]);

  const getRowData = () => {
    const row = data;
    const inputAmount = state?.inputVal || "";
    const multiplicationResult = state?.amount || "";
    const getRowViseData = row
      ?.map((apiRows, index) => {
        if (Object?.hasOwn(inputAmount, index)) {
          const newRow = { ...apiRows, INPUT_VALUE: inputAmount[index] };
          if (state?.amount[index] !== undefined) {
            newRow.MULTIPLIED_VALUE = state?.amount[index];
          }
          return newRow;
        }
      })
      ?.filter((row) => {
        return Boolean(row);
      });

    return getRowViseData;
  };

  return (
    <TellerDenoTable
      displayTable={displayTable}
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
      gridLable={gridLable}
    />
  );
};

export default TellerDenoTableCalc;

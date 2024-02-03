import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { TellerScreenMetadata } from "./metadataTeller";
import { InitialValuesType, SubmitFnType } from "packages/form";
import { GradientButton } from "components/styledComponent/button";
import TellerDenoTable from "./tellerDenoTable";
import { useMutation, useQuery } from "react-query";
import { AuthContext } from "pages_audit/auth";
import * as API from "./api";
import DenoTable from "./denoTable";
import {
  PopupMessageAPIWrapper,
  PopupRequestWrapper,
} from "components/custom/popupMessage";
import SingleDeno from "./singleDeno";
import Grow from "@mui/material/Grow";
import { Dialog } from "@mui/material";
import { denoViewTrnGridMetaData } from "./metadataTeller";
import GridWrapper from "components/dataTableStatic";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import { format, parse } from "date-fns";
import { isValidDate } from "components/utils/utilFunctions/function";

const inititalState = {
  inputVal: {},
  displayTable: false,
  amount: [],
  totalAmount: "",
  availNote: [],
  fieldsData: {},
  balance: [],
  singleDenoShow: false,
  viewAcctDetails: false,
  columnTotal: {},
  remainExcess: "",
  confirmation: false,
  displayError: [],
  displayTotal: [],
  totalInputAmount: "",
  retData: {},
  openDeno: false,
  isDisableField: false,
  openAccountDTL: false,
  referData: "",
  secondReferData: "",
  thirdReferData: "",
  formData: {},
  viewTRN: false,
  manageOperator: false,
};

const SET_OPEN_DENO = "SET_OPEN_DENO";
const SET_DISP_TABLE = "SET_DISP_TABLE";
const SET_INPUT_VAL = "SET_INPUT_VAL";
const SET_AMOUNT_VAL = "SET_AMOUNT_VAL";
const SET_AVAIL_NOTE = "SET_AVAIL_NOTE";
const SET_FIELDS_DATA = "SET_FIELDS_DATA";
const SET_BAL_VAL = "SET_BAL_VAL";
const SET_SINGLEDENO_SHOW = "SET_SINGLEDENO_SHOW";
const SET_VIEWACCTDETAILS_VAL = "SET_VIEWACCTDETAILS_VAL";
const SET_TOTAL_VAL = "SET_TOTAL_VAL";
const SET_REMAINEXCESS_VAL = "SET_REMAINEXCESS_VAL";
const SET_CONFIRMATION_VAL = "SET_CONFIRMATION_VAL";

const dataReducer = (state, action) => {
  switch (action.type) {
    case SET_OPEN_DENO:
      return { ...state, openDeno: action.payload };
    case SET_DISP_TABLE:
      return { ...state, displayTable: action.payload };
    case SET_INPUT_VAL:
      return { ...state, inputVal: action.payload };
    case SET_AMOUNT_VAL:
      return { ...state, amount: action.payload };
    case SET_AVAIL_NOTE:
      return { ...state, availNote: action.payload };
    case SET_FIELDS_DATA:
      return { ...state, fieldsData: action.payload };
    case SET_BAL_VAL:
      return { ...state, balance: action.payload };
    case SET_SINGLEDENO_SHOW:
      return { ...state, singleDenoShow: action.payload };
    case SET_VIEWACCTDETAILS_VAL:
      return { ...state, viewAcctDetails: action.payload };
    case SET_TOTAL_VAL:
      return { ...state, columnTotal: action.payload };
    case SET_REMAINEXCESS_VAL:
      return { ...state, remainExcess: action.payload };
    case SET_CONFIRMATION_VAL:
      return { ...state, confirmation: action.payload };
    default:
      return state;
  }
};

const TellerScreen = () => {
  const formRef: any = useRef(null);
  const endSubmitRef: any = useRef(null);
  const [state, dispatch] = useReducer(dataReducer, inititalState);
  const { authState }: any = useContext(AuthContext);

  const onSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    endSubmitRef.current = {
      data: { data },
      displayData,
      endSubmit,
      setFieldError,
    };
    if (actionFlag === "SAVE") {
      if (Boolean(data)) {
        dispatch({ type: SET_FIELDS_DATA, payload: data });
      }
    }
  };

  const getData: any = useMutation(API.CashReceiptEntrysData, {
    onSuccess: (response: any) => {
      dispatch({ type: SET_OPEN_DENO, payload: false });
      dispatch({ type: SET_DISP_TABLE, payload: true });
    },
    onError: (error: any) => {
      dispatch({ type: SET_DISP_TABLE, payload: false });
    },
  });

  const data: any = useMemo(() => {
    if (Array.isArray(getData.data)) {
      return [...getData.data];
    }
  }, [getData.data]);

  //initial value set in available note and balance column
  useEffect(() => {
    let initAvailNote: any = [];
    let initBalance: any = [];
    data?.map((notes) => {
      initAvailNote.push(notes?.AVAIL_QTY);
      initBalance.push(notes?.AVAIL_VAL);
    });
    dispatch({ type: SET_AVAIL_NOTE, payload: initAvailNote });
    dispatch({ type: SET_BAL_VAL, payload: initBalance });
    // dispatch({
    //   type: SET_REMAINEXCESS_VAL,
    //   payload: Boolean(state?.fieldsData?.TRN === "R")
    //     ? state?.fieldsData?.RECEIPT
    //     : Boolean(state?.fieldsData?.TRN === "P")
    //     ? state?.fieldsData?.PAYMENT
    //     : "0",
    // });
  }, [data]);

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
    dispatch({ type: SET_TOTAL_VAL, payload: newValue });
  }, [state?.availNote, state?.balance]);

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
    dispatch({ type: SET_INPUT_VAL, payload: updatedValue });

    //display Amout column value (multiplied value of denomination * note count)
    const multipliedValue = [...state?.amount];
    multipliedValue[index] =
      parseInt(sanitValue) * parseInt(data?.[index]?.DENO_VAL);
    dispatch({ type: SET_AMOUNT_VAL, payload: multipliedValue });

    //update values of available notes column on handlechange in both receipt and payment
    if (Boolean(state?.fieldsData) && Boolean(state?.fieldsData?.TRN)) {
      if (state?.fieldsData?.TRN === "R") {
        if (!isNaN(sanitValue)) {
          state.availNote[index] =
            parseInt(data?.[index]?.AVAIL_QTY) + parseInt(sanitValue || "0");
          state.balance[index] =
            parseInt(data?.[index]?.DENO_VAL) *
            parseFloat(state?.availNote[index] || "0");
        } else {
          state.availNote[index] = parseInt(data?.[index]?.AVAIL_QTY);
          state.balance[index] = parseInt(data?.[index]?.AVAIL_VAL);
        }
      } else if (state?.fieldsData?.TRN === "P") {
        if (!isNaN(sanitValue)) {
          state.availNote[index] =
            parseInt(data?.[index]?.AVAIL_QTY) - parseInt(sanitValue || "0");
          state.balance[index] =
            parseInt(data?.[index]?.DENO_VAL) * parseFloat(state?.availNote);
        } else {
          state.availNote[index] = parseInt(data?.[index]?.AVAIL_QTY);
          state.balance[index] = parseInt(data?.[index]?.AVAIL_VAL);
        }
      }
    }
  };

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
      dispatch({ type: SET_VIEWACCTDETAILS_VAL, payload: false });
    }
  }, []);

  const handleonBlur = (event, index) => {
    const dataForTotal = {
      inputVal: state?.inputVal || "0",
      amount: state?.amount || "0",
      availNote: state?.availNote || "0",
      balance: state?.balance || "0",
    };

    const newValue = getInitTotals(dataForTotal);

    dispatch({
      type: SET_TOTAL_VAL,
      payload: newValue,
    });

    if (state?.remainExcess === 0) {
      dispatch({ type: SET_CONFIRMATION_VAL, payload: true });
    } else {
      dispatch({ type: SET_CONFIRMATION_VAL, payload: false });
    }
  };

  useEffect(() => {
    const withdrawAmount: any = Boolean(state?.fieldsData?.TRN === "R")
      ? state?.fieldsData?.RECEIPT
      : Boolean(state?.fieldsData?.TRN === "P")
      ? state?.fieldsData?.PAYMENT
      : "";

    const upadatedFinalAmount: any =
      parseInt(withdrawAmount) - parseInt(state?.columnTotal?.amount);

    dispatch({ type: SET_REMAINEXCESS_VAL, payload: upadatedFinalAmount });
  }, [state?.columnTotal?.amount, data]);

  useEffect(() => {
    if (state?.remainExcess === 0) {
      dispatch({ type: SET_CONFIRMATION_VAL, payload: true });
    } else {
      dispatch({ type: SET_CONFIRMATION_VAL, payload: false });
    }
  }, [state?.remainExcess]);

  return (
    <>
      <FormWrapper
        key={`TellerScreen`}
        metaData={TellerScreenMetadata as MetaDataType}
        initialValues={{} as InitialValuesType}
        onSubmitHandler={onSubmitHandler}
        formStyle={{
          background: "white",
        }}
        controlsAtBottom={false}
        onFormButtonClickHandel={(id) => {}}
        setDataOnFieldChange={(action, data) => {
          if (action === "RECEIPT" || action === "PAYMENT") {
            if (Boolean(data?.value)) {
              dispatch({ type: SET_OPEN_DENO, payload: true });
              let event: any = { preventDefault: () => {} };
              formRef?.current?.handleSubmit(event, "SAVE");
            }
          } else if (action === "TRN") {
            Boolean(data?.value) && data?.value === "S"
              ? dispatch({ type: SET_SINGLEDENO_SHOW, payload: true })
              : dispatch({ type: SET_SINGLEDENO_SHOW, payload: false });
          }
        }}
        ref={formRef}
      >
        {({ isSubmitting, handleSubmit }) => (
          <>
            <GradientButton
              // ref={buttonRef}
              style={{ marginRight: "5px" }}
              onClick={(event) => {
                dispatch({ type: SET_VIEWACCTDETAILS_VAL, payload: true });
              }}
              color={"primary"}
              endicon={"CheckCircleOutline"}
              rotateIcon="scale(1.4)"
              disabled={false}
            >
              View Trn
            </GradientButton>
            {Boolean(state?.displayTable) ? (
              <GradientButton
                // ref={buttonRef}
                style={{ marginRight: "5px" }}
                onClick={(event) => {
                  if (Boolean(endSubmitRef.current?.endSubmit)) {
                    endSubmitRef.current?.endSubmit(true);
                  }
                  dispatch({ type: SET_DISP_TABLE, payload: false });
                }}
                color={"primary"}
                endicon={"CheckCircleOutline"}
                rotateIcon="scale(1.4)"
              >
                Reset
              </GradientButton>
            ) : null}
          </>
        )}
      </FormWrapper>
      {Boolean(state?.openDeno) ? (
        <PopupMessageAPIWrapper
          MessageTitle="Denomination confirmation"
          Message="Are you sure to open denomination"
          onActionYes={() => {
            const formattedDate = format(
              parse(authState?.workingDate, "dd/MM/yyyy", new Date()),
              "dd-MMM-yyyy"
            ).toUpperCase();
            getData.mutate({
              COMP_CD: authState?.companyID,
              BRANCH_CD: authState?.user?.branchCode,
              USER_NAME: authState?.user?.id,
              // TRAN_DT: "03/FEB/2024",
              TRAN_DT: formattedDate,
            });
          }}
          onActionNo={() => {
            dispatch({ type: SET_OPEN_DENO, payload: false });
            if (Boolean(endSubmitRef.current?.endSubmit)) {
              endSubmitRef.current?.endSubmit(true);
            }
          }}
          rows={[]}
          open={state?.openDeno}
          loading={getData.isLoading}
        />
      ) : null}{" "}
      {Boolean(state?.confirmation) ? (
        <PopupRequestWrapper
          MessageTitle={"Confirmation"}
          Message={"All Transaction are Completed Want to Proceed"}
          onClickButton={(rows, buttonNames) => {
            buttonNames === "Yes"
              ? console.log("form Submitted")
              : dispatch({ type: SET_CONFIRMATION_VAL, payload: false });
          }}
          buttonNames={["Yes", "No"]}
          rows={[]}
          open={state?.confirmation}
        />
      ) : null}
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
      />
      {Boolean(state?.singleDenoShow) ? <SingleDeno /> : null}
      {state?.viewAcctDetails ? (
        <Dialog open={state?.viewAcctDetails} maxWidth={"md"}>
          <GridWrapper
            key={`denoViewTrnGrid`}
            finalMetaData={denoViewTrnGridMetaData as GridMetaDataType}
            data={[]}
            setData={() => null}
            actions={actions}
            setAction={setCurrentAction}
            headerToolbarStyle={{
              backgroundColor: "var(theme-color5)",
            }}
            loading={false}
            // refetchData={() => refetch()}
          />
        </Dialog>
      ) : null}
    </>
  );
};

export default TellerScreen;

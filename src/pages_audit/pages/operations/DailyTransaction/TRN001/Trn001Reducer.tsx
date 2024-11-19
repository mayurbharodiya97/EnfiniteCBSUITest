import { icon } from "@fortawesome/fontawesome-svg-core";
import { isValid, parse } from "date-fns";
import { enqueueSnackbar } from "notistack";
import {
  createContext,
  useCallback,
  useEffect,
  useReducer,
  useRef,
} from "react";
import { boolean } from "yup";

const initialState: any = {
  unqID: 0,
  branch: { label: "", value: "", info: {} },
  bugMsgBranchCode: "",
  accType: { label: "", value: "", info: {} },
  bugMsgAccType: "",
  accNo: "",
  bugAccNo: false,
  bugMsgAccNo: "",
  trx: { label: "", value: "", code: "" }, //TYPE_CD
  bugMsgTrx: "",
  scroll: "", //token
  bugMsgScroll: "",
  sdc: { label: "", value: "", info: {} },
  bugMsgSdc: "",
  remark: "",
  bugMsgRemarks: "",
  cNo: "",
  bugCNo: false,
  bugMsgCNo: "",
  date: new Date(),
  bugDate: false,
  bugMsgDate: "",
  debit: "",
  bugMsgDebit: "",
  credit: "",
  bugMsgCredit: "",
  bug: false,
  isCredit: true,
  viewOnly: false,
  cheqNoFlag: {},
  cheqDateFlag: {},
  acctNoFlag: {},
};

const updateRows = (rows, updUnqId, updateFn) => {
  if (typeof updateFn !== "function") {
    throw new Error("updateFn must be a function");
  }

  const updatedRows = rows?.map((row) =>
    row.unqID === updUnqId ? updateFn(row) : row
  );

  return updatedRows;
};
export const RowsReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "UPDATE_ROW":
      return {
        ...state,
        rows: updateRows(state.rows, payload.updUnqId, payload.updateFn),
      };
    case "UPDATE_ROW_DIRECT":
      return {
        ...state,
        rows: state.rows.map((row) =>
          row.unqID === payload.updUnqId ? { ...row, ...payload.newRow } : row
        ),
      };
    case "ADD_NEW_ROW":
      return {
        ...state,
        rows: [...state.rows, payload.newData],
      };
    case "RESET_ROWS":
      return {
        ...state,
        rows: [initialState],
      };
    case "DELETE_ROW":
      return {
        ...state,
        rows: state?.rows?.filter((row) => {
          return row?.unqID !== payload?.updUnqId;
        }),
      };
    case "COMMON_TYPE":
      const { stateName, fieldId, isLoading, rowIndex } =
        action?.payload?.dataObj;
      if (stateName === "LOADING_STATE") {
        return {
          ...state,
          loadingStates: {
            ...state.loadingStates,
            [rowIndex]: {
              ...(state.loadingStates[rowIndex] || {}),
              [fieldId]: isLoading,
            },
          },
        };
      }
      return state;
    default:
      return state;
  }
};

export const TRN001Context = createContext<any>(initialState);
const TRN001Provider = ({ children }) => {
  const [state, dispatch] = useReducer(RowsReducer, {
    rows: [initialState],
    loadingStates: {},
  });
  const stateRef = useRef<any>(state);
  stateRef.current = state;
  const handleSetDefaultBranch = useCallback(
    (data, authState, updUnqId) => {
      if (Boolean(data)) {
        const updateFn = (row) => {
          const branch = data.find(
            (branch) => branch.value === authState?.user?.branchCode
          );
          return { ...row, branch: branch ?? row.branch };
        };

        dispatch({
          type: "UPDATE_ROW",
          payload: { updUnqId: updUnqId, updateFn },
        });
      }
    },
    [state?.rows]
  );

  const handleBranchChange = useCallback(
    ({ updUnqId, branchVal }) => {
      dispatch({
        type: "UPDATE_ROW",
        payload: {
          updUnqId,
          updateFn: (row) => ({ ...row, branch: branchVal }),
        },
      });
    },
    [state.rows]
  );

  const handleBranchBlur = useCallback(
    ({ updUnqId, chequeDate }) => {
      const bugMsgBranchCode = state.rows.find((row) => row.unqID === updUnqId)
        ?.branch?.value
        ? ""
        : "Branch Code Required";

      dispatch({
        type: "UPDATE_ROW",
        payload: {
          updUnqId,
          updateFn: (row) => ({
            ...row,
            accType: { label: "", value: "", info: {} },
            bugMsgAccType: "",
            accNo: "",
            bugMsgAccNo: "",
            trx: { label: "", value: "", code: "" },
            bugMsgTrx: "",
            cNo: "",
            bugMsgCNo: "",
            date: parse(chequeDate, "dd/MMM/yyyy", new Date()) ?? new Date(),
            bugMsgDate: "",
            debit: "",
            bugMsgDebit: "",
            credit: "",
            bugMsgCredit: "",
            scroll: "",
            bugMsgScroll: "",
            bugMsgBranchCode: bugMsgBranchCode,
            cheqNoFlag: { [updUnqId]: false },
            acctNoFlag: { [updUnqId]: false },
            cheqDateFlag: { [updUnqId]: false },
          }),
        },
      });
    },
    [state?.rows]
  );

  const handleAccTypeChange = useCallback(
    ({ updUnqId, value }) => {
      dispatch({
        type: "UPDATE_ROW",
        payload: {
          updUnqId,
          updateFn: (row) => ({ ...row, accType: value ?? "" }),
        },
      });
    },
    [state?.rows]
  );

  const handleAccTypeBlurCtx = useCallback(
    ({ updUnqId, chequeDate }) => {
      const bugMsgAccType = state?.rows?.find((row) => row?.unqID === updUnqId)
        ?.accType?.value
        ? ""
        : "Account Type Required";
      dispatch({
        type: "UPDATE_ROW",
        payload: {
          updUnqId,
          updateFn: (row) => ({
            ...row,
            accNo: "",
            bugMsgAccNo: "",
            trx: { label: "", value: "", code: "" },
            bugMsgTrx: "",
            cNo: "",
            bugMsgCNo: "",
            date: parse(chequeDate, "dd/MMM/yyyy", new Date()) ?? new Date(),
            bugMsgDate: "",
            debit: "",
            bugMsgDebit: "",
            credit: "",
            bugMsgCredit: "",
            scroll: "",
            bugMsgScroll: "",
            cheqNoFlag: { [updUnqId]: false },
            bugMsgAccType: bugMsgAccType,
            acctNoFlag: { [updUnqId]: false },
            cheqDateFlag: { [updUnqId]: false },
          }),
        },
      });
    },
    [state?.rows]
  );

  const handleAcctNoChange = useCallback(
    ({ updUnqId, value }) => {
      const sanitizedValue = value?.replace(/[^0-9 ]/g, "");
      if (sanitizedValue?.length <= 20) {
        dispatch({
          type: "UPDATE_ROW",
          payload: {
            updUnqId,
            updateFn: (row) => ({
              ...row,
              accNo: sanitizedValue ?? "",
            }),
          },
        });
      }
    },
    [state?.rows]
  );

  const handleAcctNoBlurCtx = useCallback(
    ({ updUnqId, newRow }) => {
      dispatch({
        type: "UPDATE_ROW_DIRECT",
        payload: { updUnqId, newRow },
      });
    },
    [state?.rows]
  );

  const getAcctNoValidationCtx = useCallback(
    async ({
      updUnqId,
      data,
      variables,
      getBtnName,
      chequeDate,
      setLoadingState,
    }) => {
      let shouldCallCarousalCards = false;
      if (state?.rows?.length > 0) {
        for (let i = 0; i < data?.MSG?.length; i++) {
          if (data?.MSG?.length > 0) {
            const status: any = data?.MSG[i]?.O_STATUS;
            const message = data?.MSG[i]?.O_MESSAGE;
            const chequeNo = data?.CHEQUE_NO ?? "";
            if (status === "999") {
              const { btnNm, msgObj } = await getBtnName({
                messageTitle: "ValidationFailed",
                message,
                icon: "ERROR",
              });
              if (btnNm === "Ok") {
                dispatch({
                  type: "UPDATE_ROW",
                  payload: {
                    updUnqId,
                    updateFn: (row) => ({
                      ...row,
                      accNo: "",
                      bugMsgAccNo: "A/C No. Required",
                      trx: { label: "", value: "", code: "" },
                      bugMsgTrx: "",
                      cNo: "",
                      bugMsgCNo: "",
                      date: parse(chequeDate, "dd/MMM/yyyy", new Date()),
                      bugMsgDate: "",
                      debit: "",
                      bugMsgDebit: "",
                      credit: "",
                      bugMsgCredit: "",
                      cheqNoFlag: { [updUnqId]: false },
                      scroll: "",
                      bugMsgScroll: "",
                      acctNoFlag: { [updUnqId]: false },
                      cheqDateFlag: { [updUnqId]: false },
                    }),
                  },
                });
                shouldCallCarousalCards = false;
              }
            } else if (status === "99") {
              const { btnNm, msgObj } = await getBtnName({
                messageTitle: "Confirmation",
                message,
                buttonNames: ["Yes", "No"],
                icon: "CONFIRM",
              });
              if (btnNm === "No") {
                dispatch({
                  type: "UPDATE_ROW",
                  payload: {
                    updUnqId,
                    updateFn: (row) => ({
                      ...row,
                      accNo: "",
                      bugMsgAccNo: "A/C No. Required",
                      trx: { label: "", value: "", code: "" },
                      bugMsgTrx: "",
                      cNo: "",
                      bugMsgCNo: "",
                      date: parse(chequeDate, "dd/MMM/yyyy", new Date()),
                      bugMsgDate: "",
                      debit: "",
                      bugMsgDebit: "",
                      credit: "",
                      bugMsgCredit: "",
                      cheqNoFlag: { [updUnqId]: false },
                      scroll: "",
                      bugMsgScroll: "",
                      acctNoFlag: { [updUnqId]: false },
                      cheqDateFlag: { [updUnqId]: false },
                    }),
                  },
                });
                shouldCallCarousalCards = false;
              } else if (btnNm === "Yes") {
                dispatch({
                  type: "UPDATE_ROW",
                  payload: {
                    updUnqId,
                    updateFn: (row) => ({
                      ...row,
                      accNo: variables?.ACCT_CD,
                      bugMsgAccNo: "",
                      trx: { label: "", value: "", code: "" },
                      bugMsgTrx: "",
                      cNo: chequeNo,
                      bugMsgCNo: "",
                      date: parse(chequeDate, "dd/MMM/yyyy", new Date()),
                      bugMsgDate: "",
                      debit: "",
                      bugMsgDebit: "",
                      credit: "",
                      bugMsgCredit: "",
                      cheqNoFlag: { [updUnqId]: false },
                      scroll: "",
                      bugMsgScroll: "",
                      acctNoFlag: { [updUnqId]: false },
                      cheqDateFlag: { [updUnqId]: false },
                    }),
                  },
                });
                shouldCallCarousalCards = true;
              }
            } else if (status === "9") {
              const { btnNm, msgObj } = await getBtnName({
                messageTitle: "Alert",
                message,
                icon: "WARNING",
              });
              if (btnNm === "Ok") {
                dispatch({
                  type: "UPDATE_ROW",
                  payload: {
                    updUnqId,
                    updateFn: (row) => ({
                      ...row,
                      accNo: variables?.ACCT_CD,
                      bugMsgAccNo: "",
                      trx: { label: "", value: "", code: "" },
                      bugMsgTrx: "",
                      cNo: chequeNo,
                      bugMsgCNo: "",
                      date: parse(chequeDate, "dd/MMM/yyyy", new Date()),
                      bugMsgDate: "",
                      debit: "",
                      bugMsgDebit: "",
                      credit: "",
                      bugMsgCredit: "",
                      cheqNoFlag: { [updUnqId]: false },
                      scroll: "",
                      bugMsgScroll: "",
                      acctNoFlag: { [updUnqId]: false },
                      cheqDateFlag: { [updUnqId]: false },
                    }),
                  },
                });
                shouldCallCarousalCards = true;
              }
            } else if (status === "0") {
              dispatch({
                type: "UPDATE_ROW",
                payload: {
                  updUnqId,
                  updateFn: (row) => ({
                    ...row,
                    accNo: variables?.ACCT_CD,
                    bugMsgAccNo: "",
                    trx: { label: "", value: "", code: "" },
                    bugMsgTrx: "",
                    cNo: chequeNo,
                    bugMsgCNo: "",
                    date: parse(chequeDate, "dd/MMM/yyyy", new Date()),
                    bugMsgDate: "",
                    debit: "",
                    bugMsgDebit: "",
                    credit: "",
                    bugMsgCredit: "",
                    cheqNoFlag: { [updUnqId]: false },
                    scroll: "",
                    bugMsgScroll: "",
                    acctNoFlag: { [updUnqId]: true },
                    cheqDateFlag: { [updUnqId]: false },
                  }),
                },
              });
              shouldCallCarousalCards = true;
            }
          }
          setLoadingState(updUnqId, "ACCTNO", false);
        }
        return shouldCallCarousalCards;
      }
    },
    [state?.rows]
  );

  const handleTrxCtx = useCallback(
    async ({ updUnqId, value, defSdc, parametres, getBtnName }) => {
      if (parametres[0]?.RESTRICT_TRF_F1 === "Y") {
        if (value?.code === "3" || value?.code === "6") {
          const { btnNm, msgObj } = await getBtnName({
            messageTitle: "ValidationFailed",
            message: "Transfer not allowed.",
            icon: "ERROR",
          });
          if (btnNm === "Ok") {
            dispatch({
              type: "UPDATE_ROW",
              payload: {
                updUnqId,
                updateFn: (row) => ({
                  ...row,
                  trx: { label: "", value: "", code: "" },
                  bugMsgTrx: "",
                  sdc: { label: "", value: "", info: {} },
                  bugMsgSdc: "",
                  remark: "",
                  bugMsgRemarks: "",
                  isCredit: ["1", "2", "3"]?.includes(value?.code),
                }),
              },
            });
          }
        } else {
          dispatch({
            type: "UPDATE_ROW",
            payload: {
              updUnqId,
              updateFn: (row) => ({
                ...row,
                trx: value ?? "",
                sdc: defSdc ?? { label: "", value: "", info: {} },
                bugMsgSdc: "",
                remark: defSdc?.label ?? "",
                bugMsgRemarks: "",
                isCredit: ["1", "2", "3"]?.includes(value?.code),
              }),
            },
          });
        }
      } else {
        dispatch({
          type: "UPDATE_ROW",
          payload: {
            updUnqId,
            updateFn: (row) => ({
              ...row,
              trx: value ?? "",
              sdc: defSdc ?? { label: "", value: "", info: {} },
              bugMsgSdc: "",
              remark: defSdc?.label ?? "",
              bugMsgRemarks: "",
              isCredit: ["1", "2", "3"]?.includes(value?.code),
            }),
          },
        });
      }
    },
    [state?.rows]
  );

  const handleTrxBlurCtx = useCallback(
    ({ updUnqId, chequeDate }) => {
      const bugMsgTrx = state?.rows?.find((row) => row?.unqID === updUnqId)?.trx
        ?.code
        ? ""
        : "Trx Required";

      dispatch({
        type: "UPDATE_ROW",
        payload: {
          updUnqId,
          updateFn: (row) => ({
            ...row,
            cNo: "",
            bugMsgCNo: "",
            date: parse(chequeDate, "dd/MMM/yyyy", new Date()),
            bugMsgDate: "",
            debit: "",
            bugMsgDebit: "",
            credit: "",
            bugMsgCredit: "",
            scroll: "",
            bugMsgScroll: "",
            cheqNoFlag: { [updUnqId]: false },
            bugMsgTrx: bugMsgTrx,
            cheqDateFlag: { [updUnqId]: false },
          }),
        },
      });
    },
    [state?.rows]
  );

  const handleScrollCtx = useCallback(
    ({ updUnqId, value }) => {
      dispatch({
        type: "UPDATE_ROW",
        payload: {
          updUnqId,
          updateFn: (row) => ({
            ...row,
            scroll: value ?? "",
          }),
        },
      });
    },
    [state?.rows]
  );
  const handleScrollBlurCtx = useCallback(
    ({ updUnqId, value, mutationFn, authState, setLoadingState }) => {
      let preRequest;
      dispatch({
        type: "UPDATE_ROW",
        payload: {
          updUnqId,
          updateFn: (row) => {
            let bugScroll = "";
            // const bugMsgScroll =
            //   !row?.scroll && row?.trx?.code === "4" ? "Token Required" : "";
            if (Boolean(value)) {
              bugScroll = "";
              if (row?.trx?.code === "4") {
                const req = {
                  COMP_CD: authState?.companyID ?? "",
                  BRANCH_CD: row?.branch?.value ?? "",
                  ACCT_TYPE: row?.accType?.value ?? "",
                  ACCT_CD: row?.accNo ?? "",
                  TOKEN_NO: value ?? "",
                  SCREEN_REF: "TRN/001",
                  unqID: updUnqId,
                };
                if (
                  Boolean(JSON?.stringify(req) !== JSON?.stringify(preRequest))
                ) {
                  preRequest = req;
                  setLoadingState(updUnqId, "TOKEN", true);
                  mutationFn?.mutate(req);
                }
              }
            } else {
              bugScroll = row?.trx?.code === "4" ? "Token Required" : "";
            }
            return {
              ...row,
              bugMsgScroll: bugScroll,
            };
          },
        },
      });
    },
    [state?.rows]
  );

  const getTokenValidation = useCallback(
    async ({ updUnqId, data, getBtnName, setLoadingState }) => {
      if (state?.rows?.length > 0) {
        for (let i = 0; i < data?.length; i++) {
          if (data?.length > 0) {
            const status: any = data[i]?.O_STATUS;
            const message = data[i]?.O_MESSAGE;
            if (status === "999") {
              const { btnNm, msgObj } = await getBtnName({
                messageTitle: "ValidationFailed",
                message,
                icon: "ERROR",
              });
              if (btnNm === "Ok") {
                dispatch({
                  type: "UPDATE_ROW",
                  payload: {
                    updUnqId,
                    updateFn: (row) => ({
                      ...row,
                      scroll: "",
                      bugMsgScroll: "Token Required",
                    }),
                  },
                });
              }
            } else if (status === "99") {
              const { btnNm, msgObj } = await getBtnName({
                messageTitle: "Confirmation",
                message,
                buttonNames: ["Yes", "No"],
                icon: "CONFIRM",
              });
              if (btnNm === "No") {
                dispatch({
                  type: "UPDATE_ROW",
                  payload: {
                    updUnqId,
                    updateFn: (row) => ({
                      ...row,
                      scroll: "",
                      bugMsgScroll: "Token Required",
                    }),
                  },
                });
              }
            } else if (status === "9") {
              const { btnNm, msgObj } = await getBtnName({
                messageTitle: "Alert",
                message,
                icon: "WARNING",
              });
            }
          }
        }
        setLoadingState(updUnqId, "TOKEN", false);
      }
    },
    [state?.rows]
  );

  const handleSdcCtx = useCallback(
    ({ updUnqId, value }) => {
      dispatch({
        type: "UPDATE_ROW",
        payload: {
          updUnqId,
          updateFn: (row) => ({
            ...row,
            sdc: value,
            remark: value?.label,
            bugMsgRemarks: "",
          }),
        },
      });
    },
    [state?.rows]
  );
  const handleSdcBlurCtx = useCallback(
    ({ updUnqId }) => {
      const bugMsgSdc = state?.rows?.find((row) => row?.unqID === updUnqId)?.sdc
        ?.value
        ? ""
        : "SDC Required";
      dispatch({
        type: "UPDATE_ROW",
        payload: {
          updUnqId,
          updateFn: (row) => ({
            ...row,
            bugMsgSdc: bugMsgSdc,
          }),
        },
      });
    },
    [state?.rows]
  );

  const handleRemarkCtx = useCallback(
    ({ updUnqId, value }) => {
      dispatch({
        type: "UPDATE_ROW",
        payload: {
          updUnqId,
          updateFn: (row) => ({
            ...row,
            remark: value ?? "",
          }),
        },
      });
    },
    [state?.rows]
  );

  const handleRemarksBlurCtx = useCallback(
    ({ updUnqId }) => {
      const bugMsgRemarks = state?.rows?.find((row) => row?.unqID === updUnqId)
        ?.remark
        ? ""
        : "Remarks Required";
      dispatch({
        type: "UPDATE_ROW",
        payload: {
          updUnqId,
          updateFn: (row) => ({
            ...row,
            bugMsgRemarks: bugMsgRemarks,
          }),
        },
      });
    },
    [state?.rows]
  );
  const handleCNoCtx = useCallback(
    ({ updUnqId, value }) => {
      dispatch({
        type: "UPDATE_ROW",
        payload: {
          updUnqId,
          updateFn: (row) => ({
            ...row,
            cNo: value,
          }),
        },
      });
    },
    [state?.rows]
  );

  const handleCNoBlurCtx = useCallback(
    ({ updUnqId, value, mutationFn, setLoadingState }) => {
      let preData;

      dispatch({
        type: "UPDATE_ROW",
        payload: {
          updUnqId,
          updateFn: (row) => {
            const currentRequest = {
              BRANCH_CD: row?.branch?.value ?? "",
              ACCT_TYPE: row?.accType?.value ?? "",
              ACCT_CD: row?.accNo ?? "",
              CHEQUE_NO: value ?? "",
              TYPE_CD: row?.trx?.code ?? "",
              SCREEN_REF: "TRN/001",
              unqID: updUnqId,
            };

            let bugMsgCNo = "";
            if (Boolean(value)) {
              bugMsgCNo = "";
              if (
                Boolean(row?.accNo) &&
                Boolean(row?.accType?.value) &&
                Boolean(row?.branch?.value) &&
                Boolean(row?.trx?.value) &&
                !Boolean(row?.isCredit) &&
                Boolean(
                  JSON?.stringify(currentRequest) != JSON?.stringify(preData)
                )
              ) {
                preData = currentRequest;
                setLoadingState(updUnqId, "CHQNOVALID", true);
                mutationFn.mutate(currentRequest);
              }
            } else {
              bugMsgCNo = "Cheque No. Required";
            }

            return {
              ...row,
              cNo: value,
              bugMsgCNo,
              cheqNoFlag: { [updUnqId]: false },
            };
          },
        },
      });
    },
    [state?.rows]
  );

  const getChqValidationCtx = useCallback(
    async ({ updUnqId, data, getBtnName, chequeDate, setLoadingState }) => {
      let returnFlag;
      if (state?.rows?.length > 0) {
        for (let i = 0; i < data?.length; i++) {
          if (data?.length > 0) {
            const status: any = data[i]?.ERR_CODE;
            const message = data[i]?.ERR_MSG;

            if (status === "999") {
              const { btnNm, msgObj } = await getBtnName({
                messageTitle: "ValidationFailed",
                message,
                icon: "ERROR",
              });
              if (btnNm === "Ok") {
                dispatch({
                  type: "UPDATE_ROW",
                  payload: {
                    updUnqId,
                    updateFn: (row) => ({
                      ...row,
                      cNo: "",
                      bugMsgCNo: "Cheque No. Required",
                      date: parse(chequeDate, "dd/MMM/yyyy", new Date()),
                      bugMsgDate: "",
                      debit: "",
                      bugMsgDebit: "",
                      credit: "",
                      bugMsgCredit: "",
                      cheqNoFlag: { [updUnqId]: false },
                      cheqDateFlag: { [updUnqId]: false },
                    }),
                  },
                });
                returnFlag = false;
              }
            } else if (status === "99") {
              const { btnNm, msgObj } = await getBtnName({
                messageTitle: "Confirmation",
                message,
                buttonNames: ["Yes", "No"],
                icon: "CONFIRM",
              });
              if (btnNm === "No") {
                dispatch({
                  type: "UPDATE_ROW",
                  payload: {
                    updUnqId,
                    updateFn: (row) => ({
                      ...row,
                      cNo: "Cheque No. Required",
                      bugMsgCNo: "",
                      date: parse(chequeDate, "dd/MMM/yyyy", new Date()),
                      bugMsgDate: "",
                      debit: "",
                      bugMsgDebit: "",
                      credit: "",
                      bugMsgCredit: "",
                      cheqNoFlag: { [updUnqId]: false },
                      cheqDateFlag: { [updUnqId]: false },
                    }),
                  },
                });
                returnFlag = false;
              } else if (btnNm === "Yes") {
                dispatch({
                  type: "UPDATE_ROW",
                  payload: {
                    updUnqId,
                    updateFn: (row) => ({
                      ...row,
                      date: parse(chequeDate, "dd/MMM/yyyy", new Date()),
                      bugMsgDate: "",
                      debit: "",
                      bugMsgDebit: "",
                      credit: "",
                      bugMsgCredit: "",
                      cheqNoFlag: { [updUnqId]: false },
                      cheqDateFlag: { [updUnqId]: false },
                    }),
                  },
                });
                returnFlag = true;
              }
            } else if (status === "9") {
              const { btnNm, msgObj } = await getBtnName({
                messageTitle: "Alert",
                message,
                icon: "WARNING",
              });
              if (btnNm === "Ok") {
                dispatch({
                  type: "UPDATE_ROW",
                  payload: {
                    updUnqId,
                    updateFn: (row) => ({
                      ...row,
                      date: parse(chequeDate, "dd/MMM/yyyy", new Date()),
                      bugMsgDate: "",
                      debit: "",
                      bugMsgDebit: "",
                      credit: "",
                      bugMsgCredit: "",
                      cheqNoFlag: { [updUnqId]: false },
                      cheqDateFlag: { [updUnqId]: false },
                    }),
                  },
                });
                returnFlag = true;
              }
            } else if (status === "0") {
              dispatch({
                type: "UPDATE_ROW",
                payload: {
                  updUnqId,
                  updateFn: (row) => ({
                    ...row,
                    date: parse(chequeDate, "dd/MMM/yyyy", new Date()),
                    bugMsgDate: "",
                    debit: "",
                    bugMsgDebit: "",
                    credit: "",
                    bugMsgCredit: "",
                    cheqNoFlag: { [updUnqId]: true },
                    cheqDateFlag: { [updUnqId]: false },
                  }),
                },
              });
              returnFlag = true;
            }
          }
          setLoadingState(updUnqId, "CHQNOVALID", false);
        }
      }
      return returnFlag;
    },
    [state?.rows]
  );

  const handleDateCtx = useCallback(
    ({ updUnqId, date }) => {
      dispatch({
        type: "UPDATE_ROW",
        payload: {
          updUnqId,
          updateFn: (row) => ({
            ...row,
            date: date ?? "",
          }),
        },
      });
    },
    [state?.rows]
  );

  const handleDateBlurCtx = useCallback(
    ({ updUnqId, event, mutationFn, setLoadingState }) => {
      let preData;
      const date = event?.target?.value;
      const parsedDate = parse(date, "dd/MM/yyyy", new Date());
      dispatch({
        type: "UPDATE_ROW",
        payload: {
          updUnqId,
          updateFn: (row) => {
            const currentRequest = {
              BRANCH_CD: row?.branch?.value ?? "",
              TYPE_CD: row?.trx?.value ?? "",
              CHEQUE_NO: row?.cNo ?? "",
              CHEQUE_DT: row?.date ?? "",
              unqID: updUnqId,
            };
            let bugMsgDate = "";
            let bugDate = false;
            if (isValid(parsedDate)) {
              bugMsgDate = "";
              bugDate = false;
              if (
                Boolean(row?.cNo) &&
                Boolean(row?.date) &&
                Boolean(row?.trx?.value) &&
                Boolean(row?.branch?.value) &&
                Boolean(
                  JSON?.stringify(currentRequest) !== JSON?.stringify(preData)
                )
              ) {
                preData = currentRequest;
                setLoadingState(updUnqId, "CHQDATE", true);
                mutationFn?.mutate(currentRequest);
              }
            } else {
              bugMsgDate = "Invalid Date";
              bugDate = true;
            }
            return {
              ...row,
              date: parsedDate,
              bugMsgDate,
              bugDate,
              cheqDateFlag: { [updUnqId]: false },
            };
          },
        },
      });
    },
    [state?.rows]
  );

  const getDateValidationCtx = useCallback(
    async ({ updUnqId, data, getBtnName, chequeDate, setLoadingState }) => {
      let returnFlag;
      if (state?.rows?.length > 0) {
        for (let i = 0; i < data?.length; i++) {
          if (data?.length > 0) {
            const status: any = data[i]?.STATUS;
            const message = data[i]?.MESSAGE1;

            if (status === "999") {
              const { btnNm, msgObj } = await getBtnName({
                messageTitle: "ValidationFailed",
                message,
                icon: "ERROR",
              });
              if (btnNm === "Ok") {
                dispatch({
                  type: "UPDATE_ROW",
                  payload: {
                    updUnqId,
                    updateFn: (row) => ({
                      ...row,
                      date: "",
                      bugMsgDate: "Invalid Date",
                      debit: "",
                      bugMsgDebit: "",
                      credit: "",
                      bugMsgCredit: "",
                      cheqDateFlag: { [updUnqId]: false },
                    }),
                  },
                });
                returnFlag = false;
              }
            } else if (status === "99") {
              const { btnNm, msgObj } = await getBtnName({
                messageTitle: "Confirmation",
                message,
                buttonNames: ["Yes", "No"],
                icon: "CONFIRM",
              });
              if (btnNm === "No") {
                dispatch({
                  type: "UPDATE_ROW",
                  payload: {
                    updUnqId,
                    updateFn: (row) => ({
                      ...row,
                      date: "Invalid Date",
                      bugMsgDate: "",
                      debit: "",
                      bugMsgDebit: "",
                      credit: "",
                      bugMsgCredit: "",
                      cheqDateFlag: { [updUnqId]: false },
                    }),
                  },
                });
                returnFlag = false;
              } else if (btnNm === "Yes") {
                dispatch({
                  type: "UPDATE_ROW",
                  payload: {
                    updUnqId,
                    updateFn: (row) => ({
                      ...row,
                      debit: "",
                      bugMsgDebit: "",
                      credit: "",
                      bugMsgCredit: "",
                      cheqDateFlag: { [updUnqId]: false },
                    }),
                  },
                });
                returnFlag = true;
              }
            } else if (status === "9") {
              const { btnNm, msgObj } = await getBtnName({
                messageTitle: "Alert",
                message,
                icon: "WARNING",
              });
              if (btnNm === "Ok") {
                dispatch({
                  type: "UPDATE_ROW",
                  payload: {
                    updUnqId,
                    updateFn: (row) => ({
                      ...row,
                      debit: "",
                      bugMsgDebit: "",
                      credit: "",
                      bugMsgCredit: "",
                      cheqDateFlag: { [updUnqId]: false },
                    }),
                  },
                });
                returnFlag = true;
              }
            } else if (status === "0") {
              dispatch({
                type: "UPDATE_ROW",
                payload: {
                  updUnqId,
                  updateFn: (row) => ({
                    ...row,
                    debit: "",
                    bugMsgDebit: "",
                    credit: "",
                    bugMsgCredit: "",
                    cheqDateFlag: { [updUnqId]: true },
                  }),
                },
              });
              returnFlag = true;
            }
          }
        }
      }
      setLoadingState(updUnqId, "CHQDATE", false);
      return returnFlag;
    },
    [state?.rows]
  );

  const handleDebitCtx = useCallback(
    ({ updUnqId, newRow }) => {
      dispatch({
        type: "UPDATE_ROW_DIRECT",
        payload: { updUnqId, newRow },
      });
    },
    [state?.rows]
  );

  const handleDebitBlurCtx = useCallback(
    ({
      updUnqId,
      value,
      setLoadingState,
      mutationFn,
      authState,
      cardData,
      status,
    }) => {
      let preData;
      dispatch({
        type: "UPDATE_ROW",
        payload: {
          updUnqId,
          updateFn: (row) => {
            const bugMsgDebit =
              value && !row?.isCredit ? "" : "Debit Amount Required";
            if (
              Boolean(value) &&
              Boolean(row) &&
              Object?.keys(row)?.length > 0 &&
              Object?.keys(cardData)?.length > 0
            ) {
              const reqPara = {
                BRANCH_CD: row?.branch?.value ?? "",
                ACCT_TYPE: row?.accType?.value ?? "",
                ACCT_CD: row?.accNo ?? "",
                TYPE_CD: row?.trx?.code ?? "",
                COMP_CD: authState?.companyID ?? "",
                CHEQUE_NO: row?.cNo ?? "",
                AVALIABLE_BAL: cardData?.WITHDRAW_BAL ?? "0",
                SHADOW_CL: cardData?.TRAN_BAL,
                HOLD_BAL: cardData?.HOLD_BAL ?? "0", ///////
                LEAN_AMT: cardData?.LIEN_AMT ?? "0",
                AGAINST_CLEARING: cardData?.AGAINST_CLEARING ?? "N", ///////
                MIN_BALANCE: cardData?.MIN_BALANCE ?? "0", ///////
                CONF_BAL: cardData?.CONF_BAL,
                TRAN_BAL: cardData?.TRAN_BAL,
                UNCL_BAL: cardData?.UNCL_BAL ?? "",
                LIMIT_AMOUNT: cardData?.LIMIT_AMOUNT ?? "0",
                DRAWING_POWER: cardData?.DRAWING_POWER ?? "0",
                AMOUNT: row?.debit ?? "0",
                OD_APPLICABLE: cardData?.OD_APPLICABLE ?? "N",
                OP_DATE: cardData?.OP_DATE ?? "",
                INST_NO: cardData?.INST_NO ?? "0",
                INST_RS: cardData?.INST_RS ?? "0",
                PENDING_AMOUNT: cardData?.PENDING_AMOUNT ?? "0",
                STATUS: status,
                TYPE: "C",
                SCREEN_REF: "TRN/001",
                TRAN_CD: "",
                FLAG: "D",
                unqID: updUnqId,
              };

              if (
                Boolean(JSON?.stringify(reqPara) !== JSON?.stringify(preData))
              ) {
                preData = reqPara;
                setLoadingState(updUnqId, "AMNTVALIDDR", true);
                mutationFn?.mutate(reqPara);
              }
            }
            return { ...row, bugMsgDebit };
          },
        },
      });
    },
    []
  );

  const handleCreditCtx = useCallback(
    ({ updUnqId, newRow }) => {
      dispatch({
        type: "UPDATE_ROW_DIRECT",
        payload: { updUnqId, newRow },
      });
    },
    [state?.rows]
  );

  const handleCreditBlurCtx = useCallback(
    ({
      updUnqId,
      value,
      setLoadingState,
      cardData,
      authState,
      mutationFn,
      status,
    }) => {
      let preData;
      dispatch({
        type: "UPDATE_ROW",
        payload: {
          updUnqId,
          updateFn: (row) => {
            const bugMsgCredit =
              !value && Boolean(row?.isCredit) ? "Credit Amount Required" : "";
            if (
              Boolean(value) &&
              Boolean(row) &&
              Object?.keys(row)?.length > 0 &&
              Object?.keys(cardData)?.length > 0
            ) {
              const reqPara = {
                BRANCH_CD: row?.branch?.value ?? "",
                ACCT_TYPE: row?.accType?.value ?? "",
                ACCT_CD: row?.accNo ?? "",
                TYPE_CD: row?.trx?.code ?? "",
                COMP_CD: authState?.companyID ?? "",
                CHEQUE_NO: row?.cNo ?? "",
                AVALIABLE_BAL: cardData?.WITHDRAW_BAL ?? "0",
                SHADOW_CL: cardData?.TRAN_BAL,
                HOLD_BAL: cardData?.HOLD_BAL ?? "0", ///////
                LEAN_AMT: cardData?.LIEN_AMT ?? "0",
                AGAINST_CLEARING: cardData?.AGAINST_CLEARING ?? "N", ///////
                MIN_BALANCE: cardData?.MIN_BALANCE ?? "0", ///////
                CONF_BAL: cardData?.CONF_BAL,
                TRAN_BAL: cardData?.TRAN_BAL,
                UNCL_BAL: cardData?.UNCL_BAL ?? "",
                LIMIT_AMOUNT: cardData?.LIMIT_AMOUNT ?? "0",
                DRAWING_POWER: cardData?.DRAWING_POWER ?? "0",
                AMOUNT: row?.credit ?? "0",
                OD_APPLICABLE: cardData?.OD_APPLICABLE ?? "N",
                OP_DATE: cardData?.OP_DATE ?? "",
                INST_NO: cardData?.INST_NO ?? "0",
                INST_RS: cardData?.INST_RS ?? "0",
                PENDING_AMOUNT: cardData?.PENDING_AMOUNT ?? "0",
                STATUS: status,
                TYPE: "C",
                SCREEN_REF: "TRN/001",
                TRAN_CD: "",
                FLAG: "C",
                unqID: updUnqId,
              };

              if (
                Boolean(JSON?.stringify(reqPara) !== JSON?.stringify(preData))
              ) {
                preData = reqPara;
                setLoadingState(updUnqId, "AMNTVALIDCR", true);
                mutationFn?.mutate(reqPara);
              }
            }
            return { ...row, bugMsgCredit };
          },
        },
      });
    },
    []
  );

  const getAmountValidationCtx = useCallback(
    async ({
      updUnqId,
      data,
      getBtnName,
      setLoadingState,
      totalDebit,
      totalCredit,
      handleAddRow,
      crDbFlag,
    }) => {
      if (state?.rows?.length > 0) {
        const rowData = state?.rows[updUnqId];
        for (let i = 0; i < data?.length; i++) {
          if (data?.length > 0) {
            const status: any = data[i]?.O_STATUS;
            const message = data[i]?.O_MESSAGE;
            if (status === "999") {
              const { btnNm, msgObj } = await getBtnName({
                messageTitle: "ValidationFailed",
                message,
                icon: "ERROR",
              });
              if (btnNm === "Ok") {
                dispatch({
                  type: "UPDATE_ROW",
                  payload: {
                    updUnqId,
                    updateFn: (row) => ({
                      ...row,
                      debit: "",
                      credit: "",
                      bugMsgDebit:
                        crDbFlag === "D" ? "Debit Amount Required" : "",
                      bugMsgCredit:
                        crDbFlag === "D" ? "" : "Credit Amount Required",
                    }),
                  },
                });
              }
            } else if (status === "99") {
              const { btnNm, msgObj } = await getBtnName({
                messageTitle: "Confirmation",
                message,
                buttonNames: ["Yes", "No"],
                icon: "CONFIRM",
              });
              if (btnNm === "No") {
                dispatch({
                  type: "UPDATE_ROW",
                  payload: {
                    updUnqId,
                    updateFn: (row) => ({
                      ...row,
                      debit: "",
                      credit: "",
                      bugMsgDebit:
                        crDbFlag === "D" ? "Debit Amount Required" : "",
                      bugMsgCredit:
                        crDbFlag === "D" ? "" : "Credit Amount Required",
                    }),
                  },
                });
                break;
              }
            } else if (status === "9") {
              const { btnNm, msgObj } = await getBtnName({
                messageTitle: "Alert",
                message,
                icon: "WARNING",
              });
            } else if (status === "0") {
              if (Boolean(rowData)) {
                const { trx, debit: rowDebit, credit: rowCredit } = rowData;
                if (
                  Boolean(totalDebit !== totalCredit) &&
                  Boolean(trx?.code === "3" || trx?.code === "6") &&
                  Boolean(rowCredit !== rowDebit)
                ) {
                  handleAddRow(updUnqId);
                }
              }
            }
          }
        }
        setLoadingState(
          updUnqId,
          crDbFlag === "D" ? "AMNTVALIDDR" : "AMNTVALIDCR",
          false
        );
      }
    },
    [state?.rows]
  );
  const deleteRowCtx = useCallback(
    ({ updUnqId, handleTotal }) => {
      dispatch({
        type: "DELETE_ROW",
        payload: {
          updUnqId,
        },
      });
      handleTotal(state?.rows?.filter((row) => row?.unqID !== updUnqId));
    },
    [state?.rows]
  );

  const checkErrorsFn = () => {
    const allRows = state?.rows ?? [];
    return stateRef?.current?.rows?.some((row) => {
      const errorFields = [
        "bugMsgBranchCode",
        "bugMsgAccType",
        "bugMsgAccNo",
        "bugMsgTrx",
        "bugMsgScroll",
        "bugMsgSdc",
        "bugMsgRemarks",
        "bugMsgCNo",
        "bugMsgDate",
        "bugMsgDebit",
        "bugMsgCredit",
      ];

      const haveBug = errorFields?.some((field) => {
        return Boolean(row[field]);
      });

      return haveBug;
    });
  };

  const setFieldsError = useCallback(
    ({ updUnqId, payload }) => {
      dispatch({
        type: "UPDATE_ROW",
        payload: {
          updUnqId,
          updateFn: (row) => ({
            ...row,
            ...payload,
          }),
        },
      });
    },
    [state?.rows]
  );

  const commonStateUpdate = (dataObj) => {
    dispatch({
      type: "COMMON_TYPE",
      payload: { dataObj },
    });
  };

  const getConfirmValidationCtx = useCallback(
    async ({ data, getBtnName }) => {
      let returnFlag = false;
      if (state?.rows?.length > 0) {
        for (let i = 0; i < data?.length; i++) {
          if (data?.length > 0) {
            const status: any = data[i]?.O_STATUS;
            const message = data[i]?.O_MESSAGE;
            if (status === "999") {
              const { btnNm, msgObj } = await getBtnName({
                messageTitle: "ValidationFailed",
                message,
                icon: "ERROR",
              });
              returnFlag = false;
            } else if (status === "99") {
              const { btnNm, msgObj } = await getBtnName({
                messageTitle: "Confirmation",
                message,
                buttonNames: ["Yes", "No"],
                icon: "CONFIRM",
              });
              if (btnNm === "No") {
                returnFlag = false;
                break;
              } else if (btnNm === "Yes") {
                returnFlag = true;
              }
            } else if (status === "9") {
              const { btnNm, msgObj } = await getBtnName({
                messageTitle: "Alert",
                message,
                icon: "WARNING",
              });
              if (btnNm === "Ok") {
                returnFlag = true;
              }
            } else if (status === "0") {
              returnFlag = true;
            }
          }
        }
        return returnFlag;
      }
    },
    [state?.rows]
  );

  return (
    <TRN001Context.Provider
      value={{
        state,
        stateRef: stateRef?.current,
        dispatch,
        handleSetDefaultBranch,
        handleBranchChange,
        handleBranchBlur,
        handleAccTypeChange,
        handleAccTypeBlurCtx,
        handleAcctNoChange,
        handleAcctNoBlurCtx,
        getAcctNoValidationCtx,
        handleTrxCtx,
        handleTrxBlurCtx,
        handleScrollCtx,
        handleScrollBlurCtx,
        handleSdcCtx,
        handleSdcBlurCtx,
        handleRemarkCtx,
        handleRemarksBlurCtx,
        handleCNoCtx,
        handleCNoBlurCtx,
        getChqValidationCtx,
        handleDateCtx,
        handleDateBlurCtx,
        handleDebitCtx,
        handleDebitBlurCtx,
        handleCreditCtx,
        handleCreditBlurCtx,
        getDateValidationCtx,
        getAmountValidationCtx,
        deleteRowCtx,
        checkErrorsFn,
        commonStateUpdate,
        getTokenValidation,
        setFieldsError,
        getConfirmValidationCtx,
      }}
    >
      {children}
    </TRN001Context.Provider>
  );
};
export default TRN001Provider;

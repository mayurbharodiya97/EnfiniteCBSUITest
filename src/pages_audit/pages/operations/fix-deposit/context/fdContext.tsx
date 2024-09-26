import { createContext, useReducer } from "react";
import { FDStateType, ActionType, FDContextType } from "./type";

const inititalState: FDStateType = {
  activeStep: 0,
  isBackButton: false,
  disableButton: false,
  fdDetailFormData: {
    FDDTL: [
      {
        ACCT_NAME: "",
      },
    ],
  },
  sourceAcctFormData: {
    TRNDTLS: [
      {
        ACCT_NAME: "",
      },
    ],
  },
  retrieveFormData: {},
  fdParaDetailData: {},
  acctNoData: {},
  viewDtlGridData: [],
};

const FDReducer = (state: FDStateType, action: ActionType): FDStateType => {
  switch (action.type) {
    case "commonType":
      return {
        ...state,
        ...action.payload,
      };
    case "activeStep":
      return {
        ...state,
        ...action.payload,
      };
    case "resetAllData":
      return inititalState;
    default: {
      return state;
    }
  }
};

export const FDContext = createContext<any>(inititalState);

export const FDContextWrapper = ({ children }) => {
  const [state, dispatch] = useReducer(FDReducer, inititalState);

  const setActiveStep = (value) => {
    dispatch({
      type: "activeStep",
      payload: {
        activeStep: value,
      },
    });
  };
  const setIsBackButton = (data) => {
    dispatch({
      type: "commonType",
      payload: {
        isBackButton: data,
      },
    });
  };
  const handleDisableButton = (data) => {
    dispatch({
      type: "commonType",
      payload: {
        disableButton: data,
      },
    });
  };
  const updateFDDetailsFormData = (data) => {
    dispatch({
      type: "commonType",
      payload: {
        fdDetailFormData: { FDDTL: data },
      },
    });
  };
  const updateSourceAcctFormData = (data) => {
    dispatch({
      type: "commonType",
      payload: {
        sourceAcctFormData: { TRNDTLS: data },
      },
    });
  };
  const updateRetrieveFormData = (data) => {
    dispatch({
      type: "commonType",
      payload: {
        retrieveFormData: data,
      },
    });
  };
  const updateFDParaDetailData = (data) => {
    dispatch({
      type: "commonType",
      payload: {
        fdParaDetailData: data,
      },
    });
  };
  const updateAcctNoData = (data) => {
    dispatch({
      type: "commonType",
      payload: {
        acctNoData: data,
      },
    });
  };
  const updateViewDtlGridData = (data) => {
    dispatch({
      type: "commonType",
      payload: {
        viewDtlGridData: data,
      },
    });
  };

  const resetAllData = (data) => {
    dispatch({
      type: "resetAllData",
      payload: {},
    });
  };

  return (
    <FDContext.Provider
      value={{
        FDState: state,
        setActiveStep,
        resetAllData,
        setIsBackButton,
        handleDisableButton,
        updateFDDetailsFormData,
        updateSourceAcctFormData,
        updateRetrieveFormData,
        updateFDParaDetailData,
        updateAcctNoData,
        updateViewDtlGridData,
      }}
    >
      {children}
    </FDContext.Provider>
  );
};

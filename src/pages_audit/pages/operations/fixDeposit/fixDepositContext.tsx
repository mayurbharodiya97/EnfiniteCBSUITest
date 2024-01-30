import { createContext, useReducer, useState } from "react";
import { FDContextType, FDStateType, ActionType } from "./type";

const inititalState: FDStateType = {
  activeStep: 0,
  fdParaFormData: { FD_TYPE: "E", MODE: "3" },
  isOpendfdAcctForm: false,
  fdAcctFormData: {},
};

const fdReducer = (state: FDStateType, action: ActionType): FDStateType => {
  // console.log(">>state", state?.fdParaFormData);
  // console.log(">>action", action);
  switch (action.type) {
    case "updateActiveStep":
    case "updateFDParaFormData":
    case "updateIsOpendfdAcct":
    case "updateFDAcctFormData":
      return {
        ...state,
        ...action.payload,
      };
    case "updateFDParaOnChange":
      return {
        ...state,
        fdParaFormData: { ...state?.fdParaFormData, ...action.payload },
      };
    default: {
      return state;
    }
  }
};

export const FixDepositContext = createContext<any>(inititalState);

export const FixDepositProvider = ({ children }) => {
  const [state, dispatch] = useReducer(fdReducer, inititalState);

  const setActiveStep = (value) => {
    dispatch({
      type: "updateActiveStep",
      payload: {
        activeStep: value,
      },
    });
  };

  const updateFDParaFormData = (data) => {
    dispatch({
      type: "updateFDParaFormData",
      payload: {
        fdParaFormData: { ...data },
      },
    });
  };

  const updateFDParaDataOnChange = (data) => {
    dispatch({
      type: "updateFDParaOnChange",
      payload: {
        ...data,
      },
    });
  };

  const setIsOpendfdAcctForm = (value) => {
    dispatch({
      type: "updateIsOpendfdAcct",
      payload: {
        isOpendfdAcctForm: value,
      },
    });
  };

  const updateFDAccountsFormData = (data) => {
    dispatch({
      type: "updateFDAcctFormData",
      payload: {
        fdAcctFormData: data,
      },
    });
  };

  return (
    <FixDepositContext.Provider
      value={{
        fdState: state,
        setActiveStep,
        updateFDParaFormData,
        updateFDParaDataOnChange,
        setIsOpendfdAcctForm,
        updateFDAccountsFormData,
      }}
    >
      {children}
    </FixDepositContext.Provider>
  );
};

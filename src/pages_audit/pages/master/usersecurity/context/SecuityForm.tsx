import { createContext, useReducer } from "react";
import { StateType, ActionType, ContextType } from "./type";

const inititalState: StateType = {
  formData: {},
  oldformData: {},
  form1Data: {},
  grid1: [],
  grid2: [],
  grid3: [],
  grid4: {},
  grid5: [],
  oldData: [],
  oldData1: [],
  oldData2: [],
  oldData3: [],
  oldData4: {},
  saveData: {},
  initPopulateData: [],
  initPopulateData1: [],
  initPopulateData2: [],
  activeStep: 0,
  isBackButton: false,
};

const userReducer = (state: StateType, action: ActionType): StateType => {
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
    case "formData":
      return {
        ...state,
        formData: { ...state?.formData, ...action.payload },
      };
    case "oldformData":
      return {
        ...state,
        oldformData: { ...state?.formData, ...action.payload },
      };
    case "saveData":
      return {
        ...state,
        saveData: { ...state?.saveData, ...action.payload },
      };
    case "grid1":
      return {
        ...state,
        grid1: action.payload,
      };
    case "grid2":
      return {
        ...state,
        grid2: action.payload,
      };
    case "grid3":
      return {
        ...state,
        grid3: action.payload,
      };
    case "grid4":
      return {
        ...state,
        grid4: { ...state?.grid4, ...action.payload },
      };
      case "grid5":
        return {
          ...state,
          grid5: action.payload,
        };
    case "oldData":
      return {
        ...state,
        oldData: action.payload,
      };
    case "oldData1":
      return {
        ...state,
        oldData1: action.payload,
      };
    case "oldData2":
      return {
        ...state,
        oldData2: action.payload,
      };
    case "oldData3":
      return {
        ...state,
        oldData3: action.payload,
      };
    case "oldData4":
      return {
        ...state,
        oldData4: action.payload,
      };
    case "initPopulateData":
      return {
        ...state,
        initPopulateData: action.payload,
      };
    case "initPopulateData1":
      return {
        ...state,
        initPopulateData1: action.payload,
      };
    case "initPopulateData2":
      return {
        ...state,
        initPopulateData2: action.payload,
      };
    case "resetAllData":
      return inititalState;
    default: {
      return state;
    }
  }
};

export const SecurityContext = createContext<any>(inititalState);

export const SecurityContextWrapper = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, inititalState);
  const setActiveStep = (value) => {
    dispatch({
      type: "activeStep",
      payload: {
        activeStep: value,
      },
    });
  };
  const updateoldData = (data) => {
    dispatch({
      type: "commonType",
      payload: {
        oldData: data,
      },
    });
  };
  const updateoldData1 = (data) => {
    dispatch({
      type: "commonType",
      payload: {
        oldData1: data,
      },
    });
  };
  const updateoldData2 = (data) => {
    dispatch({
      type: "commonType",
      payload: {
        oldData2: data,
      },
    });
  };
  const populateData = (data) => {
    dispatch({
      type: "commonType",
      payload: {
        initPopulateData: data,
      },
    });
  };
  const resetAllData = (data) => {
    dispatch({
      type: "resetAllData",
      payload: {},
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
  const dispatchCommon = (type: string, payload: object) => {
    dispatch({
      type: type,
      payload: payload ?? {},
    });
  };
  return (
    <SecurityContext.Provider
      value={{
        userState: state,
        setActiveStep,
        dispatchCommon,
        updateoldData,
        updateoldData1,
        updateoldData2,
        populateData,
        resetAllData,
        setIsBackButton,
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
};

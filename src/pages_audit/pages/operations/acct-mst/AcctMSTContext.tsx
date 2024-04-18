import React, { useCallback, useReducer } from "react";

const initialState: any = {
  acctModectx: "",
  isLoading: false,
  param320: null,
  gparam155: null,

  // all customer-mst states
  isFormModalOpenctx: false,
  handleFormModalOpenctx: () => {},
  handleFormModalClosectx: () => {},

  fromctx: "",
  formmodectx: "",
  isDraftSavedctx: false,

  isSidebarExpandedctx: false,
  setIsSidebarExpandedctx: () => {},
  handleSidebarExpansionctx: () => {},

  colTabValuectx: 0,
  setColTabValuectx: () => {},
  handleColTabChangectx: () => {},

  isLoadingDatactx: () => {},
  setIsLoadingDatactx: () => {},
  isCustomerDatactx: false,
  setIsCustomerDatactx: () => {},

  entityTypectx: null,
  setEntityTypectx: () => {},

  tabsApiResctx: [],
  tabNameList: [],
  setTabsApiRes: () => {},
  // customerCategoriesctx: [],
  categConstitutionValuectx: null,
  categoryValuectx: null,
  constitutionValuectx: null,
  accTypeValuectx: null,
  kycNoValuectx: null,
  setCategoryValue: () => {},
  setConstitutionValuectx: () => {},
  setAccTypeValuectx: () => {},
  AccTypeOptionsctx: [],

  formDatactx: {},
  retrieveFormDataApiRes: {},
  customerIDctx: "",
  formDataDraftctx: {},
  isFreshEntryctx: false,
  req_cd_ctx: "",

  photoBlobctx: null,
  photoBase64ctx: null,
  signBlobctx: null,
  signBase64ctx: null,

  confirmFlagctx: null,
  update_casectx: null,
  steps: {
    0: { status: "" },
  },
  currentFormctx: {
    currentFormRefctx: [],
    currentFormSubmitted: null,
    colTabValuectx: null,
    isLoading: false,
  },
  modifiedFormCols: {},
  updateFormDatactx: {},
  isFinalUpdatectx: false,

  // steps: {
  //     error: [],
  //     completed: [],
  //     notValidated: []
  // }
};

const Reducer = (state, action) => {
  switch (action.type) {
    case "handleFromFormMode":
    case "handleFormModalOpen":
    case "handleDraftSave":
    case "handleFormModalClose":
    case "update_ApiResctx":
    case "handleCategoryChangectx":
    case "update_accTypeValuectx":
    case "update_kycNoValuectx":
    case "update_req_cd_ctxctx":
    case "update_photo_signctx":
    case "update_isSidebarExpandedctx":
    case "update_colTabValuectx":
    case "update_stepStatus":
    case "update_formData":
    case "update_formDataDraft":
    case "update_retrieveFormData":
    case "modify_formdata":
    case "modify_tabCols":
    case "update_customerIDctx":
    case "reset_ckyc":
    case "set_currentFormObj":
    case "onFinalUpdate":
    case "handle_formloading":
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
export const AcctMSTContext = React.createContext<any>({
  AcctMSTState: initialState,
  handleFormLoading: () => {},
  handleFromFormModectx: () => {},
  handleFormModalClosectx: () => {},
  handleSidebarExpansionctx: () => {},
  handleHeaderFormSubmit: () => {},
  handleApiRes: () => {},
  handleColTabChangectx: () => {},
  handleFormModalOpenct: () => {},
});
  const AcctMSTProvider = ({ children }) => {
    const [state, dispatch] = useReducer(Reducer, initialState);

    interface handleFromFormModeTyoe {
      formmode?: string | null,
      from?: string | null
  } 
  const handleFromFormModectx = useCallback((data:handleFromFormModeTyoe) => {
      const keys = Object.keys(data)
      let payload = {};
      if(keys.includes("formmode")) {
          payload["formmodectx"] = data["formmode"];
      }
      if(keys.includes("from")) {
          payload["fromctx"] = data["from"];
      }
      dispatch({
          type: "handleFromFormMode", 
          payload: payload
      })
  }, [])

  const handleFormModalClosectx = useCallback(() => {
    dispatch({
      type: "handleFormModalClose",
      payload: {
        acctModectx: "",
        isLoading: false,
        param320: null,
        gparam155: null,

        isFormModalOpenctx: false,
        entityTypectx: null,
        colTabValuectx: false,
        categConstitutionValuectx: null,
        categoryValuectx: null,
        constitutionValuectx: null,
        accTypeValuectx: "",
        tabsApiResctx: [],
        isFreshEntryctx: false,
        tabNameList: [],
        formDatactx: {},
        steps: {},

        retrieveFormDataApiRes: {},
        req_cd_ctx: "",
        customerIDctx: "",
        photoBlobctx: null,
        photoBase64ctx: null,
        signBlobctx: null,
        signBase64ctx: null,

        modifiedFormCols: {},
        updateFormDatactx: {},
        confirmFlagctx: "",
        update_casectx: "",
        currentFormctx: {
          currentFormRefctx: [],
          currentFormSubmitted: null,
          colTabValuectx: null,
          isLoading: false,
        },
        isFinalUpdatectx: false,

        fromctx: "",
        formmodectx: "",
        isDraftSavedctx: false,
      },
    });
  }, []);

  const handleSidebarExpansionctx = useCallback(() => {
    dispatch({
      type: "update_isSidebarExpandedctx",
      payload: {
        isSidebarExpandedctx: !state.isSidebarExpandedctx,
      },
    });
  }, [state.isSidebarExpandedctx]);

  interface handleHeaderFormSubmit {
    acctType?:any, 
    acctMode?:any
  }
  const handleHeaderFormSubmit = useCallback((reqObj:handleHeaderFormSubmit) => {
    let payload:any = {}
    if(Boolean(reqObj.acctType)) {
      payload.accTypeValuectx = reqObj.acctType; 
    }
    if(Boolean(reqObj.acctMode)) {
      payload.acctModectx = reqObj.acctMode; 
    }
    dispatch({
      type: "update_accTypeValuectx",
      payload: {...payload}
    })
  }, [])

  const handleApiRes = useCallback((apiRes) => {
    // console.log("asdasdas>>", apiRes)
    let steps:any[] = [] 
    apiRes.forEach((element:any) => {
      steps.push({tabName: element?.TAB_DISPL_NAME, icon: element?.ICON, isVisible: element?.isVisible ?? true})
    })
    const PARAM320 = apiRes?.[0]?.PARA_320;
    const GPARAM155 = apiRes?.[0]?.GPARA_155;

    dispatch({
        type: "update_ApiResctx",
        payload: {
            tabsApiResctx: apiRes,
            tabNameList: steps,
            param320: PARAM320,
            gparam155: GPARAM155,
        }
    })
  }, [])

  const handleColTabChangectx = useCallback((value:any) => {
    dispatch({
        type: "update_colTabValuectx",
        payload: {
            colTabValuectx: value,
        }
    })
  },[])

  const handleFormModalOpenctx = useCallback(() => {
    dispatch({
        type: "handleFormModalOpen", 
        payload: {isFormModalOpenctx: true, isFreshEntryctx: true }
    })
  }, [])

  const handleFormLoading = useCallback((isloading:boolean) => {
    dispatch({
      type: "handle_formloading",
      payload: {
        isLoading: isloading
      }
    })
  }, [])

  const handleCurrFormctx = useCallback((obj) => {
    let currVal = state?.currentFormctx
    dispatch({
        type: "set_currentFormObj",
        payload: {
            currentFormctx: {
                ...currVal,
                ...obj 
            }
        }
    })
  }, [state?.currentFormctx])
  const handleStepStatusctx = ({status= "error", coltabvalue= 0}) => {
    dispatch({
        type: "update_stepStatus",
        payload: {
            steps: {
                ...state?.steps,
                [coltabvalue]: {status: status}
            }
        }
    })
  }

  const handleFormDataonSavectx = (data) => {
    dispatch({
        type: "update_formData",
        payload: {
            formDatactx: {...data}
        }
    })
  }

  const handleModifiedColsctx = (tabModifiedCols ) => {    
    dispatch({
        type: "modify_tabCols",
        payload: {
            modifiedFormCols: {...tabModifiedCols}
        }
    })
  }

  const handleSavectx = (e, refs) => {
    // ref(e, "save")
    Promise.all([refs])
    .then((response) => {
      // console.log("evalSave in success ", response)
    }).catch(err => {
      // console.log("evalSave out catch", err.message)
    })    
  }

  return (
    <AcctMSTContext.Provider
      value={{
        AcctMSTState:state,
        handleFormLoading,
        handleFromFormModectx,
        handleFormModalClosectx,
        handleSidebarExpansionctx,
        handleHeaderFormSubmit,
        handleApiRes,
        handleColTabChangectx,
        handleFormModalOpenctx,
        handleCurrFormctx,
        handleStepStatusctx,
        handleFormDataonSavectx,
        handleModifiedColsctx,
        handleSavectx
      }}
    >
      {children}
    </AcctMSTContext.Provider>
  );
};

export default AcctMSTProvider;

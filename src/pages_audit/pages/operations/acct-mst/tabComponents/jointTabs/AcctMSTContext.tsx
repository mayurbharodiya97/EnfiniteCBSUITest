import { utilFunction } from "@acuteinfo/common-base";
import _ from "lodash";
import React, { useCallback, useReducer } from "react";

const initialState: any = {
  acctModectx: "",
  acctNumberctx: "",
  isLoading: false,
  param320: "",
  gparam155: "",

  // all customer-mst states
  isFormModalOpenctx: false,

  fromctx: "",
  formmodectx: "",
  isDraftSavedctx: false,

  isSidebarExpandedctx: false,

  colTabValuectx: 0,
  // handleColTabChangectx: () => {},

  isCustomerDatactx: false,

  entityTypectx: null,

  tabsApiResctx: [],
  tabNameList: [],
  // customerCategoriesctx: [],
  categConstitutionValuectx: null,
  categoryValuectx: null,
  constitutionValuectx: null,
  accTypeValuectx: null,
  kycNoValuectx: null,
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
  handleFormModalOpenOnEditctx: () => {},
  handleSidebarExpansionctx: () => {},
  handleHeaderFormSubmit: () => {},
  handleApiRes: () => {},
  handleColTabChangectx: () => {},
  handleFormModalOpenctx: () => {},
  handleCurrFormctx: () => {},
  handleStepStatusctx: () => {},
  handleFormDataonSavectx: () => {},
  handlecustomerIDctx: () => {},
  handleModifiedColsctx: () => {},
  handleFormDataonRetrievectx: () => {},
  handleSavectx: () => {},
  handleUpdatectx: () => {},
});
const AcctMSTProvider = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  interface handleFromFormModeTyoe {
    formmode?: string | null;
    from?: string | null;
  }
  const handleFromFormModectx = useCallback((data: handleFromFormModeTyoe) => {
    const keys = Object.keys(data);
    let payload = {};
    if (keys.includes("formmode")) {
      payload["formmodectx"] = data["formmode"];
    }
    if (keys.includes("from")) {
      payload["fromctx"] = data["from"];
    }
    dispatch({
      type: "handleFromFormMode",
      payload: payload,
    });
  }, []);

  const handleFormModalClosectx = useCallback(() => {
    dispatch({
      type: "handleFormModalClose",
      payload: {
        acctModectx: "",
        acctNumberctx: "",
        isLoading: false,
        param320: "",
        gparam155: "",

        isFormModalOpenctx: false,
        entityTypectx: null,
        colTabValuectx: false,
        categConstitutionValuectx: null,
        categoryValuectx: null,
        constitutionValuectx: null,
        accTypeValuectx: null,
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

  interface handleHeaderFormSubmitType {
    acctType: any;
    reqID: any;
  }
  const handleHeaderFormSubmit = useCallback(
    (reqObj: handleHeaderFormSubmitType) => {
      let payload: any = {};
      if (Boolean(reqObj.acctType)) {
        payload.accTypeValuectx = reqObj.acctType;
      }
      if (Boolean(reqObj.reqID)) {
        payload.req_cd_ctx = reqObj.reqID;
      }
      dispatch({
        type: "update_accTypeValuectx",
        payload: { ...payload },
      });
    },
    []
  );

  const handleApiRes = useCallback((apiRes) => {
    // console.log("asdasdas>>", apiRes)
    let steps: any[] = [];
    apiRes.forEach((element: any) => {
      steps.push({
        tabName: element?.TAB_DISPL_NAME,
        icon: element?.ICON,
        isVisible: element?.isVisible ?? true,
      });
    });
    const PARAM320 = apiRes?.[0]?.PARA_320;
    const GPARAM155 = apiRes?.[0]?.GPARA_155;

    dispatch({
      type: "update_ApiResctx",
      payload: {
        tabsApiResctx: apiRes,
        tabNameList: steps,
        param320: PARAM320,
        gparam155: GPARAM155,
      },
    });
  }, []);

  const handleColTabChangectx = useCallback((value: any) => {
    dispatch({
      type: "update_colTabValuectx",
      payload: {
        colTabValuectx: value,
      },
    });
  }, []);

  const handleFormModalOpenctx = useCallback(() => {
    dispatch({
      type: "handleFormModalOpen",
      payload: { isFormModalOpenctx: true, isFreshEntryctx: true },
    });
  }, []);

  const handleFormModalOpenOnEditctx = (recordData: any[]) => {
    if (
      Array.isArray(recordData) &&
      recordData?.[0]?.data &&
      Boolean(recordData?.[0]?.data?.REQUEST_ID)
    ) {
      let payload = {
        req_cd_ctx: !isNaN(parseInt(recordData[0]?.data?.REQUEST_ID))
          ? parseInt(recordData[0]?.data?.REQUEST_ID)
          : "",
        acctNumberctx: recordData[0].data?.ACCOUNT_NUMBER ?? "",
        accTypeValuectx: recordData[0].data?.ACCT_TYPE ?? "",
        isFormModalOpenctx: true,
        isFreshEntryctx: false,
      };
      dispatch({
        type: "handleCategoryChangectx",
        payload: payload,
      });
    }
  };

  const handleFormLoading = useCallback((isloading: boolean) => {
    dispatch({
      type: "handle_formloading",
      payload: {
        isLoading: isloading,
      },
    });
  }, []);

  const handleCurrFormctx = useCallback(
    (obj) => {
      let currVal = state?.currentFormctx;
      dispatch({
        type: "set_currentFormObj",
        payload: {
          currentFormctx: {
            ...currVal,
            ...obj,
          },
        },
      });
    },
    [state?.currentFormctx]
  );
  const handleStepStatusctx = ({ status = "error", coltabvalue = 0 }) => {
    dispatch({
      type: "update_stepStatus",
      payload: {
        steps: {
          ...state?.steps,
          [coltabvalue]: { status: status },
        },
      },
    });
  };

  const handleFormDataonSavectx = (data) => {
    dispatch({
      type: "update_formData",
      payload: {
        formDatactx: { ...data },
      },
    });
  };

  const handlecustomerIDctx = (data) => {
    dispatch({
      type: "update_customerIDctx",
      payload: {
        customerIDctx: data,
      },
    });
  };

  const handleModifiedColsctx = (tabModifiedCols) => {
    dispatch({
      type: "modify_tabCols",
      payload: {
        modifiedFormCols: { ...tabModifiedCols },
      },
    });
  };

  const handleFormDataonRetrievectx = (data) => {
    let retrieveApiRes = data;
    let payload = {};
    payload["retrieveFormDataApiRes"] = { ...retrieveApiRes };
    dispatch({
      type: "update_retrieveFormData",
      payload: payload,
    });
  };

  const handleSavectx = (e, refs) => {
    // ref(e, "save")
    Promise.all([refs])
      .then((response) => {
        console.log("evalSave in success ", response);
      })
      .catch((err) => {
        console.log("evalSave out catch", err.message);
      });
  };

  const handleUpdatectx = async ({ COMP_CD }) => {
    let update_type = "";
    let updated_tabs = Object.keys(state?.modifiedFormCols ?? {});
    // let updated_tab_format:any = {}
    let updated_tab_format: any = {};
    // console.log(state?.modifiedFormCols, ":qweewqasdcde1", updated_tabs.length, updated_tabs)
    if (updated_tabs.length > 0) {
      // console.log(update_type, ":qweewqasdcde2", "reqcd", state?.req_cd_ctx)
      let other_data = {
        IsNewRow: !state?.req_cd_ctx ? true : false,
        REQ_CD: state?.req_cd_ctx ?? "",
        COMP_CD: COMP_CD ?? "",
      };
      // console.log("feiuqwdwqduyqewd",updated_tabs)
      let dataa = updated_tabs.map(async (TAB, i) => {
        return new Promise((res, rej) => {
          let oldFormData = _.pick(
            state?.retrieveFormDataApiRes[TAB] ?? {},
            state?.modifiedFormCols[TAB] ?? []
          );
          console.log(
            _.pick(
              state?.retrieveFormDataApiRes[TAB] ?? {},
              state?.modifiedFormCols[TAB] ?? []
            ),
            "oldddddd",
            state?.retrieveFormDataApiRes[TAB],
            state?.modifiedFormCols[TAB]
          );
          let newFormData = _.pick(
            state?.formDatactx[TAB] ?? {},
            state?.modifiedFormCols[TAB] ?? []
          );
          console.log(
            _.pick(
              state?.formDatactx[TAB] ?? {},
              state?.modifiedFormCols[TAB] ?? []
            ),
            "oldddddd new",
            state?.formDatactx[TAB],
            state?.modifiedFormCols[TAB]
          );

          let upd;

          if (
            TAB == "OTHER_ADDRESS" ||
            TAB == "RELATED_PERSON_DTL" ||
            TAB == "OTHER_ADDRESS" ||
            TAB == "DOC_MST"
          ) {
            let oldRow: any[] = [];
            let newRow: any[] = [];
            // if(state?.retrieveFormDataApiRes[TAB] && state?.retrieveFormDataApiRes[TAB].length>0) {
            oldRow =
              state?.retrieveFormDataApiRes[TAB] &&
              state?.retrieveFormDataApiRes[TAB].length > 0
                ? state?.retrieveFormDataApiRes[TAB].map((formRow, i) => {
                    let filteredRow = _.pick(
                      formRow ?? {},
                      state?.modifiedFormCols[TAB] ?? []
                    );
                    if (TAB == "DOC_MST") {
                      filteredRow["SUBMIT"] = Boolean(filteredRow.SUBMIT)
                        ? "Y"
                        : "N";
                      // filteredRow = filteredRow.map(doc => ({...doc, SUBMIT: Boolean(doc.SUBMIT) ? "Y" : "N"}))
                    }
                    // console.log("wadqwdwq. asdasdawdawqqqqqq filteredrow", filteredRow)
                    return filteredRow;
                  })
                : [];
            // console.log(oldRow, "wadqwdwq. asdasdawdawqqqqqq", state?.retrieveFormDataApiRes[TAB])

            newRow =
              state?.formDatactx[TAB] && state?.formDatactx[TAB].length > 0
                ? state?.formDatactx[TAB].map((formRow, i) => {
                    let filteredRow = _.pick(
                      formRow ?? {},
                      state?.modifiedFormCols[TAB] ?? []
                    );
                    return filteredRow;
                  })
                : [];
            // console.log(newRow, "wadqwdwq. asdasdawdawqqqqqq new", state?.formDatactx[TAB])
            // console.log("feiuqwdwqduyqewd", TAB)
            // console.log(oldRow, ":qweewqasdcde23", "newRow", newRow )
            upd = utilFunction.transformDetailDataForDML(
              oldRow ?? [],
              newRow ?? [],
              ["SR_CD"]
            );
            if (upd) {
              // console.log(update_type, ":qweewqasdcde3", "upd", upd )
              // console.log("wadqwdwq. asdasdawdawqqqqqq", upd)
            }
          } else {
            upd = utilFunction.transformDetailsData(newFormData, oldFormData);
            // console.log(update_type, ":qweewqasdcde3", "upd else", upd )
          }
          if (Object.keys(updated_tab_format).includes(TAB)) {
            if (
              TAB == "OTHER_ADDRESS" ||
              TAB == "RELATED_PERSON_DTL" ||
              TAB == "OTHER_ADDRESS" ||
              TAB == "DOC_MST"
            ) {
              updated_tab_format[TAB] = [
                {
                  ...updated_tab_format.TAB,
                  ...upd,
                  ..._.pick(state?.formDatactx[TAB], upd._UPDATEDCOLUMNS),
                  ...other_data,
                },
              ];
            } else {
              updated_tab_format[TAB] = {
                ...updated_tab_format.TAB,
                ...upd,
                ..._.pick(state?.formDatactx[TAB], upd._UPDATEDCOLUMNS),
                ...other_data,
              };
            }
          } else {
            if (
              TAB == "OTHER_ADDRESS" ||
              TAB == "RELATED_PERSON_DTL" ||
              TAB == "OTHER_ADDRESS" ||
              TAB == "DOC_MST"
            ) {
              // console.log("asdqwezxc arraytabupdate", TAB, upd)
              // if(Array.isArray(upd._UPDATEDCOLUMNS) && upd._UPDATEDCOLUMNS?.length>0) {
              if (
                (Array.isArray(upd.isDeleteRow) &&
                  upd.isDeleteRow?.length > 0) ||
                (Array.isArray(upd.isNewRow) && upd.isNewRow?.length > 0) ||
                (Array.isArray(upd.isUpdatedRow) &&
                  upd.isUpdatedRow?.length > 0)
              )
                updated_tab_format[TAB] = [
                  {
                    ...upd,
                    ..._.pick(state?.formDatactx[TAB], upd._UPDATEDCOLUMNS),
                    ...other_data,
                  },
                ];
              // }
            } else if (TAB == "PHOTO_MST") {
              // console.log("asdqwezxc photomst", TAB, upd)
              if (
                Array.isArray(upd._UPDATEDCOLUMNS) &&
                upd._UPDATEDCOLUMNS?.length > 0
              ) {
                updated_tab_format[TAB] = {
                  ...upd,
                  ..._.pick(state?.formDatactx[TAB], upd._UPDATEDCOLUMNS),
                  ...other_data,
                  SR_CD: state?.retrieveFormDataApiRes[TAB]?.SR_CD ?? "",
                };
              }
            } else {
              // console.log("asdqwezxc other", TAB, upd)
              if (
                Array.isArray(upd._UPDATEDCOLUMNS) &&
                upd._UPDATEDCOLUMNS?.length > 0
              ) {
                updated_tab_format[TAB] = {
                  ...upd,
                  ..._.pick(state?.formDatactx[TAB], upd._UPDATEDCOLUMNS),
                  ...other_data,
                };
              }
            }
          }
          // console.log(update_type, ":qweewqasdcde3", "updated_tab_format", updated_tab_format )
          // console.log("updated_tab_format[TAB]", updated_tab_format[TAB])
          res(1);
        });
      });
      // console.log(":qweewqasdcde4", "updated_tab_format", updated_tab_format, Object.keys(updated_tab_format))
      if (typeof updated_tab_format === "object") {
        if (
          Object.keys(updated_tab_format)?.length === 1 &&
          Object.keys(updated_tab_format)?.includes("PERSONAL_DETAIL")
        ) {
          update_type = "save_as_draft";
        } else if (Object.keys(updated_tab_format)?.length > 0) {
          update_type = "full_save";
        }
      }

      return { updated_tab_format, update_type };
    }
  };

  return (
    <AcctMSTContext.Provider
      value={{
        AcctMSTState: state,
        handleFormLoading,
        handleFromFormModectx,
        handleFormModalClosectx,
        handleFormModalOpenOnEditctx,
        handleSidebarExpansionctx,
        handleHeaderFormSubmit,
        handleApiRes,
        handleColTabChangectx,
        handleFormModalOpenctx,
        handleCurrFormctx,
        handleStepStatusctx,
        handleFormDataonSavectx,
        handlecustomerIDctx,
        handleModifiedColsctx,
        handleFormDataonRetrievectx,
        handleSavectx,
        handleUpdatectx,
      }}
    >
      {children}
    </AcctMSTContext.Provider>
  );
};

export default AcctMSTProvider;

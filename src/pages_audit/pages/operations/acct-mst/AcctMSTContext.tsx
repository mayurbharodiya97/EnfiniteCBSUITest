import { utilFunction } from "components/utils";
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


  mainIntialVals: {
    UDYAM_REG_NO: "",
    ANNUAL_TURNOVER_SR_CD: "",
    BUSINESS_CD: "",
    PRODUCTION_YES_NO: "",
    DATE_OF_COMMENCEMENT: "",
    ACTION_TAKEN_CD: "",
    SANCTIONED_BY: "",
    RATE_WEF: "",
    NO_OF_LEAVES: "",
    CHEQUE_NO: "",
    REF_ACCT_CD: "",
    REF_ACCT_TYPE: "",
    REF_COMP_CD: "",
    REF_BRANCH_CD: "",
    LOCKER_KEY_NO: "",
    INT_SKIP_REASON_TRAN_CD: "",
    UDYAM_REG_DT: "",
    INVEST_IN_PLANT: "",
    NPA_REASON: "",
    INT_SKIP_FLAG: "",
    INSURANCE_EXPIRY_PENAL_RT: "",
    STOCK_EXPIRY_PENAL_RT: "",
    PACKET_NO: "",
    AGAINST_CLEARING: "",
    OD_APPLICABLE: "",
    RESOLUTION_NO: "",
    DOCKET_NO: "",
    FILE_NO: "",
    DATE_OF_DEATH: "",
    HANDICAP_DESCIRPTION: "",
    HANDICAP_FLAG: "",
    PASSPORT_NO: "",
    DAY_BOOK_REVRS_GRP_CD: "",
    MONTHLY_HOUSEHOLD_INCOME: "",
    EDUCATION_QUALIFICATION: "",
    MARITAL_STATUS: "",
    DATE_OF_RETIREMENT: "",
    DESIGNATION_CD: "",
    FIRM_NM: "",
    SALARIED: "",
    MOTHER_MAIDEN_NM: "",
    PREFIX_CD: "",
    LST_STATEMENT_DT: "",
    CLOSE_REASON_CD: "",
    DISBURSEMENT_DT: "",
    PTS: "",
    DUE_AMT: "",
    DRAWING_POWER: "",
    NPA_CD: "",
    NPA_DT: "",
    TYPE_CD: "",
    LIMIT_AMOUNT: "",
    PATH_SIGN: "",
    DAY_BOOK_GRP_CD: "",
    INSTALLMENT_TYPE: "",
    LAST_INST_DT: "",
    INST_DUE_DT: "",
    INST_NO: "",
    INST_RS: "",
    SANCTIONED_AMT: "",
    APPLIED_AMT: "",
    INS_START_DT: "",
    SANCTION_DT: "",
    APPLY_DT: "",
    RECOMMENDED_DESG: "",
    RECOMMENED_NM: "",
    ENTERED_DATE: "",
    INT_TYPE: "",
    SECURITY_CD: "",
    PRIORITY_CD: "",
    PURPOSE_CD: "",
    CR_INT: "",
    PENAL_RATE: "",
    AG_CLR_RATE: "",
    INT_RATE: "",
    CATEG_CD: "",
    CLASS_CD: "",
    AGENT_CD: "",
    LEAN_AMT: "",
    LEAN_TYPE: "",
    SHARE_ACCT_CD: "",
    SHARE_ACCT_TYPE: "",
    MEM_ACCT_CD: "",
    MEM_ACCT_TYPE: "",
    E_MAIL_ID: "",
    REMARKS: "",
    TRADE_INFO: "",
    COMMU_CD: "",
    ACCT_MODE: "",
    GROUP_CD: "",
    TRADE_CD: "",
    FORM_60: "",
    PAN_NO: "",
    MOBILE_REG: "",
    CONTACT3: "",
    CONTACT2: "",
    CONTACT1: "",
    CONTACT4: "",
    CONFIRMED: "",
    GSTIN: "",
    UNIQUE_ID: "",
    CITY_CD: "",
    AREA_CD: "",
    ADD1: "",
    ADD2: "",
    STATUS: "",
    ADD3: "",
    FIRST_NM: "",
    CLOSE_DT: "",
    OP_DATE: "",
    CUSTOMER_ID: "",
    ACCT_CD: "",
    ACCT_TYPE: "",
    TIN: "",
    LF_NO: "",
    BIRTH_DT: "",
    GENDER: "",
    LAST_NM: "",
    SURNAME: "",
    INDUSTRY_CODE: "",
    RENRE_CD: "",
    THROUGH_CHANNEL: "",
    REQUEST_CD: "",
    ACCT_NM: ""
  }


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
    acctType:any, 
    reqID: any
  }
  const handleHeaderFormSubmit = useCallback((reqObj:handleHeaderFormSubmitType) => {
    let payload:any = {}
    if(Boolean(reqObj.acctType)) {
      payload.accTypeValuectx = reqObj.acctType; 
    }
    if(Boolean(reqObj.reqID)) {
      payload.req_cd_ctx = reqObj.reqID; 
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
    const PARAM320 = apiRes?.[0]?.PARA_320; // enable/disable fields in main tab
    const GPARAM155 = apiRes?.[0]?.GPARA_155; // hide/display fields

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

  const handleFormModalOpenOnEditctx = (recordData:any[]) => {
    if(
      Array.isArray(recordData) && 
      recordData?.[0]?.data 
      // && Boolean(recordData?.[0]?.data?.REQUEST_ID)
    ) {
      let payload = {
        req_cd_ctx: !isNaN(parseInt(recordData[0]?.data?.REQUEST_ID)) ? parseInt(recordData[0]?.data?.REQUEST_ID) : "",
        acctNumberctx: recordData[0].data?.ACCT_CD ?? "",
        accTypeValuectx: recordData[0].data?.ACCT_TYPE ?? "",
        isFormModalOpenctx: true, isFreshEntryctx: false
      };
      dispatch({
        type: "handleCategoryChangectx",
        payload: payload
      })
    }
  }

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

  const handlecustomerIDctx = (data) => {
    dispatch({
        type: "update_customerIDctx",
        payload: {
            customerIDctx: data
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

  const handleFormDataonRetrievectx = (data) => {
    let retrieveApiRes = data
    let payload = {};
    if(Array.isArray(data?.JOINT_ACCOUNT_DTL) && data?.JOINT_ACCOUNT_DTL?.length>0) {
      data?.JOINT_ACCOUNT_DTL.forEach(jointRow => {
        if(jointRow?.J_TYPE) {
          // J, I, N, G, M, U, S
          if(jointRow?.J_TYPE === "J   ") {
            // Joint Holder
            if(retrieveApiRes["JOINT_HOLDER_DTL"]) {
              retrieveApiRes["JOINT_HOLDER_DTL"] = [...retrieveApiRes["JOINT_HOLDER_DTL"], jointRow];
            } else {
              retrieveApiRes["JOINT_HOLDER_DTL"] = [jointRow]
            }
          } else if(jointRow?.J_TYPE === "I   ") {
            // Introductor
            if(retrieveApiRes["JOINT_INTRODUCTOR_DTL"]) {
              retrieveApiRes["JOINT_INTRODUCTOR_DTL"] = [...retrieveApiRes["JOINT_INTRODUCTOR_DTL"], jointRow];
            } else {
              retrieveApiRes["JOINT_INTRODUCTOR_DTL"] = [jointRow]
            }
          } else if(jointRow?.J_TYPE === "N   ") {
            // Nominee
            if(retrieveApiRes["JOINT_NOMINEE_DTL"]) {
              retrieveApiRes["JOINT_NOMINEE_DTL"] = [...retrieveApiRes["JOINT_NOMINEE_DTL"], jointRow];
            } else {
              retrieveApiRes["JOINT_NOMINEE_DTL"] = [jointRow]
            }
          } else if(jointRow?.J_TYPE === "G   ") {
            // Guarantor
            if(retrieveApiRes["JOINT_GUARANTOR_DTL"]) {
              retrieveApiRes["JOINT_GUARANTOR_DTL"] = [...retrieveApiRes["JOINT_GUARANTOR_DTL"], jointRow];
            } else {
              retrieveApiRes["JOINT_GUARANTOR_DTL"] = [jointRow]
            }
          } else if(jointRow?.J_TYPE === "M   ") {
            // Hypothication
            if(retrieveApiRes["JOINT_HYPOTHICATION_DTL"]) {
              retrieveApiRes["JOINT_HYPOTHICATION_DTL"] = [...retrieveApiRes["JOINT_HYPOTHICATION_DTL"], jointRow];
            } else {
              retrieveApiRes["JOINT_HYPOTHICATION_DTL"] = [jointRow]
            }
          } else if(jointRow?.J_TYPE === "U   ") {
            // Guardian
            if(retrieveApiRes["JOINT_GUARDIAN_DTL"]) {
              retrieveApiRes["JOINT_GUARDIAN_DTL"] = [...retrieveApiRes["JOINT_GUARDIAN_DTL"], jointRow];
            } else {
              retrieveApiRes["JOINT_GUARDIAN_DTL"] = [jointRow]
            }
          } else if(jointRow?.J_TYPE === "S   ") {
            // Signatory
            if(retrieveApiRes["JOINT_SIGNATORY_DTL"]) {
              retrieveApiRes["JOINT_SIGNATORY_DTL"] = [...retrieveApiRes["JOINT_SIGNATORY_DTL"], jointRow];
            } else {
              retrieveApiRes["JOINT_SIGNATORY_DTL"] = [jointRow]
            }
          }
        } else {
          console.log("joint type not found")
        }
      });
    }
    payload["retrieveFormDataApiRes"] = {...retrieveApiRes}
    dispatch({
        type: "update_retrieveFormData",
        payload: payload
    })
  }

  const handleSavectx = (e, refs) => {
    // ref(e, "save")
    Promise.all([refs])
    .then((response) => {
      console.log("evalSave in success ", response)
    }).catch(err => {
      console.log("evalSave out catch", err.message)
    })    
  }

  const handleUpdatectx = async ({COMP_CD}) => {










    let update_type = "";
    let updated_tabs = Object.keys(state?.modifiedFormCols ?? {})
    // let updated_tab_format:any = {}
    let updated_tab_format:any = {}
    // console.log(state?.modifiedFormCols, ":qweewqasdcde1", updated_tabs.length, updated_tabs)
    if(updated_tabs.length>0) {

    // console.log(update_type, ":qweewqasdcde2", "reqcd", state?.req_cd_ctx)
    let other_data = {
        IsNewRow: !state?.req_cd_ctx ? true : false,
        REQ_CD: state?.req_cd_ctx ?? "",
        COMP_CD: COMP_CD ?? "",
    }
    // console.log("feiuqwdwqduyqewd",updated_tabs)
    let dataa = updated_tabs.map(async (TAB, i) => {
        return new Promise((res, rej) => {
            let oldFormData = _.pick(state?.retrieveFormDataApiRes[TAB] ?? {}, state?.modifiedFormCols[TAB] ?? [])
            console.log(_.pick(state?.retrieveFormDataApiRes[TAB] ?? {}, state?.modifiedFormCols[TAB] ?? []), "oldddddd", state?.retrieveFormDataApiRes[TAB], state?.modifiedFormCols[TAB])
            let newFormData = _.pick(state?.formDatactx[TAB] ?? {}, state?.modifiedFormCols[TAB] ?? [])
            console.log(_.pick(state?.formDatactx[TAB] ?? {}, state?.modifiedFormCols[TAB] ?? []), "oldddddd new", state?.formDatactx[TAB], state?.modifiedFormCols[TAB])

            let upd;

            if(TAB == "OTHER_ADDRESS" || TAB == "RELATED_PERSON_DTL" || TAB == "DOC_MST") {
                let oldRow:any[] = []
                let newRow:any[] = []
                // if(state?.retrieveFormDataApiRes[TAB] && state?.retrieveFormDataApiRes[TAB].length>0) {
                    oldRow = (state?.retrieveFormDataApiRes[TAB] && state?.retrieveFormDataApiRes[TAB].length>0) ? state?.retrieveFormDataApiRes[TAB].map((formRow, i) => {
                        let filteredRow = _.pick(formRow ?? {}, state?.modifiedFormCols[TAB] ?? [])
                        if(TAB == "DOC_MST") {
                            filteredRow["SUBMIT"] = Boolean(filteredRow.SUBMIT) ? "Y" : "N"
                            // filteredRow = filteredRow.map(doc => ({...doc, SUBMIT: Boolean(doc.SUBMIT) ? "Y" : "N"}))
                        }
                        // console.log("wadqwdwq. asdasdawdawqqqqqq filteredrow", filteredRow)
                        return filteredRow;
                    }) : [];
                    // console.log(oldRow, "wadqwdwq. asdasdawdawqqqqqq", state?.retrieveFormDataApiRes[TAB])

                    newRow = (state?.formDatactx[TAB] && state?.formDatactx[TAB].length>0) ? state?.formDatactx[TAB].map((formRow, i) => {
                        let filteredRow = _.pick(formRow ?? {}, state?.modifiedFormCols[TAB] ?? [])
                        return filteredRow;
                    }) : [];
                    // console.log(newRow, "wadqwdwq. asdasdawdawqqqqqq new", state?.formDatactx[TAB])
                    // console.log("feiuqwdwqduyqewd", TAB)
                    // console.log(oldRow, ":qweewqasdcde23", "newRow", newRow )
                    upd = utilFunction.transformDetailDataForDML(
                        oldRow ?? [],
                        newRow ?? [],
                        ["SR_CD"]
                    );
                    if(upd) {
                        // console.log(update_type, ":qweewqasdcde3", "upd", upd )
                        // console.log("wadqwdwq. asdasdawdawqqqqqq", upd)
                    }
            } else {
                upd = utilFunction.transformDetailsData(newFormData, oldFormData);
                // console.log(update_type, ":qweewqasdcde3", "upd else", upd )
            }
            if(Object.keys(updated_tab_format).includes(TAB)) {
                if(TAB == "OTHER_ADDRESS" || TAB == "RELATED_PERSON_DTL" || TAB == "OTHER_ADDRESS" || TAB == "DOC_MST") {
                    updated_tab_format[TAB] = [{
                        ...updated_tab_format.TAB,
                        ...upd,
                        ...(_.pick(state?.formDatactx[TAB], upd._UPDATEDCOLUMNS)),
                        ...other_data
                    }]
                } else {
                    updated_tab_format[TAB] = {
                        ...updated_tab_format.TAB,
                        ...upd,
                        ...(_.pick(state?.formDatactx[TAB], upd._UPDATEDCOLUMNS)),
                        ...other_data
                    }
                }
            } else {
                if(TAB == "OTHER_ADDRESS" || TAB == "RELATED_PERSON_DTL" || TAB == "OTHER_ADDRESS" || TAB == "DOC_MST") {
                    // console.log("asdqwezxc arraytabupdate", TAB, upd)
                    // if(Array.isArray(upd._UPDATEDCOLUMNS) && upd._UPDATEDCOLUMNS?.length>0) {
                        if(Array.isArray(upd.isDeleteRow) && upd.isDeleteRow?.length>0 ||
                        Array.isArray(upd.isNewRow) && upd.isNewRow?.length>0 ||
                        Array.isArray(upd.isUpdatedRow) && upd.isUpdatedRow?.length>0)
                        updated_tab_format[TAB] = [{
                            ...upd,
                            ...(_.pick(state?.formDatactx[TAB], upd._UPDATEDCOLUMNS)),
                            ...other_data
                        }]
                    // }
                } else if(TAB == "PHOTO_MST") {
                    // console.log("asdqwezxc photomst", TAB, upd)
                    if(Array.isArray(upd._UPDATEDCOLUMNS) && upd._UPDATEDCOLUMNS?.length>0) {
                        updated_tab_format[TAB] = {
                            ...upd,
                            ...(_.pick(state?.formDatactx[TAB], upd._UPDATEDCOLUMNS)),
                            ...other_data,
                            SR_CD: state?.retrieveFormDataApiRes[TAB]?.SR_CD ?? ""
                        }
                    }
                } else {
                    // console.log("asdqwezxc other", TAB, upd)
                    if(Array.isArray(upd._UPDATEDCOLUMNS) && upd._UPDATEDCOLUMNS?.length>0) {
                        updated_tab_format[TAB] = {
                            ...upd,
                            ...(_.pick(state?.formDatactx[TAB], upd._UPDATEDCOLUMNS)),
                            ...other_data
                        }
                    }
                }
            }
            // console.log(update_type, ":qweewqasdcde3", "updated_tab_format", updated_tab_format )                
            // console.log("updated_tab_format[TAB]", updated_tab_format[TAB])
            res(1)
        })
    })
    // console.log(":qweewqasdcde4", "updated_tab_format", updated_tab_format, Object.keys(updated_tab_format))
    if(typeof updated_tab_format === "object") {
        if(Object.keys(updated_tab_format)?.length === 1 && Object.keys(updated_tab_format)?.includes("PERSONAL_DETAIL")) {
            update_type = "save_as_draft";
        } else if(Object.keys(updated_tab_format)?.length>0) {
            update_type = "full_save";
        }
    }

    return {updated_tab_format, update_type};
    }
}

  return (
    <AcctMSTContext.Provider
      value={{
        AcctMSTState:state,
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

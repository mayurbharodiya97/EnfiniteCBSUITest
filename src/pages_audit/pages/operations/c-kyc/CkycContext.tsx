import React, {useCallback, useReducer} from 'react'
import * as API from "./api";
import { CkycStateType } from './type';
import { AuthSDK } from 'registry/fns/auth';
import { DefaultErrorObject, utilFunction } from 'components/utils';
import _ from 'lodash';

const initialState:any  = {
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
    isCustActivectx: null,
    req_cd_ctx: "",

    photoBlobctx: null,
    photoBase64ctx: null,
    signBlobctx: null,
    signBase64ctx: null,

    confirmFlagctx: null,
    update_casectx: null,
    steps: {
        0: {status: ""}
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
}

const Reducer = (state, action) => {
    switch(action.type) {
        case "handleFromFormMode": 
            return {
                ...state,
                ...action.payload
            };
        case "handleFormModalOpen": 
            return {
                ...state,
                ...action.payload
            };
        case "handleDraftSave": 
            return {
                ...state,
                ...action.payload
            };
        case "handleFormModalClose":
            return {
                ...state,
                ...action.payload
            };
        case "update_ApiResctx":
            return {
                ...state,
                ...action.payload
            };
        // case "update_customerCategoriesctx":
        //     return {
        //         ...state,
        //         ...action.payload
        //     };
        case "handleCategoryChangectx":
            return {
                ...state,
                ...action.payload
            };
        case "update_accTypeValuectx":
            return {
                ...state,
                ...action.payload
            };
        case "update_kycNoValuectx":
            return {
                ...state,
                ...action.payload
            };
        case "update_req_cd_ctxctx":
            return {
                ...state,
                ...action.payload
            };
        case "update_photo_signctx":
            return {
                ...state,
                ...action.payload
            };
        case "update_isSidebarExpandedctx":
            return {
                ...state,
                ...action.payload
            };
        case "update_colTabValuectx":
            return {
                ...state,
                ...action.payload
            };
        case "update_stepStatus":
            return {
                ...state,
                ...action.payload
            };
        case "update_formData":
            return {
                ...state,
                ...action.payload
            };
        case "update_formDataDraft":
            return {
                ...state,
                ...action.payload
            };
        case "update_retrieveFormData":
            return {
                ...state,
                ...action.payload
            };
        case "modify_formdata":
            return {
                ...state,
                ...action.payload
            };
        case "modify_tabCols":
            return {
                ...state,
                ...action.payload
            };
        case "update_customerIDctx":
            return {
                ...state,
                ...action.payload
            };
        case "reset_ckyc":
            return {
                ...state,
                ...action.payload
            };
        case "set_currentFormObj":
            return {
                ...state,
                ...action.payload
            };
        case "onFinalUpdate":
            return {
                ...state,
                ...action.payload
            };
        default: return state;
    }
}

export const CkycContext = React.createContext<any>(initialState) 
const CkycProvider = ({children}) => {
    const [state, dispatch] = useReducer(Reducer, initialState)

    interface handleFromFormModeTyoe {
        formmode?: string | null,
        from?: string | null
    } 
    const handleFromFormModectx = (data:handleFromFormModeTyoe) => {
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
    }

    const handleFormModalOpenctx = (entityType) => {
        dispatch({
            type: "handleFormModalOpen", 
            payload: {isFormModalOpenctx: true, entityTypectx: entityType, isFreshEntryctx: true }
        })
    }

    const handleFormModalOpenOnEditctx = (recordData) => {
        // console.log("qweqeqeqwsxqswq", recordData)
        // required - CATEGORY_CODE, CONSTITUTION_TYPE, CUSTOMER_TYPE
        // if(recordData[0]?.data?.CATEGORY_CONSTITUTIONS) {
        if(recordData[0]?.data?.CATEG_NM && recordData[0]?.data?.CONSTITUTION_NAME) {
            const categConstitutionValue = {
                value: recordData[0]?.data?.CATEGORY_CODE,
                label: recordData[0]?.data?.CATEG_NM,
                CONSTITUTION_TYPE: recordData[0]?.data?.CONSTITUTION_TYPE,
                CONSTITUTION_NAME: recordData[0]?.data?.CONSTITUTION_NAME,
                
                

                // value: "05  ",
                // label: "OTHER",
                // CONSTITUTION_TYPE: "01",
                // CONSTITUTION_NAME: "INDIVIDUAL",
            }
            let payload = {
                categConstitutionValuectx: categConstitutionValue,
                categoryValuectx: recordData[0]?.data?.CATEGORY_CODE,
                constitutionValuectx: recordData[0]?.data?.CONSTITUTION_TYPE,
                isFormModalOpenctx: true, entityTypectx: recordData[0]?.data?.CUSTOMER_TYPE, isCustActivectx: recordData[0]?.data?.ACTIVE, isFreshEntryctx: false,
                customerIDctx: recordData[0]?.data?.CUSTOMER_ID ?? "",
                req_cd_ctx: !isNaN(parseInt(recordData[0]?.data?.REQUEST_ID)) ? parseInt(recordData[0]?.data?.REQUEST_ID) : "",
            }
            if(recordData[0]?.data?.CONFIRMED) {
                        // A - ALL ,
                        // Y - CONFIRMED,
                        // M - SENT TO MODIFICATION 
                        // R - REJECT 
                        // P - SENT TO CONFIRMATION
                payload["confirmFlagctx"] = recordData[0]?.data?.CONFIRMED
            }
            if(recordData[0]?.data?.UPD_TAB_FLAG_NM) {
                // D	EXISTING_DOC_MODIFY
                // M	EXISTING_MODIFY
                // O	EXISTING_OTHER_ADD_MODIFY
                // P	EXISTING_PHOTO_MODIFY
                // A	FRESH_MODIFY
                payload["update_casectx"] = recordData[0]?.data?.UPD_TAB_FLAG_NM
            }


            dispatch({
                type: "handleCategoryChangectx",
                payload: payload
                // payload: {
                //     // categConstitutionValuectx: categConstitutionValue,
                //     // categoryValuectx: "05  ",
                //     // constitutionValuectx: "01",
                //     // isFormModalOpenctx: true, entityTypectx: "I", isFreshEntryctx: false,
                //     // customerIDctx: "2",


                //     categConstitutionValuectx: categConstitutionValue,
                //     categoryValuectx: recordData[0]?.data?.CATEGORY_CODE,
                //     constitutionValuectx: recordData[0]?.data?.CONSTITUTION_TYPE,
                //     isFormModalOpenctx: true, entityTypectx: recordData[0]?.data?.CUSTOMER_TYPE, isFreshEntryctx: false,
                //     customerIDctx: recordData[0]?.data?.CUSTOMER_ID ?? "",
                //     req_cd_ctx: recordData[0]?.data?.REQUEST_ID ?? "",
                //     // retrieveFormDataApiRes: retrieveFormdata,
                    
                //     // categConstitutionValuectx: "kuashd",
                //     // categoryValuectx: "kub",
                //     // constitutionValuectx: "yuu",
                //     // isFormModalOpenctx: true, entityTypectx: recordData[0]?.data?.CUSTOMER_TYPE, isFreshEntryctx: false 

                //     // categoryValuectx: value?.value,
                //     // constitutionValuectx: value?.CONSTITUTION_TYPE,
                //     // colTabValuectx: 0,
                // }
            })
        }
    }

    const onDraftSavectx = () => {
        dispatch({
            type: "handleDraftSave",
            payload: {
                isFreshEntryctx: false,
                isDraftSavedctx: true                                
            }
        })
    }

    const handleFormModalClosectx = () => {
        dispatch({
            type: "handleFormModalClose",
            payload: {
                isFormModalOpenctx: false, 
                entityTypectx: null,
                colTabValuectx: false,
                categConstitutionValuectx: null,
                categoryValuectx: null,
                constitutionValuectx: null,
                accTypeValuectx: "",
                tabsApiResctx: [],
                isFreshEntryctx: false,
                isCustActivectx: null,
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
            }
        })
    }

    const handleApiRes = (apiRes) => {
        // console.log("asdasdas>>", apiRes)
        let steps:any[] = [] 
        apiRes.forEach((element:any) => {
          steps.push({tabName: element?.TAB_DISPL_NAME, icon: element?.ICON, isVisible: element?.isVisible ?? true})
        })
        dispatch({
            type: "update_ApiResctx",
            payload: {
                tabsApiResctx: apiRes,
                tabNameList: steps
            }
        })
    }

    // const handleCustCategoryRes = (apiRes) => {
    //     dispatch({
    //         type: "update_customerCategoriesctx",
    //         payload: {
    //             customerCategoriesctx: apiRes
    //         }
    //     })           
    // }

    const handleCategoryChangectx = (e, value) => {
        if(value) {
            dispatch({
                type: "handleCategoryChangectx",
                payload: {
                    categConstitutionValuectx: value,
                    categoryValuectx: value?.value,
                    constitutionValuectx: value?.CONSTITUTION_TYPE,
                    colTabValuectx: 0,
                }
              })
        } else {
            dispatch({
                type: "handleCategoryChangectx",
                payload: {
                    categConstitutionValuectx: null,
                    categoryValuectx: null,
                    constitutionValuectx: null,
                    colTabValuectx: false,
                    tabsApiResctx: []
                }
            })
        }
    }

    const handleAccTypeVal = (value) => {
        dispatch({
            type: "update_accTypeValuectx",
            payload: {
                accTypeValuectx: value ?? ""
            }
        })
    }

    const handleKycNoValctx = (value) => {
        dispatch({
            type: "update_kycNoValuectx",
            payload: {
                kycNoValuectx: value
            }
        })
    }

    const handleReqCDctx = (value) => {
        dispatch({
            type: "update_req_cd_ctxctx",
            payload: {
                req_cd_ctx: value
            }
        })
    }    

    const handlePhotoOrSignctx = (blob:any, base64:string, img:string) => {
        // console.log("async called ctx", blob, img, base64)
        if(img == "photo") {
            dispatch({
                type: "update_photo_signctx",
                payload: {
                    photoBlobctx: blob,
                    photoBase64ctx: base64,
                }
            })
        } else if(img === "sign") {
            dispatch({
                type: "update_photo_signctx",
                payload: {
                    signBlobctx: blob,
                    signBase64ctx: base64,                
                }
            })
        }
    }    

    const handleSidebarExpansionctx = () => {
        dispatch({
            type: "update_isSidebarExpandedctx",
            payload: {
                isSidebarExpandedctx: !state.isSidebarExpandedctx
            }
        })
    }

    const handleColTabChangectx = (value:any) => {
        // const {colTabValuectx} = state
        // let tabVal = (value === "INC")
        //             ? parseInt(colTabValuectx+1)
        //             : value === "PRV"
        //                 ? colTabValuectx - 1
        //                 : value
        // console.log(tabVal, colTabValuectx, (value === "INC") ? parseInt(tabVal + 1) : value, "coltabvaluee", value)
        dispatch({
            type: "update_colTabValuectx",
            payload: {
                // colTabValuectx: (value === "INC") ? parseInt(state.colTabValuectx + 1) : value
                colTabValuectx: value,
            }
            // payload: tabVal
        })
    }

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

        // dispatch({
        //     type: "update_stepStatus",
        //     payload: {
        //         steps: {
        //             error: [...state?.steps?.error],
        //             completed: [...state?.steps?.completed],
        //             notValidated: [...state?.steps?.notValidated]
        //         }
        //     }
        // })
    }

    const handleFormDataonSavectx = (data) => {
        dispatch({
            type: "update_formData",
            payload: {
                formDatactx: {...data}
            }
        })
    }

    const handleEditFormDatactx = (tabFormat, tabModifiedCols ) => {    
        dispatch({
            type: "modify_formdata",
            payload: {
                updateFormDatactx: {...tabFormat},
                modifiedFormCols: {...tabModifiedCols}
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
        // console.log("retrieved form dataaa", data)
        // const categConstitutionValue = {
        //     value: recordData[0]?.data?.CATEGORY_CODE,
        //     label: recordData[0]?.data?.CATEGORY_CONSTITUTIONS.split("-")[0],
        //     CONSTITUTION_TYPE: recordData[0]?.data?.CONSTITUTION_TYPE,
        //     CONSTITUTION_NAME: recordData[0]?.data?.CATEGORY_CONSTITUTIONS.split("-")[1],
        // }

        // categConstitutionValuectx: categConstitutionValue,
        // categoryValuectx: recordData[0]?.data?.CATEGORY_CODE, // 05  
        // constitutionValuectx: recordData[0]?.data?.CONSTITUTION_TYPE, // 01
        // isFormModalOpenctx: true, entityTypectx: recordData[0]?.data?.CUSTOMER_TYPE // I, 
        // isFreshEntryctx: false,


        // let apiRes = {...data[0]}
        // console.log("wqkdhqiwuheqieqwdata", data)
        let retrieveApiRes = data
        // console.log("daatadtatad", data)
        let payload = {
            // retrieveFormDataApiRes: {...retrieveApiRes},
            accTypeValuectx: data?.["PERSONAL_DETAIL"]?.ACCT_TYPE ?? "", //ACCT_TYPE
        }
        if(!Boolean(state?.isFreshEntryctx) || !Boolean(state?.isDraftSavedctx)) {
            // PHOTO_MST - getting photo sign on retrieve form data to populate images
            if(data && data.PHOTO_MST) {
                // photoBase64ctx
                // signBase64ctx
                // if(data.PHOTO_MST) {
                    payload["photoBase64ctx"] = data.PHOTO_MST.CUST_PHOTO
                    payload["signBase64ctx"] = data.PHOTO_MST.CUST_SIGN
                // }
            }
    
            // OTHER-DTL, Y-> true, N -> false
            if(retrieveApiRes && retrieveApiRes.OTHER_DTL) {
                let resData = retrieveApiRes.OTHER_DTL
                if(resData["POLITICALLY_CONNECTED"] == "Y") {
                    resData["POLITICALLY_CONNECTED"] = true
                } else {
                    resData["POLITICALLY_CONNECTED"] = false
                }
    
                if(resData["BLINDNESS"] == "Y") {
                    resData["BLINDNESS"] = true
                } else {
                    resData["BLINDNESS"] = false
                }
    
                if(resData["REFERRED_BY_STAFF"] == "Y") {
                    resData["REFERRED_BY_STAFF"] = true
                } else {
                    resData["REFERRED_BY_STAFF"] = false
                }
                retrieveApiRes = {...retrieveApiRes, OTHER_DTL: {...retrieveApiRes.OTHER_DTL, resData}}
                // payload.retrieveFormDataApiRes.OTHER_DTL = {...resData}
            }
            // OTHER-DTL, Y-> true, N -> false
            if(retrieveApiRes && retrieveApiRes.DOC_MST) {
                let resData = retrieveApiRes.DOC_MST
                if(resData.length>0) {
                    resData = resData.map(doc => {
                        let newDoc = doc
                        newDoc["SUBMIT"] = doc.SUBMIT === "Y" ? true : false
                        // console.log("wekjfhiuwefwef", doc, doc.SUBMIT === "Y" ? true : false)
                        return newDoc
                    })
                }
    
                retrieveApiRes = {...retrieveApiRes, DOC_MST: resData}
            }            
        }
        payload["retrieveFormDataApiRes"] = {...retrieveApiRes}
        dispatch({
            type: "update_retrieveFormData",
            payload: payload
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



    // interface CurrFormObj {
    //     currentFormRefctx?: any,
    //     currentFormSubmitted?: any,
    //     colTabValuectx?: any,
    // }
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

    const onFinalUpdatectx = (val:boolean) => {
        dispatch({
            type: "onFinalUpdate",
            payload: {
                isFinalUpdatectx: val
            }
        })
    }

    const handleFormDataonDraftctx = (data) => {
        // console.log("werhfwejfuiwef", state.formDatactx, typeof data, {...state.formDatactx, ...data})
        dispatch({
            type: "update_formDataDraft",
            // payload: {
            //     formDataDraftctx: {
            //         // ...state.formDataDraftctx , 
            //         personal_details: {...state.formDataDraftctx.personal_details, ...data}
            //     }
            // }
            payload: data
        })
    }

    const handleSaveAsDraft = () => {
        const remainingData = {
            "IsNewRow": true,
            "REQ_CD":"",
            "REQ_FLAG":"F",
            "SAVE_FLAG":"D",
            "ENTRY_TYPE" :"F",
            "CUSTOMER_ID":"",
        }
        const remainingPD = {
            IsNewRow: true,
            CUSTOMER_TYPE: state?.entityTypectx,
            CATEGORY_CD: state?.categoryValuectx,
            COMP_CD: "132 ",
            BRANCH_CD: "099 ",
            ACCT_TYPE: state?.accTypeValuectx,
            REQ_FLAG: "",
            CONSTITUTION_TYPE:"I",
        }        
    }

    const resetCkycctx = () => {
        // dispatch({
        //     type: "reset_ckyc",
        //     payload: {
                
        //     }
        // })
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
        // console.log("myr on update", "modifiedFormCols", state?.modifiedFormCols)
        let update_type = "";
        let updated_tabs = Object.keys(state?.modifiedFormCols ?? {})
        // console.log("myr on update", "updated_tabs", updated_tabs)
        // let updated_tab_format:any = {}
        let updated_tab_format:any = {}
        // console.log(state?.modifiedFormCols, ":qweewqasdcde1", updated_tabs.length, updated_tabs)
        if(updated_tabs.length>0) {

            // console.log("myr on update", "updated_tabs - length>0", updated_tabs)
        // console.log(update_type, ":qweewqasdcde2", "reqcd", state?.req_cd_ctx)
        let other_data = {
            IsNewRow: !state?.req_cd_ctx ? true : false,
            REQ_CD: state?.req_cd_ctx ?? "",
            COMP_CD: COMP_CD ?? "",
        }
        console.log("feiuqwdwqduyqewd",updated_tabs)
        let dataa = updated_tabs.map(async (TAB, i) => {
            return new Promise((res, rej) => {
                // console.log("myr on update", "TAB", TAB)
                let oldFormData = _.pick(state?.retrieveFormDataApiRes[TAB] ?? {}, state?.modifiedFormCols[TAB] ?? [])
                console.log(_.pick(state?.retrieveFormDataApiRes[TAB] ?? {}, state?.modifiedFormCols[TAB] ?? []), "oldddddd", state?.retrieveFormDataApiRes[TAB], state?.modifiedFormCols[TAB])
                let newFormData = _.pick(state?.formDatactx[TAB] ?? {}, state?.modifiedFormCols[TAB] ?? [])
                console.log(_.pick(state?.formDatactx[TAB] ?? {}, state?.modifiedFormCols[TAB] ?? []), "oldddddd new", state?.formDatactx[TAB], state?.modifiedFormCols[TAB])
                // console.log("myr on update", oldFormData, "old - new", newFormData, TAB)

                let upd;
                if(TAB == "DOC_MST") {

                } else if(TAB == "OTHER_ADDRESS" || TAB == "RELATED_PERSON_DTL" || TAB == "OTHER_ADDRESS") {
                    let oldRow:any[] = []
                    let newRow:any[] = []
                    // if(state?.retrieveFormDataApiRes[TAB] && state?.retrieveFormDataApiRes[TAB].length>0) {
                        oldRow = (state?.retrieveFormDataApiRes[TAB] && state?.retrieveFormDataApiRes[TAB].length>0) ? state?.retrieveFormDataApiRes[TAB].map((formRow, i) => {
                            let filteredRow = _.pick(formRow ?? {}, state?.modifiedFormCols[TAB] ?? [])
                            // if(TAB == "DOC_MST") {
                            //     filteredRow["SUBMIT"] = Boolean(filteredRow.SUBMIT) ? "Y" : "N"
                            //     // filteredRow = filteredRow.map(doc => ({...doc, SUBMIT: Boolean(doc.SUBMIT) ? "Y" : "N"}))
                            // }
                            console.log("wadqwdwq. asdasdawdawqqqqqq filteredrow", filteredRow)
                            return filteredRow;
                        }) : [];
                        console.log(oldRow, "wadqwdwq. asdasdawdawqqqqqq", state?.retrieveFormDataApiRes[TAB])

                        newRow = (state?.formDatactx[TAB] && state?.formDatactx[TAB].length>0) ? state?.formDatactx[TAB].map((formRow, i) => {
                            let filteredRow = _.pick(formRow ?? {}, state?.modifiedFormCols[TAB] ?? [])
                            return filteredRow;
                        }) : [];
                        // console.log("myr on update", oldRow, "old - new", newRow, TAB)
                        console.log(newRow, "wadqwdwq. asdasdawdawqqqqqq new", state?.formDatactx[TAB])
                        console.log("feiuqwdwqduyqewd", TAB)
                        // console.log(oldRow, ":qweewqasdcde23", "newRow", newRow )
                        upd = utilFunction.transformDetailDataForDML(
                            oldRow ?? [],
                            newRow ?? [],
                            ["SR_CD"]
                        );
                        // console.log("myr on update", "upd", upd, TAB)
                        if(upd) {
                            // console.log(update_type, ":qweewqasdcde3", "upd", upd )
                            console.log("wadqwdwq. asdasdawdawqqqqqq", upd)
                        }
                    // }


                } else {
                    upd = utilFunction.transformDetailsData(newFormData, oldFormData);
                    // console.log("myr on update", "not multi row", upd, TAB)
                    // console.log(update_type, ":qweewqasdcde3", "upd else", upd )
                }
                if(Object.keys(updated_tab_format).includes(TAB)) {
                    if(TAB == "DOC_MST") {
                        updated_tab_format[TAB] = [...state?.formDatactx[TAB]?.doc_mst_payload];
                    } else if(TAB == "OTHER_ADDRESS" || TAB == "RELATED_PERSON_DTL" || TAB == "OTHER_ADDRESS") {
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
                    if(TAB == "DOC_MST") {
                        updated_tab_format[TAB] = [...state?.formDatactx[TAB]?.doc_mst_payload];
                    } else if(TAB == "OTHER_ADDRESS" || TAB == "RELATED_PERSON_DTL" || TAB == "OTHER_ADDRESS") {
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
        <CkycContext.Provider 
            value={{
                state, dispatch, handleFromFormModectx, handleFormModalOpenctx, handleFormModalClosectx, handleFormModalOpenOnEditctx, onDraftSavectx,
                handleApiRes, 
                // handleCustCategoryRes,
                handleCategoryChangectx, handleAccTypeVal, handleKycNoValctx, handleReqCDctx, handlePhotoOrSignctx, handleSidebarExpansionctx, handleColTabChangectx, 
                handleFormDataonSavectx, handleFormDataonDraftctx, handleFormDataonRetrievectx, handleEditFormDatactx, handleModifiedColsctx, handlecustomerIDctx, 
                handleStepStatusctx, resetCkycctx, handleSavectx, handleUpdatectx, handleCurrFormctx, onFinalUpdatectx
            }}
        >
            {children}
        </CkycContext.Provider>
    )
}

export default CkycProvider;
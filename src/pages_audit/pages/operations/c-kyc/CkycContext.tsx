import React, {useReducer} from 'react'
import * as API from "./api";
import { CkycStateType } from './type';
import { AuthSDK } from 'registry/fns/auth';
import { DefaultErrorObject, utilFunction } from 'components/utils';
import _ from 'lodash';

const initialState:any  = {
    isFormModalOpenctx: false,
    handleFormModalOpenctx: () => {},
    handleFormModalClosectx: () => {},

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
    isReadyToSavectx: false,
    isReadyToUpdatectx: false,
    steps: {
        0: {status: ""}
    },
    currentFormRefctx: () => {},
    modifiedFormCols: {},
    updateFormDatactx: {},
    modifiedFormFormat: {}

    // steps: {
    //     error: [],
    //     completed: [],
    //     notValidated: []
    // }
}

const Reducer = (state, action) => {
    switch(action.type) {
        case "handleFormModalOpen": 
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
        case "handle_isreadytosave":
            return {
                ...state,
                ...action.payload
            };
        case "handle_isreadytoupdate":
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
        case "set_currentFormRef":
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

    const handleFormModalOpenctx = (entityType) => {
        dispatch({
            type: "handleFormModalOpen", 
            payload: {isFormModalOpenctx: true, entityTypectx: entityType, isFreshEntryctx: true }
        })
    }

    const handleFormModalOpenOnEditctx = (recordData, retrieveFormdata) => {
        // console.log(retrieveFormdata, "qweqeqeqwsxqswq", recordData)
        // required - CATEGORY_CODE, CONSTITUTION_TYPE, CUSTOMER_TYPE
        if(recordData[0]?.data?.CATEGORY_CONSTITUTIONS) {
            const categConstitutionValue = {
                value: recordData[0]?.data?.CATEGORY_CODE,
                label: recordData[0]?.data?.CATEGORY_CONSTITUTIONS.split("-")[0],
                CONSTITUTION_TYPE: recordData[0]?.data?.CONSTITUTION_TYPE,
                CONSTITUTION_NAME: recordData[0]?.data?.CATEGORY_CONSTITUTIONS.split("-")[1],
                
                

                // value: "05  ",
                // label: "OTHER",
                // CONSTITUTION_TYPE: "01",
                // CONSTITUTION_NAME: "INDIVIDUAL",
            }
            let payload = {
                categConstitutionValuectx: categConstitutionValue,
                categoryValuectx: recordData[0]?.data?.CATEGORY_CODE,
                constitutionValuectx: recordData[0]?.data?.CONSTITUTION_TYPE,
                isFormModalOpenctx: true, entityTypectx: recordData[0]?.data?.CUSTOMER_TYPE, isFreshEntryctx: false,
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
                isReadyToSavectx: false,
                isReadyToUpdatectx: false,
                modifiedFormFormat: {},                
                currentFormRefctx: () => {},            
            }
        })
    }

    const handleApiRes = (apiRes) => {
        // console.log("asdasdas>>", apiRes)
        let steps:any[] = [] 
        apiRes.forEach((element:any) => {
          steps.push(element?.TAB_DISPL_NAME)
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

    const handleReadyToSavectx = (value:boolean) => {
        dispatch({
            type: "handle_isreadytosave",
            payload: {
                isReadyToSavectx: value
            }
        })
    }

    const handleReadyToUpdatectx = (value:boolean) => {
        dispatch({
            type: "handle_isreadytoupdate",
            payload: {
                isReadyToUpdatectx: value
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
        console.log("wqkdhqiwuheqieqwdata", data)
        let retrieveApiRes = data
        // console.log("daatadtatad", data)
        let payload = {
            retrieveFormDataApiRes: {...retrieveApiRes},
            accTypeValuectx: data?.["PERSONAL_DETAIL"]?.ACCT_TYPE ?? "", //ACCT_TYPE
        }
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

    const handleCurrentFormRefctx = (fun:any) => {
        dispatch({
            type: "set_currentFormRef",
            payload: {
                currentFormRefctx: fun
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

    const handleUpdatectx = async ({COMP_CD}) => {
        let update_type = "";
        let updated_tabs = Object.keys(state?.modifiedFormCols ?? {})
        // let updated_tab_format:any = {}
        let updated_tab_format:any = {}
        if(updated_tabs.length>0) {

        if(updated_tabs.length == 1 && updated_tabs[0] == "PERSONAL_DETAIL") {
            // if(updated_tabs[0] == "PERSONAL_DETAIL") {
                update_type = "save_as_draft";
            // }
        } else if(updated_tabs.length>0 ) {
            update_type = "full_save";
        }
        let other_data = {
            IsNewRow: !state?.req_cd_ctx ? true : false,
            REQ_CD: state?.req_cd_ctx ?? "",
            COMP_CD: COMP_CD ?? "",
        }
        console.log("feiuqwdwqduyqewd",updated_tabs)
        let dataa = updated_tabs.map(async (TAB, i) => {
            return new Promise((res, rej) => {
                let oldFormData = _.pick(state?.retrieveFormDataApiRes[TAB] ?? {}, state?.modifiedFormCols[TAB] ?? [])
                console.log(_.pick(state?.retrieveFormDataApiRes[TAB] ?? {}, state?.modifiedFormCols[TAB] ?? []), "oldddddd", state?.retrieveFormDataApiRes[TAB], state?.modifiedFormCols[TAB])
                let newFormData = _.pick(state?.formDatactx[TAB] ?? {}, state?.modifiedFormCols[TAB] ?? [])
                console.log(_.pick(state?.formDatactx[TAB] ?? {}, state?.modifiedFormCols[TAB] ?? []), "oldddddd new", state?.formDatactx[TAB], state?.modifiedFormCols[TAB])

                let upd;
                if(TAB == "OTHER_ADDRESS" || TAB == "RELATED_PERSON_DTL") {
                    let oldRow:any[] = []
                    let newRow:any[] = []
                    // if(state?.retrieveFormDataApiRes[TAB] && state?.retrieveFormDataApiRes[TAB].length>0) {
                        oldRow = (state?.retrieveFormDataApiRes[TAB] && state?.retrieveFormDataApiRes[TAB].length>0) && state?.retrieveFormDataApiRes[TAB].map((formRow, i) => {
                            let filteredRow = _.pick(formRow ?? {}, state?.modifiedFormCols[TAB] ?? [])
                            return filteredRow;
                        })
                        console.log(oldRow, "asdasdawdawqqqqqq", state?.retrieveFormDataApiRes[TAB])

                        newRow = (state?.formDatactx[TAB] && state?.formDatactx[TAB].length>0) && state?.formDatactx[TAB].map((formRow, i) => {
                            let filteredRow = _.pick(formRow ?? {}, state?.modifiedFormCols[TAB] ?? [])
                            return filteredRow;
                        })
                        console.log(newRow, "asdasdawdawqqqqqq new", state?.formDatactx[TAB])
                        console.log("feiuqwdwqduyqewd", TAB)
                        upd = utilFunction.transformDetailDataForDML(
                            oldRow ?? [],
                            newRow ?? [],
                            ["SR_CD"]
                        );
                        if(upd) {
                            console.log("feiuqwdwqduyqewd", upd)
                        }
                    // }


                    // if(TAB == "RELATED_PERSON_DTL") {
                    //     // let newVal = _.pick(state?.formDatactx[TAB] ?? {}, state?.modifiedFormCols[TAB] ?? [])
                    //     // let oldVal = _.pick(state?.retrieveFormDataApiRes[TAB] ?? {}, state?.modifiedFormCols[TAB] ?? [])
    
                    //     let old = (state?.retrieveFormDataApiRes[TAB] && state?.retrieveFormDataApiRes[TAB].length>0) && state?.retrieveFormDataApiRes[TAB].map((formRow, i) => {
                    //         let DateFields = []
                    //         let filteredRow = _.pick(formRow ?? {}, state?.modifiedFormCols[TAB] ?? [])
                    //         return filteredRow;
                    //     })
                    //     console.log(old, "asdasdawdawqqqqqq", state?.retrieveFormDataApiRes[TAB])
    
                    //     let neww = (state?.formDatactx[TAB] && state?.formDatactx[TAB].length>0) && state?.formDatactx[TAB].map((formRow, i) => {
                    //         let DateFields = []
                    //         let filteredRow = _.pick(formRow ?? {}, state?.modifiedFormCols[TAB] ?? [])
                    //         return filteredRow;
                    //     })

                    //     console.log(neww, "asdasdawdawqqqqqq new", state?.formDatactx[TAB])
    
    
    
                    //     console.log("feiuqwdwqduyqewd", TAB)
                    //     upd = utilFunction.transformDetailDataForDML(
                    //         old ?? [],
                    //         neww ?? [],
                    //         ["SR_CD"]

                    //         // state?.retrieveFormDataApiRes[TAB] ?? [],
                    //         // state?.formDatactx[TAB] ?? [],
                    //         // ["SR_CD"]
                    //     );    
                    //     if(upd) {
                    //         console.log("feiuqwdwqduyqewd", upd)
                    //     }
                    // }
                } else {
                    upd = utilFunction.transformDetailsData(newFormData, oldFormData);
                }
                if(Object.keys(updated_tab_format).includes(TAB)) {
                    if(TAB == "OTHER_ADDRESS" || TAB == "RELATED_PERSON_DTL") {
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
                    if(TAB == "OTHER_ADDRESS" || TAB == "RELATED_PERSON_DTL") {
                        updated_tab_format[TAB] = [{
                            ...upd,
                            ...(_.pick(state?.formDatactx[TAB], upd._UPDATEDCOLUMNS)),
                            ...other_data
                        }]
                    } else {
                        updated_tab_format[TAB] = {
                            ...upd,
                            ...(_.pick(state?.formDatactx[TAB], upd._UPDATEDCOLUMNS)),
                            ...other_data
                        }
                    }
                }
                // console.log("updated_tab_format[TAB]", updated_tab_format[TAB])
                res(1)
            })
            // return (async () => {
            //     let oldFormData = _.pick(state?.retrieveFormDataApiRes[TAB] ?? {}, state?.modifiedFormCols[TAB] ?? [])
            //     let newFormData = _.pick(state?.formDatactx[TAB] ?? {}, state?.modifiedFormCols[TAB] ?? [])
            //     let upd = utilFunction.transformDetailsData(newFormData, oldFormData);
            //     if(Object.keys(updated_tab_format).includes(TAB)) {
            //         updated_tab_format[TAB] = {
            //             ...updated_tab_format.TAB,
            //             ...upd,
            //             ...(_.pick(state?.formDatactx[TAB], upd._UPDATEDCOLUMNS))
            //         }                
            //     } else {
            //         updated_tab_format[TAB] = {
            //             ...upd,
            //             ...(_.pick(state?.formDatactx[TAB], upd._UPDATEDCOLUMNS))
            //         }                
            //     }
            // })()
        })

        //     let oldFormData = _.pick(state?.retrieveFormDataApiRes["PERSONAL_DETAIL"] ?? {}, state?.modifiedFormCols["PERSONAL_DETAIL"])
        //     let newFormData = _.pick(state?.formDatactx["PERSONAL_DETAIL"] ?? {}, state?.modifiedFormCols["PERSONAL_DETAIL"])
        //     let upd = utilFunction.transformDetailsData(newFormData, oldFormData);

        // updated_tab_format["PERSONAL_DETAIL"] = {
        //     ...updated_tab_format["PERSONAL_DETAIL"],
        //     ...upd,
        //     ...(_.pick(state?.formDatactx["PERSONAL_DETAIL"], state?.modifiedFormCols["PERSONAL_DETAIL"]))
        // }                



        // updated_tabs.forEach(TAB => {
        //     // let oldFormData = _.pick(state?.retrieveFormDataApiRes["PERSONAL_DETAIL"] ?? {}, formFieldsRef.current)
        //     // let newFormData = _.pick(state?.formDatactx["PERSONAL_DETAIL"] ?? {}, formFieldsRef.current)
        //     // let upd = utilFunction.transformDetailsData(newFormData, oldFormData);

        //     let oldFormData = _.pick(state?.retrieveFormDataApiRes[TAB] ?? {}, state?.modifiedFormCols[TAB] ?? [])
        //     let newFormData = _.pick(state?.formDatactx[TAB] ?? {}, state?.modifiedFormCols[TAB] ?? [])
        //     let upd = utilFunction.transformDetailsData(newFormData, oldFormData);
        //     if(Object.keys(updated_tab_format).includes(TAB)) {
        //         updated_tab_format.TAB = {
        //             ...updated_tab_format.TAB,
        //             ...upd,
        //             ...(_.pick(state?.formDatactx[TAB], state?.modifiedFormCols[TAB]))
        //         }                
        //     }
        // });
        // if(dataa) {
        //     console.log(dataa, "updated_tab_format", updated_tab_format, "type ", update_type, "tabs", updated_tabs)
        // }
        const { data, status, message, messageDetails } =
        await AuthSDK.internalFetcher("SAVECUSTOMERDATA", {
            // IsNewRow: true,
            // // REQ_CD:"734",
            // REQ_CD:REQ_CD,
            // REQ_FLAG:"F",
            // SAVE_FLAG:"F",
            // ENTRY_TYPE :"1",
            // CUSTOMER_ID:"",
            // NRI_DTL: formData["NRI_DTL"], //test-done        
            CUSTOMER_ID: state?.customerIDctx ?? "",
            REQ_CD: state?.req_cd_ctx ?? "",
            REQ_FLAG: state?.customerIDctx ? "E" : "F",
            SAVE_FLAG: state?.customerIDctx 
                        ? "" 
                        : update_type == "save_as_draft" 
                            ? "D" 
                            : update_type == "full_save" 
                                ? "F" 
                                : "",
            // SAVE_FLAG: "",
            ENTRY_TYPE : state?.req_cd_ctx ? "2" : "1",
            IsNewRow: !state?.req_cd_ctx ? true : false,
            // CUSTOMER_ID:"",
            // NRI_DTL: formData["NRI_DTL"], //test-done,
            
            ...updated_tab_format

        });
        if(status === "0") {
          return data;
        } else {
          throw DefaultErrorObject(message, messageDetails);
        }   
        }
    }

    return (
        <CkycContext.Provider 
            value={{
                state, dispatch, handleFormModalOpenctx, handleFormModalClosectx, handleFormModalOpenOnEditctx,
                handleApiRes, 
                // handleCustCategoryRes,
                handleCategoryChangectx, handleAccTypeVal, handleKycNoValctx, handleReqCDctx, handlePhotoOrSignctx, handleSidebarExpansionctx, handleColTabChangectx, 
                handleFormDataonSavectx, handleFormDataonDraftctx, handleFormDataonRetrievectx, handleEditFormDatactx, handleModifiedColsctx, handlecustomerIDctx, handleStepStatusctx, handleReadyToSavectx, handleReadyToUpdatectx, resetCkycctx, handleUpdatectx, handleCurrentFormRefctx
            }}
        >
            {children}
        </CkycContext.Provider>
    )
}

export default CkycProvider;
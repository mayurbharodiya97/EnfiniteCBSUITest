import React, {useReducer} from 'react'
import { CkycStateType } from './type';

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
    customerCategoriesctx: [],
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


    steps: {
        0: {status: ""}
    }

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
        case "update_customerCategoriesctx":
            return {
                ...state,
                ...action.payload
            };
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
        // console.log(retrieveFormdata, "qweqeqeqwsxqswq", recordData[0].data)
        const categConstitutionValue = {
            value: recordData[0]?.data?.CATEGORY_CODE,
            label: recordData[0]?.data?.CATEGORY_CONSTITUTIONS.split("-")[0],
            CONSTITUTION_TYPE: recordData[0]?.data?.CONSTITUTION_TYPE,
            CONSTITUTION_NAME: recordData[0]?.data?.CATEGORY_CONSTITUTIONS.split("-")[1],
        }

        dispatch({
            type: "handleCategoryChangectx",
            payload: {
                categConstitutionValuectx: categConstitutionValue,
                categoryValuectx: recordData[0]?.data?.CATEGORY_CODE,
                constitutionValuectx: recordData[0]?.data?.CONSTITUTION_TYPE,
                isFormModalOpenctx: true, entityTypectx: recordData[0]?.data?.CUSTOMER_TYPE, isFreshEntryctx: false,
                customerIDctx: recordData[0]?.id
                // retrieveFormDataApiRes: retrieveFormdata,
                
                // categConstitutionValuectx: "kuashd",
                // categoryValuectx: "kub",
                // constitutionValuectx: "yuu",
                // isFormModalOpenctx: true, entityTypectx: recordData[0]?.data?.CUSTOMER_TYPE, isFreshEntryctx: false 

                // categoryValuectx: value?.value,
                // constitutionValuectx: value?.CONSTITUTION_TYPE,
                // colTabValuectx: 0,
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

    const handleCustCategoryRes = (apiRes) => {
        dispatch({
            type: "update_customerCategoriesctx",
            payload: {
                customerCategoriesctx: apiRes
            }
        })           
    }

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
                accTypeValuectx: value
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
        dispatch({
            type: "update_retrieveFormData",
            payload: {
                retrieveFormDataApiRes: {...data},
                accTypeValuectx: data?.["PERSONAL_DETAIL"]?.ACCT_TYPE, //ACCT_TYPE

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

    return (
        <CkycContext.Provider 
            value={{
                state, dispatch, handleFormModalOpenctx, handleFormModalClosectx, handleFormModalOpenOnEditctx,
                handleApiRes, handleCustCategoryRes,
                handleCategoryChangectx, handleAccTypeVal, handleKycNoValctx, handleReqCDctx, handlePhotoOrSignctx, handleSidebarExpansionctx, handleColTabChangectx, 
                handleFormDataonSavectx, handleFormDataonDraftctx, handleFormDataonRetrievectx, handlecustomerIDctx, handleStepStatusctx, resetCkycctx
            }}
        >
            {children}
        </CkycContext.Provider>
    )
}

export default CkycProvider;
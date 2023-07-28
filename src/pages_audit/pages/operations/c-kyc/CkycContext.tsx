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

    entityTypectx: "",
    setEntityTypectx: () => {},

    tabsApiResctx: [],
    setTabsApiRes: () => {},
    customerCategoriesctx: [],
    categoryValuectx: null,
    constitutionValuectx: null,
    accTypeValuectx: null,
    setCategoryValue: () => {},
    setConstitutionValuectx: () => {},
    setAccTypeValuectx: () => {},
    AccTypeOptionsctx: [],

    formDatactx: {},
    formDataDraftctx: {},
    isFreshEntryctx: false,
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

    const handleCategoryChangectx = (e, value) => {
        if(value) {
            dispatch({
                type: "handleCategoryChangectx",
                payload: {
                    categoryValuectx: value?.value,
                    constitutionValuectx: value?.CONSTITUTION_TYPE,
                    colTabValuectx: 0,
                }
              })
        } else {
            dispatch({
                type: "handleCategoryChangectx",
                payload: {
                    categoryValuectx: null,
                    constitutionValuectx: null,
                    colTabValuectx: false,
                    tabsApiResctx: []
                }
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
                categoryValuectx: null,
                constitutionValuectx: null,
                accTypeValuectx: null,
                tabsApiResctx: [],
                isFreshEntryctx: false,
            }
        })
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

    const handleFormDataonSavectx = (data) => {
        dispatch({
            type: "update_formData",
            payload: {
                formDatactx: {...data}
            }
        })
    }

    const handleFormDataonDraftctx = (data) => {
        console.log("werhfwejfuiwef", state.formDatactx, typeof data, {...state.formDatactx, ...data})
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

    return (
        <CkycContext.Provider 
            value={{
                state, dispatch, handleFormModalOpenctx, handleFormModalClosectx, 
                handleCategoryChangectx, handleSidebarExpansionctx, handleColTabChangectx, 
                handleFormDataonSavectx, handleFormDataonDraftctx
            }}
        >
            {children}
        </CkycContext.Provider>
    )
}

export default CkycProvider;
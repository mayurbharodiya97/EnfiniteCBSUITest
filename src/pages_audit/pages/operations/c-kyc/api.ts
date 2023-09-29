import { DefaultErrorObject } from "components/utils";
import { format } from "date-fns";
import { AuthSDK } from "registry/fns/auth";

export const TodaysTransactionTableGrid = async ({ COMP_CD, BRANCH_CD }) => {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETTRANSACTIONDETAILS", {
        COMP_CD: COMP_CD,
        // BASE_BRANCH_CD: BASE_BRANCH_CD,
        BRANCH_CD: BRANCH_CD,
        // ENTERED_DATE: format(new Date(), "dd/MMM/yyyy"),
      });
    if (status === "0") {
      return data;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  };


export const GetCategoryOptions = async () => {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("CATEGORYNAME", {
        // COMP_CD: COMP_CD,
        // BASE_BRANCH_CD: BASE_BRANCH_CD,
        // BRANCH_CD: BRANCH_CD,
        // ENTERED_DATE: format(new Date(), "dd/MMM/yyyy"),
        // CUST_TYPE: CUST_TYPE
      });
    if (status === "0") {
      return data;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  };
export const GetAreaOptions = async () => {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETAREA", {
        // COMP_CD: COMP_CD,
        // BASE_BRANCH_CD: BASE_BRANCH_CD,
        // BRANCH_CD: BRANCH_CD,
        // ENTERED_DATE: format(new Date(), "dd/MMM/yyyy"),
        // CUST_TYPE: CUST_TYPE
      });
    if (status === "0") {
      return data;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  };

export const getCustomerDetails = async ({COMP_CD, CUST_ID, CONTACT_NO, PAN_NO, ACCT_NM, UNIQ_ID, E_MAIL_ID }) => {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETCUSTOMERDTL", {
        COMP_CD: "132",
        CUST_ID: "211562",
        CONTACT_NO: " ",
        PAN_NO: " ",
        ACCT_NM: " ",
        UNIQ_ID: " ",
        E_MAIL_ID: " "
        // BASE_BRANCH_CD: BASE_BRANCH_CD,
        // BRANCH_CD: BRANCH_CD,
        // ENTERED_DATE: format(new Date(), "dd/MMM/yyyy"),
        // CUST_TYPE: CUST_TYPE
      });
    if (status === "0") {
      return data;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  };

export const getTabsDetail = async ({ COMP_CD , ENTITY_TYPE, CATEGORY_CD, CONS_TYPE, isFreshEntry }) => {
  if(!CATEGORY_CD || !CONS_TYPE) {
    return []
  }
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCIFTABDTL", {
      COMP_CD: COMP_CD,
      ENTITY_TYPE: ENTITY_TYPE,
      CATEGORY_CD: CATEGORY_CD,
      CONS_TYPE: CONS_TYPE,
      ENTRY_MODE: isFreshEntry ? "NEW" : "EDIT"
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getCustomerDetailsonEdit = async ({COMP_CD, CUSTOMER_ID}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCUSTOMERDETAILS", {
      COMP_CD: COMP_CD, 
      CUSTOMER_ID: CUSTOMER_ID, 
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ CATEG_CD, CATEG_NM, ...other }) => {
          return {
            ...other,
            CATEG_CD: CATEG_CD, 
            CATEG_NM: CATEG_NM,
            value: CATEG_CD,
            label: CATEG_NM,
          };
        }
      );
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};


export const getCIFCategories = async ({ COMP_CD, BRANCH_CD, ENTITY_TYPE }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCIFCATEG", {
      COMP_CD: COMP_CD, 
      BRANCH_CD: BRANCH_CD,
      ENTITY_TYPE: ENTITY_TYPE,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ CATEG_CD, CATEG_NM, ...other }) => {
          return {
            ...other,
            CATEG_CD: CATEG_CD, 
            CATEG_NM: CATEG_NM,
            value: CATEG_CD,
            label: CATEG_NM,
          };
        }
      );
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getOccupationDTL = async (COMP_CD, BRANCH_CD) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCUSTOCCUPATIONLIST", {
      COMP_CD: COMP_CD ?? "",
      BRANCH_CD: BRANCH_CD ?? "",
      CONSTITUTION_TYPE: "I",
    });
    if (status === "0") {
      let responseData = data;
      if (Array.isArray(responseData)) {
        responseData = responseData.map(
          ({ TRADE_CD, TRADE_NM, ...other }) => {
            return {
              ...other,
              TRADE_CD: TRADE_CD, 
              TRADE_NM: TRADE_NM,
              value: TRADE_CD,
              label: TRADE_NM,
            };
          }
        );
      }
      return responseData;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
};

export const getRatingOpDTL = async (COMP_CD, BRANCH_CD) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCUSTRATELIST", {
      COMP_CD: COMP_CD ?? "",
      BRANCH_CD: BRANCH_CD ?? "",
    });
    if (status === "0") {
      let responseData = data;
      if (Array.isArray(responseData)) {
        responseData = responseData.map(
          ({ RATE_CD, RATE_NM, ...other }) => {
            return {
              ...other,
              RATE_CD: RATE_CD, 
              RATE_NM: RATE_NM,
              value: RATE_CD,
              label: RATE_NM,
            };
          }
        );
      }
      return responseData;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
};

export const getPMISCData = async (CATEGORY_CD, dependentValue?) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETPMISCDATA", {
      CATEGORY_CD: CATEGORY_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      console.log("qweqwerr", responseData) // checked for pass, dr - expiry date

      if(CATEGORY_CD == "Marital") {
        // console.log("dkjawhdiqwuiugeqweqe", dependentValue)
        let resOp:any = []
        const options = dependentValue?.PREFIX_CD?.optionData?.[0]?.MARITIAL_STATUS ?? ""
        responseData.map((element, i) => {
          // console.log("element item", element?.DATA_VALUE, typeof element?.DATA_VALUE)
          if(options.indexOf(element?.DATA_VALUE) != -1) {
            resOp.push(element)
          }
        })
        if(resOp && resOp.length>0) {
          // return resOp;
          responseData = resOp;
        }
      }
  

      responseData = responseData.map(
        ({ DATA_VALUE, DISPLAY_VALUE, ...other }) => {
          return {
            ...other,
            DATA_VALUE: DATA_VALUE, 
            DISPLAY_VALUE: DISPLAY_VALUE,
            value: DATA_VALUE,
            label: DISPLAY_VALUE,
          };
        }
      );
    }
    return responseData
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}

export const GetDynamicSalutationData = async (CATEGORY_CD) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSALUTATIONDATA", {
      CATEGORY: CATEGORY_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ DATA_VALUE, DISPLAY_VALUE, ...other }) => {
          return {
            ...other,
            DATA_VALUE: DATA_VALUE, 
            DISPLAY_VALUE: DISPLAY_VALUE,
            value: DATA_VALUE,
            label: DISPLAY_VALUE,
          };
        }
      );
    }
    return responseData
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}

export const getGenderOp = (dependentValue) => {
  const opString = dependentValue?.PREFIX_CD?.optionData?.[0]?.GENDER ?? ""
  const opArr = (opString.indexOf("-") == -1) ? Array.from(opString) : opString.split(",").trim()  // [M,F,O]
  let op = [
    {label: "MALE", value: "M"},
    {label: "FEMALE", value: "F"},
    {label: "OTHER", value: "O"},
    {label: "TRANSGENDER", value: "T"},
  ]
  if(opString) {
    let options:any = []
    op.map((el,i) => {
      if(opArr?.includes(el.value)) {
        options.push(el)
        // op.splice(i, 1)
      }
    })
    if(options && options.length>0) {
      op = options
    }
  }
  // console.log(op, "oppopo,", opArr)
  return op;
}

export const getCountryOptions = async (COMP_CD, BRANCH_CD) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCOUNTRYLIST", {
      COMP_CD: COMP_CD, 
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      // console.log("qweqwerr", responseData)
      responseData = responseData.map(({ COUNTRY_CD, COUNTRY_NM, ...other }) => {
          return {
            ...other,
            COUNTRY_CD: COUNTRY_CD, 
            COUNTRY_NM: COUNTRY_NM,
            value: COUNTRY_CD,
            label: COUNTRY_NM,
          };
        }
      );
    }
    return responseData
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}

export const getCustomerGroupOptions = async (COMP_CD, BRANCH_CD) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCUSTGROUPLIST", {
      COMP_CD: COMP_CD, 
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ GROUP_CD, DESCRIPTION, ...other }) => {
          return {
            ...other,
            GROUP_CD: GROUP_CD, 
            DESCRIPTION: DESCRIPTION,
            value: GROUP_CD,
            label: DESCRIPTION,
          };
        }
      );
    }
    return responseData
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}

export const getCommunityList = async (COMP_CD, BRANCH_CD) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCUSTCOMMULIST", {
      COMP_CD: COMP_CD, 
      BRANCH_CD: BRANCH_CD,
      CONSTITUTION_TYPE: "I"
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ CODE, DISPLAY_NM, ...other }) => {
          return {
            ...other,
            CODE: CODE, 
            DISPLAY_NM: DISPLAY_NM,
            value: CODE,
            label: DISPLAY_NM,
          };
        }
      );
    }
    return responseData
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}
export const getParentAreaOptions = async (COMP_CD, BRANCH_CD) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETPARENTAREALIST", {
      COMP_CD: COMP_CD, 
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ P_AREA_NM, P_AREA_CD, ...other }) => {
          return {
            ...other,
            P_AREA_NM: P_AREA_NM, 
            P_AREA_CD: P_AREA_CD,
            value: P_AREA_CD,
            label: P_AREA_NM,
          };
        }
      );
    }
    return responseData
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}
// export const getSubAreaOptions = async (dependentValue, COMP_CD, BRANCH_CD) => {
//   console.log("getSubAreaOptions called", dependentValue)
//   // let Parent_Area = ""
//   // let apiData:any[] = []
//   // if(dependentValue?.PAR_AREA_CD?.value) {
//   //   let resData:any[] = []
//   //   Parent_Area = dependentValue.PAR_AREA_CD.value
//   //   resData = apiData.filter(d => d?.PARENT_AREA == Parent_Area)
//   //   return resData;
//   // }

//   if(!Boolean(dependentValue.PAR_AREA_CD.value)) {
//     const { data, status, message, messageDetails } =
//       await AuthSDK.internalFetcher("GETAREALIST", {
//         COMP_CD: COMP_CD, 
//         BRANCH_CD: BRANCH_CD,
//       });
//     if (status === "0") {
//       let responseData = data;
//       // responseData = data.filter(d => d?.PARENT_AREA == Parent_Area);
//       // console.log(responseData, "subarea", responseData.length, data.length )
//       if (Array.isArray(responseData)) {

//         // if(dependentValue?.PAR_AREA_CD?.value) {
//         //   // let resData:any[] = []
//         //   // Parent_Area = dependentValue.PAR_AREA_CD.value
//         //   // resData = apiData.filter(d => d?.PARENT_AREA == Parent_Area)
//         //   // return resData;
//         //   let Parent_Area = dependentValue.PAR_AREA_CD.value
//         //   responseData = responseData.filter(d => d?.PARENT_AREA == Parent_Area)
//         // }
      

//         responseData = responseData.map(({ AREA_NM, AREA_CD, ...other }) => {
//             return {
//               ...other,
//               AREA_NM: AREA_NM, 
//               AREA_CD: AREA_CD,
//               value: AREA_CD,
//               label: AREA_NM,
//             };
//           }
//         );
//       }
//       return responseData
//     } else {
//       throw DefaultErrorObject(message, messageDetails);
//     }
//   }
// }

export const getSubAreaOptions = async (dependentValue, COMP_CD, BRANCH_CD) => {
  const { data, status, message, messageDetails } =
  await AuthSDK.internalFetcher("GETAREALIST", {
    COMP_CD: COMP_CD, 
    BRANCH_CD: BRANCH_CD,
    PIN_CODE: "123456"
  });

  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      let Parent_Area = null;
      if(dependentValue?.PAR_AREA_CD?.value) {
        Parent_Area = dependentValue.PAR_AREA_CD.value
        responseData = responseData.filter(d => d?.PARENT_AREA == Parent_Area)
      } else if (dependentValue?.LOC_AREA_CD?.value) {
        Parent_Area = dependentValue.LOC_AREA_CD.value
        responseData = responseData.filter(d => d?.PARENT_AREA == Parent_Area)
      }

      responseData = responseData.map(({ AREA_NM, AREA_CD, ...other }) => {
          return {
            ...other,
            AREA_NM: AREA_NM, 
            AREA_CD: AREA_CD,
            value: AREA_CD,
            label: AREA_NM,
          };
        }
      );
    }
    return responseData
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}

export const getRetrieveData = async ({COMP_CD, SELECT_COLUMN}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCUSTOMERLIST", {
      COMP_CD: COMP_CD,
      SELECT_COLUMN: SELECT_COLUMN
    });
  if (status === "0") {
    return data
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}
export const getPendingData = async ({COMP_CD, BRANCH_CD, ENTERED_DATE}) => {
  const { data, status, message, messageDetails } =
  await AuthSDK.internalFetcher("GETPENDINGCUSTLIST", {
    COMP_CD: COMP_CD, 
    BRANCH_CD: BRANCH_CD, 
    ENTERED_DATE: ENTERED_DATE
  });
  if (status === "0") {
    return data
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}
export const getRangeOptions = async (COMP_CD, BRANCH_CD) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETNNULINCOME", {
      COMP_CD: COMP_CD, 
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ TRAN_CD, DISPLAY_NM, ...other }) => {
          return {
            ...other,
            TRAN_CD: TRAN_CD, 
            DISPLAY_NM: DISPLAY_NM,
            value: TRAN_CD,
            label: DISPLAY_NM,
          };
        }
      );
    }
    return responseData
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}
export const getEmpCompanyTypes = async (COMP_CD, BRANCH_CD) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCOMPTYPENM", {
      COMP_CD: COMP_CD, 
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ COMPANY_TYPE_CD, DISPLAY_COMP_TYPE_NM, ...other }) => {
          return {
            ...other,
            COMPANY_TYPE_CD: COMPANY_TYPE_CD, 
            DISPLAY_COMP_TYPE_NM: DISPLAY_COMP_TYPE_NM,
            value: COMPANY_TYPE_CD,
            label: DISPLAY_COMP_TYPE_NM,
          };
        }
      );
    }
    return responseData
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}
export const getEduQualiOptions = async (COMP_CD, BRANCH_CD) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETEDUCATIONDTL", {
      COMP_CD: COMP_CD, 
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ ED_TYPE_CD, DISPLAY_NM, ...other }) => {
          return {
            ...other,
            ED_TYPE_CD: ED_TYPE_CD, 
            DISPLAY_NM: DISPLAY_NM,
            value: ED_TYPE_CD,
            label: DISPLAY_NM,
          };
        }
      );
    }
    return responseData
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}

export const getRelationshipManagerOptions = async (COMP_CD) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("RELATIONSHIPMANAGER", {
      COMP_CD: COMP_CD, 
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ FULLNAME, EMP_ID, ...other }) => {
          return {
            ...other,
            FULLNAME:FULLNAME,
            EMP_ID: EMP_ID,
            label: FULLNAME,
            value: EMP_ID,
          };
        }
      );
    }
    return responseData
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}

export const getDocumentTypes = async ({TRAN_CD, SR_CD, DOC_TYPE}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DOCCUMENTSCANHISTORY", {
      TRAN_CD: "189084", 
      SR_CD: "1",
      DOC_TYPE: "KYC"
  });
  if (status === "0") {
    let responseData = data;
    // if (Array.isArray(responseData)) {
    //   responseData = responseData.map(({ FULLNAME, EMP_ID, ...other }) => {
    //       return {
    //         ...other,
    //         FULLNAME:FULLNAME,
    //         EMP_ID: EMP_ID,
    //         label: FULLNAME,
    //         value: EMP_ID,
    //       };
    //     }
    //   );
    // }
    return responseData
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}

export const getKYCDocumentGridData = async ({COMP_CD, BRANCH_CD, CUST_TYPE, CONSTITUTION_TYPE}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DOCTEMPLATEDTL", {
      COMP_CD: COMP_CD, 
      BRANCH_CD: BRANCH_CD, 
      CUST_TYPE: CUST_TYPE, 
      CONSTITUTION_TYPE: CONSTITUTION_TYPE,
      // TRAN_CD: "42"
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ FULLNAME, EMP_ID, ...other }) => {
          return {
            ...other,
            FULLNAME:FULLNAME,
            EMP_ID: EMP_ID,
            label: FULLNAME,
            value: EMP_ID,
          };
        }
      );
    }
    return responseData
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}

export const getCustDocumentOpDtl = async (COMP_CD, BRANCH_CD) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCUSTDOCUMENT", {
      COMP_CD: COMP_CD, 
      BRANCH_CD: BRANCH_CD, 
    });
  if (status === "0") {
    let responseData = data;
    // if (Array.isArray(responseData)) {
    //   responseData = responseData.map(({ FULLNAME, EMP_ID, ...other }) => {
    //       return {
    //         ...other,
    //         FULLNAME:FULLNAME,
    //         EMP_ID: EMP_ID,
    //         label: FULLNAME,
    //         value: EMP_ID,
    //       };
    //     }
    //   );
    // }
    return responseData
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}

export const SaveAsDraft = async ({
  CUSTOMER_TYPE,
  CATEGORY_CD,
  ACCT_TYPE,
  CONSTITUTION_TYPE,
  IsNewRow,
  PERSONAL_DETAIL,
}) => {
  // console.log("reqdataa..",
  //   // `
  //   // // ${Object.keys(PERSONAL_DETAIL)}`,
  // )
  const remainingData = { 
    // IsNewRow: IsNewRow,
    // REQ_CD:"",
    // REQ_FLAG:"F",
    // SAVE_FLAG:"D",
    // ENTRY_TYPE :"F",
    // CUSTOMER_ID:"",

    IsNewRow: IsNewRow,
    REQ_CD: "",
    REQ_FLAG: "F",
    SAVE_FLAG: "D",
    ENTRY_TYPE: "1",
    CUSTOMER_ID: "",
  }
  const remainingPD = {
      IsNewRow: IsNewRow,
      CUSTOMER_TYPE: CUSTOMER_TYPE,
      CATEGORY_CD: CATEGORY_CD,
      // CONSTITUTION_TYPE: CONSTITUTION_TYPE,
      CONSTITUTION_TYPE: CONSTITUTION_TYPE,
      COMP_CD: "132 ",
      BRANCH_CD: "099 ",
      ACCT_TYPE: ACCT_TYPE,
      REQ_FLAG: "F",
      CATEG_CD: CONSTITUTION_TYPE,
      // entityType: CUSTOMER_TYPE,
      COUNTRY_CD: "123 "
      // GST_NO: "",
  }

  // not found in individual type cust. form
  const ExtraData = {
    APPLICATION_TYPE: "Y",
    // ENTERED_DATE: format(new Date(), "dd-MMM-yyyy"),
    ENTERED_DATE: "20-July-2023",
    STD_1: "",
    STD_4: "54890",
    STD_2: "",
    STD_3: "",
    CONTACT1: "",
    CONTACT4: "",
    CONTACT2: "7858089344",
    CONTACT3: "",

    // SCREEN: "",
    // ISD_CD:"456783",
    // ENTERED_BY:"hff",
    // PAN_NO: "DWIPP9643D",
    // UNIQUE_ID: "673598516700",
}

  // let REQDATA = {...PERSONAL_DETAIL, ...remainingPD, ...ExtraData}
  // REQDATA = {
  //   ...REQDATA,
  // }


  // console.log("wndiuwqieiqweqwe apipip", {
  //   ...remainingData,
  //   PERSONAL_DETAIL: {...PERSONAL_DETAIL, ...remainingPD, ...ExtraData}
  // })


  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("SAVECUSTOMERDATA", {
      ...remainingData,
      PERSONAL_DETAIL: {...PERSONAL_DETAIL, ...remainingPD, ...ExtraData},

    //   PERSONAL_DETAIL: {
    //     IsNewRow: true,
    //     FIRST_NM: "apurva",
    //     ACCT_NM :"vijay",
    //     SURNAME: "tetu",
    //     CUSTOMER_TYPE: "I",
    //     CONSTITUTION_TYPE: "01",
    //     COMP_CD: "132 ",
    //     BRANCH_CD: "099 ",
    //     GENDER :"F",
    //     KYC_NUMBER: "123456",
    //     COMMU_CD: "01",
    //     REQ_FLAG: "F",
    //     FATHER_SPOUSE: "01",
    //     CASTE_CD: "OBC",
    //     TRADE_CD: "243 ",
    //     SUB_CUST_TYPE: "",
    //     RATE_CD: "",
    //     GROUP_CD: "",
    //     KYC_REVIEW_DT: "",
    //     EXPLICIT_TDS: "N",
    //     BIRTH_DT: "08-11-2000",
    //     NATIONALITY: "",
    //     RESIDENCE_STATUS: "01",
    //     CATEG_CD: "09",
    //     GSTIN: "08ABKFM4841Q1Z1",
    //     FORM_60: "Y",
    //     PAN_NO: "ABKFM4841Q",
    //     UDYAM_REG_NO: "38494404",
    //     OTHER_DOC: "",
    //     PROOF_OF_ADD: "01",
    //     OTHER_DOC_NO: "",
    //     REFERENCE_TYPE: "",
    //     REFERENCE_RELATION: "",
    //     PASSPORT_NO: "924746587",
    //     PASSPORT_ISSUE_DT: "03-09-2018",
	 	// PASSPORT_EXPIRY_DT: "03-09-2023",
	 	// PASSPORT_AUTHORITY_CD: "01",
	 	// DRIVING_LICENSE_NO: "58324892",
	 	// DRIVING_LICENSE_ISSUE_DT: "03-09-2018",
	 	// DRIVING_LICENSE_EXPIRY_DT: "03-12-2027",
	 	// DRIVING_LICENSE_AUTHORITY_CD: "01",
    //     OTHER_REFERENCE: "",
    //     MEM_ACCT_TYPE: "",
    //     UNIQUE_ID: "673598516700",
    //     MEM_ACCT_CD: "",
    //     MEM_COMP_CD: "",
    //     MEM_BRANCH_CD: "",
    //     FATCA_DEC_RECVD: "N",
    //     FATCA_DT: "",
    //     TIN_ISSUING_COUNTRY: "01",
    //     COUNTRY_OF_INCORPORATION: "",
    //     PLACE_OF_INCORPORATION: "",
    //     DATE_OF_COMMENCEMENT: "",
    //     US_GIIN: "",
    //     TIN: "12",
    //     CCIL_ID: "",
    //     LEI_NO: "",
    //     LEI_EXPIRY_DATE: "",
    //     ADDRESS_TYPE: "02",
    //     AREA_CD: "001",
    //     PIN_CODE: "385659",
    //     CITY_CD: "",
    //     STATE_CD: "",
    //     DISTRICT_CD: "",
    //     COUNTRY_CD: "01",
    //     ADD1: "Acute Informatics",
    //     ADD2: "Pune",
    //     ADD3: " ",
    //     OTHER_POA: "",
    //     LOC_ADD_TYPE: "",
    //     SAME_AS_PER: "Y",
    //     LOC_ADD1: "",
    //     LOC_ADD2: "",
    //     LOC_ADD3: "",
    //     LOC_AREA_CD: "",
    //     LOC_CITY_CD: "",
    //     LOC_DISTRICT_CD: "",
    //     LOC_STATE_CD: "",
    //     LOC_COUNTRY_CD: "",
    //     LOC_PIN_CODE: "",
    //     LOC_PROOF_OF_ADD: "",
    //     STD_1: "",
    //     STD_4: "54890",
    //     STD_2: "",
    //     STD_3: "",
    //     CONTACT1: "",
    //     CONTACT4: "",
    //     CONTACT2: "7858089344",
    //     CONTACT3: "",
    //     E_MAIL_ID: "apurvapatil@gmail.com",
    //     ENTRY_TYPE: "1",
    //     APPLICATION_TYPE: "Y",
    //     E_MAIL_ID2: "",
    //     ENTERED_BY: "hff",
    //     ENTERED_DATE: "20-06-2023",
    //     ENT_BRANCH_CD: "099 ",
    //     ENT_COMP_CD: "132 "
    // },




      // PERSONAL_DETAIL: {
      //     prefixDivider: "",
      //     PREFIX_CD: "",
      //     FIRST_NM: "",
      //     LAST_NM: "",
      //     SURNAME: "",
      //     ACCT_NM: "",
      //     maidenHeaderdivider: "",
      //     MAIDEN_PREFIX_CD: "Mrs",
      //     MAIDEN_FIRST_NM: "",
      //     MAIDEN_MIDDLE_NM: "",
      //     MAIDEN_LAST_NM: "",
      //     FATHER_SPOUSE: "01",
      //     fatherHeaderDivider: "",
      //     FATHER_PREFIX_CD: "Mr",
      //     FATHER_FIRST_NM: "",
      //     FATHER_MIDDLE_NM: "",
      //     FATHER_LAST_NM: "",
      //     motherHeaderDivider: "",
      //     MOTHER_PREFIX_CD: "Mrs",
      //     MOTHER_FIRST_NM: "",
      //     MOTHER_MIDDLE_NM: "",
      //     MOTHER_LAST_NM: "",
      //     BIRTH_DT: "01-Aug-2023",
      //     LF_NO: "minor",
      //     GENDER: "",
      //     BLOOD_GRP_CD: "",
      //     MARITAL_STATUS: "",
      //     NATIONALITY: "",
      //     RESIDENCE_STATUS: "01",
      //     TRADE_CD: "",
      //     GROUP_CD: "",
      //     COMMU_CD: "",
      //     CASTE_CD: "",
      //     KYC_REVIEW_DT: "",
      //     FORM_60: "N",
      //     PAN_NO: "DWIPP9643D",
      //     UNIQUE_ID: "673598516700",
      //     ELECTION_CARD_NO: "",
      //     EXPLICIT_TDS: "N",
      //     NREGA_JOB_CARD: "",
      //     OTHER_DOC: "",
      //     OTHER_DOC_NO: "",
      //     GSTIN: "",
      //     passportDivider: "",
      //     PASSPORT_NO: "924746587",
      //     PASSPORT_AUTHORITY_CD: "Delhi",
      //     PASSPORT_ISSUE_DT: "03-Sep-2023",
      //     PASSPORT_EXPIRY_DT: "03-Sep-2023",
      //     drivingLicenseDivider: "",
      //     DRIVING_LICENSE_NO: "58324892",
      //     DRIVING_LICENSE_AUTHORITY_CD: "Delhi",
      //     DRIVING_LICENSE_ISSUE_DT: "03-Sep-2023",
      //     DRIVING_LICENSE_EXPIRY_DT: "03-Sep-2023",
      //     currentAddDivider: "",
      //     ADDRESS_TYPE: "",
      //     ADD1: "",
      //     ADD2: "",
      //     ADD3: "",
      //     PAR_AREA_CD: "",
      //     AREA_CD: "",
      //     PIN_CODE: "",
      //     CITY_CD: "",
      //     DISTRICT: "",
      //     STATE: "",
      //     COUNTRY: "",
      //     STATE_CD: "",
      //     COUNTRY_CD: "",
      //     PROOF_OF_ADD: "",
      //     OTHER_POA: "",
      //     localAddDivider: "",
      //     SAME_AS_PER: "",
      //     LOC_ADD_TYPE: "",
      //     LOC_ADD1: "",
      //     LOC_ADD2: "",
      //     LOC_ADD3: "",
      //     LOC_AREA_CD: "",
      //     LOC_AREA_CD2: "",
      //     LOC_PIN_CODE: "",
      //     LOC_CITY_CD: "",
      //     LOC_DISTRICT_CD: "",
      //     LOC_STATE_CD: "",
      //     LOC_COUNTRY: "",
      //     STATE_UT_CODE: "",
      //     LOC_COUNTRY_CD: "",
      //     LOC_PROOF_OF_ADD: "",
      //     contactDivider: "",
      //     // PHONE_o: "",
      //     // PHONE_R: "",
      //     MOBILE_NO: "",
      //     FAX: "",
      //     E_MAIL_ID: "",
      //     FATCA_DEC_RECVD: "N",
      //     FATCA_DT: "03-Sep-2023",
      //     US_GIIN: "",
      //     DATE_OF_COMMENCEMENT: "03-Sep-2023",
      //     PLACE_OF_INCORPORATION: "",
      //     TIN: "12",
      //     COUNTRY_OF_INCORPORATION: "",
      //     TIN_ISSUING_COUNTRY: "18  ",
      //     IsNewRow: true,
      //     CUSTOMER_TYPE: "I",
      //     CATEGORY_CD: "03  ",
      //     CONSTITUTION_TYPE: "01",
      //     COMP_CD: "132 ",
      //     BRANCH_CD: "099 ",
      //     ACCT_TYPE: "01",
      //     REQ_FLAG: "F",
      //     CATEG_CD: "01",
      //     entityType: "I",
      //     GST_NO: "",
      //     APPLICATION_TYPE: "Y",
      //     ENTERED_DATE: "20-July-2023",
      //     STD_1: "",
      //     STD_4: "54890",
      //     STD_2: "",
      //     STD_3: "",
      //     CONTACT1: "",
      //     CONTACT4: "",
      //     CONTACT2: "7858089344",
      //     CONTACT3: "",
      // }

  //     IsNewRow: true,
	// REQ_CD:"",
	// REQ_FLAG:"F",
  //   SAVE_FLAG:"D",
  //   ENTRY_TYPE :"1",
  //   CUSTOMER_ID:"",
	// PERSONAL_DETAIL: {
  //       IsNewRow: true,
	// 	CUSTOMER_TYPE: "I",
  //       CONSTITUTION_TYPE:"I",
	// 	COMP_CD: "132 ",
	// 	BRANCH_CD: "099 ",
	// 	ACCT_TYPE: "01",
	// 	REQ_FLAG: "F",
	// 	PREFIX_CD: "MISS",
	// 	FIRST_NM: "rupa",
	// 	LAST_NM: "ajay",
	// 	SURNAME: "patil",
	// 	ACCT_NM: "rupa ajay patil",
	// 	MAIDEN_PREFIX_CD: "Miss",
	// 	MAIDEN_FIRST_NM: " ",
	// 	MAIDEN_MIDDLE_NM: " ",
	// 	MAIDEN_LAST_NM: " ",
	// 	FATHER_SPOUSE: "01",
	// 	FATHER_PREFIX_CD: "Mr",
	// 	FATHER_FIRST_NM: "Vijay",
	// 	FATHER_MIDDLE_NM: "SANJAY",
	// 	FATHER_LAST_NM: "patil",
	// 	MOTHER_PREFIX_CD: "Mrs.",
	// 	MOTHER_FIRST_NM: "jaya",
	// 	MOTHER_MIDDLE_NM: "Vijay",
	// 	MOTHER_LAST_NM: "patil",
	// 	FORM_60: "Y",
	// 	PAN_NO: "DWIPP9643D",
	// 	UNIQUE_ID: "673598516700",
	// 	ELECTION_CARD_NO: "38494404",
	// 	EXPLICIT_TDS: "N",
	// 	NREGA_JOB_CARD: "",
	// 	OTHER_DOC: "",
	// 	PROOF_OF_ADD: "01",
	// 	OTHER_DOC_NO: "02",
	// 	PASSPORT_NO: "924746587",
	// 	PASSPORT_ISSUE_DT: "03-SEP-2018",
	// 	PASSPORT_EXPIRY_DT: "03-SEP-2023",
	// 	PASSPORT_AUTHORITY_CD: "01",
	// 	DRIVING_LICENSE_NO: "58324892",
	// 	DRIVING_LICENSE_ISSUE_DT: "03-SEP-2018",
	// 	DRIVING_LICENSE_EXPIRY_DT: "03-SEP-2024",
	// 	DRIVING_LICENSE_AUTHORITY_CD: "01",
	// 	FATCA_DEC_RECVD: "N",
	// 	FATCA_DT: "",
	// 	US_GIIN: "",
	// 	TIN: "12",
	// 	TIN_ISSUING_COUNTRY: "01",
	// 	COUNTRY_OF_INCORPORATION: "",
	// 	PLACE_OF_INCORPORATION: "",
	// 	DATE_OF_COMMENCEMENT: "",
	// 	BIRTH_DT: "08-NOV-2023",
	// 	GENDER: "F",
	// 	BLOOD_GRP_CD: "B+",
	// 	MARITAL_STATUS: "02",
	// 	NATIONALITY: "",
	// 	TRADE_CD: "S-02",
	// 	GROUP_CD: "9",
	// 	CASTE_CD: "",
	// 	COMMU_CD: "01",
	// 	LF_NO: "J",
	// 	KYC_REVIEW_DT: "",
	// 	ADDRESS_TYPE: "02",
	// 	ADD1: "Acute Informatics",
	// 	ADD2: "Pune",
	// 	ADD3: " ",
	// 	STATE_CD: "",
	// 	OTHER_POA: "",
	// 	LOC_ADD_TYPE: "",
	// 	LOC_ADD1: "",
	// 	LOC_ADD2: "",
	// 	LOC_ADD3: "",
	// 	LOC_AREA_CD: "",
	// 	LOC_CITY_CD: "",
	// 	LOC_DISTRICT_CD: "",
	// 	LOC_STATE_CD: "",
	// 	LOC_COUNTRY_CD: "",
	// 	LOC_PIN_CODE: "",
	// 	AREA_CD: "001",
	// 	PIN_CODE: "385659",
	// 	SAME_AS_PER: "Y",
	// 	CONTACT: "N",
	// 	LOC_PROOF_OF_ADD: "",
	// 	STD_1: "",
	// 	STD_4: "54890",
	// 	STD_2: "",
	// 	STD_3: "",
	// 	CONTACT1: "",
	// 	CONTACT4: "",
	// 	CONTACT2: "9727999751",
	// 	CONTACT3: "",
	// 	E_MAIL_ID: "rupapatil@gmail.com",
	// 	ENTRY_TYPE: "",
	// 	APPLICATION_TYPE: "Y",
	// 	SUB_CUST_TYPE: "",
	// 	RATE_CD: "",
	// 	GSTIN: "",
	// 	UDYAM_REG_NO: "",
	// 	REFERENCE_TYPE: "",
	// 	REFERENCE_RELATION: "",
	// 	OTHER_REFERENCE: "",
	// 	CCIL_ID: "",
	// 	LEI_NO: "",
	// 	LEI_EXPIRY_DATE: "",
	// 	E_MAIL_ID2: "",
	// 	MEM_ACCT_TYPE: "",
	// 	MEM_ACCT_CD: "",
	// 	MEM_COMP_CD: "",
	// 	MEM_BRANCH_CD: "",
  //       RESIDENCE_STATUS:"01",
  //       CATEG_CD:"09",
  //       COUNTRY_CD:"45  "  
  //   }
    });
  if (status === "0") {
    // let responseData = data;
    // console.log("asdwqe responseData", responseData)
    return data
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}

export const SaveEntry = async ({
  CUSTOMER_TYPE,
  CATEGORY_CD,
  ACCT_TYPE,
  CONSTITUTION_TYPE,
  IsNewRow,
  REQ_CD,
  formData,
}) => {
  // console.log("aaaaaaaaa", formData)
  const PHOTO_MST = {
    IsNewRow: true,
    COMP_CD:"132 ",
    ENTERED_BRANCH_CD:"099",
    REQ_CD: " ",
    SR_CD:"3",
    SIGN_GROUP:"2",
    FROM_LIMIT:"2",
    TO_LIMIT:"2",
    REQ_FLAG:"F",
    CUST_PHOTO: "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",
    CUST_SIGN: "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",
    ACT_FLAG: "F"
  }

  const DOC_MST = {
    IsNewRow: true,
    REQ_CD: " ",
    REQ_FLAG: "F",
    COMP_CD:"132",
    BRANCH_CD: "099 ",
    SR_CD:"3",
    ACCT_TYPE:"abcd",
    ACCT_CD:"12",
    TRAN_CD:"123",
    ENT_COMP_CD:"132 ",
    ENT_BRANCH_CD:"099 "
  }

  const remainingData = { 
    // IsNewRow: IsNewRow,
    // REQ_CD:"",
    // REQ_FLAG:"F",
    // SAVE_FLAG:"D",
    // ENTRY_TYPE :"F",
    // CUSTOMER_ID:"",

    IsNewRow: true,
    REQ_CD: REQ_CD,
    REQ_FLAG: "F",
    SAVE_FLAG: "F",
    ENTRY_TYPE: "1",
    CUSTOMER_ID: "",
  }

  const remainingPD = {
    IsNewRow: IsNewRow,
    CUSTOMER_TYPE: CUSTOMER_TYPE,
    CATEGORY_CD: CATEGORY_CD,
    // CONSTITUTION_TYPE: CONSTITUTION_TYPE,
    CONSTITUTION_TYPE: CONSTITUTION_TYPE,
    COMP_CD: "132 ",
    BRANCH_CD: "099 ",
    ACCT_TYPE: ACCT_TYPE,
    REQ_FLAG: "F",
    CATEG_CD: CONSTITUTION_TYPE,
    entityType: CUSTOMER_TYPE,
    COUNTRY_CD: "123 "
    // GST_NO: "",
  }

  const ExtraData = {
    APPLICATION_TYPE: "Y",
    // ENTERED_DATE: format(new Date(), "dd-MMM-yyyy"),
    ENTERED_DATE: "20-July-2023",
    STD_1: "",
    STD_4: "54890",
    STD_2: "",
    STD_3: "",
    CONTACT1: "",
    CONTACT4: "",
    CONTACT2: "7858089344",
    CONTACT3: "",

    // SCREEN: "",
    // ISD_CD:"456783",
    // ENTERED_BY:"hff",
    // PAN_NO: "DWIPP9643D",
    // UNIQUE_ID: "673598516700",
  }

  formData["PERSONAL_DETAIL"] = {
    ...formData["PERSONAL_DETAIL"],
    ...remainingPD, ...ExtraData
  }
  
  const { data, status, message, messageDetails } =
  await AuthSDK.internalFetcher("SAVECUSTOMERDATA", {
    ...remainingData,
    // PERSONAL_DETAIL: {...PERSONAL_DETAIL, ...remainingPD, ...ExtraData}
    // ...formData,
    OTHER_ADDRESS: {
      IsNewRow: true,
      REQ_CD: " ",
      REQ_FLAG: "F",
      COMP_CD:"132",
      BRANCH_CD: "099 ",
      SR_CD:"3",
      ENTERED_BY:"ajayj",
      ENTERED_DATE:"10",
      LAST_ENTERED_BY:"12-NOV-2022",
      LAST_MODIFIED_DATE:"08-NOV-2023",
      MACHINE_NM:"Acute",
      LAST_MACHINE_NM:"Acute",
      CONFIRMED:"N"
    },
    RELATED_PERSON_DTL: {
      IsNewRow: true,
      REQ_CD: " ",
      COMP_CD:"132",
      BRANCH_CD: "099 ",
      SR_CD:"3",
      REQ_FLAG:"F",
      ENTERED_BY:"",
      ENTERED_DATE:"ajayj",
      MACHINE_NM:"Acute",
      LAST_ENTERED_BY:"15-NOV-2022",
      LAST_MODIFIED_DATE:"12-NOV-2023",
      LAST_MACHINE_NM:"Acute",
      CONFIRMED:"N",
      ENT_COMP_CD:"132",
      ENT_BRANCH_CD:"099",
      ACTIVE:"Y"
    },
    ATTESTATION_DTL: {
      IsNewRow: true,
      REQ_CD: " ",
      REQ_FLAG:"F",
      COMP_CD:"132",
      BRANCH_CD: "099 ",
      SR_CD:"3",
      ENTERED_BY:"ajayj",
      ENTERED_DATE:"10",
      LAST_ENTERED_BY:"12-NOV-2022",
      LAST_MODIFIED_DATE:"08-NOV-2023",
      MACHINE_NM:"Acute",
      LAST_MACHINE_NM:"Acute",
      CONFIRMED:"N",
      ENT_COMP_CD:"132",
      ENT_BRANCH_CD:"099"
    },
    OTHER_DTL: {
      IsNewRow: true,
      REQ_CD: " ",
      COMP_CD:"132",
      BRANCH_CD: "099 ",
      SR_CD:"3",
      REQ_FLAG:"F",
      NO_OF_CHILDREN: "3",
      NO_OF_ADULTS: "2",
      POLITICALLY_CONNECTED: "Y",
      EARNING_MEMEBER:"1",
      BLINDNESS:"N",
      ID_MARK: "d ",
      EMPLOYMENT_STATUS: "Y",
      REFERRED_BY_STAFF: "Y",
      EDUCATION_CD: " 01",
      EMP_COMPANY_TYPE: "01 ",
      COMPANY_NM: " Acute",
      JOINING_DT: "20-July-2023",
      RETIREMENT_DT: "20-July-2026",
      WORK_EXP: "5 ",
      SPECIALIZATION_REMARKS: "r ",
      FUNDED_AMT: "20000",
      NON_FUNDED_AMT: "2000",
      THRESHOLD_AMT: " 10000",
      NO_OF_2_WHEELERS: "2 ",
      NO_OF_4_WHEELERS: "2 ",
      CIBIL_SCORE: "6 "
    },
    NRI_DTL: {
      IsNewRow: true,
      REQ_CD: " ",
      BRANCH_CD: "099 ",
      SR_CD:"3",
      REQ_FLAG:"F",
      COMP_CD:"132 ",
      VISA_DETAIL: "49026446 ",
      VISA_ISSUE_DT: "20-June-2020 ",
      VISA_ISSUE_BY: "20-July-2021 ",
      VISA_EXPIRY_DT: "20-July-2023",
      DOMESTIC_RISK: "A",
      COUNTRY_OF_RISK: " ",
      CROSS_BORDER_RISK: " ",
      VISUALLY_IMPAIRED: "N",
      CUSTOMER_EVALUATION_FLAG: " ",
      relationshIP_manager: " a",
      ENT_COMP_CD:"132 ",
      ENT_BRANCH_CD:"099 "
    }, 
    PHOTO_MST:{
      IsNewRow: true,
      COMP_CD:"132 ",
      ENTERED_BRANCH_CD:"099",
      REQ_CD:"",
      SR_CD:"3",
      SIGN_GROUP:"2",
      FROM_LIMIT:"2",
      TO_LIMIT:"2",
      REQ_FLAG:"F",
      CUST_PHOTO:"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",
      CUST_SIGN:"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",
      ACT_FLAG:"F"
    }, 
    DOC_MST: {
      IsNewRow: true,
      REQ_CD: "",
      REQ_FLAG: "F",
      COMP_CD:"132",
      BRANCH_CD: "099 ",
      SR_CD:"3",
      ACCT_TYPE:"abcd",
      ACCT_CD:"12",
      TRAN_CD:"123",
      ENT_COMP_CD:"132 ",
      ENT_BRANCH_CD:"099 "
     },
  });
}

export const DeactivateCustomer = async ({CUSTOMER_ID, COMP_CD}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("CUSTOMERDEPENDENCYCOUNT", {
      COMP_CD: COMP_CD, 
      CUSTOMER_ID: CUSTOMER_ID,
    });
  if (status === "0") {
    let responseData = data;
    // if (Array.isArray(responseData)) {
    //   responseData = responseData.map(({ ED_TYPE_CD, DISPLAY_NM, ...other }) => {
    //       return {
    //         ...other,
    //         ED_TYPE_CD: ED_TYPE_CD, 
    //         DISPLAY_NM: DISPLAY_NM,
    //         value: ED_TYPE_CD,
    //         label: DISPLAY_NM,
    //       };
    //     }
    //   );
    // }
    return responseData
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}

export const getOptionsOnPinParentArea = async (dependentValue, formState, _, authState) => {
  // console.log("getOptionsOnPinParentArea dp.", dependentValue?.PIN_CODE, dependentValue?.PAR_AREA_CD)
  let PIN_CODE = "", PARENT_AREA = ""
  if(dependentValue?.PIN_CODE?.value && dependentValue?.PIN_CODE?.value?.length>5) {
    // console.log("getOptionsOnPinParentArea dp pincode", dependentValue?.PIN_CODE?.value, dependentValue?.PAR_AREA_CD?.value)
    PIN_CODE = dependentValue?.PIN_CODE?.value
  } else if(dependentValue?.PAR_AREA_CD?.value) {
    // console.log("getOptionsOnPinParentArea dp parea", dependentValue?.PIN_CODE?.value, dependentValue?.PAR_AREA_CD?.value)
    PARENT_AREA = dependentValue?.PAR_AREA_CD?.value
  }
  if(dependentValue?.PIN_CODE?.value && dependentValue?.PIN_CODE?.value?.length<5) {

  } else if(PIN_CODE || PARENT_AREA) {
    // console.log("getOptionsOnPinParentArea dp f", PIN_CODE, PARENT_AREA)
    const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETAREALIST", {
      COMP_CD: authState?.companyID ?? "",
      BRANCH_CD: authState?.user?.branchCode ?? "",
      PIN_CODE: PIN_CODE,
      FLAG: PIN_CODE ? "P" : "A", // P - pincode, A - parent area
      PARENT_AREA: PARENT_AREA,
      // PIN_CODE: currentField?.value ?? "",
      // FLAG: "", // P - pincode, A - parent area
      // PARENT_AREA: "",
    });

    if(status == 0) {
      // console.log("getOptionsOnPinParentArea data", data)
      let responseData = data;
      if (Array.isArray(responseData)) {
        responseData = responseData.map(({ AREA_CD, AREA_NM, ...other }) => {
            return {
              ...other,
              AREA_CD: AREA_CD,
              AREA_NM: AREA_NM,
              label: AREA_NM,
              value: AREA_CD,
            };
          }
        );
      }
      return responseData  
    }
  }
}

export const getOptionsOnLocalPinParentArea = async (dependentValue, formState, _, authState) => {
  // console.log("getOptionsOnPinParentArea dp.", dependentValue?.PIN_CODE, dependentValue?.LOC_AREA_CD)
  let PIN_CODE = "", PARENT_AREA = ""
  if(dependentValue?.LOC_PIN_CODE?.value && dependentValue?.LOC_PIN_CODE?.value?.length>5) {
    // console.log("getOptionsOnPinParentArea dp pincode", dependentValue?.LOC_PIN_CODE?.value, dependentValue?.LOC_AREA_CD?.value)
    PIN_CODE = dependentValue?.LOC_PIN_CODE?.value
  } else if(dependentValue?.LOC_AREA_CD?.value) {
    // console.log("getOptionsOnPinParentArea dp parea", dependentValue?.LOC_PIN_CODE?.value, dependentValue?.LOC_AREA_CD?.value)
    PARENT_AREA = dependentValue?.LOC_AREA_CD?.value
  }
  if(dependentValue?.LOC_PIN_CODE?.value && dependentValue?.LOC_PIN_CODE?.value?.length<5) {

  } else if(PIN_CODE || PARENT_AREA) {
    // console.log("getOptionsOnPinParentArea dp f", PIN_CODE, PARENT_AREA)
    const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETAREALIST", {
      COMP_CD: authState?.companyID ?? "",
      BRANCH_CD: authState?.user?.branchCode ?? "",
      PIN_CODE: PIN_CODE,
      FLAG: PIN_CODE ? "P" : "A", // P - pincode, A - parent area
      PARENT_AREA: PARENT_AREA,
      // PIN_CODE: currentField?.value ?? "",
      // FLAG: "", // P - pincode, A - parent area
      // PARENT_AREA: "",
    });

    if(status == 0) {
      // console.log("getOptionsOnPinParentArea data", data)
      let responseData = data;
      if (Array.isArray(responseData)) {
        responseData = responseData.map(({ AREA_CD, AREA_NM, ...other }) => {
            return {
              ...other,
              AREA_CD: AREA_CD,
              AREA_NM: AREA_NM,
              label: AREA_NM,
              value: AREA_CD,
            };
          }
        );
      }
      return responseData  
    }
  }
}

export const getInsuranceGridData = async ({COMP_CD, CUSTOMER_ID}) => {
  // const { data, status, message, messageDetails } =
  // await AuthSDK.internalFetcher("CUSTOMERDEPENDENCYCOUNT", {
  //   COMP_CD: COMP_CD, 
  //   CUSTOMER_ID: CUSTOMER_ID,
  // });
  const {data, status, message, messageDetails} = 
  await AuthSDK.internalFetcher("GETINSURANCE", {
    CUSTOMER_ID: CUSTOMER_ID,
    COMP_CD: COMP_CD,
  })

  if(status == 0) {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}

export const getBankDTLGridData = async ({COMP_CD, CUSTOMER_ID}) => {
  const {data, status, message, messageDetails} = 
  await AuthSDK.internalFetcher("OTHERBANKDETAIL", {
    CUSTOMER_ID: CUSTOMER_ID,
    COMP_CD: COMP_CD,
  })
  if(status == 0) {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}

export const getCreditCardDTLGridData = async ({COMP_CD, CUSTOMER_ID}) => {
  const {data, status, message, messageDetails} = 
  await AuthSDK.internalFetcher("CUSTOMERCREDITCARDDTL", {
    CUSTOMER_ID: CUSTOMER_ID,
    COMP_CD: COMP_CD,
  })
  if(status == 0) {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}

export const getOffencesDTLGridData = async ({COMP_CD, CUSTOMER_ID}) => {
  const {data, status, message, messageDetails} = 
  await AuthSDK.internalFetcher("OFFENCESDTL", {
    CUSTOMER_ID: CUSTOMER_ID,
    COMP_CD: COMP_CD,
  })
  if(status == 0) {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}

export const getControllingPersonDTLGridData = async ({COMP_CD, CUSTOMER_ID}) => {
  const {data, status, message, messageDetails} = 
  await AuthSDK.internalFetcher("CONTROLLINGPERSONDTL", {
    CUSTOMER_ID: CUSTOMER_ID,
    COMP_CD: COMP_CD,
  })
  if(status == 0) {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ ACTIVE, ...other }) => {
          return {
            ...other,
            ACTIVE: ACTIVE === "Y" ? true : false
          };
        }
      );
    }
    return responseData  
  }  
}

export const getAssetDTLGridData = async ({COMP_CD, CUSTOMER_ID}) => {
  const {data, status, message, messageDetails} = 
  await AuthSDK.internalFetcher("GETASSETDTL", {
    CUSTOMER_ID: CUSTOMER_ID,
    COMP_CD: COMP_CD,
  })
  if(status == 0) {
    let responseData = data;
    // if (Array.isArray(responseData)) {
    //   responseData = responseData.map(({ ACTIVE, ...other }) => {
    //       return {
    //         ...other,
    //         ACTIVE: ACTIVE === "Y" ? true : false
    //       };
    //     }
    //   );
    // }
    return responseData  
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}

export const getFinancialDTLGridData = async ({COMP_CD, CUSTOMER_ID}) => {
  const {data, status, message, messageDetails} = 
  await AuthSDK.internalFetcher("GETFINANCIALDETAIL", {
    CUSTOMER_ID: CUSTOMER_ID,
    COMP_CD: COMP_CD,
  })
  if(status == 0) {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}
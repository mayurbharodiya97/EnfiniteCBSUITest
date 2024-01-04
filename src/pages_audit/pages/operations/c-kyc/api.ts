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

export const getTabsDetail = async ({ COMP_CD , ENTITY_TYPE, CATEGORY_CD, CONS_TYPE, isFreshEntry, CONFIRMFLAG }) => {
  if(!CATEGORY_CD || !CONS_TYPE) {
    return []
  }
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCIFTABDTL", {
      COMP_CD: COMP_CD,
      ENTITY_TYPE: ENTITY_TYPE,
      CATEGORY_CD: CATEGORY_CD,
      CONS_TYPE: CONS_TYPE,
      ENTRY_MODE: isFreshEntry 
                  ? "NEW"
                  : (CONFIRMFLAG && !CONFIRMFLAG.includes("Y"))
                    ? "NEW"
                    : "EDIT"
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getCustomerDetailsonEdit = async (reqData) => {
  // COMP_CD, CUSTOMER_ID?, REQUEST_CD?}
  const {COMP_CD, CUSTOMER_ID, REQUEST_CD} = reqData
  let payload = {}
  // console.log("req. dataaa COMP_CD", COMP_CD, CUSTOMER_ID, REQUEST_CD)
  if(CUSTOMER_ID) {
    payload = {
      COMP_CD: COMP_CD,
      CUSTOMER_ID: CUSTOMER_ID
    }
  } else {
    payload = {
      COMP_CD: COMP_CD,
      REQUEST_CD: REQUEST_CD
    }
  }
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCUSTOMERDETAILS", payload);
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

export const getPMISCData = async (CATEGORY_CD, dependentValue?, CUST_TYPE?) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETPMISCDATA", {
      CATEGORY_CD: CATEGORY_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      // console.log("qweqwerr", responseData) // checked for pass, dr - expiry date

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
      if(CATEGORY_CD == "CKYC_RELAT_PERS" && CUST_TYPE) {
        let resOp:any = []
        responseData.map((element, i) => {
          if(element?.REMARKS === "I") {
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

// for retrieveing data, in retrieve, personal/entity details, in grid
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

// for getting pending entries, in grid
export const getPendingData = async (reqObj:{COMP_CD: string, ENTERED_DATE?:string, REQ_FLAG: string}) => {
  const {COMP_CD, REQ_FLAG, ENTERED_DATE} = reqObj
  let payload = {}
  if(ENTERED_DATE) {
    payload = {
      COMP_CD: COMP_CD, 
      // BRANCH_CD: BRANCH_CD, 
      ENTERED_DATE: ENTERED_DATE,
      REQ_FLAG: REQ_FLAG
    }
  } else {
    payload = {
      COMP_CD: COMP_CD, 
      // BRANCH_CD: BRANCH_CD, 
      REQ_FLAG: REQ_FLAG
    }
  }
  const { data, status, message, messageDetails } =
  await AuthSDK.internalFetcher("GETPENDINGCUSTLIST", payload);
  if (status === "0") {
    return data
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}
// for getting pending entries, in grid
export const ConfirmPendingCustomers = async ({REQUEST_CD, REMARKS, CONFIRMED}) => {
  const { data, status, message, messageDetails } =
  await AuthSDK.internalFetcher("CONFIRMCUSTOMERDATA", {
    REQUEST_CD: REQUEST_CD,
    REMARKS: REMARKS,
    CONFIRMED: CONFIRMED,
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

// retrieving document medatory docs in grid
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
      responseData = responseData.map(({ DOC_DESCRIPTION, BANK_DOC_TRAN_CD, ...other }) => {
          return {
            ...other,
            DOC_DESCRIPTION:DOC_DESCRIPTION,
            BANK_DOC_TRAN_CD: BANK_DOC_TRAN_CD,
            label: DOC_DESCRIPTION,
            value: BANK_DOC_TRAN_CD,
          };
        }
      );
    }
    return responseData
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}

export const getCustDocumentOpDtl = async ({COMP_CD, BRANCH_CD, formState}) => {
  const {gridData, rowsData} = formState;
  // console.log("qekuwhdiuwehdw", formState)
  let selectedDoc:any[] = []
  if(rowsData && rowsData.length>0) {
    selectedDoc = rowsData.map(el => {
      return el.data.BANK_DOC_TRAN_CD ?? "";
    })
  } else if(gridData && gridData.length>0) {
    selectedDoc = gridData.map(el => {
      return el.BANK_DOC_TRAN_CD ?? "";
    })
  }
  // console.log(gridData, "auedhniuwehdwe", formMode)
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCUSTDOCUMENT", {
      COMP_CD: COMP_CD, 
      BRANCH_CD: BRANCH_CD, 
    });
  if (status === "0") {
    let responseData = data;
    if(rowsData && rowsData.length>0) {
      responseData = responseData.filter(el => selectedDoc.includes(el.SR_CD))
    } else if(gridData && gridData.length>0) {
      responseData = responseData.filter(el => !selectedDoc.includes(el.SR_CD))
    }
    // console.log("auedhniuwehdwe  qwed", data)
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ DESCRIPTION, SR_CD, ...other }) => {
          // if(selectedDoc.includes(SR_CD)) {

          // } else {
            return {
              ...other,
              DESCRIPTION:DESCRIPTION,
              SR_CD: SR_CD,
              label: DESCRIPTION,
              value: SR_CD,
            };
          // }
        // }
      });
    }
    return responseData
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}

export const getPhotoSignImage = async ({COMP_CD, reqCD, customerID}) => {
  const reqObj = reqCD ? {
    COMP_CD: COMP_CD,
    REQUEST_CD: reqCD
  } : {
    COMP_CD: COMP_CD,
    CUSTOMER_ID: customerID
  }
  if(reqCD || customerID) {
    const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCUSTOMERHISTORY", reqObj);
    // GETCUSTIMGHISMST
    if(status === "0") {
      let responseData = data;
      return responseData;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  }
}

export const getPhotoSignHistory = async ({COMP_CD, CUSTOMER_ID}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCUSTPHOTODTL", {
      COMP_CD: COMP_CD, 
      CUSTOMER_ID: CUSTOMER_ID,
    });
  if (status === "0") {
    return data
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}

export const updatePhotoSignData = async ({COMP_CD, CUSTOMER_ID}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETUPDCUSTPHOTODATA", {
      COMP_CD: COMP_CD, 
      CUSTOMER_ID: CUSTOMER_ID,
    });
  if (status === "0") {
    return data
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}

export const getControllCustInfo = async ({COMP_CD, BRANCH_CD, CUSTOMER_ID, FROM}) => {
  if(CUSTOMER_ID) {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETVIEWDTL", {
        COMP_CD: COMP_CD,
        BRANCH_CD: BRANCH_CD,
        CUSTOMER_ID: CUSTOMER_ID,
        // CATEG_CD: CATEG_CD,
        // formIndex: formIndex
      });
    if (status === "0") {
      // console.log("asdqwsxavqad", data)
      if(FROM == "metadata") {
        if(data[0].ACCT_NM) {
          return {
            REF_ACCT_NM: {value: data[0].ACCT_NM}
          }
        } else {
          return {
            REF_ACCT_NM: {value: ""}
          }
        }
      } else {
        return data
      }
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  } else {
    if(FROM == "metadata") {
      return {
        REF_ACCT_NM: {value: ""}
      }
    }
  }
}

export const TrimSpaceValidation = (columnValue, allField, flag) => {
  if(columnValue.value) {
      let regex = /^[a-zA-Z]+$/;
      if(columnValue.value !== columnValue.value.trimStart() && columnValue.value !== columnValue.value.trimEnd()) {
          return "Space before name is not allowed.";  
      } else if(columnValue.value !== columnValue.value.trimStart()) {
        return "Space before name is not allowed.";
      } else if (columnValue.value !== columnValue.value.trimEnd()) {
        return "Space after name is not allowed.";
      } else if(!regex.test(columnValue.value)) {
          return "Please Enter Character Value.";
      }                    
  }
  return "";
}

export const SaveAsDraft = async ({
  CUSTOMER_TYPE,
  CATEGORY_CD,
  ACCT_TYPE,
  KYC_NUMBER,
  CONSTITUTION_TYPE,
  IsNewRow,
  PERSONAL_DETAIL,
  COMP_CD
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
    COMP_CD: COMP_CD
  }
  const remainingPD = {
      IsNewRow: IsNewRow,
      CUSTOMER_TYPE: CUSTOMER_TYPE,
      // CATEGORY_CD: CATEGORY_CD,
      // CONSTITUTION_TYPE: CONSTITUTION_TYPE,
      CONSTITUTION_TYPE: CONSTITUTION_TYPE,
      COMP_CD: "132 ",
      BRANCH_CD: "099 ",
      ACCT_TYPE: ACCT_TYPE,
      REQ_FLAG: "F",
      CATEG_CD: CATEGORY_CD,
      // entityType: CUSTOMER_TYPE,
      // COUNTRY_CD: "123 ",
      // KYC_NUMBER: KYC_NUMBER ?? "",
      // GST_NO: "",
  }

  // not found in individual type cust. form
  const ExtraData = {
    APPLICATION_TYPE: "Y",
    // ENTERED_DATE: format(new Date(), "dd-MMM-yyyy"),
    // ENTERED_DATE: "20-July-2023",
    // STD_1: "",
    // STD_4: "54890",
    // STD_2: "",
    // STD_3: "",
    CONTACT1: "",
    CONTACT4: "",
    CONTACT2: "7858089344",
    CONTACT3: "",
    SAME_AS_PER: PERSONAL_DETAIL.SAME_AS_PER ? "Y" : "N",
    // formData["PERSONAL_DETAIL"].SAME_AS_PER = formData["PERSONAL_DETAIL"].SAME_AS_PER ? "Y" : "N";
    ENT_BRANCH_CD :"099 ", //need-in-legal
    ENT_COMP_CD: "132 ", //need-in-legal

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

export const SaveEntry = async (reqdata) => {
  const {
    CUSTOMER_ID,
    CUSTOMER_TYPE,
    CATEGORY_CD,
    ACCT_TYPE,
    KYC_NUMBER,
    CONSTITUTION_TYPE,
    IsNewRow,
    REQ_CD,
    formData,
  } = reqdata

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
    CUST_PHOTO: "BASE64",
    CUST_SIGN: "BASE64",
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
    // REQ_CD: "681",  // for-testing
    REQ_CD: REQ_CD,
    REQ_FLAG: "F",
    SAVE_FLAG: "F",
    ENTRY_TYPE: "1",
    CUSTOMER_ID: CUSTOMER_ID,
  }

  const remainingPD = {
    IsNewRow: IsNewRow,
    CUSTOMER_TYPE: CUSTOMER_TYPE,
    // CATEGORY_CD: CATEGORY_CD,
    // CONSTITUTION_TYPE: CONSTITUTION_TYPE,
    CONSTITUTION_TYPE: CONSTITUTION_TYPE,
    COMP_CD: "132 ",
    BRANCH_CD: "099 ",
    ACCT_TYPE: ACCT_TYPE,
    REQ_FLAG: "F",
    CATEG_CD: CATEGORY_CD,
    // entityType: CUSTOMER_TYPE,
    // COUNTRY_CD: "123 ",
    KYC_NUMBER: KYC_NUMBER ?? "",
    // GST_NO: "",
  }

  const ExtraData = {
    APPLICATION_TYPE: "Y",
    // ENTERED_DATE: format(new Date(), "dd-MMM-yyyy"),
    ENTERED_DATE: "20-July-2023",
    // STD_1: "",
    // STD_4: "54890",
    // STD_2: "",
    // STD_3: "",
    // CONTACT1: "",
    // CONTACT4: "",
    // CONTACT2: "7858089344",
    // CONTACT3: "",
    // ENT_BRANCH_CD :"099 ", //need-in-legal
    // ENT_COMP_CD: "132 ", //need-in-legal
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
  // SAME_AS_PER
  // formData["PERSONAL_DETAIL"].SAME_AS_PER = formData["PERSONAL_DETAIL"].SAME_AS_PER ? "Y" : "N";


  let otherDTL = formData["OTHER_DTL"]
  if(Boolean(otherDTL["POLITICALLY_CONNECTED"])) {
      otherDTL["POLITICALLY_CONNECTED"] = "Y"
  } else {
      otherDTL["POLITICALLY_CONNECTED"] = "N"
  }

  if(Boolean(otherDTL["BLINDNESS"])) {
      otherDTL["BLINDNESS"] = "Y"
  } else {
      otherDTL["BLINDNESS"] = "N"
  }

  if(Boolean(otherDTL["REFERRED_BY_STAFF"])) {
      otherDTL["REFERRED_BY_STAFF"] = "Y"
  } else {
      otherDTL["REFERRED_BY_STAFF"] = "N"
  }


  const { data, status, message, messageDetails } =
  await AuthSDK.internalFetcher("SAVECUSTOMERDATA", {
    // ...remainingData,
    // // PERSONAL_DETAIL: {...PERSONAL_DETAIL, ...remainingPD, ...ExtraData}
    // // ...formData,
    // // PERSONAL_DETAIL: formData["PERSONAL_DETAIL"], 
    // OTHER_ADDRESS: formData["OTHER_ADDRESS"],
    // // OTHER_ADDRESS: {
    // //   IsNewRow: true,
    // //   REQ_CD: " ",
    // //   REQ_FLAG: "F",
    // //   COMP_CD:"132",
    // //   BRANCH_CD: "099 ",
    // //   SR_CD:"3",
    // //   ENTERED_BY:"ajayj",
    // //   ENTERED_DATE:"10",
    // //   LAST_ENTERED_BY:"12-NOV-2022",
    // //   LAST_MODIFIED_DATE:"08-NOV-2023",
    // //   MACHINE_NM:"Acute",
    // //   LAST_MACHINE_NM:"Acute",
    // //   CONFIRMED:"N"
    // // },
    // // RELATED_PERSON_DTL: {
    // //   IsNewRow: true,
    // //   REQ_CD: " ",
    // //   COMP_CD:"132",
    // //   BRANCH_CD: "099 ",
    // //   SR_CD:"3",
    // //   REQ_FLAG:"F",
    // //   ENTERED_BY:"",
    // //   ENTERED_DATE:"ajayj",
    // //   MACHINE_NM:"Acute",
    // //   LAST_ENTERED_BY:"15-NOV-2022",
    // //   LAST_MODIFIED_DATE:"12-NOV-2023",
    // //   LAST_MACHINE_NM:"Acute",
    // //   CONFIRMED:"N",
    // //   ENT_COMP_CD:"132",
    // //   ENT_BRANCH_CD:"099",
    // //   ACTIVE:"Y"
    // // },
    // RELATED_PERSON_DTL: formData["RELATED_PERSON_DTL"],
    // // ATTESTATION_DTL: {
    // //   IsNewRow: true,
    // //   REQ_CD: " ",
    // //   REQ_FLAG:"F",
    // //   COMP_CD:"132",
    // //   BRANCH_CD: "099 ",
    // //   SR_CD:"3",
    // //   ENTERED_BY:"ajayj",
    // //   ENTERED_DATE:"10",
    // //   LAST_ENTERED_BY:"12-NOV-2022",
    // //   LAST_MODIFIED_DATE:"08-NOV-2023",
    // //   MACHINE_NM:"Acute",
    // //   LAST_MACHINE_NM:"Acute",
    // //   CONFIRMED:"N",
    // //   ENT_COMP_CD:"132",
    // //   ENT_BRANCH_CD:"099"
    // // },
    // ATTESTATION_DTL: formData["ATTESTATION_DTL"],
    // // OTHER_DTL: {
    // //   IsNewRow: true,
    // //   REQ_CD: " ",
    // //   COMP_CD:"132",
    // //   BRANCH_CD: "099 ",
    // //   SR_CD:"3",
    // //   REQ_FLAG:"F",
    // //   NO_OF_CHILDREN: "3",
    // //   NO_OF_ADULTS: "2",
    // //   POLITICALLY_CONNECTED: "Y",
    // //   EARNING_MEMEBER:"1",
    // //   BLINDNESS:"N",
    // //   ID_MARK: "d ",
    // //   EMPLOYMENT_STATUS: "Y",
    // //   REFERRED_BY_STAFF: "Y",
    // //   EDUCATION_CD: " 01",
    // //   EMP_COMPANY_TYPE: "01 ",
    // //   COMPANY_NM: " Acute",
    // //   JOINING_DT: "20-July-2023",
    // //   RETIREMENT_DT: "20-July-2026",
    // //   WORK_EXP: "5 ",
    // //   SPECIALIZATION_REMARKS: "r ",
    // //   FUNDED_AMT: "20000",
    // //   NON_FUNDED_AMT: "2000",
    // //   THRESHOLD_AMT: " 10000",
    // //   NO_OF_2_WHEELERS: "2 ",
    // //   NO_OF_4_WHEELERS: "2 ",
    // //   CIBIL_SCORE: "6 "
    // // },
    // OTHER_DTL: formData["OTHER_DTL"],
    // // NRI_DTL: {
    // //   IsNewRow: true,
    // //   REQ_CD: " ",
    // //   BRANCH_CD: "099 ",
    // //   SR_CD:"3",
    // //   REQ_FLAG:"F",
    // //   COMP_CD:"132 ",
    // //   VISA_DETAIL: "49026446 ",
    // //   VISA_ISSUE_DT: "20-June-2020 ",
    // //   VISA_ISSUE_BY: "20-July-2021 ",
    // //   VISA_EXPIRY_DT: "20-July-2023",
    // //   DOMESTIC_RISK: "A",
    // //   COUNTRY_OF_RISK: " ",
    // //   CROSS_BORDER_RISK: " ",
    // //   VISUALLY_IMPAIRED: "N",
    // //   CUSTOMER_EVALUATION_FLAG: " ",
    // //   relationshIP_manager: " a",
    // //   ENT_COMP_CD:"132 ",
    // //   ENT_BRANCH_CD:"099 "
    // // },
    // NRI_DTL: formData["NRI_DTL"],
    // PHOTO_MST: formData["PHOTO_MST"],
    // DOC_MST: {
    //   IsNewRow: true,
    //   MASTER_DATA: [
    //     {
    //       ACCT_TYPE: "0",
    //       ACCT_CD: "0",
    //       SR_CD: "1",
    //       TEMPLATE_CD: "4",
    //       SUBMIT: "N",
    //       VALID_UPTO: " ",
    //       DOC_AMOUNT: "",
    //       DOC_NO: "12345",
    //       DOC_TYPE: "KYC",
    //       DOC_WEIGHTAGE: "",
    //       ACTIVE: "Y",
    //       DETAILS_DATA: {
    //         isNewRow: [
    //           {
    //             SR_CD: "1",
    //             ACCT_TYPE: "0",
    //             ACCT_CD: "0",
    //             TEMPLATE_CD: "4",
    //             SUBMIT: "N",
    //             VALID_UPTO: " ",
    //             DOC_AMOUNT: "",
    //             DOC_NO: "12345",
    //             DOC_TYPE: "KYC",
    //             DOC_WEIGHTAGE: "",
    //             ACTIVE: "Y",
    //             DOC_IMAGE: "BASE64"
    //           }
    //         ]
    //       }
    //     },
    //     {
    //       ACCT_TYPE: "0",
    //       ACCT_CD: "0",
    //       SR_CD: "2",
    //       TEMPLATE_CD: "12",
    //       SUBMIT: "N",
    //       VALID_UPTO: "05-10-2023",
    //       DOC_AMOUNT: "",
    //       DOC_NO: "22222",
    //       DOC_TYPE: "KYC",
    //       DOC_WEIGHTAGE: "",
    //       ACTIVE: "Y",
    //       DETAILS_DATA: {
    //         isNewRow: [
    //           {
    //             SR_CD: "2",
    //             ACCT_TYPE: "0",
    //             ACCT_CD: "0",
    //             TEMPLATE_CD: "12",
    //             SUBMIT: "N",
    //             VALID_UPTO: "05-10-2023",
    //             DOC_AMOUNT: "",
    //             DOC_NO: "22222",
    //             DOC_TYPE: "KYC",
    //             DOC_WEIGHTAGE: "",
    //             ACTIVE: "Y",
    //             DOC_IMAGE: "BASE64"
    //           }
    //         ]
    //       }
    //     }
    //   ]
    // },
    // // DOC_MST: {
    // //   IsNewRow: true,
    // //   REQ_CD: "",
    // //   REQ_FLAG: "F",
    // //   COMP_CD:"132",
    // //   BRANCH_CD: "099 ",
    // //   SR_CD:"3",
    // //   ACCT_TYPE:"abcd",
    // //   ACCT_CD:"12",
    // //   TRAN_CD:"123",
    // //   ENT_COMP_CD:"132 ",
    // //   ENT_BRANCH_CD:"099 "
    // //  },

    // // FORM_DTL: {
    // //   IsNewRow: true,
    // //   COMP_CD: "132 ",
    // //   ENTERED_COMP_CD: "132 ",
    // //   ENTERED_BRANCH_CD: "099",
    // //   TRAN_CD: "1319",
    // //   ENTERED_FROM: "P",
    // //   FORM_TYPE: "CASH_TDS_EXEMPT",
    // //   FORM_NM: "RETURN_FILED",
    // //   FORM_EXPIRY_DATE: "10-OCT-2023",
    // //   ENTERED_BY: "vsys",
    // //   TDS_RATE: "50",
    // //   TDS_CERTI_DETAILS: "test",
    // //   TDS_LIMIT: "50000",
    // //   ACT_FLAG: "F"
    // // },






















    // {
      // "DISPLAY_LANGUAGE": "en",
      // "LOGINUSERDETAILS": {
      //     "USERNAME": "adi",
      //     "USERROLE": "4",
      //     "BROWSER_FINGERPRINT": "",
      //     "MACHINE_NAME": "Auto",
      //     "BRANCH_CD": "099 "
      // },
      IsNewRow: true,
      // REQ_CD:"734",
      REQ_CD:REQ_CD,
      REQ_FLAG:"F",
      SAVE_FLAG:"F",
      ENTRY_TYPE :"1",
      CUSTOMER_ID:"",
    //  OTHER_ADDRESS: [
    //    {
    //         IsNewRow:true,
    //        SR_CD:"1",
    //   COMP_CD:"132 ",
    //   BRANCH_CD:"099",
    //       ADDRESS_TYPE:"02",
    //   ENT_COMP_CD:"132 ",
    //       ENT_BRANCH_CD:"099 " },
    //   {
    //        IsNewRow:true,
    //        SR_CD:"3",
    //   COMP_CD:"132 ",
    //   BRANCH_CD:"099 ",
    //       ADDRESS_TYPE:"02",
    //   ENT_COMP_CD:"132 ",
    //       ENT_BRANCH_CD:"099 "}
    //   ],
          OTHER_ADDRESS: formData["OTHER_ADDRESS"], //test-done
  
  //         RELATED_PERSON_DTL: {
  //          IsNewRow: true,
  //         COMP_CD:"132 ",
  //         BRANCH_CD: "099 ",
  //         SR_CD:"3",
  //         REQ_FLAG:"F",
  //         CONFIRMED:"N",
  //         ENT_COMP_CD:"132 ",
  //         ENT_BRANCH_CD:"099 ",
  //         ACTIVE:"Y"
  // },
  RELATED_PERSON_DTL: formData["RELATED_PERSON_DTL"], // test-done
  // ATTESTATION_DTL: {
  //          IsNewRow: true,
  //         REQ_FLAG:"F",
  //         COMP_CD:"132",
  //         BRANCH_CD: "099 ",
  //         SR_CD:"3",
  //         CONFIRMED:"N",
  //          ENT_COMP_CD:"132",
  //         ENT_BRANCH_CD:"099"
  // },
  ATTESTATION_DTL: formData["ATTESTATION_DTL"], //test-done
  // OTHER_DTL:{
  
  //          IsNewRow: true,
  //         COMP_CD:"132",
  //          BRANCH_CD: "099 ",
  //           SR_CD:"3",
  //         REQ_FLAG:"F",
  //         NO_OF_CHILDREN: "3",
  //         NO_OF_ADULTS: "2",
  //         POLITICALLY_CONNECTED: "Y",
  //         EARNING_MEMEBER:"1",
  //         BLINDNESS:"N",
  //         ID_MARK: "d",
  //         EMPLOYMENT_STATUS: "Salaried",
  //         REFERRED_BY_STAFF: "Y",
  //     EDUCATION_CD: " 01",
  //     EMP_COMPANY_TYPE: "01 ",
  //     COMPANY_NM: " Acute",
  //     JOINING_DT: "20-July-2023",
  //     RETIREMENT_DT: "20-July-2026",
  //     WORK_EXP: "5 ",
  //     SPECIALIZATION_REMARKS: "r ",
  //     FUNDED_AMT: "20000",
  //     NON_FUNDED_AMT: "2000",
  //     THRESHOLD_AMT: " 10000",
  //     NO_OF_2_WHEELERS: "2 ",
  //     NO_OF_4_WHEELERS: "2 ",
  //     CIBIL_SCORE: "6 ",
  //      ENT_COMP_CD:"132 ",
  //     ENT_BRANCH_CD:"099 "
  // },
  // OTHER_DTL: formData["OTHER_DTL"], //test-done
  OTHER_DTL: otherDTL, //test-done
  // PHOTO_MST:{
  
  //      IsNewRow: true,
  //     COMP_CD:"132 ",
  //     ENTERED_BRANCH_CD:"099",
  //     SR_CD:"3",
  //     SIGN_GROUP:"2",
  //     FROM_LIMIT:"2",
  //     TO_LIMIT:"2",
  //     REQ_FLAG:"F",
  //     CUST_PHOTO:"BASE64",
  //     CUST_SIGN:"BASE64",
  //     ACT_FLAG:"F",
  //      ENT_COMP_CD:"132 ",
  //     ENT_BRANCH_CD:"099 "
  // },
  PHOTO_MST: formData["PHOTO_MST"], //test-done
  //  DOC_MST:{
  
  //         IsNewRow: true,
  //         MASTER_DATA: [
  //             {
  //                 ACCT_TYPE: "0",
  //                 ACCT_CD: "0",
  //                 SR_CD: "1",
  //                 TEMPLATE_CD: "4",
  //                 SUBMIT: "N",
  //                 VALID_UPTO: " ",
  //                 DOC_AMOUNT: "",
  //                 DOC_NO: "12345",
  //                 DOC_TYPE: "KYC",
  //                 DOC_WEIGHTAGE: "",
  //                 ACTIVE: "Y",
  //                 DETAILS_DATA: {
  //                     isNewRow: [
  //                         {
  //                             SR_CD: "1",
  //                             ACCT_TYPE: "0",
  //                             ACCT_CD: "0",
  //                             TEMPLATE_CD: "4",
  //                             SUBMIT: "N",
  //                             VALID_UPTO: " ",
  //                             DOC_AMOUNT: "",
  //                             DOC_NO: "12345",
  //                             DOC_TYPE: "KYC",
  //                             DOC_WEIGHTAGE: "",
  //                             ACTIVE: "Y",
  //                             DOC_IMAGE:"BASE64"
  //                         }
  //                     ]
  //                 }
  //             },
  //             {
  //                 ACCT_TYPE: "0",
  //                 ACCT_CD: "0",
  //                 SR_CD: "2",
  //                 TEMPLATE_CD: "12",
  //                 SUBMIT: "N",
  //                 VALID_UPTO: "05-OCT-2023",
  //                 DOC_AMOUNT: "",
  //                 DOC_NO: "22222",
  //                 DOC_TYPE: "KYC",
  //                 DOC_WEIGHTAGE: "",
  //                 ACTIVE: "Y",
  //                 DETAILS_DATA: {
  //                     isNewRow: [
  //                         {
  //                             SR_CD: "2",
  //                             ACCT_TYPE: "0",
  //                             ACCT_CD: "0",
  //                             TEMPLATE_CD: "12",
  //                             SUBMIT: "N",
  //                             VALID_UPTO: "05-OCT-2023",
  //                             DOC_AMOUNT: "",
  //                             DOC_NO: "22222",
  //                             DOC_TYPE: "KYC",
  //                             DOC_WEIGHTAGE: "",
  //                             ACTIVE: "Y",
  //                             DOC_IMAGE: "BASE64"
  //                         }
  //                     ]
  //                 }
  //             }
  //         ]
  //     },
  DOC_MST: [
    {
      IsNewRow: true,
      COMP_CD: "132 ",
      BRANCH_CD:"099 ",
      ENT_COMP_CD:"132 ",
      ENT_BRANCH_CD:"099 ",
      ACCT_TYPE: "1",
      ACCT_CD: "2",
      TEMPLATE_CD: "4",
      SUBMIT: "N",
      VALID_UPTO: "05-OCT-23",
      DOC_AMOUNT: "1234",
      DOC_NO: "123456",
      DOC_TYPE: "KYC",
      DOC_WEIGHTAGE: "1 ",
      ACTIVE: "Y",
    }
  ],
  
  
  // NRI_DTL: {
  // IsNewRow: true,
  // BRANCH_CD: "099 ",
  // SR_CD:"3",
  // REQ_FLAG:"F",
  // COMP_CD:"132 ",
  //     VISA_DETAIL: "49026446 ",
  //     VISA_ISSUE_DT: "20-Jun-2020 ",
  //     VISA_ISSUE_BY: "20-Jul-2021 ",
  //     VISA_EXPIRY_DT: "20-Jul-2023",
  //     DOMESTIC_RISK: "A",
  //     COUNTRY_OF_RISK: " ",
  //     CROSS_BORDER_RISK: " ",
  //     VISUALLY_IMPAIRED: "N",
  //     CUSTOMER_EVALUATION_FLAG: " ",
  //     RELATIONSHIP_MANAGER:"12",
  //     ENT_COMP_CD:"132 ",
  //     ENT_BRANCH_CD:"099 "
  // // }
  
  // },
  NRI_DTL: formData["NRI_DTL"], //test-done
  
  });
  if(status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}

// to show total_acct number, in deactivate customer
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

export const getAttestHistory = async ({COMP_CD, CUSTOMER_ID}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCUSTATTESTHISDTL", {
      COMP_CD: COMP_CD, 
      CUSTOMER_ID: CUSTOMER_ID,
    });
    if(status === "0") {
      return data;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
} 

export const getAttestData = async ({COMP_CD, BRANCH_CD, CUSTOMER_ID, USER_NAME}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCUSTATTESTRITDTL", {
      CUSTOMER_ID: CUSTOMER_ID,
      USER_NAME: USER_NAME, 
      COMP_CD: COMP_CD, 
      BRANCH_CD: BRANCH_CD,
    });
    if(status === "0") {
      return data;
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


export const getOptionsOnPin = async (dependentValue, formState, _, authState) => {
  // console.log("getOptionsOnPinParentArea dp.", dependentValue?.PIN_CODE, dependentValue?.PAR_AREA_CD)
  let PIN_CODE = "";
  if(dependentValue?.PIN_CODE?.value && dependentValue?.PIN_CODE?.value?.length>5) {
    // console.log("getOptionsOnPinParentArea dp pincode", dependentValue?.PIN_CODE?.value, dependentValue?.PAR_AREA_CD?.value)
    PIN_CODE = dependentValue?.PIN_CODE?.value
  }
  if(dependentValue?.PIN_CODE?.value && dependentValue?.PIN_CODE?.value?.length<5) {

  } else if(PIN_CODE) {
    const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETAREALIST", {
      COMP_CD: authState?.companyID ?? "",
      BRANCH_CD: authState?.user?.branchCode ?? "",
      PIN_CODE: PIN_CODE,
      FLAG: PIN_CODE ? "P" : "A", // P - pincode, A - parent area
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
  if(dependentValue.LOC_PIN_CODE && dependentValue?.LOC_PIN_CODE?.value && dependentValue.LOC_PIN_CODE?.value?.length>5) {
    // console.log("getOptionsOnPinParentArea dp pincode", dependentValue?.LOC_PIN_CODE?.value, dependentValue?.LOC_AREA_CD?.value)
    PIN_CODE = dependentValue?.LOC_PIN_CODE?.value
  } else if(dependentValue?.LOC_AREA_CD?.value) {
    // console.log("getOptionsOnPinParentArea dp parea", dependentValue?.LOC_PIN_CODE?.value, dependentValue?.LOC_AREA_CD?.value)
    PARENT_AREA = dependentValue?.LOC_AREA_CD?.value
  }
  if(dependentValue.LOC_PIN_CODE && dependentValue?.LOC_PIN_CODE?.value && dependentValue?.LOC_PIN_CODE?.value?.length<5) {

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

// to get data, in grid
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

// get bank detail data, in grid
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

// to get data, in grid
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

// to get data, in grid
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

// to get data, in grid
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

// to get data, in grid
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

// to get data, in grid
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
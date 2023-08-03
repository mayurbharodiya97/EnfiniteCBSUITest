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

export const getTabsDetail = async ({ COMP_CD , ENTITY_TYPE, CATEGORY_CD, CONS_TYPE }) => {
  if(!CATEGORY_CD || !CONS_TYPE) {
    return []
  }
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCIFTABDTL", {
      COMP_CD: COMP_CD,
      ENTITY_TYPE: ENTITY_TYPE,
      CATEGORY_CD: CATEGORY_CD,
      CONS_TYPE: CONS_TYPE,
    });
  if (status === "0") {
    return data;
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

export const getPMISCData = async (CATEGORY_CD) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETPMISCDATA", {
      CATEGORY_CD: CATEGORY_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      console.log("qweqwerr", responseData)
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

export const getCountryOptions = async (COMP_CD, BRANCH_CD) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCOUNTRYLIST", {
      COMP_CD: COMP_CD, 
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      console.log("qweqwerr", responseData)
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
export const getSubAreaOptions = async (COMP_CD, BRANCH_CD) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETAREALIST", {
      COMP_CD: COMP_CD, 
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
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
    return data
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
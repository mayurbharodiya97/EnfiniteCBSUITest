import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

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
      responseData = responseData.map(({ CATEG_CD, CATEG_NM, ...other }) => {
        return {
          ...other,
          CATEG_CD: CATEG_CD,
          CATEG_NM: CATEG_NM,
          value: CATEG_CD,
          label: CATEG_NM,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getAcctModeOptions = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTMSTMODEDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ MODE_CD, MODE_NM, ...other }) => {
        return {
          ...other,
          MODE_CD: MODE_CD,
          CATEG_NM: MODE_NM,
          value: MODE_CD,
          label: MODE_NM,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getTabsDetail = async ({COMP_CD, BRANCH_CD, ACCT_TYPE, ACCT_MODE, ALLOW_EDIT}) => {
  if (!ACCT_TYPE) {
    return [];
  }
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTTAB", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      ACCT_TYPE: ACCT_TYPE,
      ACCT_MODE: ACCT_MODE,
      ALLOW_EDIT: ALLOW_EDIT,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const isReadOnlyonParam320 = ({formState}) => {
  // return true;
  const PARAM320 = formState?.PARAM320;
  if(Boolean(PARAM320)) {
      if(PARAM320 === "Y") {
          return true;
      } else if(PARAM320 === "N") {
          return false;
      }
  }
  return false;
}

export const getMortgageTypeOp = async ({COMP_CD, BRANCH_CD}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTMSTMORTGAGEDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
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
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}

export const getAdvocateTypeOp = async ({COMP_CD, BRANCH_CD}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTMSTADVOCATEDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
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
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}

export const getValuerTypeOp = async ({COMP_CD, BRANCH_CD}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTMSTVALUERNMDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
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
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}

export const getGuardianorRelationTypeOp = async ({COMP_CD, BRANCH_CD}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTMSTGUARDIANDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
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
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}

export const getNPATypeOP = async ({COMP_CD, BRANCH_CD}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTMSTNPADDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ NPA_CD, DISPLAY_NM, ...other }) => {
        return {
          ...other,
          NPA_CD: NPA_CD,
          DISPLAY_NM: DISPLAY_NM,
          value: NPA_CD,
          label: DISPLAY_NM,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}

export const getSegmentPTSOp = async ({COMP_CD, BRANCH_CD}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTMSTPTSDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
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
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}

export const getPurposeTypeOP = async ({COMP_CD, BRANCH_CD}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTMSTPURPOSEDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ PURPOSE_CD, DISPLAY_NM, ...other }) => {
        return {
          ...other,
          PURPOSE_CD: PURPOSE_CD,
          DISPLAY_NM: DISPLAY_NM,
          value: PURPOSE_CD,
          label: DISPLAY_NM,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}

export const getPrioritParentTypeOP = async ({COMP_CD, BRANCH_CD}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACTPRIORITYPARENTDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ PRIORITY_CD, PRIORITY_NM, ...other }) => {
        return {
          ...other,
          PRIORITY_CD: PRIORITY_CD,
          PRIORITY_NM: PRIORITY_NM,
          value: PRIORITY_CD,
          label: PRIORITY_NM,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}

export const getPrioritMainTypeOP = async ({COMP_CD, BRANCH_CD, dependentValue}) => {
  // console.log("dependentValuedependentValuedependentValue", dependentValue)
  const PARENT_GROUP = dependentValue?.PARENT_GROUP?.value;
  if(Boolean(PARENT_GROUP)) {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETACTPRIORITYMAINDDW", {
        COMP_CD: COMP_CD,
        BRANCH_CD: BRANCH_CD,
        PARENT_GROUP: PARENT_GROUP,
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
        });
      }
      return responseData;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  }
}

export const getPriorityWeakerTypeOP = async ({COMP_CD, BRANCH_CD, dependentValue}) => {
  const PARENT_GROUP = dependentValue?.PARENT_GROUP?.value;
  if(Boolean(PARENT_GROUP)) {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETACTWEAKERSUBPRIODDW", {
        COMP_CD: COMP_CD,
        BRANCH_CD: BRANCH_CD,
        PRIORITY_CD: PARENT_GROUP
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
        });
      }
      return responseData;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  }

}

export const getCategoryTypeOP = async ({COMP_CD, BRANCH_CD}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTMSTCATEGORYDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ CATEG_CD, DISPLAY_NM, ...other }) => {
        return {
          ...other,
          CATEG_CD: CATEG_CD,
          DISPLAY_NM: DISPLAY_NM,
          value: CATEG_CD,
          label: DISPLAY_NM,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}

export const getAgentTypeOP = async ({COMP_CD, BRANCH_CD}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTMSTAGENTDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ AGENT_CD, DISPLAY_NM, ...other }) => {
        return {
          ...other,
          AGENT_CD: AGENT_CD,
          DISPLAY_NM: DISPLAY_NM,
          value: AGENT_CD,
          label: DISPLAY_NM,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}

export const getRiskCategTypeOP = async ({COMP_CD, BRANCH_CD}) => {//come back
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACTRISKCLASSDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      FOR_SHARE: "N"
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ CLASS_CD, DISPLAY_NM, ...other }) => {
        return {
          ...other,
          CLASS_CD: CLASS_CD,
          DISPLAY_NM: DISPLAY_NM,
          value: CLASS_CD,
          label: DISPLAY_NM,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}

export const getIndustryTypeOP = async ({COMP_CD, BRANCH_CD}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTMSTINDUSTRYDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ INDUSTRY_CODE, DISPLAY_NM, ...other }) => {
        return {
          ...other,
          INDUSTRY_CODE: INDUSTRY_CODE,
          DISPLAY_NM: DISPLAY_NM,
          value: INDUSTRY_CODE,
          label: DISPLAY_NM,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}

export const getRECRETypeOP = async ({COMP_CD, BRANCH_CD}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTMSTRECREDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ RENRE_CD, DISPLAY_NM, ...other }) => {
        return {
          ...other,
          RENRE_CD: RENRE_CD,
          DISPLAY_NM: DISPLAY_NM,
          value: RENRE_CD,
          label: DISPLAY_NM,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}

export const getBusinessypeOP = async ({COMP_CD, BRANCH_CD}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTMSTBUSINESSDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ BUSINESS_CD, DISPLAY_NM, ...other }) => {
        return {
          ...other,
          BUSINESS_CD: BUSINESS_CD,
          DISPLAY_NM: DISPLAY_NM,
          value: BUSINESS_CD,
          label: DISPLAY_NM,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
}

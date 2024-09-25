import { DefaultErrorObject } from "@acuteinfo/common-base";
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

export const getAccountList = async ({ SELECT_COLUMN }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCOUNTLIST", {
      SELECT_COLUMN: SELECT_COLUMN,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getCustomerData = async ({
  CUSTOMER_ID,
  ACCT_TYPE,
  COMP_CD,
  SCREEN_REF,
}) => {
  if (Boolean(CUSTOMER_ID)) {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETCUSTOMERDATA", {
        COMP_CD: COMP_CD,
        ACCT_TYPE: ACCT_TYPE,
        CUSTOMER_ID: CUSTOMER_ID,
        SCREEN_REF: SCREEN_REF,
      });
    if (status === "0") {
      return data;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  }
};

export const getPendingAcct = async ({ COMP_CD, BRANCH_CD, REQ_FLAG }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETPENDINGACCTLIST", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      REQ_FLAG: REQ_FLAG,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getTabsDetail = async ({
  COMP_CD,
  BRANCH_CD,
  ACCT_TYPE,
  ACCT_MODE,
  ALLOW_EDIT,
}) => {
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

export const isReadOnlyonParam320 = ({ formState }) => {
  const PARAM320 = formState?.PARAM320;
  if (Boolean(PARAM320)) {
    if (PARAM320 === "Y") {
      return true;
    } else if (PARAM320 === "N") {
      return false;
    }
  }
  return false;
};

export const getAccountDetails = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCOUNTDETAILS", reqData);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getMortgageTypeOp = async ({ COMP_CD, BRANCH_CD }) => {
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
};

export const getAdvocateTypeOp = async ({ COMP_CD, BRANCH_CD }) => {
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
};

export const getValuerTypeOp = async ({ COMP_CD, BRANCH_CD }) => {
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
};

export const getGuardianorRelationTypeOp = async ({ COMP_CD, BRANCH_CD }) => {
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
};

export const getNPATypeOP = async ({ COMP_CD, BRANCH_CD }) => {
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
};

export const getSegmentPTSOp = async ({ COMP_CD, BRANCH_CD }) => {
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
};

export const getPurposeTypeOP = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTMSTPURPOSEDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ PURPOSE_CD, DISPLAY_NM, ...other }) => {
          return {
            ...other,
            PURPOSE_CD: PURPOSE_CD,
            DISPLAY_NM: DISPLAY_NM,
            value: PURPOSE_CD,
            label: DISPLAY_NM,
          };
        }
      );
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getPrioritParentTypeOP = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACTPRIORITYPARENTDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ PRIORITY_CD, PRIORITY_NM, ...other }) => {
          return {
            ...other,
            PRIORITY_CD: PRIORITY_CD,
            PRIORITY_NM: PRIORITY_NM,
            value: PRIORITY_CD,
            label: PRIORITY_NM,
          };
        }
      );
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getPrioritMainTypeOP = async ({
  COMP_CD,
  BRANCH_CD,
  dependentValue,
}) => {
  const PARENT_GROUP = dependentValue?.PARENT_GROUP?.value;
  if (Boolean(PARENT_GROUP)) {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETACTPRIORITYMAINDDW", {
        COMP_CD: COMP_CD,
        BRANCH_CD: BRANCH_CD,
        PARENT_GROUP: PARENT_GROUP,
      });
    if (status === "0") {
      let responseData = data;
      if (Array.isArray(responseData)) {
        responseData = responseData.map(
          ({ PRIORITY_CD, DISPLAY_NM, ...other }) => {
            return {
              ...other,
              PRIORITY_CD: PRIORITY_CD,
              DISPLAY_NM: DISPLAY_NM,
              value: PRIORITY_CD,
              label: DISPLAY_NM,
            };
          }
        );
      }
      return responseData;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  } else {
    return [];
  }
};

export const getPriorityWeakerTypeOP = async ({
  COMP_CD,
  BRANCH_CD,
  dependentValue,
}) => {
  const PRIO_CD = dependentValue?.PRIO_CD?.value;
  if (Boolean(PRIO_CD)) {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETACTWEAKERSUBPRIODDW", {
        COMP_CD: COMP_CD,
        BRANCH_CD: BRANCH_CD,
        PRIORITY_CD: PRIO_CD,
      });
    if (status === "0") {
      let responseData = data;
      if (Array.isArray(responseData)) {
        responseData = responseData.map(
          ({ SUB_PRIORITY_CD, DESCRIPTION, ...other }) => {
            return {
              ...other,
              SUB_PRIORITY_CD: SUB_PRIORITY_CD,
              DESCRIPTION: `${SUB_PRIORITY_CD} ${DESCRIPTION}`,
              value: SUB_PRIORITY_CD,
              label: `${SUB_PRIORITY_CD} ${DESCRIPTION}`,
            };
          }
        );
      }
      return responseData;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  } else {
    return [];
  }
};

export const getCategoryTypeOP = async ({ COMP_CD, BRANCH_CD }) => {
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
};

export const getAgentTypeOP = async ({ COMP_CD, BRANCH_CD }) => {
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
};

interface RiskReqParam {
  COMP_CD: string;
  BRANCH_CD: string;
  FOR_SHARE?: string;
}
export const getRiskCategTypeOP = async (reqObj: RiskReqParam) => {
  const { COMP_CD, BRANCH_CD, FOR_SHARE } = reqObj;
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACTRISKCLASSDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      FOR_SHARE: FOR_SHARE ?? "N",
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
};

export const getIndustryTypeOP = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTMSTINDUSTRYDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ INDUSTRY_CODE, DISPLAY_NM, ...other }) => {
          return {
            ...other,
            INDUSTRY_CODE: INDUSTRY_CODE,
            DISPLAY_NM: DISPLAY_NM,
            value: INDUSTRY_CODE,
            label: DISPLAY_NM,
          };
        }
      );
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getRECRETypeOP = async ({ COMP_CD, BRANCH_CD }) => {
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
};

export const getBusinessypeOP = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTMSTBUSINESSDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ BUSINESS_CD, DISPLAY_NM, ...other }) => {
          return {
            ...other,
            BUSINESS_CD: BUSINESS_CD,
            DISPLAY_NM: DISPLAY_NM,
            value: BUSINESS_CD,
            label: DISPLAY_NM,
          };
        }
      );
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getAdvDirectorNameTypeOP = async ({ A_ROLE_IND }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDIRECTORLIST", {
      ROLE: A_ROLE_IND,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ DIRECTOR_CD, DIRECTOR_NM, ...other }) => {
          return {
            ...other,
            DIRECTOR_CD: DIRECTOR_CD,
            DIRECTOR_NM: DIRECTOR_NM,
            value: DIRECTOR_CD,
            label: DIRECTOR_NM,
          };
        }
      );
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getCheqSignAuthoTypeOP = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACTCHQSIGNAUTHODDW", {
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
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getIntSkipReasonTypeOP = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACTINSSKIPREASNDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ TRAN_CD, DESCRIPTION, ...other }) => {
        return {
          ...other,
          TRAN_CD: TRAN_CD,
          DESCRIPTION: DESCRIPTION,
          value: TRAN_CD,
          label: DESCRIPTION,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getSecurityTypeOP = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTMSTSECURITYCDDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ SECURITY_CD, DISPLAY_NM, ...other }) => {
          return {
            ...other,
            SECURITY_CD: SECURITY_CD,
            DISPLAY_NM: DISPLAY_NM,
            value: SECURITY_CD,
            label: DISPLAY_NM,
          };
        }
      );
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

// retrieving document medatory docs in grid for new entry
export const getKYCDocumentGridData = async ({
  COMP_CD,
  BRANCH_CD,
  ACCT_TYPE,
  CONSTITUTION_TYPE,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDOCTEMPLATEDTL", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      CUSTOMER_TYPE: null,
      ACCT_TYPE: ACCT_TYPE ?? null,
      // CONSTITUTION_TYPE: CONSTITUTION_TYPE,
      // TRAN_CD: "42"
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ DOC_DESCRIPTION, TEMPLATE_CD, ...other }) => {
          return {
            ...other,
            DOC_DESCRIPTION: DOC_DESCRIPTION,
            TEMPLATE_CD: TEMPLATE_CD,
            label: DOC_DESCRIPTION,
            value: TEMPLATE_CD,
          };
        }
      );
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getDocumentImagesList = async ({ TRAN_CD, SR_CD, REQ_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCKYCDOCSCNHISDISP", {
      TRAN_CD: TRAN_CD,
      SR_CD: SR_CD,
      REQ_CD: REQ_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ LINE_CD, ...other }) => {
        return {
          ...other,
          LINE_CD: LINE_CD,
          LINE_ID: LINE_CD,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getCustDocumentOpDtl = async ({
  COMP_CD,
  BRANCH_CD,
  formState,
}) => {
  const { gridData, rowsData } = formState;
  // console.log("qekuwhdiuwehdw", formState)
  let selectedDoc: any[] = [];
  if (rowsData && rowsData.length > 0) {
    selectedDoc = rowsData.map((el) => {
      return el.data.TEMPLATE_CD ?? "";
    });
  } else if (gridData && gridData.length > 0) {
    selectedDoc = gridData.map((el) => {
      return el.TEMPLATE_CD ?? "";
    });
  }
  // console.log(gridData, "auedhniuwehdwe", formMode)
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCUSTDOCUMENT", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (rowsData && rowsData.length > 0) {
      responseData = responseData.filter((el) =>
        selectedDoc.includes(el.SR_CD)
      );
    } else if (gridData && gridData.length > 0) {
      responseData = responseData.filter(
        (el) => !selectedDoc.includes(el.SR_CD)
      );
    }
    // console.log("auedhniuwehdwe  qwed", data)
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ DESCRIPTION, SR_CD, ...other }) => {
        // if(selectedDoc.includes(SR_CD)) {

        // } else {
        return {
          ...other,
          DESCRIPTION: DESCRIPTION,
          SR_CD: SR_CD,
          label: DESCRIPTION,
          value: SR_CD,
        };
        // }
        // }
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const accountSave = async (reqData) => {
  const {
    IsNewRow,
    REQ_CD,
    REQ_FLAG,
    SAVE_FLAG,
    CUSTOMER_ID,
    ACCT_TYPE,
    ACCT_CD,
    COMP_CD,
    formData,
  } = reqData;

  // console.log("wefhiwheifhweihf", formData)
  const jointTabs = [
    "JOINT_HOLDER_DTL",
    "JOINT_NOMINEE_DTL",
    "JOINT_GUARDIAN_DTL",
    "JOINT_GUARANTOR_DTL",
    "JOINT_HYPOTHICATION_DTL",
    "JOINT_SIGNATORY_DTL",
    "JOINT_INTRODUCTOR_DTL",
  ];

  let payload = {};

  //   MAIN_DETAIL
  // JOINT_ACCOUNT_DTL
  // DOC_MST
  // MOBILE_REG_DTL
  // RELATIVE_DTL
  // OTHER_ADDRESS_DTL

  let joint_account_dtl: any[] = [];
  if (Object.keys(formData)?.length > 0) {
    Object.keys(formData).forEach((tab: string) => {
      if (tab === "MAIN_DETAIL") {
        payload["MAIN_DETAIL"] = formData["MAIN_DETAIL"];
      }
      if (jointTabs.includes(tab)) {
        joint_account_dtl = [...joint_account_dtl, ...formData[tab]];
      } else if (
        tab === "DOC_MST" ||
        tab === "MOBILE_REG_DTL" ||
        tab === "RELATIVE_DTL" ||
        tab === "OTHER_ADDRESS_DTL"
      ) {
        if (tab === "DOC_MST") {
          payload[tab] = formData[tab]?.doc_mst_payload;
        } else {
          payload[tab] = formData[tab];
        }
      }
    });
    payload["JOINT_ACCOUNT_DTL"] = joint_account_dtl;
    payload["PHOTO_DTL"] = [
      {
        IsNewRow: true,
        ACCT_MODE: "1   ",
        ACCT_PHOTO: "BASE64",
        ACCT_SIGN: "BASE64",
        ACCT_TYPE: "001 ",
        ACCT_CD: "001 ",
        ACT_FLAG: "Y",
        FLAG: "C",
        J_TYPE: "J",
        FROM_LIMIT: "456",
        FROM_TABLE: "PHOTO",
        SIGN_GROUP: "1",
        TO_LIMIT: "1000000",
        UPDATE_HISTORY: "",
      },
    ];
    payload["SCREEN_REF"] = "MST/002";
    const ENTRY_TYPE = "1";
    payload = {
      ...payload,
      IsNewRow,
      REQ_CD,
      REQ_FLAG,
      SAVE_FLAG,
      CUSTOMER_ID,
      ACCT_TYPE,
      ACCT_CD,
      COMP_CD,
      ENTRY_TYPE,
    };
    // console.log("AcctMSTContextwadqwdwq. woiuioehfiuwhefwef", payload)
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("SAVEACCOUNTDATA", payload);
    if (status === "0") {
      return data;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  }
};

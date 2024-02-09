import { DefaultErrorObject } from "components/utils";
import { format } from "date-fns";
import { AuthSDK } from "registry/fns/auth";

export const stockAcctTypeList = async (ApiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSTKACCTTYPEDDW", {
      ...ApiReq,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ ACCT_TYPE, DESCRIPTION, ...other }) => {
          return {
            value: ACCT_TYPE,
            label: ACCT_TYPE + " - " + DESCRIPTION + " - " + other.PARENT_TYPE,
            ...other,
          };
        }
      );
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const securityListDD = async (ApiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSTKSECURITYDDW", {
      ...ApiReq,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ SECURITY_CD, SECURITY_TYPE, DESCRIPTION, ...other }) => {
          return {
            value: SECURITY_CD,
            label: DESCRIPTION + " " + SECURITY_TYPE,
            ...other,
          };
        }
      );
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const scriptListDD = async (ApiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSTKSCRIPTDDW", {
      ...ApiReq,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ SCRIPT_CD, SCRIPT_NM, ...other }) => {
        return {
          value: SCRIPT_CD,
          label: SCRIPT_NM,
          ...other,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const securityFieldDTL = async (apiReqPara) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSTKSECFIELDDISP", {
      ...apiReqPara,
    });
  if (status === "0") {
    // return data;

    let transformedSecurityData: any[] = [];

    if (Array.isArray(data)) {
      transformedSecurityData = await Promise.all(
        data
          .map((val, index) => ({
            render: {
              componentType: val?.COMPONENT_TYPE,
            },
            name: val?.FIELD_NAME,
            label: val?.FIELD_LABEL,
            sequence: val?.TAB_SEQ,
            placeholder: val?.PLACE_HOLDER,
            GridProps: {
              xs: val?.XS,
              md: val?.MD,
              sm: val?.SM,
              lg: val?.LG,
              xl: val?.XL,
            },
          }))
          .sort((a, b) => parseInt(a.sequence) - parseInt(b.sequence))
          .map(async (item) => {
            if (item.name === "TRAN_DT") {
              return {
                ...item,
                dependentFields: ["BRANCH_CD", "SECURITY_CD", "ACCT_MST_LIMIT"],
                postValidationSetCrossFieldValues: async (
                  field,
                  formState,
                  authState,
                  dependentValue
                ) => {
                  if (field?.value) {
                    const originalDate = new Date(field?.value);
                    const formattedDate = format(
                      originalDate,
                      "dd-MMM-yyyy"
                    ).toUpperCase();

                    let APIRequestPara = {
                      COMP_CD: authState?.companyID,
                      BRANCH_CD: dependentValue?.BRANCH_CD?.value,
                      SECURITY_CD: dependentValue?.SECURITY_CD?.value,
                      SCREEN_REF: "ETRN/047",
                      GD_TD_DATE: "25-Jan-2024",
                      TRN_DATE: formattedDate,

                      // LIMIT_AMOUNT: dependentValue?.ACCT_MST_LIMIT?.value,
                      LIMIT_AMOUNT: "100",
                    };
                    let postData = await expireDate(APIRequestPara);
                    console.log("<<<dataedata", postData);
                    return {
                      ASON_DT: { value: postData?.[0]?.EXPIRY_DATE },
                      STMT_DT_FLAG: {
                        value: postData?.[0]?.FLAG,
                      },
                    };
                  }
                },
              };
            } else if (item.name === "ASON_DT") {
              return {
                ...item,
                dependentFields: ["STMT_DT_FLAG"],
                isReadOnly(fieldData, dependentFieldsValues, formState) {
                  if (dependentFieldsValues?.STMT_DT_FLAG?.value === "N") {
                    return true;
                  } else {
                    return false;
                  }
                },
              };
            } else if (item.name === "SCRIPT_CD") {
              return {
                ...item,
                // disableCaching: true,
                _optionsKey: "scriptListDD",
                dependentFields: ["ACCT_TYPE", "ACCT_CD"],
                options: (dependentValue, formState, _, authState, other) => {
                  let apiReq = {
                    COMP_CD: authState?.companyID,
                    BRANCH_CD: authState?.user?.branchCode,
                  };
                  return scriptListDD(apiReq);
                },
              };
            } else if (item.name === "STOCK_VALUE") {
              return {
                ...item,
                postValidationSetCrossFieldValues: async (
                  field,
                  formState,
                  authState,
                  dependentValue
                ) => {
                  if (field?.value) {
                    return {
                      NET_VALUE: {
                        value: field?.value,
                      },
                    };
                  }
                },
              };
            } else if (item.name === "CREDITOR") {
              return {
                ...item,
                shouldExclude() {
                  if (data?.[0]?.CREDITOR_VISIBLE === "Y") {
                    return false;
                  } else {
                    return true;
                  }
                },
                dependentFields: ["STOCK_VALUE"],
                postValidationSetCrossFieldValues: async (
                  field,
                  formState,
                  authState,
                  dependentValue
                ) => {
                  if (field?.value) {
                    let drawingPower =
                      Number(dependentValue?.STOCK_VALUE?.value) -
                      Number(field?.value);

                    return {
                      NET_VALUE: {
                        value: drawingPower,
                      },
                    };
                  }
                },
              };
            } else if (item.name === "MARGIN") {
              return {
                ...item,
                dependentFields: ["NET_VALUE"],
                postValidationSetCrossFieldValues: async (
                  field,
                  formState,
                  authState,
                  dependentValue
                ) => {
                  if (field?.value) {
                    let drawingPower =
                      (Number(dependentValue?.NET_VALUE?.value) *
                        Number(field?.value)) /
                      100;
                    return {
                      DRAWING_POWER: {
                        value:
                          Number(dependentValue?.NET_VALUE?.value) -
                          drawingPower,
                      },
                    };
                  }
                },
              };
            } else {
              return item;
            }
          })
      );
    }
    return transformedSecurityData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const stockGridData = async (apiReqPara) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSTOCKDATA", {
      ...apiReqPara,
      // COMP_CD: "132 ",
      // BRANCH_CD: "099 ",
      // ACCT_TYPE: "301 ",
      // ACCT_CD: "000041              ",
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const viewDocument = async (apiReqPara) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSTKUPVEWBTNDOCDTLDISP", {
      ...apiReqPara,
      // COMP_CD: "132 ",
      // BRANCH_CD: "099 ",
      // REF_TRAN_CD: "266",
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const expireDate = async (apiReqPara) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETEXPIRYDATE", {
      ...apiReqPara,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const crudDocument = async (apiReqPara) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DOSTOCKDOCUMENTDML", {
      ...apiReqPara,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

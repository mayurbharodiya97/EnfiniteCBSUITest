import { DefaultErrorObject } from "components/utils";
import { endOfMonth, format } from "date-fns";
import { AuthSDK } from "registry/fns/auth";

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
  console.log("<<<apiReqPara", apiReqPara);
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSTKSECFIELDDISP", {
      // ...apiReqPara,
      COMP_CD: apiReqPara?.COMP_CD,
      SECURITY_CD: apiReqPara?.SECURITY_CD,
      BRANCH_CD: apiReqPara?.BRANCH_CD,
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
                required: true,
                isWorkingDate: true,
                isMaxWorkingDate: true,
                dependentFields: ["BRANCH_CD", "SECURITY_CD", "ACCT_MST_LIMIT"],
                postValidationSetCrossFieldValues: async (
                  field,
                  formState,
                  authState,
                  dependentValue
                ) => {
                  if (field?.value && dependentValue?.SECURITY_CD?.value) {
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
                      GD_TD_DATE: authState?.workingDate,
                      TRAN_DT: formattedDate,
                      LIMIT_AMOUNT: apiReqPara?.ACCT_MST_LIMIT ?? "0",
                    };
                    let postData = await expireDate(APIRequestPara);
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
                required: true,
                dependentFields: ["STMT_DT_FLAG"],
                defaultValue: format(
                  endOfMonth(new Date(apiReqPara.WORKING_DATE)),
                  "dd/MMM/yyyy"
                ),
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
                required: true,
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
                required: true,
                defaultValue: apiReqPara.STOCK_MARGIN
                  ? apiReqPara.STOCK_MARGIN
                  : 0.0,
                isReadOnly() {
                  if (apiReqPara?.STK_MRG_DISABLE === "N") {
                    return true;
                  } else {
                    return false;
                  }
                },
              };
            } else if (item.name === "DRAWING_POWER") {
              return {
                ...item,
                isReadOnly: true,
                dependentFields: ["NET_VALUE", "MARGIN"],
                setValueOnDependentFieldsChange: (dependentFields) => {
                  let value =
                    (Number(dependentFields?.NET_VALUE?.value) *
                      Number(dependentFields?.MARGIN?.value)) /
                    100;

                  return value
                    ? Number(dependentFields?.NET_VALUE?.value) - value
                    : "";
                },
              };
            } else if (item.name === "STOCK_DESC") {
              return {
                ...item,
                required: true,
                schemaValidation: {
                  type: "string",
                  rules: [
                    {
                      name: "required",
                      params: ["Stock-Decription is required."],
                    },
                  ],
                },
              };
            } else if (item.name === "NET_VALUE") {
              return {
                ...item,
                isReadOnly: true,
              };
            } else if (item.name === "RECEIVED_DT") {
              return {
                ...item,
                isWorkingDate: true,
                isMaxWorkingDate: true,
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
    });
  if (status === "0") {
    const dataStatus = data;
    dataStatus.map((item) => {
      if (item?.ALLOW_FORCE_EXPIRE_FLAG === "Y") {
        item._rowColor = "rgb(255, 225, 225)";
      }

      if (item?.CONFIRMED === "Y") {
        // item._rowColor = "rgb(9 132 3 / 51%)";
        item.CONFIRMED = "Confirm";
      } else {
        item.CONFIRMED = "Pending";
      }
      item.MARGIN = parseFloat(item.MARGIN).toFixed(2);
      return item;
    });
    return dataStatus;
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

export const insertValidate = async (apiReqPara) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("VALIDATESTOCKDATA", {
      ...apiReqPara,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const crudStockData = async (apiReqPara) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DOSTOCKDML", {
      ...apiReqPara,
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
    // return data.map((item) => {
    //   return {
    //     ...item,
    //     ACTIVE: item.ACTIVE === "Y" ? true : false,
    //   };
    // });
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const uploadDocument = async (apiReqPara) => {
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

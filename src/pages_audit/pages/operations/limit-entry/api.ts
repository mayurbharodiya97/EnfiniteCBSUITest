import { DefaultErrorObject } from "components/utils";
import { format, parse } from "date-fns";
import { AuthSDK } from "registry/fns/auth";

export const securityDropDownListType = async (
  USER_NAME,
  BRANCH_CD,
  COMP_CD
) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLIMITDDWACCTTYPE", {
      USER_NAME: USER_NAME,
      BRANCH_CD: BRANCH_CD,
      COMP_CD: COMP_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ ACCT_TYPE, DESCRIPTION, ...other }) => {
          return {
            value: ACCT_TYPE,
            // value: PARENT_TYPE.trim(),
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

export const getSecurityListData = async (apiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLIMITSECUMSTPARENT", {
      ...apiReq,
    });
  if (status === "0") {
    let responseData = data;

    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ SECURITY_TYPE, DISPLAY_NM, ...other }) => {
          return {
            value: other.SECURITY_CD,
            label: DISPLAY_NM,
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

export const getLimitEntryData = async (apiReqPara) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTNOVALIDATEDATA", {
      ...apiReqPara,
      // TRAN_CD: "1",
    });
  console.log("<<<ddddd", data, status);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const LimitSecurityData = async (apiReqPara) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLIMITSECFIELDDISP", {
      // ...apiReqPara,
      COMP_CD: apiReqPara?.COMP_CD,
      SECURITY_CD: apiReqPara?.SECURITY_CD,
      BRANCH_CD: apiReqPara?.BRANCH_CD,
    });
  if (status === "0") {
    const shouldPushWithY = data.some(
      (item) =>
        item.COMPONENT_TYPE === "rateOfInt" && item.FIELD_NAME === "PENAL_RATE"
    );
    const newObject = {
      DEFAULT_VALUE: shouldPushWithY ? "Y" : "N",
      COMPONENT_TYPE: "hidden",
      FIELD_NAME: "PANEL_FLAG",
    };
    const newData = [...data, newObject];
    
    let transformedSecurityData: any[] = [];

    if (Array.isArray(newData)) {
      transformedSecurityData = await Promise.all(
        newData
          .map((val, index) => ({
            render: {
              componentType: val?.COMPONENT_TYPE,
            },
            name: val?.FIELD_NAME,
            label: val?.FIELD_LABEL,
            sequence: val?.TAB_SEQ,
            defaultValue: val?.DEFAULT_VALUE,
            placeholder: val?.PLACE_HOLDER,
            isReadOnly: val?.IS_READ_ONLY === "Y" ? true : false,
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
            if (item.name === "FD_TYPE") {
              return {
                ...item,
                schemaValidation: {
                  type: "string",
                  rules: [
                    {
                      name: "required",
                      params: ["FD-Type is required."],
                    },
                  ],
                },
                options: await getFDTypeDDlist(
                  apiReqPara,
                  data?.[0]?.SECURITY_TYPE
                ),
                validate: (currentField, value) => {
                  if (currentField?.value) {
                    return;
                  }
                },
              };
            } else if (item.name === "FD_BRANCH_CD") {
              return {
                ...item,
                schemaValidation: {
                  type: "string",
                  rules: [
                    {
                      name: "required",
                      params: ["FD-Branch Code is required."],
                    },
                  ],
                },
                options: await getFDbranchDDlist(apiReqPara.COMP_CD),
              };
            } else if (item.name === "FD_ACCT_CD") {
              return {
                ...item,
                schemaValidation: {
                  type: "string",
                  rules: [
                    {
                      name: "required",
                      params: ["FD-Account No. is required."],
                    },
                  ],
                },
                dependentFields: [
                  "FD_TYPE",
                  "SECURITY_CD",
                  "FD_BRANCH_CD",
                  "SECURITY_TYPE",
                  "PANEL_FLAG",
                ],
                postValidationSetCrossFieldValues: async (
                  field,
                  formState,
                  authState,
                  dependentValue
                ) => {
                  if (field?.value) {
                    const formattedDate = format(
                      parse(authState?.workingDate, "dd/MMM/yyyy", new Date()),
                      "dd-MMM-yyyy"
                    ).toUpperCase();

                    let ApiReq = {
                      COMP_CD: authState?.companyID,
                      BRANCH_CD: dependentValue?.FD_BRANCH_CD?.value ?? "",
                      ACCT_TYPE: dependentValue?.FD_TYPE?.value ?? "",
                      ACCT_CD:
                        field?.value?.padStart(6, "0")?.padEnd(20, " ") ?? "",
                      SECURITY_TYPE: dependentValue?.SECURITY_TYPE?.value ?? "",
                      SECURITY_CD: dependentValue?.SECURITY_CD?.value ?? "",
                      GD_DATE: formattedDate,
                      SCREEN_REF: "ETRN/046",
                      PANEL_FLAG: dependentValue?.PANEL_FLAG?.value ?? "",
                    };

                    let postData = await getFDdetailBRD(ApiReq);

                    if (postData?.[0]?.MESSAGE1) {
                      formState.setDataOnFieldChange("MESSAGES", {
                        MESSAGES: postData?.[0]?.MESSAGE1,
                      });
                      return {
                        SECURITY_VALUE: {
                          value: postData?.[0]?.SECURITY_VALUE,
                        },
                        EXPIRY_DT: {
                          value:
                            postData?.[0]?.EXPIRY_DT &&
                            format(
                              parse(
                                postData?.[0]?.EXPIRY_DT,
                                "yyyy-MMM-dd HH:mm:ss.S",
                                new Date()
                              ),
                              "dd-MMM-yyyy"
                            ).toUpperCase(),
                        },
                        INT_AMT: {
                          value: postData?.[0]?.INT_AMT,
                        },
                        INT_RATE: {
                          value: postData?.[0]?.INT_RATE,
                        },
                        PENAL_RATE: {
                          value: postData?.[0]?.PENAL_RATE,
                        },
                      };
                    } else if (postData?.[0]?.RESTRICTION) {
                      formState.setDataOnFieldChange("MESSAGES", {
                        MESSAGES: postData?.[0]?.RESTRICTION,
                      });
                      return {
                        SECURITY_VALUE: {
                          value: "",
                        },
                        EXPIRY_DT: {
                          value: "",
                        },
                        INT_AMT: {
                          value: "",
                        },
                        INT_RATE: {
                          value: "",
                        },
                        PENAL_RATE: {
                          value: "",
                        },
                      };
                    } else {
                      return {
                        SECURITY_VALUE: {
                          value: postData?.[0]?.SECURITY_VALUE,
                        },
                        EXPIRY_DT: {
                          value:
                            postData?.[0]?.EXPIRY_DT &&
                            format(
                              parse(
                                postData?.[0]?.EXPIRY_DT,
                                "yyyy-MMM-dd HH:mm:ss.S",
                                new Date()
                              ),
                              "dd-MMM-yyyy"
                            ).toUpperCase(),
                        },
                        INT_AMT: {
                          value: postData?.[0]?.INT_AMT,
                        },
                        INT_RATE: {
                          value: postData?.[0]?.INT_RATE,
                        },
                        PENAL_RATE: {
                          value: postData?.[0]?.PENAL_RATE,
                        },
                      };
                    }
                  } else if (!field?.value) {
                    return {
                      SECURITY_VALUE: { value: "" },
                      EXPIRY_DT: { value: "" },
                      INT_RATE: { value: "" },
                      INT_AMT: { value: "" },
                      PENAL_RATE: { value: "" },
                    };
                  }
                },
                runPostValidationHookAlways: true,
              };
            } else if (item.name === "FD_NO") {
              return {
                ...item,
                schemaValidation: {
                  type: "string",
                  rules: [
                    {
                      name: "required",
                      params: ["FD-Number is required."],
                    },
                  ],
                },
                isReadOnly(fieldData, dependentFieldsValues, formState) {
                  if (dependentFieldsValues?.FD_ACCT_CD?.value) {
                    return false;
                  } else {
                    return true;
                  }
                },
                dependentFields: [
                  "FD_BRANCH_CD",
                  "FD_ACCT_CD",
                  "FD_TYPE",
                  "SECURITY_TYPE",
                  "SECURITY_CD",
                  "LIMIT_AMOUNT",
                  "TRAN_DT",
                  "SANCTIONED_AMT",
                  "PANEL_FLAG",
                ],
                postValidationSetCrossFieldValues: async (
                  field,
                  formState,
                  authState,
                  dependentValue
                ) => {
                  if (field?.value) {
                    const formattedDate = format(
                      parse(authState?.workingDate, "dd/MMM/yyyy", new Date()),
                      "dd-MMM-yyyy"
                    ).toUpperCase();

                    let ApiReq = {
                      COMP_CD: authState?.companyID ?? "",
                      BRANCH_CD: dependentValue?.FD_BRANCH_CD?.value ?? "",
                      ACCT_TYPE: dependentValue?.FD_TYPE?.value ?? "",
                      ACCT_CD:
                        dependentValue?.FD_ACCT_CD?.value
                          ?.padStart(6, "0")
                          ?.padEnd(10, " ") ?? "",
                      FD_NO: field?.value,
                      SECURITY_TYPE: dependentValue?.SECURITY_TYPE?.value ?? "",
                      SECURITY_CD:
                        dependentValue?.SECURITY_CD?.value.trim() ?? "",
                      LIMIT_AMOUNT: dependentValue?.SANCTIONED_AMT?.value ?? "",
                      GD_DATE: formattedDate,
                      TRAN_DT: formattedDate,
                      PANEL_FLAG: dependentValue?.PANEL_FLAG?.value ?? "",
                    };

                    let postData = await getFDdetailBFD(ApiReq);

                    if (postData?.[0]?.MESSAGE1) {
                      formState.setDataOnFieldChange("MESSAGES", {
                        MESSAGES: postData?.[0]?.MESSAGE1,
                      });
                      return {
                        SECURITY_VALUE: {
                          value: postData?.[0]?.SECURITY_VALUE,
                        },
                        EXPIRY_DT: {
                          value:
                            postData?.[0]?.EXPIRY_DT &&
                            format(
                              parse(
                                postData?.[0]?.EXPIRY_DT,
                                "yyyy-MMM-dd HH:mm:ss.S",
                                new Date()
                              ),
                              "dd-MMM-yyyy"
                            ).toUpperCase(),
                        },
                        INT_RATE: {
                          value: postData?.[0]?.INT_RATE,
                        },
                      };
                    } else if (postData?.[0]?.RESTRICTION) {
                      formState.setDataOnFieldChange("MESSAGES", {
                        MESSAGES: postData?.[0]?.RESTRICTION,
                      });
                      return {
                        SECURITY_VALUE: {
                          value: "",
                        },
                        // FD_NO: {
                        //   value: "",
                        // },
                        EXPIRY_DT: {
                          value: "",
                        },
                        INT_RATE: {
                          value: "",
                        },
                      };
                    } else {
                      return {
                        SECURITY_VALUE: {
                          value: postData?.[0]?.SECURITY_VALUE,
                        },
                        EXPIRY_DT: {
                          value:
                            postData?.[0]?.EXPIRY_DT &&
                            format(
                              parse(
                                postData?.[0]?.EXPIRY_DT,
                                "yyyy-MMM-dd HH:mm:ss.S",
                                new Date()
                              ),
                              "dd-MMM-yyyy"
                            ).toUpperCase(),
                        },
                        INT_RATE: {
                          value: postData?.[0]?.INT_RATE,
                        },
                      };
                    }
                  } else if (!field?.value) {
                    return {
                      SECURITY_VALUE: { value: "" },
                      EXPIRY_DT: { value: "" },
                      INT_RATE: { value: "" },
                    };
                  }
                },
                runPostValidationHookAlways: true,
              };
            } else if (item.name === "ENTRY_DT") {
              return {
                ...item,
                defaultValue: format(
                  parse(apiReqPara?.WORKING_DATE, "dd/MMMM/yyyy", new Date()),
                  "dd-MMM-yyyy"
                ).toUpperCase(),
              };
            } else if (item.name === "TRAN_DT") {
              return {
                ...item,
                defaultValue: format(
                  parse(apiReqPara?.WORKING_DATE, "dd/MMM/yyyy", new Date()),
                  "dd-MMM-yyyy"
                ).toUpperCase(),
              };
            } else if (item.name === "MARGIN") {
              return {
                ...item,
                defaultValue: apiReqPara?.LIMIT_MARGIN,
              };
            } else if (item.name === "SEC_AMT") {
              return {
                ...item,
                dependentFields: ["MARGIN", "SECURITY_VALUE"],
                setValueOnDependentFieldsChange: (
                  dependentFields,
                  data1,
                  data2
                ) => {
                  let value =
                    (Number(dependentFields?.SECURITY_VALUE?.value) *
                      Number(dependentFields?.MARGIN?.value)) /
                    100;

                  return value
                    ? Number(dependentFields?.SECURITY_VALUE?.value) - value
                    : "";
                },
              };
            } else if (item.name === "SEC_INT_AMT") {
              return {
                ...item,
                dependentFields: ["SEC_INT_MARGIN", "INT_AMT"],
                setValueOnDependentFieldsChange: (dependentFields) => {
                  let value =
                    (Number(dependentFields?.INT_AMT?.value) *
                      Number(dependentFields?.SEC_INT_MARGIN?.value)) /
                    100;

                  return value
                    ? Number(dependentFields?.INT_AMT?.value) - value
                    : "";
                },
              };
            } else if (item.name === "LIMIT_AMOUNT") {
              return {
                ...item,
                dependentFields: ["SANCTIONED_AMT"],
                setValueOnDependentFieldsChange: (dependentFields) => {
                  return dependentFields?.SANCTIONED_AMT?.value;
                },
              };
            } else if (item.name === "CHARGE_AMT") {
              return {
                ...item,
                defaultValue: apiReqPara?.HDN_CHARGE_AMT,
                postValidationSetCrossFieldValues: (
                  field,
                  __,
                  auth,
                  dependentFieldsValues
                ) => {
                  if (field.value) {
                    return {
                      SERVICE_TAX: {
                        value:
                          apiReqPara?.HDN_GST_ROUND === "3"
                            ? Math.floor(
                                (parseInt(field?.value) *
                                  parseInt(apiReqPara?.HDN_TAX_RATE)) /
                                  100
                              ) ?? ""
                            : apiReqPara?.HDN_GST_ROUND === "2"
                            ? Math.ceil(
                                (parseInt(field?.value) *
                                  parseInt(apiReqPara?.HDN_TAX_RATE)) /
                                  100
                              ) ?? ""
                            : apiReqPara?.HDN_GST_ROUND === "1"
                            ? Math.round(
                                (parseInt(field?.value) *
                                  parseInt(apiReqPara?.HDN_TAX_RATE)) /
                                  100
                              ) ?? ""
                            : (parseInt(field?.value) *
                                parseInt(apiReqPara?.HDN_TAX_RATE)) /
                                100 ?? "",
                      },
                    };
                  }
                  return {};
                },
              };
            } else if (item.name === "SERVICE_TAX") {
              return {
                ...item,
                defaultValue: apiReqPara?.HDN_GST_AMT,
              };
            } else {
              return item;
            }
          })
      );
    }
    transformedSecurityData.push({
      render: {
        componentType: "hidden",
      },
      name: "SECURITY_TYPE",
      defaultValue: data?.[0]?.SECURITY_TYPE,
    });
    return transformedSecurityData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getFDbranchDDlist = async (COMP_CD) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLIMITFDBRANCHDDW", {
      COMP_CD: COMP_CD,
    });
  if (status === "0") {
    let responseData = data;

    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ BRANCH_CD, DISP_NM, ...other }) => {
        return {
          value: BRANCH_CD,
          label: DISP_NM,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(
      message +
        " Check the GETLIMITFDBRANCHDDW API for the FD-Branch-List drop-down",
      messageDetails
    );
  }
};

export const getFDTypeDDlist = async (apiReqPara, SECURITY_TYPE) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLIMITFDTYPEDDW", {
      COMP_CD: apiReqPara.COMP_CD,
      BRANCH_CD: apiReqPara.BRANCH_CD,
      SECURITY_TYPE: SECURITY_TYPE,
    });
  if (status === "0") {
    let responseData = data;

    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ ACCT_TYPE, TYPE_NM, ...other }) => {
        return {
          value: ACCT_TYPE,
          label: ACCT_TYPE + " - " + TYPE_NM,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(
      message +
        " Check the GETLIMITFDTYPEDDW API for the FD-Account-Type drop-down",
      messageDetails
    );
  }
};

export const getFDdetailBRD = async (apiReqPara) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETFDBRDDETAIL", {
      ...apiReqPara,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getFDdetailBFD = async (apiReqPara) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETFDBFDDETAIL", {
      ...apiReqPara,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getLimitNSCdetail = async (apiReqPara) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLIMITNSCDTLBTN", {
      ...apiReqPara,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getLimitFDdetail = async (apiReqPara) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETFDDTLS", {
      ...apiReqPara,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getLimitDTL = async (chequeDTLRequestPara) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLIMITGRIDDATADISP", {
      ...chequeDTLRequestPara,
      // TRAN_CD: "1",
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const crudLimitEntryData = async (apiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DOLIMITENTRYDML", {
      ...apiReq,
      // TRAN_DT: "20-OCT-2023",
      // EXPIRY_DT: "20-OCT-2023",
      // ENTRY_DT: "11-OCT-2023",
      // RESOLUTION_DATE: "11-OCT-2023",
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

import { DefaultErrorObject, utilFunction } from "@acuteinfo/common-base";
import { isEqual, isValid } from "date-fns";
import { AuthSDK } from "registry/fns/auth";

export const getSecurityListData = async (apiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLIMITSECUMSTPARENT", {
      ...apiReq,
    });
  if (status === "0") {
    let responseData = data;

    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ ...other }) => {
        return {
          value: other.SECURITY_CD,
          label: other.DISPLAY_NM,
          ...other,
        };
      });
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
    });
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
    const newObject2 = {
      DEFAULT_VALUE: apiReqPara?.SECURITY_TYPE,
      COMPONENT_TYPE: "hidden",
      FIELD_NAME: "SECURITY_TYPE",
    };
    const newData = [...data, newObject, newObject2];
    let transformedSecurityData: any[] = [];
    if (Array.isArray(newData)) {
      transformedSecurityData = await Promise.all(
        newData.map(async (val) => {
          let item: any = {
            render: { componentType: val?.COMPONENT_TYPE },
            name: val?.FIELD_NAME,
            label: val?.FIELD_LABEL,
            sequence: val?.TAB_SEQ,
            defaultValue: val?.DEFAULT_VALUE,
            placeholder: val?.PLACE_HOLDER,
            isReadOnly: val?.IS_READ_ONLY === "Y",
            GridProps: {
              xs: val?.XS,
              md: val?.MD,
              sm: val?.SM,
              lg: val?.LG,
              xl: val?.XL,
            },
          };
          if (item.name === "FD_BRANCH_CD") {
            item.defaultValue = apiReqPara?.BRANCH_CD;
            item.options =
              item.render.componentType !== "hidden" &&
              (await getFDbranchDDlist(apiReqPara.COMP_CD));

            item.postValidationSetCrossFieldValues = async (field) => {
              if (field?.value) {
                return {
                  FD_TYPE: { value: "" },
                  FD_ACCT_CD: { value: "" },
                  FD_NO: { value: "" },
                };
              }
            };
          } else if (item.name === "FD_TYPE") {
            item.isFieldFocused =
              apiReqPara?.SECURITY_TYPE !== "BFD" &&
              apiReqPara?.SECURITY_TYPE !== "BRD"
                ? false
                : true;

            item.options =
              item.render.componentType !== "hidden" &&
              apiReqPara.SECURITY_TYPE &&
              (await getFDTypeDDlist(apiReqPara));

            item.validate = (columnValue, allField, flag) => {
              if (!Boolean(columnValue.value)) {
                return "FD-Account type is required.";
              }
              return "";
            };
            item.postValidationSetCrossFieldValues = async (field) => {
              if (field?.value) {
                return {
                  FD_ACCT_CD: { value: "" },
                  FD_NO: { value: "" },
                };
              }
            };
          } else if (item.name === "FD_ACCT_CD") {
            item.isFieldFocused =
              apiReqPara?.SECURITY_TYPE !== "BFD" &&
              apiReqPara?.SECURITY_TYPE !== "BRD";

            item.dependentFields = [
              "FD_TYPE",
              "SECURITY_CD",
              "FD_BRANCH_CD",
              "PANEL_FLAG",
            ];
            item.postValidationSetCrossFieldValues = async (
              field,
              formState,
              authState,
              dependentValue
            ) => {
              if (field?.value) {
                if (
                  (apiReqPara?.SECURITY_TYPE !== "BFD" &&
                    apiReqPara?.SECURITY_TYPE !== "BRD") ||
                  (dependentValue?.FD_BRANCH_CD?.value &&
                    dependentValue?.FD_TYPE?.value)
                ) {
                  let ApiReq = {
                    FD_COMP_CD: authState?.companyID,
                    FD_BRANCH_CD: dependentValue?.FD_BRANCH_CD?.value ?? "",
                    FD_ACCT_TYPE: dependentValue?.FD_TYPE?.value ?? "",
                    FD_ACCT_CD:
                      apiReqPara?.SECURITY_TYPE !== "BFD" &&
                      apiReqPara?.SECURITY_TYPE !== "BRD"
                        ? field?.value
                        : utilFunction.getPadAccountNumber(
                            field?.value,
                            dependentValue?.FD_TYPE?.optionData
                          ),
                    SECURITY_TYPE: apiReqPara.SECURITY_TYPE ?? "",
                    SECURITY_CD: dependentValue?.SECURITY_CD?.value ?? "",
                    SCREEN_REF: "ETRN/046",
                    PANEL_FLAG: dependentValue?.PANEL_FLAG?.value ?? "",
                  };

                  let postData = await getFDdetailBRD(ApiReq);

                  let responseData: any = [];
                  const messagebox = async (msgTitle, msg, buttonNames) => {
                    let buttonName = await formState.MessageBox({
                      messageTitle: msgTitle,
                      message: msg,
                      buttonNames: buttonNames,
                    });
                    return buttonName;
                  };
                  if (postData?.length) {
                    for (let i = 0; i < postData?.length; i++) {
                      if (postData[i]?.O_STATUS !== "0") {
                        let btnName = await messagebox(
                          postData[i]?.O_STATUS === "999"
                            ? "validation fail"
                            : "ALert message",
                          postData[i]?.O_MESSAGE,
                          postData[i]?.O_STATUS === "99"
                            ? ["Yes", "No"]
                            : ["Ok"]
                        );
                        if (
                          btnName === "No" ||
                          postData[i]?.O_STATUS === "999"
                        ) {
                          return {
                            FD_ACCT_CD: { value: "", isFieldFocused: true },
                            SECURITY_VALUE: { value: "" },
                            SEC_AMT: { value: "" },
                            SEC_INT_MARGIN: { value: "" },
                            SEC_INT_AMT: { value: "" },
                            EXPIRY_DT: { value: "" },
                            INT_AMT: { value: "" },
                            INT_RATE: { value: "" },
                            PENAL_RATE: { value: "" },
                            TRAN_DT: { value: "" },
                            LIMIT_AMOUNT: { value: "" },
                          };
                        }
                      } else {
                        responseData.push(postData[i]);
                      }
                    }
                  }
                  if (responseData?.length) {
                    return {
                      FD_ACCT_CD: {
                        value:
                          apiReqPara?.SECURITY_TYPE !== "BFD" &&
                          apiReqPara?.SECURITY_TYPE !== "BRD"
                            ? field?.value
                            : field.value.padStart(6, "0")?.padEnd(20, " "),
                        ignoreUpdate: true,
                      },
                      FD_NO: {
                        value: "",
                        ignoreUpdate: true,
                        isFieldFocused:
                          apiReqPara?.SECURITY_TYPE !== "BFD" &&
                          apiReqPara?.SECURITY_TYPE !== "BRD"
                            ? false
                            : true,
                      },
                      SECURITY_VALUE: {
                        value: responseData?.[0]?.SECURITY_VALUE,
                      },
                      EXPIRY_DT: {
                        value: responseData?.[0]?.EXPIRY_DT,
                      },
                      TRAN_DT: {
                        value: responseData?.[0]?.TRAN_DT
                          ? responseData?.[0]?.TRAN_DT
                          : authState.workingDate,
                        isFieldFocused:
                          apiReqPara?.SECURITY_TYPE !== "BFD" &&
                          apiReqPara?.SECURITY_TYPE !== "BRD"
                            ? true
                            : false,
                      },
                      INT_AMT: {
                        value: responseData?.[0]?.INT_AMT,
                      },
                      INT_RATE: {
                        value:
                          apiReqPara?.SECURITY_TYPE !== "BFD" &&
                          apiReqPara?.SECURITY_TYPE !== "BRD"
                            ? null
                            : responseData?.[0]?.INT_RATE,
                        ignoreUpdate: true,
                      },
                      PENAL_RATE: {
                        value: responseData?.[0]?.PENAL_RATE,
                        ignoreUpdate: true,
                      },
                      // PENAL_INT_RATE: {
                      //   value: Date.now(),
                      // },
                    };
                  }
                }
              } else if (!field?.value) {
                return {
                  FD_NO: { value: "" },
                  SECURITY_VALUE: { value: "" },
                  SEC_AMT: { value: "" },
                  SEC_INT_MARGIN: { value: "" },
                  SEC_INT_AMT: { value: "" },
                  EXPIRY_DT: { value: "" },
                  TRAN_DT: { value: "" },
                  INT_RATE: { value: "" },
                  INT_AMT: { value: "" },
                  PENAL_RATE: { value: "" },
                  LIMIT_AMOUNT: { value: "" },
                };
              }
            };

            item.runPostValidationHookAlways = true;
          } else if (item.name === "FD_NO") {
            item.isReadOnly = (fieldData, dependentFieldsValues) => {
              if (dependentFieldsValues?.FD_ACCT_CD?.value) {
                return false;
              } else {
                return true;
              }
            };
            item.dependentFields = [
              "FD_BRANCH_CD",
              "FD_ACCT_CD",
              "FD_TYPE",
              "SECURITY_CD",
              "LIMIT_AMOUNT",
              "TRAN_DT",
              "SANCTIONED_AMT",
              "PANEL_FLAG",
            ];
            item.postValidationSetCrossFieldValues = async (
              field,
              formState,
              authState,
              dependentValue
            ) => {
              if (field?.value && dependentValue?.FD_ACCT_CD?.value) {
                let ApiReq = {
                  FD_COMP_CD: authState?.companyID ?? "",
                  FD_BRANCH_CD: dependentValue?.FD_BRANCH_CD?.value ?? "",
                  FD_ACCT_TYPE: dependentValue?.FD_TYPE?.value ?? "",
                  FD_ACCT_CD: utilFunction.getPadAccountNumber(
                    dependentValue?.FD_ACCT_CD?.value,
                    dependentValue?.FD_TYPE?.optionData
                  ),
                  FD_NO: field?.value,
                  SECURITY_TYPE: apiReqPara.SECURITY_TYPE ?? "",
                  SECURITY_CD: dependentValue?.SECURITY_CD?.value.trim() ?? "",
                  LIMIT_AMOUNT: dependentValue?.SANCTIONED_AMT?.value ?? "",
                  GD_DATE: authState?.workingDate,
                  TRAN_DT: authState?.workingDate,
                  PANEL_FLAG: dependentValue?.PANEL_FLAG?.value ?? "",
                };

                let postData = await getFDdetailBFD(ApiReq);

                console.log("<<<postdata", postData);

                if (postData?.[0]?.RESTRICTION) {
                  let buttonName = await formState.MessageBox({
                    messageTitle: "Validation Failed...!",
                    message: postData?.[0]?.RESTRICTION,
                  });
                  if (buttonName === "Ok") {
                    return {
                      SECURITY_VALUE: {
                        value: "",
                      },
                      FD_NO: {
                        value: "",
                        isFieldFocused: true,
                      },
                      EXPIRY_DT: {
                        value: "",
                      },
                      INT_RATE: {
                        value: "",
                      },
                    };
                  }
                } else if (postData?.[0]?.MESSAGE1 || postData?.[0]?.MESSAGE2) {
                  let buttonName = await formState.MessageBox({
                    messageTitle: "Risk Category Alert",
                    message: postData?.[0]?.MESSAGE1,
                    buttonNames: ["Yes", "No"],
                    defFocusBtnName: "Yes",
                  });
                  if (buttonName === "Yes") {
                    return {
                      SECURITY_VALUE: {
                        value: postData?.[0]?.SECURITY_VALUE,
                      },
                      EXPIRY_DT: {
                        value: postData?.[0]?.EXPIRY_DT,
                      },
                      INT_RATE: {
                        value: postData?.[0]?.INT_RATE,
                      },
                      TRAN_DT: {
                        isFieldFocused: true,
                      },
                    };
                  } else {
                    return {
                      SECURITY_VALUE: {
                        value: "",
                      },
                      EXPIRY_DT: {
                        value: "",
                      },
                      INT_RATE: {
                        value: "",
                      },
                      FD_NO: {
                        value: "",
                        isFieldFocused: true,
                      },
                    };
                  }
                } else {
                  return {
                    SECURITY_VALUE: {
                      value: postData?.[0]?.SECURITY_VALUE,
                    },
                    EXPIRY_DT: {
                      value: postData?.[0]?.EXPIRY_DT,
                    },
                    INT_RATE: {
                      value: postData?.[0]?.INT_RATE,
                    },
                    TRAN_DT: {
                      isFieldFocused: true,
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
            };
            item.runPostValidationHookAlways = true;
          } else if (item.name === "ENTRY_DT") {
            item.isWorkingDate = true;
            item.required = true;
            item.schemaValidation = {
              type: "string",
              rules: [
                { name: "required", params: ["This Field is required."] },
              ],
            };
            // item.validate = (value) => {
            //   if (!Boolean(value?.value)) {
            //     return "This Field is required.";
            //   }
            //   return "";
            // };
          } else if (item.name === "TRAN_DT") {
            item.required = true;
            item.isWorkingDate = true;
            item.schemaValidation = {
              type: "string",
              rules: [
                { name: "required", params: ["This Field is required."] },
              ],
            };
            // item.validate = (value) => {
            //   if (Boolean(value?.value) && !isValid(value?.value)) {
            //     return "This Field is required.";
            //   }
            //   return "";
            // };
            item.postValidationSetCrossFieldValues = async (
              field,
              formState,
              authState
            ) => {
              if (new Date(field?.value) > new Date(authState.workingDate)) {
                let buttonName = await formState.MessageBox({
                  messageTitle: "Alert",
                  message: "AreYouSureToFutureLimit",
                  buttonNames: ["No", "Yes"],
                });
                if (buttonName === "Yes") {
                  return {
                    // EXPIRED_FLAG: { value: "P" },
                    EXPIRY_DT: { value: field?.value, isFieldFocused: true },
                  };
                } else if (buttonName === "No") {
                  return {
                    EXPIRY_DT: { value: "" },
                    TRAN_DT: { value: "", isFieldFocused: true },
                  };
                }
              } else {
                return {
                  EXPIRY_DT: {
                    value:
                      apiReqPara?.SECURITY_TYPE === "OTH" ||
                      apiReqPara?.SECURITY_TYPE === "PRT"
                        ? field?.value
                        : null,
                  },
                };
              }
            };
          } else if (item.name === "EXPIRY_DT") {
            item.required = true;
            item.defaultValue =
              apiReqPara?.SECURITY_TYPE === "OTH" ||
              apiReqPara?.SECURITY_TYPE === "PRT"
                ? apiReqPara?.WORKING_DATE
                : null;
            item.schemaValidation = {
              type: "string",
              rules: [
                { name: "required", params: ["This Field is required."] },
              ],
            };
            // item.validate = (value) => {
            //   if (Boolean(value?.value) && !isValid(value?.value)) {
            //     return "This Field is required.";
            //   }
            //   return "";
            // };
            item.dependentFields = ["FD_NO"];
            item.isReadOnly = (fieldData, dependentFieldsValues) => {
              if (fieldData?.value && dependentFieldsValues?.FD_NO?.value) {
                return true;
              } else if (
                apiReqPara?.SECURITY_TYPE === "OTH" ||
                apiReqPara?.SECURITY_TYPE === "PRT"
              ) {
                return true;
              } else {
                return false;
              }
            };
          } else if (item.name === "SECURITY_VALUE") {
            item.dependentFields = ["MARGIN", "SEC_INT_AMT"];
            item.postValidationSetCrossFieldValues = (
              field,
              formState,
              authState,
              dependentFields
            ) => {
              return {
                SEC_AMT: {
                  value: dependentFields?.MARGIN?.value
                    ? Number(field.value) -
                      (Number(field.value) *
                        Number(dependentFields?.MARGIN?.value)) /
                        100
                    : Number(field.value),
                  ignoreUpdate: true,
                },
              };
            };
          } else if (item.name === "MARGIN") {
            item.dependentFields = [
              "SECURITY_CD",
              "SECURITY_VALUE",
              "SEC_INT_AMT",
            ];
            item.setValueOnDependentFieldsChange = (dependentFields) => {
              return dependentFields?.SECURITY_CD?.optionData?.[0]
                ?.LIMIT_MARGIN;
            };

            item.postValidationSetCrossFieldValues = async (
              field,
              formState,
              authState,
              dependentFields
            ) => {
              return {
                SEC_AMT: {
                  value:
                    Number(dependentFields?.SECURITY_VALUE?.value) -
                    (Number(dependentFields?.SECURITY_VALUE?.value) *
                      Number(field?.value)) /
                      100,
                  ignoreUpdate: true,
                },
              };
            };
          } else if (item.name === "SEC_AMT") {
            item.dependentFields = ["SECURITY_VALUE", "SEC_INT_AMT"];
            item.postValidationSetCrossFieldValues = async (
              field,
              formState,
              authState,
              dependentFields
            ) => {
              if (
                Number(field.value) <=
                Number(dependentFields?.SECURITY_VALUE?.value)
              ) {
                return {
                  MARGIN: {
                    value:
                      100 -
                      (Number(field?.value) * 100) /
                        Number(dependentFields?.SECURITY_VALUE?.value),
                    ignoreUpdate: true,
                  },
                };
              }
            };
            item.validate = (currentField, dependentFields, formState) => {
              if (
                Number(currentField.value) >
                Number(dependentFields?.SECURITY_VALUE?.value)
              ) {
                return "Limit Amount can't be greater than Security value.";
              }
              return "";
            };
          } else if (item.name === "INT_AMT") {
            item.dependentFields = ["SEC_INT_MARGIN", "SEC_AMT"];
            item.postValidationSetCrossFieldValues = (
              field,
              formState,
              authState,
              dependentFields
            ) => {
              return {
                SEC_INT_AMT: {
                  value: dependentFields?.SEC_INT_MARGIN?.value
                    ? Number(field.value) -
                      (Number(field.value) *
                        Number(dependentFields?.SEC_INT_MARGIN?.value)) /
                        100
                    : Number(field.value),
                  ignoreUpdate: true,
                },
              };
            };
          } else if (item.name === "SEC_INT_MARGIN") {
            item.dependentFields = ["SECURITY_CD", "INT_AMT", "SEC_AMT"];
            item.postValidationSetCrossFieldValues = async (
              field,
              formState,
              authState,
              dependentFields
            ) => {
              return {
                SEC_INT_AMT: {
                  value:
                    Number(dependentFields?.INT_AMT?.value) -
                    (Number(dependentFields?.INT_AMT?.value) *
                      Number(field?.value)) /
                      100,
                  ignoreUpdate: true,
                },
              };
            };
          } else if (item.name === "SEC_INT_AMT") {
            item.dependentFields = ["INT_AMT", "SEC_AMT"];
            item.postValidationSetCrossFieldValues = async (
              field,
              formState,
              authState,
              dependentFields
            ) => {
              if (
                Number(field.value) <= Number(dependentFields?.INT_AMT?.value)
              ) {
                return {
                  SEC_INT_MARGIN: {
                    value:
                      100 -
                      (Number(field?.value) * 100) /
                        Number(dependentFields?.INT_AMT?.value),
                    ignoreUpdate: true,
                  },
                };
              }
            };
            item.validate = (currentField, dependentFields, formState) => {
              if (
                Number(currentField.value) >
                Number(dependentFields?.INT_AMT?.value)
              ) {
                return "Sec. Int Amount can't be greater than Intrest Amount.";
              }
              return "";
            };
          } else if (item.name === "LIMIT_AMOUNT") {
            item.setValueOnDependentFieldsChange = (dependentFields) => {
              let secAmt = Number(dependentFields?.SEC_AMT?.value) ?? 0;
              let secIntAmt = Number(dependentFields?.SEC_INT_AMT?.value) ?? 0;
              return secAmt + secIntAmt;
            };
            item.validationRun = "onChange";
            item.dependentFields = [
              "SEC_AMT",
              "SEC_INT_AMT",
              "BRANCH_CD",
              "ACCT_TYPE",
              "ACCT_CD",
              "PANEL_FLAG",
              "SECURITY_CD",
              "PENAL_INT_RATE",
            ];
            item.postValidationSetCrossFieldValues = async (
              field,
              formState,
              authState,
              dependentFields
            ) => {
              if (
                typeof field?.value === "string" &&
                dependentFields?.PENAL_INT_RATE?.value === "Y" &&
                dependentFields?.ACCT_CD?.value &&
                dependentFields?.SECURITY_CD?.value &&
                dependentFields?.PANEL_FLAG?.value
              ) {
                let ApiReq = {
                  BRANCH_CD: dependentFields?.BRANCH_CD?.value,
                  ACCT_TYPE: dependentFields?.ACCT_TYPE?.value,
                  ACCT_CD: dependentFields?.ACCT_CD?.value,
                  PANEL_FLAG: dependentFields?.PANEL_FLAG?.value,
                  SECURITY_CD: dependentFields?.SECURITY_CD?.value,
                  SECURITY_TYPE: apiReqPara?.SECURITY_TYPE,
                  LIMIT_AMOUNT: field?.value,
                  SCREEN_REF: "ETRN/047",
                };

                let postData = await limitRate(ApiReq);

                if (postData?.length) {
                  return {
                    PENAL_RATE: { value: postData?.[0]?.PENAL_RATE ?? "" },
                    INT_RATE: {
                      value:
                        apiReqPara?.SECURITY_TYPE !== "BFD" &&
                        apiReqPara?.SECURITY_TYPE !== "BRD"
                          ? postData?.[0]?.INT_RATE ?? ""
                          : "",
                    },
                  };
                }
              }
            };
          } else if (item.name === "CHARGE_AMT") {
            item.dependentFields = ["SECURITY_CD"];
            item.setValueOnDependentFieldsChange = () => {
              return apiReqPara?.HDN_CHARGE_AMT;
            };
            item.postValidationSetCrossFieldValues = (field) => {
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
                          100,
                  },
                };
              }
              return {};
            };
          } else if (item.name === "SERVICE_TAX") {
            item.dependentFields = ["SECURITY_CD"];
            item.setValueOnDependentFieldsChange = () => {
              return apiReqPara?.HDN_GST_AMT;
            };
          } else if (item.name === "REMARKS") {
            item.maxLength = 100;
            item.validate = (columnValue) => {
              let regex = /^[^!&]*$/;
              if (!regex.test(columnValue.value)) {
                return "Special Characters not Allowed in Reamrks.";
              }
              return "";
            };
          } else if (item.name === "SECURITY") {
            item.maxLength = 22;
            item.validate = (columnValue) => {
              let regex = /^[^!&]*$/;
              if (!regex.test(columnValue.value)) {
                return "Special Characters not Allowed in Description.";
              }
              return "";
            };
          } else if (item.name === "DOCKET_NO") {
            item.maxLength = 16;
            item.validate = (columnValue) => {
              let regex = /^[^!&]*$/;
              if (!regex.test(columnValue.value)) {
                return "Special Characters not Allowed in Docket No.";
              }
              return "";
            };
          } else if (item.name === "RESOLUTION_NO") {
            item.maxLength = 16;
            item.validate = (columnValue) => {
              let regex = /^[^!&]*$/;
              if (!regex.test(columnValue.value)) {
                return "Special Characters not Allowed in Resolution No.";
              }
              return "";
            };
          } else if (item.name === "INT_RATE") {
            item.required = true;
            item.validate = (columnValue) => {
              if (Number(columnValue.value) <= 0) {
                return "Interest rate should  be greater than zero.";
              }
              return "";
            };
          }
          return item;
        })
      );
    }
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

export const getFDTypeDDlist = async (apiReqPara) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLIMITFDTYPEDDW", {
      COMP_CD: apiReqPara.COMP_CD,
      BRANCH_CD: apiReqPara.BRANCH_CD,
      SECURITY_TYPE: apiReqPara.SECURITY_TYPE,
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
    const dataStatus = data;
    dataStatus.map((item) => {
      item.COLLATERAL_RATE = parseFloat(item.COLLATERAL_RATE).toFixed(2);
      return item;
    });
    return dataStatus;
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
    const dataStatus = data;
    dataStatus.map((item) => {
      item.RATE = parseFloat(item.RATE).toFixed(2);
      return item;
    });
    return dataStatus;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getLimitDTL = async (limitDetail) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLIMITGRIDDATADISP", {
      ...limitDetail,
    });
  if (status === "0") {
    const dataStatus = data;
    dataStatus.map((item) => {
      if (item?.ALLOW_FORCE_EXP === "Y") {
        item._rowColor = "rgb(255, 225, 225)";
      }
      item.CONFIRMED_DISPLAY =
        item?.CONFIRMED === "Y" ? "Confirmed" : "Pending";
      item.MARGIN = item.MARGIN ? parseFloat(item.MARGIN).toFixed(2) : 0;
      item.INT_RATE = item.INT_RATE ? parseFloat(item.INT_RATE).toFixed(2) : 0;
      item.SECURITY_VALUE = item.SECURITY_VALUE
        ? parseFloat(item.SECURITY_VALUE).toFixed(2)
        : 0;
      return item;
    });
    return dataStatus;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const crudLimitEntryData = async (apiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DOLIMITENTRYDML", {
      ...apiReq,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const validateInsert = async (apiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLIMITDATAVALIDATE", {
      ...apiReq,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const validateDelete = async (apiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("VALIDDELETELIMITDATA", {
      // ...apiReq,
      ENTERED_DATE: apiReq.ENTERED_DATE,
      TRAN_CD: apiReq.TRAN_CD,
      EXPIRED_FLAG: apiReq.EXPIRED_FLAG,
      BRANCH_CD: apiReq.BRANCH_CD,
      ACCT_TYPE: apiReq.ACCT_TYPE,
      ACCT_CD: apiReq.ACCT_CD,
      FD_TYPE: apiReq.FD_TYPE,
      FD_ACCT_CD: apiReq.FD_ACCT_CD,
      FD_NO: apiReq.FD_NO,
      FD_COMP_CD: apiReq.FD_COMP_CD,
      FD_BRANCH_CD: apiReq.FD_BRANCH_CD,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const limitRate = async (apiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLIMITRATE", {
      ...apiReq,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const limitConfirm = async (apireq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DOLIMITCONFRIMATION", { ...apireq });

  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

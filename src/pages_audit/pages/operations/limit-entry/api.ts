import { DefaultErrorObject } from "components/utils";
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
    await AuthSDK.internalFetcher("GETLIMITACTNMBALDISP", {
      ...apiReqPara,
      // TRAN_CD: "1",
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
            if (item.name === "FD_TYPE") {
              return {
                ...item,
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
                options: await getFDbranchDDlist(apiReqPara.COMP_CD),
                validate: (currentField, value) => {
                  if (currentField?.value) {
                    return;
                  }
                },
              };
            } else if (item.name === "FD_ACCT_CD") {
              return {
                ...item,
                validate: (currentField, value) => {
                  if (currentField?.value) {
                    return;
                  }
                },
                dependentFields: [
                  "FD_TYPE",
                  "SECURITY_CD",
                  "FD_BRANCH_CD",
                  "SECURITY_TYPE",
                ],
                postValidationSetCrossFieldValues: async (
                  field,
                  formState,
                  authState,
                  dependentValue
                ) => {
                  if (field?.value) {
                    let ApiReq = {
                      // COMP_CD: authState?.companyID,
                      // BRANCH_CD: dependentValue?.FD_BRANCH_CD?.value ?? "",
                      // ACCT_TYPE: dependentValue?.FD_TYPE?.value ?? "",
                      // ACCT_CD: field?.value ?? "",
                      // // FD_NO: data.FD_NO,
                      // SECURITY_TYPE: dependentValue?.SECURITY_TYPE?.value ?? "",
                      // SECURITY_CD: dependentValue?.SECURITY_CD?.value ?? "",
                      // DATE: format(new Date(), "dd-MMM-yyyy"),
                      // SCREEN_REF: "ETRN/046",
                      // PANEL_FLAG: "Y",

                      // ACCT_TYPE: "0002",
                      // ACCT_CD: "000009",
                      // SECURITY_CD: "12",
                      ACCT_TYPE: "305 ",
                      ACCT_CD: "000648              ",
                      // FD_NO: "7694",
                      SECURITY_CD: "19",
                      BRANCH_CD: "099 ",
                      COMP_CD: "132 ",
                      SECURITY_TYPE: "BRD",
                      DATE: "15-DEC-2023",
                      SCREEN_REF: "ETRN/046",
                      PANEL_FLAG: "Y",
                    };
                    //
                    let postData = await getFDdetailBRD(ApiReq);

                    const result = ["MESSAGE1", "RESTRICTION"]
                      .map((key) => postData[0][key])
                      .filter((message) => message !== "")
                      .join(", ");

                    if (result) {
                      formState.setDataOnFieldChange("MESSAGES", result);
                      return {};
                    } else {
                      return {
                        SECURITY_VALUE: {
                          value: postData?.[0]?.SECURITY_VALUE,
                        },
                        EXPIRY_DT: {
                          value: postData?.[0]?.EXPIRY_DT,
                        },
                      };
                    }
                  }
                },
                runPostValidationHookAlways: true,
              };
            } else if (item.name === "FD_NO") {
              return {
                ...item,
                dependentFields: [
                  "FD_BRANCH_CD",
                  "FD_ACCT_CD",
                  "FD_TYPE",
                  "SECURITY_TYPE",
                  "SECURITY_CD",
                  "LIMIT_AMOUNT",
                  "TRAN_DT",
                ],
                postValidationSetCrossFieldValues: async (
                  field,
                  formState,
                  authState,
                  dependentValue
                ) => {
                  if (field?.value) {
                    let ApiReq = {
                      // COMP_CD: authState?.companyID ?? "",
                      // BRANCH_CD: dependentValue?.FD_BRANCH_CD?.value ?? "",
                      // ACCT_TYPE: dependentValue?.FD_TYPE?.value ?? "",
                      // ACCT_CD: dependentValue?.FD_ACCT_CD?.value ?? "",
                      // FD_NO: field?.value ?? "",
                      // SECURITY_TYPE: dependentValue?.SECURITY_TYPE?.value ?? "",
                      // SECURITY_CD:  dependentValue?.SECURITY_CD?.value ?? "",
                      // LIMIT_AMOUNT: dependentValue?.LIMIT_AMOUNT?.value ?? "",
                      // GD_DATE: format(new Date(), "dd-MMM-yyyy"),
                      // TRAN_DT: dependentValue?.TRAN_DT?.value ?? "",

                      COMP_CD: authState?.companyID,
                      BRANCH_CD: "099 ",
                      ACCT_TYPE: "0005",
                      ACCT_CD: "000048   ",
                      FD_NO: "1000001033",
                      SECURITY_TYPE: "BFD",
                      SECURITY_CD: "12",
                      LIMIT_AMOUNT: "9999999999",
                      GD_DATE: "19-DEC-2023",
                      TRAN_DT: "19-DEC-2023",
                    };

                    let postData = await getFDdetailBFD(ApiReq);

                    const result = ["MESSAGE1", "RESTRICTION"]
                      .map((key) => postData[0][key])
                      .filter((message) => message !== "")
                      .join(", ");
                    if (result) {
                      formState.setDataOnFieldChange("MESSAGES", result);
                      return {};
                    }
                  }
                },
                runPostValidationHookAlways: true,
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
      // COMP_CD: "132 ",
      // BRANCH_CD: "099 ",
      // ACCT_TYPE: "202 ",
      // ACCT_CD: "000001   ",
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
      // COMP_CD: "132 ",
      // BRANCH_CD: "099 ",
      // ACCT_TYPE: "1100",
      // ACCT_CD: "000004",
      // LOGIN_COMP_CD: "132 ",
      // FLAG: "C",
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
export const saveLimitEntryData = async (apiReq) => {
  console.log("<<<apiReq", apiReq);
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DOLIMITENTRYDML", {
      ...apiReq,
      // _isNewRow: true,
      // COMP_CD: "132 ",
      // BRANCH_CD: "099 ",
      // ACCT_TYPE: "003 ",
      // ACCT_CD: "124004              ",
      // TRAN_DT: "20-OCT-2023",
      // EXPIRY_DT: "20-OCT-2023",
      // SECURITY: "4",
      // SECURITY_VALUE: "48728",
      // LIMIT_AMOUNT: "1000000",
      // DRAWING_POWER: "38900",
      // REMARKS: "",
      // INT_RATE: "17",
      // FD_TYPE: "241 ",
      // FD_ACCT_CD: "000002              ",
      // FD_NO: "12",
      // PENAL_RATE: "10",
      // ENTERED_COMP_CD: "132 ",
      // ENTERED_BRANCH_CD: "099 ",
      // FD_COMP_CD: "132 ",
      // FD_BRANCH_CD: "099 ",
      // SECURITY_CD: "1717",
      // ENTRY_DT: "11-OCT-2023",
      // DOCKET_NO: "PO001",
      // SEC_INT_AMT: "99",
      // SEC_INT_MARGIN: "5455",
      // INT_AMT: "265",
      // SEC_AMT: "555",
      // MARGIN: "22",
      // RESOLUTION_NO: "52652",
      // RESOLUTION_DATE: "11-OCT-2023",
      // CHARGE_AMT: "4654",
      // UPD_FLAG: "Y",
      // EXPIRED_FLAG: "A",
      // AD_HOC_LIMIT_FLG: "N",
      // SHORT_LMT_FLAG: "N",
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

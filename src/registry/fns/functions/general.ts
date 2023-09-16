import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "../auth";
import { format } from "date-fns";
import { isValidDate } from "components/utils/utilFunctions/function";
import { useEffect } from "react";

const GeneralAPISDK = () => {
  const GetMiscValue = async (ReqData) => {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher(
        "GETMISCVALUE",
        {
          CATEGORY_CD: ReqData,
          DISPLAY_LANGUAGE: "en",
          ACTION: "",
        },
        {
          UNIQUE_REQ_ID: "32627636893400",
          APITOKEN: "MzI2Mjc2MzY4OTM0MDA=",
        }
      );
    if (status === "0") {
      return data;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  };
  const getValidateValue = async (fieldData) => {
    if (
      //fieldData.value === "X" || --if any issue doing validation uncomment and check
      fieldData.value === "" ||
      fieldData.value === "0" ||
      fieldData.value === false ||
      fieldData.value === null ||
      fieldData.value === "00" ||
      (Array.isArray(fieldData.value) && fieldData.value.length <= 0)
    ) {
      return "This field is required";
    } else {
      return "";
    }
  };
  const getTranslateDataFromGoole = async (data, fromLang, toLang) => {
    try {
      let response = await fetch(
        "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" +
          fromLang +
          "&tl=" +
          toLang +
          "&dt=t&q=" +
          data
      );
      if (String(response.status) === "200") {
        let resData: any = await response.json();
        if (Array.isArray(resData)) {
          return resData?.[0]?.[0]?.[0] ?? "";
        } else {
          return "";
        }
      } else {
        return "";
      }
    } catch (error) {
      console.log(error);
      return "";
    }
  };
  const setDocumentName = (text) => {
    let titleText = document.title;
    document.title = titleText.split(" - ")[0] + " - " + text;
  };
  const getCustType = () => {
    console.log("changed...");
  };
  const getAccountTypeList = async (...reqData) => {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETUSERACCTTYPE", {
        USER_NAME: reqData?.[3]?.user.id ?? "",
      });
    if (status === "0") {
      let responseData = data;
      if (Array.isArray(responseData)) {
        responseData = responseData.map(({ ACCT_TYPE, TYPE_NM, ...others }) => {
          return {
            ...others,
            value: ACCT_TYPE,
            label: ACCT_TYPE + " - " + TYPE_NM,
          };
        });
      }
      return responseData;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  };
  const getCustomerIdValidate = async (currentField, formState, authState) => {
    // if (currentField?.value) {
    const { status, data, message, messageDetails } =
      await AuthSDK.internalFetcher("GETCUSTIDVAL", {
        COMP_CD: authState?.companyID ?? "",
        CUSTOMER_ID: currentField?.value ?? "",
      });
    if (status === "0") {
      return {
        ACCT_NM: { value: data?.[0]?.ACCT_NM },
        CONSTITUTION_TYPE: { value: data?.[0]?.CONSTITUTION_TYPE },
        CONTACT2: { value: data?.[0]?.CONTACT2 },
        CUSTOMER_TYPE: { value: data?.[0]?.CUSTOMER_TYPE },
        PAN_NO: { value: data?.[0]?.PAN_NO },
        UNIQUE_ID: { value: data?.[0]?.UNIQUE_ID },
      };
    } else {
      return {
        ACCT_NM: { value: "" },
        CONSTITUTION_TYPE: { value: "" },
        CONTACT2: { value: "" },
        CUSTOMER_TYPE: { value: "" },
        PAN_NO: { value: "" },
        UNIQUE_ID: { value: "" },
      };
    }
  };
  const retrieveStatementDtlFullAcctNo = async (
    currentField,
    formState,
    authState,
    dependentFieldValue
  ) => {
    return retrieveStatementDetails(
      currentField,
      formState,
      authState,
      dependentFieldValue,
      "FULL_ACCT_NO"
    );
  };
  const retrieveStatementDtlAcctCd = async (
    currentField,
    formState,
    authState,
    dependentFieldValue
  ) => {
    return retrieveStatementDetails(
      currentField,
      formState,
      authState,
      dependentFieldValue,
      "ACCT_CD"
    );
  };
  const retrieveStatementDetails = async (
    currentField,
    formState,
    authState,
    dependentFieldValue,
    reqFlag
  ) => {
    let paddedAcctcode = (currentField?.value).padStart(
      dependentFieldValue?.ACCT_TYPE?.optionData?.[0]?.PADDING_NUMBER,
      0
    );
    if (currentField?.value) {
      const { status, data } = await AuthSDK.internalFetcher("GETACCTDATA", {
        COMP_CD: authState?.companyID,
        BRANCH_CD:
          reqFlag === "ACCT_CD" ? dependentFieldValue?.BRANCH_CD?.value : "",
        ACCT_TYPE:
          reqFlag === "ACCT_CD" ? dependentFieldValue?.ACCT_TYPE?.value : "",
        ACCT_CD: reqFlag === "ACCT_CD" ? currentField?.value : "",
        FULL_ACCT_NO: reqFlag === "ACCT_CD" ? "" : currentField?.value,
      });

      if (status === "0") {
        if (data?.length > 0) {
          const { LST_STATEMENT_DT } = data[0];
          const originalDate: any = new Date(LST_STATEMENT_DT);

          return {
            ACCT_NM: {
              value: data?.[0]?.ACCT_NM,
            },
            STMT_FROM_DATE: {
              value: format(
                isValidDate(LST_STATEMENT_DT)
                  ? originalDate.setDate(originalDate.getDate() + 1)
                  : new Date(),
                "dd/MMM/yyyy"
              ),
            },
            WK_STMT_TO_DATE: {
              value: isValidDate(new Date()) ? new Date() : new Date(),
            },
            // ACCT_CD: {
            //   value: paddedAcctcode,
            // },
          };
        } else {
          return {
            ACCT_NM: { value: "" },
            STMT_FROM_DATE: { value: "" },
            WK_STMT_TO_DATE: { value: "" },
            // ACCT_CD: {
            //   value: "",
            // },
          };
        }
      }
    } else {
      return {
        ACCT_NM: { value: "" },
        STMT_FROM_DATE: { value: "" },
        WK_STMT_TO_DATE: { value: "" },
        // ACCT_CD: {
        //   value: "",
        // },
      };
    }
  };
  const getBranchCodeList = async (...reqData) => {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETBRACCESSLST", {
        USER_NAME: reqData?.[3]?.user.id ?? "",
      });
    if (status === "0") {
      let responseData = data;
      if (Array.isArray(responseData)) {
        responseData = responseData.map(({ BRANCH_CD, BRANCH_NM }) => {
          return {
            value: BRANCH_CD,
            label: BRANCH_CD + " - " + BRANCH_NM,
          };
        });
      }
      return responseData;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  };
  const getReportAccountType = async (...reqData) => {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETACCTTYPELST", {
        COMP_CD: reqData?.[3]?.companyID ?? "",
      });
    if (status === "0") {
      let responseData = data;
      if (Array.isArray(responseData)) {
        responseData = responseData.map(({ ACCT_TYPE, TYPE_NM }) => {
          return {
            value: ACCT_TYPE,
            label: ACCT_TYPE + " - " + TYPE_NM,
          };
        });
      }
      return responseData;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  };
  const getTbgDocMstData = async (...reqData) => {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETTBGDOCMSTDATA", {
        COMP_CD: reqData?.[3]?.companyID ?? "",
      });
    if (status === "0") {
      let responseData = data;
      if (Array.isArray(responseData)) {
        responseData = responseData.map(
          ({ DOC_TITLE, DOC_CD, USER_DEFINE_CD }) => {
            return {
              value: DOC_CD,
              label: DOC_TITLE + " - " + USER_DEFINE_CD,
            };
          }
        );
      }
      return responseData;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  };
  const convertArraytoObject = (array, keyname, valuename) => {
    if (array && Array.isArray(array)) {
      return array.reduce((acuu, item) => {
        return { ...acuu, [item[keyname]]: item[valuename] };
      }, {});
    } else {
      return {};
    }
  };
  const getActionDetailsData = async (currentField, formState, authState) => {
    if (currentField?.value) {
      const { status, data, message, messageDetails } =
        await AuthSDK.internalFetcher("GETCOLMISCDATA", {
          CATEGORY_CD: currentField?.value ?? "",
        });

      if (status === "0") {
        let resData = convertArraytoObject(data, "DISPLAY_VALUE", "DATA_VALUE");

        return {
          ACTIONLABEL: { value: resData?.ACTIONLABEL },
          ACTIONICON: { value: resData?.ACTIONICON },
          ROWDOUBLECLICK: {
            value: resData?.ROWDOUBLECLICK === "Y" ? true : false,
          },
          ALWAYSAVAILABLE: {
            value: resData?.ALWAYSAVAILABLE === "Y" ? true : false,
          },
          MULTIPLE: { value: resData?.MULTIPLE === "Y" ? true : false },
          SHOULDEXCLUDE: { value: resData?.SHOULDEXCLUDE },
          ON_ENTER_SUBMIT: { value: resData?.ONENTERSUBMIT },
          STARTSICON: { value: resData?.STARTSICON },
          ENDSICON: { value: resData?.ENDSICON },
          ROTATEICON: { value: resData?.ROTATEICON },
          ISNODATATHENSHOW: {
            value: resData?.ISNODATATHENSHOW === "Y" ? true : false,
          },
          TOOLTIP: { value: resData?.TOOLTIP },
        };
      } else {
        return {
          ACTIONLABEL: { value: "" },
          ACTIONICON: { value: "" },
          ROWDOUBLECLICK: { value: "" },
          ALWAYSAVAILABLE: { value: "" },
          MULTIPLE: { value: "" },
          SHOULDEXCLUDE: { value: "" },
          ON_ENTERSUBMIT: { value: "" },
          STARTSICON: { value: "" },
          ENDSICON: { value: "" },
          ROTATEICON: { value: "" },
          ISNODATATHENSHOW: { value: "" },
          TOOLTIP: { value: "" },
        };
      }
    }
  };
  const getquickViewList = async (...reqData) => {
    const { status, data, message, messageDetails } =
      await AuthSDK.internalFetcher("GETUSRDOCLIST", {
        USER_NAME: reqData?.[1]?.user?.id,
        COMP_CD: reqData?.[1]?.companyID,
      });
    if (status === "0") {
      let responseData = data;
      if (Array.isArray(responseData)) {
        responseData = responseData.map(
          ({ DOC_CD, DOC_NM, ...other }, index) => {
            return {
              value: DOC_CD,
              label: `${index + 1}${"."}  ${DOC_NM}`,
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
  const getMetadataList = async (...reqData) => {
    const { status, data, message, messageDetails } =
      await AuthSDK.internalFetcher("GETTBGFROMCONFIGLIST", {
        BRANCH_CD: reqData?.[3]?.user?.branchCode,
        COMP_CD: reqData?.[3]?.companyID,
        DOC_CD: reqData?.[4] ?? "",
      });
    if (status === "0") {
      let responseData = data;
      if (Array.isArray(responseData)) {
        responseData = responseData.map(({ DESCRIPTION, SR_CD }) => {
          return {
            value: SR_CD,
            label: DESCRIPTION,
          };
        });
      }
      return responseData;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  };

  const getKYCDocTypes = async (dependantFields, ...other) => {
    if (dependantFields.SR_CD.value && dependantFields.TRAN_CD.value) {
      const { status, data, message, messageDetails } =
        await AuthSDK.internalFetcher("DOCCUMENTSCANHISTORY", {
          SR_CD: dependantFields.SR_CD?.value || "189084",
          TRAN_CD: dependantFields.TRAN_CD?.value,
          DOC_TYPE: "KYC",
        });
      if (status === "0") {
        let responseData = data;
        // if (Array.isArray(responseData)) {
        //   responseData = responseData.map(({ DOC_TITLE, USER_DEFINE_CD }) => {
        //     return {
        //       value: USER_DEFINE_CD,
        //       label: DOC_TITLE + " - " + USER_DEFINE_CD,
        //     };
        //   });
        // }

        return responseData;
      } else {
        throw DefaultErrorObject(message, messageDetails);
      }
    }
    // return []
  };

  const getChequeLeavesList = async (...reqData) => {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETCHQLEAVESLIST", {
        COMP_CD: reqData?.[3]?.companyID ?? "",
      });
    if (status === "0") {
      let responseData = data;
      if (Array.isArray(responseData)) {
        responseData = responseData.map(({ NO_OF_LEAF, TRAN_CD }) => {
          return {
            value: NO_OF_LEAF,
            label: NO_OF_LEAF,
          };
        });
      }
      return responseData;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  };

  return {
    GetMiscValue,
    getValidateValue,
    getTranslateDataFromGoole,
    setDocumentName,
    getCustType,
    getAccountTypeList,
    getCustomerIdValidate,
    retrieveStatementDtlFullAcctNo,
    retrieveStatementDtlAcctCd,
    retrieveStatementDetails,
    getBranchCodeList,
    getReportAccountType,
    getTbgDocMstData,
    getActionDetailsData,
    getquickViewList,
    getMetadataList,
    getKYCDocTypes,
    getChequeLeavesList,
  };
};

export const GeneralAPI = GeneralAPISDK();

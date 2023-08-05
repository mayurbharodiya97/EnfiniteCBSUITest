import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "../auth";
import { format } from "date-fns";
import { isValidDate } from "components/utils/utilFunctions/function";

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

  const retrieveStatementDetails = async (
    currentField,
    formState,
    authState,
    dependentFieldValue
  ) => {
    if (currentField?.value) {
      const { status, data } = await AuthSDK.internalFetcher("GETACCTDATA", {
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: dependentFieldValue?.BRANCH_CD?.value ?? "",
        ACCT_TYPE: dependentFieldValue?.ACCT_TYPE?.value ?? "",
        ACCT_CD: currentField?.value ?? "",
      });
      if (status === "0") {
        if (data?.length > 0) {
          //..//
          //..//

          const { LST_STATEMENT_DT } = data[0];
          const inputDate = new Date(LST_STATEMENT_DT);
          const nextDate = new Date(inputDate);
          let NEwdate = nextDate.setDate(nextDate.getDate() + 1);
          // Make sure to adjust the timezone offset to match your desired output
          const timezoneOffset = nextDate.getTimezoneOffset() * 60000; // Convert to milliseconds
          let FROM_DATE = new Date(NEwdate - timezoneOffset)
            .toISOString()
            .slice(0, 23);

          return {
            ACCT_NM: {
              value: data?.[0]?.ACCT_NM,
            },
            STMT_FROM_DATE: {
              value: isValidDate(FROM_DATE)
                ? FROM_DATE ?? new Date()
                : new Date(),
            },
            WK_STMT_TO_DATE: {
              value: new Date(),
            },
          };
        } else {
          return {
            ACCT_NM: { value: "" },
            STMT_FROM_DATE: { value: "" },
            WK_STMT_TO_DATE: { value: "" },
          };
        }
      }
    } else {
      return {
        ACCT_NM: { value: "" },
        STMT_FROM_DATE: { value: "" },
        WK_STMT_TO_DATE: { value: "" },
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
        responseData = responseData.map(({ DOC_TITLE, USER_DEFINE_CD }) => {
          return {
            value: USER_DEFINE_CD,
            label: DOC_TITLE + " - " + USER_DEFINE_CD,
          };
        });
      }
      return responseData;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  };
  const getActionDetailsData = async (currentField, formState, authState) => {
    if (currentField?.value) {
      const { status, data, message, messageDetails } =
        await AuthSDK.internalFetcher("GETCOLMISCDATA", {
          CATEGORY_CD: currentField?.value ?? "",
        });
      console.log("currentField", currentField);
      if (status === "0") {
        return {
          ACTION_NAME: { value: data?.[0]?.ACTION_NAME },
          ACTION_LABEL: { value: data?.[0]?.ACTION_LABEL },
          ACTION_ICON: { value: data?.[0]?.ACTION_ICON },
          ROW_DOUBLE_CLICK: { value: data?.[0]?.ROW_DOUBLE_CLICK },
          ALWAYS_AVALIBALE: { value: data?.[0]?.ALWAYS_AVALIBALE },
          MULTIPLE: { value: data?.[0]?.MULTIPLE },
          SHOULD_EXCLUDE: { value: data?.[0]?.SHOULD_EXCLUDE },
          ON_ENTER_SUBMIT: { value: data?.[0]?.ON_ENTER_SUBMIT },
          START_ICON: { value: data?.[0]?.START_ICON },
          END_ICON: { value: data?.[0]?.END_ICON },
          ROTATE_ICON: { value: data?.[0]?.ROTATE_ICON },
          IS_NO_DATA_THEN_SHOW: { value: data?.[0]?.IS_NO_DATA_THEN_SHOW },
          TOOLTIP: { value: data?.[0]?.TOOLTIP },
        };
      } else {
        return {
          ACTION_NAME: { value: "" },
          ACTION_LABEL: { value: "" },
          ACTION_ICON: { value: "" },
          ROW_DOUBLE_CLICK: { value: "" },
          ALWAYS_AVALIBALE: { value: "" },
          MULTIPLE: { value: "" },
          SHOULD_EXCLUDE: { value: "" },
          ON_ENTER_SUBMIT: { value: "" },
          START_ICON: { value: "" },
          END_ICON: { value: "" },
          ROTATE_ICON: { value: "" },
          IS_NO_DATA_THEN_SHOW: { value: "" },
          TOOLTIP: { value: "" },
        };
      }
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
    retrieveStatementDetails,
    getBranchCodeList,
    getReportAccountType,
    getTbgDocMstData,
    getActionDetailsData,
  };
};

export const GeneralAPI = GeneralAPISDK();

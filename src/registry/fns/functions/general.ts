import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "../auth";

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
            label: TYPE_NM,
          };
        });
      }
      return responseData;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  };

  const getCustomerIdValidate = async (authState) => {
    // if (currentField?.value) {
    const { status, data, message, messageDetails } =
      await AuthSDK.internalFetcher("GETCUSTIDVAL", {
        COMP_CD: authState?.companyID ?? "",
        CUSTOMER_ID: "1234",
      });
    if (status === "0") {
      console.log(">>data", data);
      return data;
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
  };
};

export const GeneralAPI = GeneralAPISDK();

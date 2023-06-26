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

  const getAcctDetails = async (currentField, dependentFields, __) => {
    console.log(
      ">>Working",
      dependentFields?.[0]?.value,
      dependentFields?.[1]?.value,
      currentField?.value
    );
    if (currentField?.value) {
      const { status, data } = await AuthSDK.internalFetcher("GETACCTVIEWMKR", {
        COMP_CD: "473 ",
        BRANCH_CD: dependentFields?.[0]?.value,
        ACCT_TYPE: dependentFields?.[1]?.value,
        ACCT_CD: currentField?.value,
      });
      if (status === "0") {
        console.log(">>data", data);
        return {
          ACCT_NM: { value: data?.[0]?.ACCT_NM },
          ACCT_MODE: { value: data?.[0]?.ACCT_MODE },
          CONTACT: { value: data?.[0]?.CONTACT },
          WITHDRAW_BAL: { value: data?.[0]?.WITHDRAW_BAL },
          CUSTOMER_ID: { value: data?.[0]?.CUSTOMER_ID },
          PAN_NO: { value: data?.[0]?.PAN_NO },
          UNIQUE_ID: { value: data?.[0]?.UNIQUE_ID },
          SCR_ADD: { value: data?.[0]?.SCR_ADD },
        };
      } else {
        return {
          ACCT_NM: { value: "" },
          ACCT_MODE: { value: "" },
          CONTACT: { value: "" },
          WITHDRAW_BAL: { value: "" },
          CUSTOMER_ID: { value: "" },
          PAN_NO: { value: "" },
          UNIQUE_ID: { value: "" },
          SCR_ADD: { value: "" },
        };
      }
    }
  };

  return {
    GetMiscValue,
    getValidateValue,
    getTranslateDataFromGoole,
    setDocumentName,
    getAcctDetails,
  };
};

export const GeneralAPI = GeneralAPISDK();

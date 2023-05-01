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
  const GetChargeTemplates = async () => {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher(
        "GETCHARGETEMPLATELIST",
        {},
        {
          UNIQUE_REQ_ID: "32627636893400",
          APITOKEN: "MzI2Mjc2MzY4OTM0MDA=",
        }
      );
    if (status === "0") {
      let responseData = data;
      if (Array.isArray(responseData)) {
        responseData = responseData.map(({ VALUE, LABEL, ...other }) => {
          //let { VALUE, LABEL, ...other } = one;
          return {
            value: VALUE,
            label: LABEL,
            ...other,
          };
        });
      }
      return responseData;
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
  const putOpenWindowName = async (item) => {
    //console.log(item);
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
  const GetDistrictList = async () => {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher(
        "GETDISTRICTLIST",
        {},
        {
          UNIQUE_REQ_ID: "32627636893400",
          APITOKEN: "MzI2Mjc2MzY4OTM0MDA=",
        }
      );
    if (status === "0") {
      let responseData = data;
      if (Array.isArray(responseData)) {
        responseData = responseData.map(({ NEW_DIST_CD, DIST_NM }) => {
          return {
            value: NEW_DIST_CD,
            label: DIST_NM,
          };
        });
      }
      return responseData;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  };
  const setDocumentName = (text) => {
    let titleText = document.title;
    document.title = titleText.split(" - ")[0] + " - " + text;
  };
  const GetSecurityGroupingList = async () => {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETSECURITYGROUPINGLIST", {});
    if (status === "0") {
      return data.map((item) => {
        return { label: item?.GROUP_NAME, value: item?.GROUP_NAME };
      });
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  };
  const GetUsersNotificationTemplateList = async () => {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETUSERSNOTIFTEMPLIST", {});
    if (status === "0") {
      return data.map((item) => {
        return {
          label: item?.DESCRIPTION,
          value: item?.TRAN_CD,
          disabled: item?.CONFIRMED === "N" ? true : false,
        };
      });
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  };
  const GetPGWMerchantList = async () => {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETMERCHANTMASTERDATA", {});
    if (status === "0") {
      let responseData = data;
      if (Array.isArray(responseData)) {
        responseData = responseData.map(({ TRAN_CD, DESCRIPTION }) => {
          return {
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
  const GetPGWList = async () => {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETMERCHONBOARDGRID", {});
    if (status === "0") {
      let responseData = data;
      if (Array.isArray(responseData)) {
        responseData = responseData.map(({ TRAN_CD, PID }) => {
          return {
            value: TRAN_CD,
            label: PID,
          };
        });
      }
      return responseData;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  };
  const GetFromSourceTemplateList = async (ReqData) => {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher(
        "GETFROMSOURCETEMPLATEDD",
        { A_DB_COLUMN: ReqData },
        {
          UNIQUE_REQ_ID: "32627636893400",
          APITOKEN: "MzI2Mjc2MzY4OTM0MDA=",
        }
      );
    if (status === "0") {
      let responseData = data;
      if (Array.isArray(responseData)) {
        responseData = responseData.map(({ TRAN_CD, DESCRIPTION }) => {
          return {
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
  return {
    GetMiscValue,
    getValidateValue,
    putOpenWindowName,
    GetChargeTemplates,
    getTranslateDataFromGoole,
    GetDistrictList,
    setDocumentName,
    GetSecurityGroupingList,
    GetUsersNotificationTemplateList,
    GetPGWMerchantList,
    GetPGWList,
    GetFromSourceTemplateList,
  };
};

export const GeneralAPI = GeneralAPISDK();

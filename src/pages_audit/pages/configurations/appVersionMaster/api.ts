import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";
import { GeneralAPI } from "registry/fns/functions";

export const GetMiscValue = () => GeneralAPI.GetMiscValue("DEVICE_OS");

export const getAppVersionMasterGridData = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETAPPVERSIONMSTGRIDDATA", {});
  if (status === "0") {
    return data.map((item) => {
      if (item?.IS_LATEST_VERSION === "Y") {
        return {
          ...item,
          _rowColor: "var(--theme-color2)",
          IS_POPUP: item.IS_POPUP === "Y" ? true : false,
          IS_FORCE_UPDATE: item.IS_FORCE_UPDATE === "Y" ? true : false,
        };
      } else {
        return {
          ...item,
          IS_POPUP: item.IS_POPUP === "Y" ? true : false,
          IS_FORCE_UPDATE: item.IS_FORCE_UPDATE === "Y" ? true : false,
        };
      }
    });
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const updateAppVersionMasterData = async (reqdata) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("", reqdata);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

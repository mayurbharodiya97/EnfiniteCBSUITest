//import { LOSSDK } from "registry/fns/functions";
import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";
import { GeneralAPI } from "registry/fns/functions";
import { parse } from "date-fns/esm";

export const getServiceConfigFormData = async (tranCD) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSERVICECONFIGDATA", {
      SERVICE_TRAN_CD: tranCD,
    });
  if (status === "0") {
    return data.map((item) => {
      return {
        ...item,
        START_TIME:
          parse(
            item.START_TIME,
            "dd/MM/yyyy HH:mm:ss",
            new Date()
          ).toString() !== "Invalid Date"
            ? parse(item.START_TIME, "dd/MM/yyyy HH:mm:ss", new Date())
            : "",
        END_TIME: parse(
          item.END_TIME,
          "dd/MM/yyyy HH:mm:ss",
          new Date()
        ).toString()
          ? parse(item.END_TIME, "dd/MM/yyyy HH:mm:ss", new Date())
          : "",
      };
    });
    //return response;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getChargeAllow = () => GeneralAPI.GetMiscValue("CHARGE_ALLOW");
export const GetChargeTemplates = () => GeneralAPI.GetChargeTemplates();

export const confirmServiceWiseConfigReq = async ({ confirmed, trancd }) => {
  if (!Boolean(confirmed)) {
    throw DefaultErrorObject(
      "Required value missing for Confirmation Status.",
      "warning"
    );
  } else if (!Boolean(trancd)) {
    throw DefaultErrorObject("Required value missing for tran cd.", "warning");
  } else {
    const { status, message, messageDetails } = await AuthSDK.internalFetcher(
      "SERVICEWISECONFIGCONFIRM",
      {
        CONFIRMED: confirmed,
        TRAN_CD: trancd + "",
      }
    );
    if (status === "0") {
      return message;
    } else {
      throw DefaultErrorObject(message, "error", messageDetails);
    }
  }
};

export const saveServiceWiseConfigReq = async ({
  responseData,
  setLocalLoader,
}) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "UPDATESERVICEWISECONFIG",
    {
      SERVICE_MST: responseData,
    }
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, "error", messageDetails);
  }
};

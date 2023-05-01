import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";

export const getUserBlockConfigGridData = async (confirmed) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETUSERBLOCKCONFIGGRIDDATA", {
      CONFIRMED: confirmed,
    });
  if (status === "0") {
    return data.map((item) => {
      return {
        ...item,
        AUTO_RELEASE: item.AUTO_RELEASE === "Y" ? true : false,
      };
    });
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const updateUserBlockConfigData = async (reqdata) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("", reqdata);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const confirmUserBlockConfigReq = async ({ confirmed, configType }) => {
  if (!Boolean(confirmed)) {
    throw DefaultErrorObject(
      "Required value missing for confirmed.",
      "warning"
    );
  } else if (!Boolean(configType)) {
    throw DefaultErrorObject(
      "Required value missing for Config Type.",
      "warning"
    );
  } else {
    const { status, message, messageDetails } = await AuthSDK.internalFetcher(
      "",
      {
        CONFIRMED: confirmed,
        CONFIG_TYPE: configType,
      }
    );
    if (status === "0") {
      return message;
    } else {
      throw DefaultErrorObject(message, "error", messageDetails);
    }
  }
};

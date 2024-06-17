import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getOrnamentTypeMasterGirdData = async ({
  companyID,
  branchCode,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETORNAMTYPMSTDATADISP", {
      COMP_CD: companyID,
      BRANCH_CD: branchCode,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const updateOrnamentTypeMasterData = async ({ data: reqdata }) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "DOORNAMTYPMSTDATA",
    {
      ...reqdata,
    }
  );

  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const deleteOrnamentTypeMasterData = async (data) => {
  const { status, message } = await AuthSDK.internalFetcher(
    "DOORNAMTYPMSTDATA",
    data
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message);
  }
};

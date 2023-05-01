//import { LOSSDK } from "registry/fns/functions";
import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";
import { GeneralAPI } from "registry/fns/functions";

export const GetDistrictList = () => GeneralAPI.GetDistrictList();

export const getBranchMasterFormData = async ({ formView, branchCode }) => {
  if (formView === "add") {
    return {};
  } else {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETBRANCHMSTFORMDATA", {
        BRANCH_CD: branchCode,
      });
    if (status === "0") {
      return data;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  }
};

export const updateBranchMasterData = async ({ data }) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "UPDATEBRANCHMASTERDATA",
    data
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

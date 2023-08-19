import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";

export const getDynamicGridConfigData = async ({
  COMP_CD,
  BRANCH_CD,
  docCD,
}) => {
  // if (formMode === "add") {
  //   return [];
  // }
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETTBGGRIDCOLDATA", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      DOC_CD: docCD + "",
    });
  if (status === "0") {
    return data.map((item) => {
      return {
        ...item,
        IS_VISIBLE: item.IS_VISIBLE === "Y" ? true : false,
      };
    });
    // return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

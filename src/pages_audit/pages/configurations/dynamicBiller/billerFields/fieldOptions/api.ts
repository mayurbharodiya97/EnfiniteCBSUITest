// import { BillerFieldsGridMetaData } from "./gridMetadata";
import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";

export const getBillerFieldOptionsGridData = async ({
  categoryID,
  subCategoryID,
  billerID,
  srcd,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETFIELDOPTIONLIST", {
      CATEGORY_ID: categoryID,
      SUB_CATEGORY_ID: subCategoryID,
      BILLER_ID: billerID,
      SR_CD: srcd,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

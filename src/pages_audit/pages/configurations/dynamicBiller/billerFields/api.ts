import { BillerFieldsGridMetaData } from "./gridMetadata";
import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";

export const getGridFormMetaData =
  ({ gridCode }) =>
  async () => {
    switch (gridCode) {
      case "CCC/001":
        return BillerFieldsGridMetaData;
      default:
        /* eslint-disable no-throw-literal */
        throw { error_msg: "Invalid Product type" };
    }
  };

export const getBillerFieldsGridData = async ({
  categoryID,
  subCategoryID,
  billerID,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETBILLERFIELDLIST", {
      CATEGORY_ID: categoryID,
      SUB_CATEGORY_ID: subCategoryID,
      BILLER_ID: billerID,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

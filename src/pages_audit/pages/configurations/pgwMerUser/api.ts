import { PGWGridMetaData } from "./gridMetadata";
import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject, utilFunction } from "components/utils";
import { GeneralAPI } from "registry/fns/functions";

export const GetMiscValue = () => GeneralAPI.GetMiscValue("PGW_TYPE");

export const getGridFormMetaData =
  ({ gridCode }) =>
  async () => {
    switch (gridCode) {
      case "CCC/001":
        return PGWGridMetaData;
      default:
        /* eslint-disable no-throw-literal */
        throw { error_msg: "Invalid Product type" };
    }
  };

export const getPGWGridData = async (confirmed) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETPGWMERUSERGRIDDATA", {
      CONFIRMED: confirmed,
    });
  if (status === "0") {
    return data.map((item) => {
      if (item?.CONFIRMED !== "Y") {
        return {
          ...item,
          _rowColor: "var(--theme-color3)",
        };
      } else {
        return {
          ...item,
        };
      }
    });
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const updatePgwMerUserEntry = async ({ data: reqdata }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("", reqdata);
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const confirmPgwMerUserReq = async ({
  confirmed,
  companyCode,
  tranCode,
}) => {
  if (!Boolean(confirmed)) {
    throw DefaultErrorObject(
      "Required value missing for confirmed.",
      "warning"
    );
  } else if (!Boolean(companyCode)) {
    throw DefaultErrorObject(
      "Required value missing for Company Code.",
      "warning"
    );
  } else if (!Boolean(tranCode)) {
    throw DefaultErrorObject(
      "Required value missing for Transaction Code.",
      "warning"
    );
  } else {
    const { status, message, messageDetails } = await AuthSDK.internalFetcher(
      "",
      {
        CONFIRMED: confirmed,
        COMP_CD: companyCode,
        TRAN_CD: tranCode,
      }
    );
    if (status === "0") {
      return message;
    } else {
      throw DefaultErrorObject(message, "error", messageDetails);
    }
  }
};

export const deleteBillerConfigConfirm = async ({
  categoryID,
  subCategoryID,
  billerID,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("", {
      CATEGORY_ID: categoryID,
      SUB_CATEGORY_ID: subCategoryID,
      BILLER_ID: billerID,
    });
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

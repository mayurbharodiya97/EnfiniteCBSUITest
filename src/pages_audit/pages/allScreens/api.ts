import { AllScreensGridMetaData } from "./gridMetadata";

export const getGridFormMetaData =
  ({ gridCode }) =>
  async () => {
    switch (gridCode) {
      case "CCC/001":
        return AllScreensGridMetaData;
      default:
        /* eslint-disable no-throw-literal */
        throw { error_msg: "Invalid Product type" };
    }
  };

export const getAllScreensGridData = async () => {
  let responseData = [
    {
      screenname: "Release Block Users",
      user_code: "NETT/001",
      system_code: "NETT/001",
      href: "technical-support/release-block-users",
    },
    {
      screenname: "Release Card PIN Block Users",
      user_code: "NETT/002",
      system_code: "NETT/002",
      href: "technical-support/release-card-block-users",
    },
    {
      screenname: "Customer Searching",
      user_code: "NETT/002",
      system_code: "NETT/002",
      href: "operation/customer-searching",
    },
    {
      screenname: "Tag Account Request",
      user_code: "NETT/002",
      system_code: "NETT/002",
      href: "operation/tag-account",
    },
    {
      screenname: "Tag Card Request",
      user_code: "NETT/002",
      system_code: "NETT/002",
      href: "operation/tag-card",
    },
  ];
  return responseData;
};

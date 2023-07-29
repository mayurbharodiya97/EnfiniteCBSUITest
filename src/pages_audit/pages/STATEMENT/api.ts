import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const StatementDetailsData = async ({
  COMP_CD,
  ACCT_TYPE,
  ACCT_CD,
  BRANCH_CD,
  FROM_DT,
  TO_DT,
  METADATA,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCTDTL", {
      COMP_CD: COMP_CD,
      ACCT_TYPE: ACCT_TYPE,
      ACCT_CD: ACCT_CD,
      FROM_DT: FROM_DT,
      TO_DT: TO_DT,
      METADATA: METADATA,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

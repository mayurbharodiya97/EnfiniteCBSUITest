import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getCashDeno = async ({
  BRANCH_CD,
  COMP_CD,
  TRAN_DT,
  USER_NAME,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCASHDENO", {
      BRANCH_CD: BRANCH_CD,
      COMP_CD: COMP_CD,
      TRAN_DT: TRAN_DT,
      USER_NAME: USER_NAME,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const customerInsert = async (request) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("CUSTOMERCASHEXCHANGE", {
      ...request,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

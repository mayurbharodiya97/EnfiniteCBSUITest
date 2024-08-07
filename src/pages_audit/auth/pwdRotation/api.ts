import { AuthSDK } from "registry/fns/auth";

import { utilFunction, DefaultErrorObject } from "@acuteinfo/common-base";

export const ResetPassword = async (
  username,
  password,
  newpassword,
  accessToken,
  token_type
) => {
  const { data, status, message, messageDetails, responseType, access_token } =
    await AuthSDK.internalFetcherPreLogin(
      "CHANGEPASSWORD",
      {
        USER_ID: username,
        OLD_PASSWORD: password,
        NEW_PASSWORD: newpassword,
      },
      {
        Authorization: utilFunction.getAuthorizeTokenText(
          accessToken,
          token_type
        ),
        USER_ID: username,
      }
    );
  return { status, data, message, messageDetails };
};
export const validatePasswords = async ({ ...request }: any) => {
  const { status, data, message, messageDetails } =
    await AuthSDK.internalFetcherPreLogin("VALIDATEPASSWORD", {
      ...request,
    });
  if (status === "0") {
    return { validateStatus: status, validateData: data[0] };
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

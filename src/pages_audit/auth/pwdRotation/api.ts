import { utilFunction } from "components/utils/utilFunctions";
import { AuthSDK } from "registry/fns/auth";

export const ResetPassword = async (
  username,
  password,
  newpassword,
  accessToken,
  token_type
) => {
  const { data, status, message, messageDetails, responseType, access_token } =
    await AuthSDK.internalFetcherPreLogin(
      "DOUPDATEPASSWORD",
      {
        USER_ID: username,
        OLD_PASSWORD: password,
        PASSWORD: newpassword,
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

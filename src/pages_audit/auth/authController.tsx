import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./authContext";
import { veirfyUsernameandPassword, verifyOTP } from "./api";
import * as API from "./api";
import { useQuery } from "react-query";
import { GeneralAPI } from "registry/fns/functions";
import { MultiLanguages } from "./multiLanguages";
import { FullScreenLoader } from "@acuteinfo/common-base";
import { AuthControllerWrapper } from "@acuteinfo/common-screens";

export const AuthLoginController = () => {
  const { isLoggedIn, login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/cbsenfinity", { replace: true });
    }
  }, [navigate, isLoggedIn]);

  const {
    data: imageData,
    isLoading,
    isFetching,
  } = useQuery<any, any>(["getLoginImageData"], () =>
    API.getLoginImageData({ APP_TRAN_CD: "51" })
  );
  const imageDataString = JSON.stringify(imageData);
  localStorage.setItem("imageData", imageDataString);

  useEffect(() => {
    GeneralAPI.setDocumentName("Enfinity");
  }, []);

  return (
    <>
      {isLoading || isFetching ? (
        <FullScreenLoader />
      ) : (
        <>
          <AuthControllerWrapper
            bannerDetails={{
              bannerImg: imageData?.[0]?.BANK_LOGO ?? "",
              bannerTitle: imageData?.[0]?.APP_NM ?? "",
              bannerNote: imageData?.[0]?.NOTE ?? "",
            }}
            logoUrl={imageData?.[0]?.DASHBOARD_APP_LOGO ?? ""}
            logoTitle="Enfinity v1.1.17"
            veirfyUsernameandPassword={veirfyUsernameandPassword}
            verifyOTP={verifyOTP}
            loginFn={login}
            OTPResendRequest={API.OTPResendRequest}
            ResetPassword={API.ResetPassword}
            validatePasswordFn={API.validatePasswords}
            LanguageComponent={MultiLanguages}
            forgotPasswordEndpoint="forgotpassword"
          />
        </>
      )}
    </>
  );
};

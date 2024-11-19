import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "assets/images/logo.jpg";
import { FullScreenLoader } from "@acuteinfo/common-base";
import {
  updatenewPassword,
  veirfyUsernameandMobileNo,
  verifyOTPForPWDReset,
} from "./api";
import { GeneralAPI } from "registry/fns/functions";
import { useQuery } from "react-query";
import * as API from "./api";
import { MultiLanguages } from "./multiLanguages";
import { ForgotPasswordControllerWrapper } from "@acuteinfo/common-screens";

export const ForgotPasswordController = ({ screenFlag }) => {
  const navigate = useNavigate();
  const {
    data: imageData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery<any, any>(["getLoginImageData"], () => API.getImageData());

  useEffect(() => {
    GeneralAPI.setDocumentName("Password Reset");
  }, []);
  return (
    <>
      {isLoading || isFetching ? (
        <FullScreenLoader />
      ) : (
        <>
          <ForgotPasswordControllerWrapper
            OTPResendRequest={API.OTPResendRequest}
            validatePasswordFn={API.validatePasswords}
            navigate={navigate}
            bannerDetails={{
              bannerImg: imageData?.[0]?.BANK_LOGO ?? "",
              bannerTitle: imageData?.[0]?.APP_NM ?? "",
              bannerNote: imageData?.[0]?.NOTE ?? "",
            }}
            logoUrl={logo}
            LanguageComponent={MultiLanguages}
            screenFlag={screenFlag}
            updatenewPassword={updatenewPassword}
            veirfyUsernameandMobileNo={veirfyUsernameandMobileNo}
            verifyOTPForPWDReset={verifyOTPForPWDReset}
            loginPageEndpoint="login"
          />
        </>
      )}
    </>
  );
};

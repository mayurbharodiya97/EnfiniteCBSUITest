import { utilFunction } from "components/utils/utilFunctions";
import { format } from "date-fns";
import { AuthSDK } from "registry/fns/auth";
import { AuthStateType } from "./type";
import { DefaultErrorObject } from "components/utils";

export const getLoginImageData = async ({ APP_TRAN_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLOGINIMGDATA", {
      APP_TRAN_CD: APP_TRAN_CD,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const veirfyUsernameandPassword = async (
  username: any,
  password: any
) => {
  //console.log(CryptoSDK.GetEncryptData(password));
  const { data, status, message, messageDetails, responseType, access_token } =
    await AuthSDK.internalFetcherPreLogin("LOGIN", {
      USER_ID: username,
      PASSWORD: password,
      APP_TRAN_CD: 51,
    });
  if (status === "0") {
    return {
      data: data[0],
      status,
      message,
      messageDetails,
      responseType,
      access_token,
    };
  } else {
    return { status, data, message, messageDetails };
  }

  // return {
  //   data: {
  //     REQUEST_CD: "110432",
  //     AUTH_TYPE: "OTP",
  //   },
  //   status: "0",
  //   message: "OTP Sent successfully.",
  //   messageDetails: "OTP Sent successfully.",
  //   responseType: "D",
  //   access_token: {
  //     access_token: "7cf0b9ce-a9bc-490a-923d-82bf56e2e285",
  //     token_type: "bearer",
  //     expires_in: "299",
  //   },
  // };
};
export const verifyOTP = async (
  transactionId,
  username,
  otpnumber,
  access_token,
  token_type,
  authType,
  bioflag = "N"
) => {
  //console.log(transactionId, username, otpnumber);
  const {
    data,
    status,
    message,
    messageDetails,
    access_token: accesstoken,
  } = await AuthSDK.internalFetcherPreLogin(
    "VERIFYOTP",
    {
      USER_ID: username,
      REQUEST_CD: transactionId,
      OTP: otpnumber,
      AUTH_TYPE: "OTP",
      // AUTH_TYPE: authType,
      APP_TRAN_CD: 51,
      BIO_FLAG: bioflag,
    },
    {
      Authorization: utilFunction.getAuthorizeTokenText(
        access_token,
        token_type
      ),
    }
  );
  if (status === "0") {
    let transformData = transformAuthData(data[0], {
      generateTime: utilFunction.getCurrentDateinLong(),
      ...accesstoken,
    });

    return {
      data: transformData,
      status,
      message,
      messageDetails,
    };
    // let {
    //   status: statusa,
    //   data: dataa,
    //   message: messagea,
    //   messageDetails: messageDetailsa,
    // } = await GetMenuData({
    //   userID: transformData?.user?.id,
    //   COMP_CD: transformData?.companyID,
    //   BRANCH_CD: transformData?.user?.branchCode,
    //   GROUP_NAME: transformData?.roleName,
    //   fulldata: transformData,
    // });
    // if (statusa === "0") {
    //   transformData.menulistdata = dataa;
    //  return {
    //     data: transformData,
    //     status,
    //     message,
    //     messageDetails,
    //   };
    // } else {
    //   return {
    //     status: statusa,
    //     data: dataa,
    //     message: messagea,
    //     messageDetails: messageDetailsa,
    //   };
    // }
  } else {
    return { status, data, message, messageDetails };
  }
};

export const RefreshTokenData = async (refreshToken) => {
  const { status, access_token } = await AuthSDK.internalFetcherPreLogin(
    "LOGIN",
    {
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }
  );
  //console.log(status, !Boolean(status), typeof status, typeof access_token);
  if (Boolean(status) && status === "0") {
    return {
      generateTime: utilFunction.getCurrentDateinLong(),
      ...access_token,
    };
  } else if (!Boolean(status) || status === "undefined") {
    return {
      generateTime: utilFunction.getCurrentDateinLong(),
      ...access_token,
    };
  } else {
    return null;
  }
};
export const LogoutAPI = async ({ userID }) => {
  const { message } = await AuthSDK.internalFetcher("LOGOUTUSER", {
    USER_ID: userID,
  });
  //if (status === "0") {
  return message;
  //} else {
  //  throw DefaultErrorObject(message, messageDetails);
  //}
};

// export const verifyPasswordAndLogin = async (
//   transactionId,
//   username,
//   password
// ) => {
//   const { data, status } = await AuthSDK.internalFetcher(
//     `./los/employee/login`,
//     {
//       body: JSON.stringify({
//         request_data: {
//           transactionId: transactionId,
//           password: password,
//           userId: username,
//         },
//         channel: "W",
//       }),
//     }
//   );
//   if (status === "success") {
//     return {
//       status,
//       data: transformAuthData(data?.response_data),
//     };
//   } else {
//     return { status, data: data?.error_data };
//   }
// };

// export const verifyToken = async (token) => {
//   const { data, status } = await AuthSDK.internalFetcher(
//     `./los/employee/token/verify`,
//     {
//       body: JSON.stringify({
//         request_data: {
//           tokenID: token,
//         },
//         channel: "W",
//       }),
//     }
//   );
//   if (status === "success") {
//     return { status, data: data?.response_data };
//   } else {
//     return { status, data: data instanceof Error ? data : data?.error_data };
//   }
// };

const transformAuthData = (data: any, access_token: any): AuthStateType => {
  return {
    access_token: access_token,
    role: data?.USER_LEVEL,
    roleName: data?.USER_ROLE,
    isLoggedIn: false,
    isBranchSelect: false,
    companyName: data?.COMPANYNAME,
    companyID: data?.COMPANYID,
    baseCompanyID: data?.BASECOMPANYID,
    workingDate: data?.WORKINGDATE,
    menulistdata: [],
    user: {
      branch: data?.BRANCH,
      branchCode: data?.BRANCHCODE,
      baseBranchCode: data?.BASEBRANCHCODE,
      isUpdDefBranch: data?.ISUPDDEFBRANCH,
      lastLogin: data?.LASTLOGINDATE,
      name: data?.NAME,
      //type: data?.user?.flag,
      // firstName: data?.user?.firstName,
      // lastName: data?.user?.lastName,
      // middleName: data?.user?.middleName,
      id: data?.ID,
      employeeID: data?.EMP_ID,
    },
    access: {},
  };
};

// const transformRoles = (data: any[]) => {
//   if (!Array.isArray(data)) {
//     return {};
//   }
//   let result = data.reduce((prev, current) => {
//     let products = current.accessCategory as any[];
//     products.reduce((prev, current) => {
//       return (prev[current.categoryCode] = current.categoryName);
//     }, {});

//     return (prev[current?.branchCode] = { ...current, products });
//   }, {});
//   console.log(result);
//   return result;
// };

// const transformRoles = (data: any[]) => {
//   if (!Array.isArray(data)) {
//     return { entities: {}, products: [] };
//   }
//   let products;
//   let result = data.reduce((prev, current) => {
//     let { entityType, accessCategory, ...others } = current;
//     products = accessCategory;
//     if (Array.isArray(prev[entityType])) {
//       prev[entityType].push(others);
//     } else {
//       prev[entityType] = [others];
//     }
//     return prev;
//   }, {});
//   return { entities: result, products: products };
// };
export const veirfyUsernameandMobileNo = async (
  username: any,
  MobileNo: any,
  screenFlag: any
) => {
  const { data, status, message, messageDetails, responseType, access_token } =
    await AuthSDK.internalFetcherPreLogin("FORGOTPASSWORD", {
      USER_ID: username,
      MOBILE_NO: MobileNo,
      SCREEN_FLAG: screenFlag,
    });
  if (status === "0") {
    return {
      data: data[0],
      status,
      message,
      messageDetails,
      responseType,
      access_token,
    };
  } else {
    return { status, data, message, messageDetails };
  }
  // return {
  //   status: "0",
  //   message: "OTP Sent successfully.",
  //   RESPONSE_TYPE: "D",
  //   data: {
  //     REQUEST_CD: 111909,
  //     AUTH_TYPE: "O",
  //   },

  //   COLOR: "0",
  //   messageDetails: "OTP Sent successfully.",
  // };
};

export const verifyOTPForPWDReset = async (
  transactionId,
  username,
  otpnumber,
  auth_Type,
  screenFlag
) => {
  // return {
  //   status: "0",
  //   message: "OTP Verified successfully.",
  //   RESPONSE_TYPE: "D",
  //   data: {
  //     STATUS: "S",
  //     REMARKS: "OTP successfully verified.",
  //   },

  //   COLOR: "0",
  //   messageDetails: "OTP Verified successfully.",
  // };
  const {
    data,
    status,
    message,
    messageDetails,
    access_token: accesstoken,
  } = await AuthSDK.internalFetcherPreLogin("FORGOTPWDOTPVERIFY", {
    USER_ID: username,
    REQUEST_CD: transactionId,
    OTP: otpnumber,
    AUTH_TYPE: auth_Type,
    SCREEN_FLAG: screenFlag,
  });
  if (status === "0") {
    return {
      data: data[0],
      status,
      message,
      messageDetails,
    };
  } else {
    return { status, data, message, messageDetails };
  }
};

export const updatenewPassword = async (transactionId, username, password) => {
  const {
    data,
    status,
    message,
    messageDetails,
    access_token: accesstoken,
  } = await AuthSDK.internalFetcherPreLogin("UPDATEFORGETNEWPASSWORD", {
    USER_NAME: username,
    REQUEST_CD: transactionId,
    USER_PASSWORD: password,
  });
  if (status === "0") {
    return {
      data: data[0],
      status,
      message,
      messageDetails,
    };
  } else {
    return { status, data, message, messageDetails };
  }
  // return {
  //   status: "0",
  //   message: "OTP Verified successfully.",
  //   RESPONSE_TYPE: "D",
  //   data: {
  //     STATUS: "S",
  //     REMARKS: "OTP successfully verified.",
  //   },

  //   COLOR: "0",
  //   messageDetails: "OTP Verified successfully.",
  // };
};

export const OTPResendRequest = async (transactionId, username, tran_type) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcherPreLogin("OTPRESEND", {
      USER_ID: username,
      REQUEST_CD: transactionId,
      TRAN_TYPE: tran_type,
    });
  if (status === "0") {
    return {
      data: data[0],
      status,
      message,
      messageDetails,
    };
  } else {
    return { status, data, message, messageDetails };
  }
};

export const capture = async () => {
  var MFS100Request = {
    Quality: 60,
    TimeOut: 10,
  };
  var jsondata = JSON.stringify(MFS100Request);
  const rawResponse = await fetch("http://localhost:8004/mfs100/capture", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: jsondata,
  });
  const content = await rawResponse.json();
  return content;
};
// export const verifyUserFinger = async (username, token) => {
//   const { data, status } = await AuthSDK.internalFetcher(
//     `./cbs/employee/verifyFinger`,
//     {
//       body: JSON.stringify({
//         requestData: {
//           userID: username,
//         },
//         channel: "W",
//       }),
//     },
//     token
//   );
//   if (status === "success") {
//     return { status, data: data?.responseData };
//   } else {
//     return { status, data: data?.errorData };
//   }
// };

export const biometricStatusUpdate = async (username, token, verifyStatus) => {
  const { data, status } = await AuthSDK.internalFetcher(
    `./cbs/employee/updateBiometricStatus`,
    {
      body: JSON.stringify({
        requestData: {
          userID: username,
          status: verifyStatus,
        },
        channel: "W",
      }),
    },
    token
  );
  return { status, data };
};

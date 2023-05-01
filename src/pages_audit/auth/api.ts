import { utilFunction } from "components/utils/utilFunctions";
import { format } from "date-fns";
import { AuthSDK, CryptoSDK } from "registry/fns/auth";
import { AuthStateType } from "./type";

export const veirfyUsernameandPassword = async (
  username: any,
  password: any
) => {
  const { data, status, message, messageDetails, responseType, access_token } =
    await AuthSDK.internalFetcherPreLogin("LOGIN", {
      USER_ID: username,
      PASSWORD: password,
    });
  console.log(
    data,
    status,
    message,
    messageDetails,
    responseType,
    access_token
  );
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
};
export const verifyOTP = async (
  transactionId,
  username,
  otpnumber,
  access_token,
  token_type
) => {
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
    let {
      status: statusa,
      data: dataa,
      message: messagea,
      messageDetails: messageDetailsa,
    } = await GetMenuData({
      userID: transformData?.user?.id,
      COMP_CD: transformData?.companyID,
      BRANCH_CD: transformData?.user?.branchCode,
      GROUP_NAME: transformData?.roleName,
      fulldata: transformData,
    });
    if (statusa === "0") {
      transformData.menulistdata = dataa;
      return {
        data: transformData,
        status,
        message,
        messageDetails,
        menuapierror: false,
      };
    } else {
      return {
        status: statusa,
        data: dataa,
        message: messagea,
        messageDetails: messageDetailsa,
        menuapierror: true,
      };
    }
  } else {
    return { status, data, message, messageDetails, menuapierror: false };
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
  const { message } = await AuthSDK.internalFetcher("LOGOUTADMIN", {
    USER_NAME: userID,
    MACHINE_IP: "",
  });
  //if (status === "0") {
  return message;
  //} else {
  //  throw DefaultErrorObject(message, messageDetails);
  //}
};
export const GetMenuData = async ({
  userID,
  COMP_CD,
  BRANCH_CD,
  GROUP_NAME,
  fulldata,
}) => {
  await AuthSDK.Getfingerprintdata();
  AuthSDK.loginUserDetails(fulldata);
  AuthSDK.setToken(fulldata.access_token);
  const { status, data, message, messageDetails } =
    await AuthSDK.internalFetcher("GETMENULIST", {
      USER_NM: userID,
      MACHINE_IP: "",
      COMP_CD: COMP_CD,
      BASE_BRANCH_CD: BRANCH_CD,
      BRANCH_CD: BRANCH_CD,
      ENTERED_DATE: format(new Date(), "dd/MMM/yyyy"),
      GROUP_NAME: GROUP_NAME,
      IMG_PATH: "",
      FLAG: "ALL_SCREENS",
      APP_TRAN_CD: "1",
    });
  return { status, data, message, messageDetails };
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
    userSubType: data?.USER_SUB_TYPE,
    isLoggedIn: false,
    companyName: data?.COMPANYNAME,
    companyID: data?.COMPANYID,
    menulistdata: [],
    user: {
      branch: data?.USER?.BRANCH,
      branchCode: data?.USER?.BRANCHCODE,
      lastLogin: data?.USER?.LASTLOGINDATE,
      name: data?.USER?.NAME,
      //type: data?.user?.flag,
      // firstName: data?.user?.firstName,
      // lastName: data?.user?.lastName,
      // middleName: data?.user?.middleName,
      id: data?.USER?.ID,
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

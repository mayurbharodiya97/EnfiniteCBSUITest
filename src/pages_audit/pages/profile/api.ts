import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getUserDetails = async ({ userID }) => {
  const { status, data, message, messageDetails } =
    await AuthSDK.internalFetcher("GETEMPLOYEEDTL", {
      USER_ID: userID,
    });
  if (status === "0") {
    const { BRANCH, BRANCH_NAME } = data[0];
    const DEFAULT_BRANCH = `${BRANCH} - ${BRANCH_NAME}`;

    let responseData = data[0];
    if (responseData?.ALLOW_RELEASE === "Y") {
      responseData.ALLOW_RELEASE = true;
    } else {
      responseData.ALLOW_RELEASE = false;
    }
    return { ...responseData, DEFAULT_BRANCH };
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getUserLoginDetails = async ({ userID }) => {
  const { status, data, message, messageDetails } =
    await AuthSDK.internalFetcher("GETUSERACTIVITY", {
      USER_ID: userID,
      // A_USER_NAME: userID,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getUserAccessBranch = async ({ userID }) => {
  const { status, data, message, messageDetails } =
    await AuthSDK.internalFetcher("GETUSERACESSBRNCH", {
      USER_NAME: userID,
    });
  if (status === "0") {
    // return data;
    return data.map((item) => {
      return {
        ...item,
        LOGIN_ACCESS: item.LOGIN_ACCESS === "Y" ? true : false,
        REPORT_ACCESS: item.REPORT_ACCESS === "Y" ? true : false,
      };
    });
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getUserAccessType = async ({ userID }) => {
  const { status, data, message, messageDetails } =
    await AuthSDK.internalFetcher("GETUSERACESSTYPE", {
      USER_NAME: userID,
    });
  if (status === "0") {
    // return data;
    return data.map((item) => {
      return {
        ...item,
        ACCESS: item.ACCESS === "Y" ? true : false,
      };
    });
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const changeEmployeePassword = async ({
  userID,
  currentPassword,
  password,
}) => {
  const { status, data, message, messageDetails } =
    await AuthSDK.internalFetcher("CHANGEPASSWORD", {
      USER_ID: userID,
      OLD_PASSWORD: currentPassword,
      NEW_PASSWORD: password,
      // NEW_PASSWORD: "123",
      // USER_ID: "bhavyata",
      // OLD_PASSWORD: "1",
      // USERNAME: userID,
    });
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const updateUserProfilePic = async ({ userID, imageData, blob }) => {
  const { status, data, message, messageDetails } =
    await AuthSDK.internalFetcher("UPDATEPROFILEPIC", {
      PROFILE_DATA: imageData,
      USER_NAME: userID,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getquickView = async ({ userID, COMP_CD }) => {
  const { status, data, message, messageDetails } =
    await AuthSDK.internalFetcher("GETUSRQUICKVIEW", {
      USER_NAME: userID,
      COMP_CD: COMP_CD,
      // USER_NAME: "adi",
      // COMP_CD: "132 ",
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getquickViewList = async () => {
  const { status, data, message, messageDetails } =
    await AuthSDK.internalFetcher("GETUSRDOCLIST", {
      USER_NAME: "adi",
      // COMP_CD: COMP_CD,
      COMP_CD: "132 ",
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ DOC_CD, DOC_NM, ...other }, index) => {
        return {
          value: DOC_CD,
          label: `${index + 1}${"."}  ${DOC_NM}`,
          ...other,
        };
      });
    }
    return responseData;
    // return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
  // return [
  //   {
  //     ACCT_STATUS: "JOINT",
  //     STATUS: "OPEN",
  //     ACCT_NAME: "VIJAY S SHARMA",
  //     ACCT_NO: "1234123412351234",
  //     CUST_ID: "1",
  //     MOB_NO: "423864384628",
  //     PAN_NO: "SHDKL1678D",
  //     OPENIND_DT: "21/06/2023",
  //     CLOSE_DT: "04/09/2037",
  //   },
  //   {
  //     ACCT_STATUS: "JOINT",
  //     STATUS: "OPEN",
  //     ACCT_NO: "9999999999999",
  //     ACCT_NAME: "MAULIK R BAJAJ",
  //     CUST_ID: "2",
  //     MOB_NO: "423864384628",
  //     PAN_NO: "SHDKL1L78D",
  //     OPENIND_DT: "21/06/2023",
  //     CLOSE_DT: "04/09/2037",
  //   },
  //   {
  //     ACCT_STATUS: "JOINT",
  //     STATUS: "OPEN",
  //     ACCT_NO: "9999999999999",
  //     ACCT_NAME: "MAULIK R BAJAJ",
  //     CUST_ID: "3",
  //     MOB_NO: "423864384628",
  //     PAN_NO: "SHDKL1L78D",
  //     OPENIND_DT: "21/06/2023",
  //     CLOSE_DT: "04/09/2037",
  //   },
  //   {
  //     ACCT_STATUS: "JOINT",
  //     STATUS: "OPEN",
  //     ACCT_NO: "4",
  //     ACCT_NAME: "MAULIK R BAJAJ",
  //     CUST_ID: "45546564",
  //     MOB_NO: "423864384628",
  //     PAN_NO: "SHDKL1L78D",
  //     OPENIND_DT: "21/06/2023",
  //     CLOSE_DT: "04/09/2037",
  //   },
  //   {
  //     ACCT_STATUS: "JOINT",
  //     STATUS: "OPEN",
  //     ACCT_NO: "9999999999999",
  //     ACCT_NAME: "MAULIK R BAJAJ",
  //     CUST_ID: "5",
  //     MOB_NO: "423864384628",
  //     PAN_NO: "SHDKL1L78D",
  //     OPENIND_DT: "21/06/2023",
  //     CLOSE_DT: "04/09/2037",
  //   },
  //   {
  //     ACCT_STATUS: "JOINT",
  //     STATUS: "OPEN",
  //     ACCT_NO: "9999999999999",
  //     ACCT_NAME: "MAULIK R BAJAJ",
  //     CUST_ID: "6",
  //     MOB_NO: "423864384628",
  //     PAN_NO: "SHDKL1L78D",
  //     OPENIND_DT: "21/06/2023",
  //     CLOSE_DT: "04/09/2037",
  //   },
  //   {
  //     ACCT_STATUS: "JOINT",
  //     STATUS: "OPEN",
  //     ACCT_NO: "9999999999999",
  //     ACCT_NAME: "MAULIK R BAJAJ",
  //     CUST_ID: "7",
  //     MOB_NO: "423864384628",
  //     PAN_NO: "SHDKL1L78D",
  //     OPENIND_DT: "21/06/2023",
  //     CLOSE_DT: "04/09/2037",
  //   },
  //   {
  //     ACCT_STATUS: "JOINT",
  //     STATUS: "OPEN",
  //     ACCT_NO: "9999999999999",
  //     ACCT_NAME: "MAULIK R BAJAJ",
  //     CUST_ID: "8",
  //     MOB_NO: "423864384628",
  //     PAN_NO: "SHDKL1L78D",
  //     OPENIND_DT: "21/06/2023",
  //     CLOSE_DT: "04/09/2037",
  //   },
  // ];
};
export const getdashUserboxData = async ({ userID, COMP_CD }) => {
  const { status, data, message, messageDetails } =
    await AuthSDK.internalFetcher("GETUSRDASHBOX", {
      // USER_NAME: "adi",
      USER_NAME: userID,
      COMP_CD: COMP_CD,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getdashboxData = async () => {
  const { status, data, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDASHBOX", {
      USER_NAME: "adi",
      COMP_CD: "132 ",
    });
  if (status === "0") {
    // return data;
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ TITLE, TRAN_CD, ...other }, index) => {
        return {
          value: TRAN_CD,
          label: `${index + 1}${"."}  ${TITLE}`,
          ...other,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const updateDashboxData = async (reqData) => {
  const { status, data, message, messageDetails } =
    await AuthSDK.internalFetcher("GETBOXDML", reqData);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const updateQuickViewData = async (reqData) => {
  const { status, data, message, messageDetails } =
    await AuthSDK.internalFetcher("GETQUICKVIEWSCREEN", reqData);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const updateTOTPAuth = async ({ userID, currentPassword, flag }) => {
  const { status, data, message, messageDetails } =
    await AuthSDK.internalFetcher("LOGINTOTP", {
      USER_ID: userID,
      FLAG: flag,
      PASSWORD: currentPassword,
    });
  if (status === "0") {
    if (flag === "DISABLED") {
      return message;
    }
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const updateTOTPAuthVerify = async ({
  userID,
  secretToken,
  otpNumber,
}) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "VERIFYTOTP",
    {
      USER_ID: userID,
      SECRET: secretToken,
      OTP: otpNumber,
    }
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

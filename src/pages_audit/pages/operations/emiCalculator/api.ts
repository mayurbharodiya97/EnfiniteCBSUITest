import { DefaultErrorObject } from "@acuteinfo/common-base";
import { AuthSDK } from "registry/fns/auth";

export const getEMIInstType = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETEMICALCINSTTYPEDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ DATA_VALUE, DISPLAY_VALUE, ...other }) => {
          return {
            ...other,
            value: DATA_VALUE,
            label: DISPLAY_VALUE,
          };
        }
      );
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getEMICalcPeriod = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETEMICALCPERIODDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });

  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ DATA_VAL, DISP_VAL, ...other }) => {
        return {
          ...other,
          value: DATA_VAL,
          label: DISP_VAL,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getEMICalcIntFund = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETEMICALCINTFUNDEDDDW", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });

  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ DATA_VAL, DISP_VAL, ...other }) => {
        return {
          ...other,
          value: DATA_VAL,
          label: DISP_VAL,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const validateCheckEmiSchedule = async ({ ...reqdata }) => {
  const { data, status, message } = await AuthSDK.internalFetcher(
    "CHECKEMISCHEDULEDTL",
    {
      ...reqdata,
    }
  );
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message);
  }
};

export const validateDisburseDetail = async ({ ...reqdata }) => {
  const { data, status, message } = await AuthSDK.internalFetcher(
    "CHECKEMIDISBURSDTL",
    {
      ...reqdata,
    }
  );
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message);
  }
};

export const emiCalculateData = async ({ ...reqdata }) => {
  const { data, status, message } = await AuthSDK.internalFetcher(
    "GETEMICACLCULATEDATA",
    {
      ...reqdata,
    }
  );
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message);
  }
};

export const emiReportData = async ({ ...reqdata }) => {
  const { data, status, message } = await AuthSDK.internalFetcher(
    "DOGETEMICALCULATEREPORT",
    {
      ...reqdata,
    }
  );
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message);
  }
};

import {
  AddIDinResponseData,
  DefaultErrorObject,
  utilFunction,
} from "components/utils";
import { format } from "date-fns";
import { AuthSDK } from "registry/fns/auth";

export const getBussinessDate = async ({ companyID, branchID }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETBUSINESSDATE", {
      TRAN_DATE: format(new Date(), "dd/MMM/yyyy"),
      COMP_CD: companyID,
      BRANCH_CD: branchID,
    });

  if (status === "0") {
    let responseData = data;
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getAccountSlipJoinDetail = async (Apireq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACCOUNTNM", { ...Apireq });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const clearingBankMasterConfigDML = async (formData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DOBANKDETAIL", formData);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const outwardClearingConfigDML = async (formData) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "DOOWCLEARINGDML",
    formData
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getRetrievalClearingData = async (Apireq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(`GETCTSCNFRETRIEV`, { ...Apireq });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getOutwardClearingConfigData = async ({
  COMP_CD,
  BRANCH_CD,
  TRAN_CD,
}) => {
  if (TRAN_CD) {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETOWCLEARINGDETAILS", {
        TRAN_CD: TRAN_CD,
        ENTERED_BRANCH_CD: BRANCH_CD,
        ENTERED_COMP_CD: COMP_CD,
      });

    if (status === "0") {
      return data;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  }
};
export const getSlipNoData = async (Apireq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSLIPNO", { ...Apireq });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
// export const getSlipNoData = async (...reqData) => {
//   const { data, status, message, messageDetails } =
//     await AuthSDK.internalFetcher(`GETSLIPNO`, {
//       COMP_CD: reqData?.[2]?.companyID ?? "",
//       BRANCH_CD: reqData?.[2]?.user?.branchCode,
//       TRAN_DT: format(new Date(reqData?.[3]?.TRAN_DT?.value), "dd/MMM/yyyy"),
//       ZONE: reqData?.[0].value ?? "",
//       TRAN_TYPE: reqData?.[0]?.optionData?.[0]?.ZONE_TRAN_TYPE ?? "S",
//     });
//   if (status === "0") {
//     return {
//       SLIP_CD: { value: data?.[0]?.SLIP_NO ?? "" },
//     };
//   } else {
//     return {
//       SLIP_CD: { value: "" },
//     };
//   }
// };
// export const TemporaryData = () => {
//   return [
//     {
//       CHEQUE_NO: "",
//       BANK_CD: "",
//       BANK_NAME: "",
//       PAYEE_AC_NO: "",
//       CHEQUE_DATE: "",
//       DESCRIPTION: "",
//       CHQ_MICR_CD: "",
//       NAME: "",
//       AMOUNT: "",
//       id: 1,
//     },
//   ];
// };

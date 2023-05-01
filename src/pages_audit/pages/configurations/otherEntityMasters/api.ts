import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";
import { GeneralAPI } from "registry/fns/functions";

export const GetMiscValue = () => GeneralAPI.GetMiscValue("APP_IND_OTH");

export const GetParentTypeDD = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETPARENTTYPEDROPDOWN", {});
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ DISPLAY_VALUE, PARENT_TYPE, ...other }) => {
          return {
            value: PARENT_TYPE,
            label: DISPLAY_VALUE,
            ...other,
          };
        }
      );
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const GetLeafTemplateDD = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLEAFTEMPLATEDROPDOWN", {});
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ TEMPLATE_DESC, TRAN_CD, ...other }) => {
          return {
            value: TRAN_CD,
            label: TEMPLATE_DESC,
            ...other,
          };
        }
      );
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const insertMastersData = () => async (formData: any) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "OTHERENTITYOPERATION",
    formData
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getDetailsGridData = async (transactionID: number) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETOTHERENTITYDETAILDATA", {
      TRAN_CD: transactionID + "",
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getMastersGridData = async (entityType) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(`GETOTHERENTITYGRIDDATA`, {
      ENTITY_TYPE: entityType,
    });
  if (status === "0") {
    if (entityType === "C") {
      return data.map((item) => {
        return { ...item, value: item?.TRAN_CD, label: item?.DESCRIPTION };
      });
    }
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const updateMastersData = () => async (formData: any) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "OTHERENTITYOPERATION",
    formData
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const updateOtherEntData =
  () =>
  async ({ formView, rows, entityType }) => {
    console.log(">>rows", rows);
    const { status, message, messageDetails } = await AuthSDK.internalFetcher(
      "UPDCLUBMASTERDATA",
      {
        ENTITY_TYPE: entityType,
        ENTITY_CD: rows?.ENTITY_CD,
        DESCRIPTION: rows?.DESCRIPTION,
        ACCT_CD: rows?.ACCT_CD,
        REMARKS: rows?.REMARKS,
        TRN_PERTICULERS: rows?.TRN_PERTICULERS,
        TRN_PERTICULERS2: rows?.TRN_PERTICULERS2,
        TO_SOURCE: rows?.TO_SOURCE,
        TRAN_CD: rows?.TRAN_CD,
      }
    );
    if (status === "0") {
      return message;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  };

export const deleteBytransactionID = (data) => async () => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "OTHERENTITYOPERATION",
    data
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message);
  }
};
export const GetClubMemberDetailsList = async (reqdata) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCLUBMEMBERDATALIST", {
      CLUB_TRAN_CD: reqdata,
    });
  if (status === "0") {
    return data.map((item) => {
      return {
        ...item,
        MEMBER_STATUS_VIEW:
          item?.MEMBER_STATUS === "Y"
            ? "Active"
            : item?.MEMBER_STATUS === "N"
            ? "Deactive"
            : item?.MEMBER_STATUS,
      };
    });
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

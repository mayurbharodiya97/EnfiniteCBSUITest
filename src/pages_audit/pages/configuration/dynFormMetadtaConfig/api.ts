import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";

export const getSouceListData = async (_, __, dependent) => {
  if (dependent["actionsDetails.PROPS_ID"]?.value === "options") {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETDDLBSOURCELIST", {});
    if (status === "0") {
      let responseData = data;
      if (Array.isArray(responseData)) {
        responseData = responseData.map(
          ({ DDLB_NAME, SOURCE_NAME, ...others }) => {
            return {
              value: DDLB_NAME,
              label: DDLB_NAME,
              ...others,
            };
          }
        );
      }

      return responseData;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  } else if (
    dependent["actionsDetails.PROPS_ID"]?.value === "schemaValidation"
  ) {
    return [
      {
        value: "string",
        label: "string",
      },
      {
        value: "number",
        label: "number",
      },
      {
        value: "boolean",
        label: "boolean",
      },
      {
        value: "date",
        label: "date",
      },
    ];
  }
  return [];
};
export const getDynmetaListData = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETFORMMETALIST", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ DOC_CD, ...other }) => {
        return {
          value: DOC_CD,
          label: DOC_CD,
          ...other,
        };
      });
    }
    return responseData;
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getDynMetadataGridConfigData = async ({
  COMP_CD,
  BRANCH_CD,
  DOC_CD,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETTBGFROMCONFIGDATA", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      DOC_CD: DOC_CD,
    });
  if (status === "0") {
    // return data;
    return data.map((item) => {
      return {
        ...item,
        RESETFIELDONUNMOUNT: item.RESETFIELDONUNMOUNT === "Y" ? true : false,
      };
    });
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getDynFieldListData = async ({
  COMP_CD,
  BRANCH_CD,
  docCD,
  srcd,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETTBGFROMFIELDDATA", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      DOC_CD: docCD + "",
      SR_CD: srcd + "",
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getDynFormPopulateData = async (inputdata) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETTBGFROMFIELDPOPULATE", {
      DOC_CD: inputdata?.DOC_CD.trim(),
      COMP_CD: inputdata?.COMP_CD,
      BRANCH_CD: inputdata?.BRANCH_CD,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getGridFieldComponentData = async (reqdata) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETFORMFIELDPROPS", reqdata);
  if (status === "0") {
    // return data;
    return data.map((item) => {
      return {
        ...item,
        _isNewRow: item["NEWROW_STATUS"] === "N" ? false : true,
      };
    });
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const dynamiFormMetadataConfigDML = async (formData: any) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "DOFORMCONFIGDATA",
    formData
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const dynamiPropsConfigDML = async (formData: any) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "DOFORMPROPDATA",
    formData
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

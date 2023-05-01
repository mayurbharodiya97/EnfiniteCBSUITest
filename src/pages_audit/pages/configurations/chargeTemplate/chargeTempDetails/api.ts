import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const insertBranchData =
  (transactionID: number) => async (formData: any) => {
    //   const { data, status, message, messageDetails } =
    //   await AuthSDK.internalFetcher(
    //     `/adminPanelCommonServiceAPI/INSCHARGETEMPLATEMST`,
    //     {
    //       DESCRIPTION: formData.description,
    //       EFFECTIVE_DT: formData.effectiveDate,
    //       MACHINE_NM: "test",
    //     }
    //   );
    // if (status === "success") {
    //   return data?.responseData;
    // } else {
    //   throw DefaultErrorObject(message, messageDetails);
    // }
  };

export const getFormData = async (transactionID: number) => {
  // const payload = {
  //   body: JSON.stringify({
  //     requestData: { transactionID },
  //     channel: "W",
  //   }),
  // };
  // const { data, status } = await AuthSDK.internalFetcher(
  //   `./master/checklist-detail/data/get`,
  //   payload
  // );
  // if (status === "success") {
  //   return data?.responseData;
  // } else {
  //   throw data?.errorData;
  // }
};

export const getEditFormData = async (
  transactionID: number,
  serialNo: number
) => {
  // const payload = {
  //   body: JSON.stringify({
  //     requestData: { transactionID, serialNo },
  //     channel: "W",
  //   }),
  // };
  // const { data, status } = await AuthSDK.internalFetcher(
  //   `./master/checklist-detail/data/get`,
  //   payload
  // );
  // if (status === "success") {
  //   return data?.responseData;
  // } else {
  //   throw data?.errorData;
  // }
};

export const getGridData = async (transactionID: number) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(
      `/adminPanelCommonServiceAPI/GETCHARGETEMPLATEDTL`,
      {
        TRAN_CD: transactionID + "",
      }
    );
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const deleteBranchData = (transactionID, serialNo) => async () => {
  const { data, status } = await AuthSDK.internalFetcher(
    `./master/checklist-detail/data/delete`,
    {
      body: JSON.stringify({
        requestData: {
          transactionID,
          serialNo,
        },
        channel: "W",
      }),
    }
  );
  if (status === "success") {
    return data?.responseData;
  } else {
    throw data?.errorData;
  }
};

export const updateData =
  (serialNo?: number, transactionID?: number) => async (formData: any) => {
    const { data, status } = await AuthSDK.internalFetcher(
      `./master/checklist-detail/data/put`,
      {
        body: JSON.stringify({
          // responseData: { serialNo, transactionID, ...formData },
          requestData: { ...formData, serialNo, transactionID },
          channel: "W",
        }),
      }
    );
    if (status === "success") {
      return data?.responseData;
    } else {
      throw data?.errorData;
    }
  };

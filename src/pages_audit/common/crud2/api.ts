//This are default API and are overridden when suitable i.e Bank Config
import { AuthSDK, crudType } from "registry/fns/auth";

export const getCRUDTabsMetadata = async ({ moduleType, refID }) => {
  const { data, status } = await AuthSDK.internalFetcher(
    `./${moduleType}/tabs/metaData`,
    {
      body: JSON.stringify({
        request_data: {
          refID: refID,
        },
      }),
    }
  );
  if (status === "success") {
    return data?.response_data;
  } else {
    throw data?.error_data;
  }
};

export const getGridFormMetaData =
  ({ moduleType, productType, refID }: crudType) =>
  async () => {
    const { data, status } = await AuthSDK.internalFetcher(
      `./${moduleType}/${productType}/grid/metadata`,
      {
        body: JSON.stringify({
          request_data: {
            refID: refID,
          },
        }),
      }
    );
    if (status === "success") {
      return data?.response_data;
    } else {
      throw data?.error_data;
    }
  };

export const getGridFormData =
  ({ moduleType, productType, refID }: crudType) =>
  async () => {
    const { data, status } = await AuthSDK.internalFetcher(
      `./${moduleType}/${productType}/grid/data`,
      {
        body: JSON.stringify({
          request_data: {
            refID: refID,
          },
          channel: "W",
        }),
      }
    );
    if (status === "success") {
      return data?.response_data;
    } else {
      throw data?.error_data;
    }
  };

export const getFormMetaData =
  ({ moduleType, productType, refID }: crudType) =>
  async (metadataType: any) => {
    const { data, status } = await AuthSDK.internalFetcher(
      `./${moduleType}/${productType}/metadata/${metadataType}`,
      {
        body: JSON.stringify({
          request_data: {
            refID: refID,
          },
        }),
      }
    );
    if (status === "success") {
      return data?.response_data;
    } else {
      throw data?.error_data;
    }
  };

export const getFormData =
  ({ moduleType, productType, refID }: crudType) =>
  async (serialNo?: string) => {
    const { data, status } = await AuthSDK.internalFetcher(
      `./${moduleType}/${productType}/data/get`,
      {
        body: JSON.stringify({
          request_data: {
            refID: refID,
            serialNo: serialNo,
          },
        }),
      }
    );
    if (status === "success") {
      return data?.response_data;
    } else {
      throw data?.error_data;
    }
  };

export const insertFormData =
  ({ moduleType, productType, refID }: crudType) =>
  async (formData: any) => {
    const { data, status } = await AuthSDK.internalFetcher(
      `./${moduleType}/${productType}/data/post`,
      {
        body: JSON.stringify({
          request_data: {
            refID: refID,
            ...formData,
          },
          channel: "W",
        }),
      }
    );
    if (status === "success") {
      return data?.response_data;
    } else {
      throw data?.error_data;
    }
  };

export const updateFormData =
  ({ moduleType, productType, refID }: crudType) =>
  async (formData: any, serialNo?: any) => {
    const { data, status } = await AuthSDK.internalFetcher(
      `./${moduleType}/${productType}/data/put`,
      {
        body: JSON.stringify({
          request_data: {
            refID: refID,
            serialNo: serialNo,
            ...formData,
          },
          channel: "W",
        }),
      }
    );
    if (status === "success") {
      return data?.response_data;
    } else {
      throw data?.error_data;
    }
  };

export const deleteFormData =
  ({ moduleType, productType, refID }: crudType) =>
  async (serialNo: any) => {
    const { data, status } = await AuthSDK.internalFetcher(
      `./${moduleType}/${productType}/data/delete`,
      {
        body: JSON.stringify({
          request_data: {
            refID: refID,
            serialNo: serialNo,
          },
          channel: "W",
        }),
      }
    );
    if (status === "success") {
      return data?.response_data;
    } else {
      throw data?.error_data;
    }
  };

export const checkFormDataExist =
  ({ moduleType, productType, refID }: crudType) =>
  async () => {
    const { data, status } = await AuthSDK.internalFetcher(
      `./${moduleType}/${productType}/data/exists`,
      {
        body: JSON.stringify({
          request_data: {
            refID: refID,
          },
          channel: "W",
        }),
      }
    );
    if (status === "success") {
      return data?.response_data;
    } else {
      throw data?.error_data;
    }
  };

export function getRetrievalDateWise(getRetrievalDateWise: any, arg1: { onSuccess: (data: unknown) => void; onError: () => void; }): any {
  throw new Error('Function not implemented.');
}
export function headerDataRetrive(headerDataRetrive: any, arg1: { onSuccess: (data: unknown) => void; onError: () => void; }): any {
  throw new Error('Function not implemented.');
}


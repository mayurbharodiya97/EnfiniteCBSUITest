import { AuthSDK } from "registry/fns/auth";

// export const getGridColumnFilterData =
//   ({ gridCode }) =>
//   async (options) => {
//     /*
//     options = {accessor:'column_id',result_type:'getGroups|getRange',filter_conditions:[]}
//     */
//     const { data, status } = await LOSSDK.internalFetcher(
//       "./grid/columnFilter",
//       {
//         body: JSON.stringify({
//           request_data: {
//             grid_code: gridCode,
//             ...options,
//           },
//         }),
//       }
//     );
//     if (status === "success") {
//       return { status, data: data?.response_data };
//     } else {
//       return { status, data: data?.error_data };
//     }
//   };

export const getGridData =
  ({ gridCode }) =>
  async (fromNo, toNo, sortBy, filterBy) => {
    // const { data, status } = await LOSSDK.internalFetcher("./grid/data", {
    //   body: JSON.stringify({
    //     request_data: {
    //       grid_code: gridCode,
    //       from_row: fromNo,
    //       to_row: toNo,
    //       orderby_columns: sortBy,
    //       filter_conditions: filterBy,
    //     },
    //   }),
    // });
    let responseData = [
      {
        sr_no: 1,
        username: "raju123",
        cust_name: "Rubbyyet",
        block_date: "01/04/2022",
        reason: "OTP Pin",
      },
      {
        sr_no: 2,
        username: "test234",
        cust_name: "Test 123",
        block_date: "01/04/2022",
        reason: "OTP Pin",
      },
    ];
    let rows = { rows: responseData };
    return { status: "success", data: rows };
    // if (status === "success") {
    //   return { status, data: data?.response_data };
    // } else {
    //   return { status, data: data?.error_data };
    // }
  };

export const getGridMetaData =
  ({ gridCode }) =>
  async () => {
    const { data, status } = await AuthSDK.internalFetcher("./grid/metaData", {
      body: JSON.stringify({
        request_data: {
          grid_code: gridCode,
        },
        channel: "W",
      }),
    });
    if (status === "success") {
      return data?.response_data;
    } else {
      throw data?.error_data;
    }
  };

import { DefaultErrorObject } from "components/utils";
import { format } from "date-fns";
import { AuthSDK } from "registry/fns/auth";
import { filters } from "components/report";

export const getRegisterCustDetails = async (reportID, filter) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETREGISTERCUSTRPTDATA", {
      //   body: JSON.stringify({
      //     request_data: {},
      //   }),
      FROM_DT: format(
        new Date(filter?.[0]?.value ?? new Date()),
        "dd/MMM/yyyy"
      ),
      TO_DT: format(new Date(filter?.[1]?.value ?? new Date()), "dd/MMM/yyyy"),
      filter: filter,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getDynamicReportMetaData = async (reportID) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDYNAMICREPORTMETADATA", {
      TRAN_CD: reportID,
    });
  if (status === "0") {
    let columns = data[0].COLUMNS.map((one) => {
      return {
        columnName: one.COLUMN_NAME,
        accessor: one.COLUMN_ACCESSOR,
        Filter:
          one.COLUMN_FILTER_TYPE === "SELECT"
            ? filters.SelectColumnFilter
            : one.COLUMN_FILTER_TYPE === "SLIDER"
            ? filters.SliderColumnFilter
            : filters.DefaultColumnFilter,
        width: one.COLUMN_WIDTH,
        type: one.COLUMN_TYPE,
      };
    });
    let filter = data[0].FILTER.map((one) => {
      return {
        render: {
          componentType: one.COLUMN_TYPE,
        },
        name: one.COLUMN_ACCESSOR,
        label: one.COLUMN_NAME,
        placeholder: "",
        format: one.COLUMN_FORMAT,
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["This field is required."] }],
        },
        GridProps: {
          xs: 12,
          md: 3,
          sm: 6,
        },
      };
    });
    let result = {
      title: data[0].TITLE,
      disableGroupBy: data[0].DISABLE_GROUP_BY,
      hideFooter: data[0].HIDE_FOOTER,
      hideAmountIn: data[0].HIDE_AMOUNT_IN,
      retrievalType: data[0].RETRIEVAL_TYPE,
      columns: columns,
      filters: {
        form: {
          name: "dynamicReport",
          label: "Retrieval Parameters",
          resetFieldOnUnmount: false,
          validationRun: "onBlur",
          submitAction: "home",
          render: {
            ordering: "auto",
            renderType: "simple",
            gridConfig: {
              item: {
                xs: 12,
                sm: 4,
                md: 4,
              },
              container: {
                direction: "row",
                spacing: 1,
              },
            },
          },
          componentProps: {
            textField: {
              fullWidth: true,
            },
            select: {
              fullWidth: true,
            },
            datePicker: {
              fullWidth: true,
            },
            numberFormat: {
              fullWidth: true,
            },
            inputMask: {
              fullWidth: true,
            },
            datetimePicker: {
              fullWidth: true,
            },
          },
        },
        fields: filter,
      },
    };
    return result;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

import {
  DefaultErrorObject,
  components,
  filters,
} from "@acuteinfo/common-base";
import { AuthSDK } from "registry/fns/auth";
import { GeneralAPI } from "registry/fns/functions/general";
import { format } from "date-fns";

export const GetMiscValue = (categoryCode) =>
  GeneralAPI.GetMiscValue(categoryCode);

export const getStaticReportMetaData = async (docCode) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSTATICREPORTMETADATA", {
      DOC_CD: docCode,
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
      let comumn: any = {
        columnName: one.COLUMN_NAME,
        accessor: one.COLUMN_ACCESSOR,
        Filter:
          one.COLUMN_FILTER_TYPE === "SELECT"
            ? filters.SelectColumnFilter
            : one.COLUMN_FILTER_TYPE === "SLIDER"
            ? filters.SliderColumnFilter
            : filters.DefaultColumnFilter,
        width: one.COLUMN_WIDTH,
        isHiddenColumn:
          one.IS_VISIBLE === "N" || one.IS_VISIBLE === false ? true : false,
      };
      if (one.COLUMN_TYPE === "DATE") {
        comumn = { ...comumn, Cell: components.DateCell };
      } else if (one.COLUMN_TYPE === "DATETIME") {
        comumn = { ...comumn, Cell: components.DateTimeCell };
      } else if (one.COLUMN_TYPE === "AMOUNT") {
        comumn = {
          ...comumn,
          // isDisplayTotal: true,
          isTotalWithoutCurrency:
            one.IS_DISP_TOTAL === "Y" || one.IS_DISP_TOTAL === true
              ? true
              : false,
          isTotalWithCurrency:
            one.IS_TOTAL_WITH_CURR === "Y" || one.IS_TOTAL_WITH_CURR === true
              ? true
              : false,
          isVisibleCurrSymbol:
            one.IS_VISIBLE_CURR_SYMBOL === "Y" ||
            one.IS_VISIBLE_CURR_SYMBOL === true
              ? false
              : true,
          isCurrencyCode:
            one.IS_CURRENCY_CODE === "Y" || one.IS_CURRENCY_CODE === true
              ? true
              : false,
          currencyRefColumn: one.CURRENCY_REF_COLUMN || "",
          Cell: components.NumberCell,
          alignment: "right",
        };
      } else if (one.COLUMN_TYPE === "NUMBER") {
        comumn = {
          ...comumn,
          alignment: "right",
        };
      }
      return comumn;
    });
    let filter = data[0].FILTER.map((one) => {
      const required =
        one.IS_REQUIRED === "Y" || one.IS_REQUIRED === true ? true : false;
      return {
        render: {
          componentType: one.COLUMN_TYPE,
        },
        name: one.COLUMN_ACCESSOR,
        label: one.COLUMN_NAME,
        required: required,
        placeholder: `Enter ${one.COLUMN_NAME}`,
        sequence: one.WHERE_SEQ_ID,
        defaultValue:
          one.COLUMN_TYPE === "datePicker" ||
          one.COLUMN_TYPE === "datetimePicker"
            ? new Date(one.DEFAULT_VALUE || Date.now())
            : one.DEFAULT_VALUE,
        format: Boolean(one.COLUMN_FORMAT)
          ? one.COLUMN_FORMAT
          : one.COLUMN_TYPE === "datePicker"
          ? "dd/MM/yyyy"
          : one.COLUMN_TYPE === "datetimePicker"
          ? "dd/MM/yyyy HH:mm:ss"
          : "",
        ...(required
          ? {
              schemaValidation: {
                type: "string",
                rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
              },
            }
          : {}),

        GridProps: {
          xs: 12,
          md: one.COLUMN_WIDTH || 6,
          sm: one.COLUMN_WIDTH || 6,
        },
      };
    });
    filter.sort((a, b) => a.sequence - b.sequence);
    let result = {
      title: data[0].TITLE,
      disableGroupBy: data[0].DISABLE_GROUP_BY,
      hideFooter:
        data[0].HIDE_FOOTER === "Y" || data[0].HIDE_FOOTER === true
          ? true
          : false,
      hideAmountIn: data[0].HIDE_AMOUNT_IN,
      retrievalType: data[0].RETRIEVAL_TYPE,
      columns: columns,
      filters: {
        form: {
          name: "dynamicReport",
          label: "RetrievalParameters",
          resetFieldOnUnmount: false,
          validationRun:
            data[0].RETRIEVAL_TYPE === "CUSTOM" ? "onChange" : "onBlur",
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

export const getReportData = async (reportID, filter, otherAPIRequestPara) => {
  const newData: any = {};
  filter.forEach((item) => {
    newData[item.id] = item.value.value;
  });
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(
      reportID,
      {
        A_FROM_DT: format(new Date(), "dd/MM/yyyy"),
        A_TO_DT: format(new Date(), "dd/MM/yyyy"),
        // A_CUSTOM_USER_NM: "",
        // USER_NAME: newData?.A_CUSTOM_USER_NM ?? "",
        // A_TRN_TYPE: "",
        // A_STATUS: "ALL",
        // A_FR_AMT: "",
        // A_TO_AMT: "",
        // V_CHANNEL: "ALL",
        // CHANNEL: "ALL",
        // BILLER_ID: "",
        // SUB_CATEGORY_ID: "",
        // A_MER_TRAN_CD: "",
        // A_FLAG:
        //   reportID === "OTPSMS" || reportID === "MOBILEEMAILSMS"
        //     ? "ALL"
        //     : "DATE",
        // A_KEY: "ALL",
        // A_FILTER_VALUE: "ALL",
        // A_PAGE_NO: "",
        // A_PAGE_SIZE: "",
        // TRN_TYPE: "ALL",
        // A_PRODUCT_TYPE: "BOTH",
        ...newData,
        ...otherAPIRequestPara,
      },
      { COMPRESSED: "Y" },
      300000
    );
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getServerReportData = async ({
  reportID,
  APIRequestPara,
  abortAPICall,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(
      reportID,
      APIRequestPara,
      {
        COMPRESSED: "Y",
      },
      300000,
      abortAPICall
    );
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getCustomRetrievalReportData = async (
  reportID,
  filter,
  otherAPIRequestPara
) => {
  const newData: any = {};
  filter.forEach((item) => {
    newData[item.id] = item.value.value;
  });
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(
      reportID,
      {
        // ...filter?.[0],
        ...newData,
        ...otherAPIRequestPara,
      },
      { COMPRESSED: "Y" }
    );
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

import { MasterDetailsMetaData } from "@acuteinfo/common-base";
import { t } from "i18next";
// import { getSchemeSource } from "registry/fns/functions/calculation";

export const DynamicReportConfigMetaData: MasterDetailsMetaData = {
  masterForm: {
    form: {
      name: "addDynamicRptConfig",
      label: "DynamicReportConfigure",
      resetFieldOnUnmount: false,
      validationRun: "onBlur",
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
    },
    fields: [
      {
        render: { componentType: "hidden" },
        name: "TRAN_CD",
      },
      {
        render: {
          componentType: "textField",
        },
        name: "TITLE",
        label: "Title",
        placeholder: "EnterTitle",
        type: "text",
        fullWidth: true,
        required: true,
        schemaValidation: {
          type: "string",
          rules: [
            { name: "required", params: ["ThisFieldisrequired"] },
            { name: "TITLE", params: ["Please enter Title."] },
          ],
        },
        GridProps: {
          xs: 12,
          md: 6,
          sm: 6,
        },
        __VIEW__: {
          GridProps: {
            xs: 12,
            md: 5,
            sm: 5,
          },
        },
        __EDIT__: {
          GridProps: {
            xs: 12,
            md: 5,
            sm: 5,
          },
        },
      },
      {
        render: {
          componentType: "textField",
        },
        name: "DESCRIPTION",
        label: "Description",
        placeholder: "EnterDescription",
        type: "text",
        fullWidth: true,
        required: true,
        schemaValidation: {
          type: "string",
          rules: [
            { name: "required", params: ["ThisFieldisrequired"] },
            { name: "DESCRIPTION", params: ["Please enter Description."] },
          ],
        },
        GridProps: {
          xs: 12,
          md: 6,
          sm: 6,
        },
        __VIEW__: {
          GridProps: {
            xs: 12,
            md: 5,
            sm: 5,
          },
        },
        __EDIT__: {
          GridProps: {
            xs: 12,
            md: 5,
            sm: 5,
          },
        },
      },
      {
        render: {
          componentType: "hidden",
        },
        name: "ACTIVE",
        label: "Active",
        __VIEW__: { render: { componentType: "checkbox" } },
        __EDIT__: { render: { componentType: "checkbox" } },
        GridProps: {
          xs: 12,
          md: 2,
          sm: 2,
        },
      },
      {
        render: {
          componentType: "checkbox",
        },
        name: "DISABLE_GROUP_BY",
        label: "DisableGroupBy",
        defaultValue: true,
        GridProps: {
          xs: 12,
          md: 3,
          sm: 3,
        },
      },
      {
        render: {
          componentType: "checkbox",
        },
        name: "HIDE_AMOUNT_IN",
        label: "HideAmountIn",
        defaultValue: true,
        GridProps: {
          xs: 12,
          md: 3,
          sm: 3,
        },
      },
      {
        render: {
          componentType: "checkbox",
        },
        name: "HIDE_FOOTER",
        label: "HideFooter",
        defaultValue: true,
        GridProps: {
          xs: 12,
          md: 3,
          sm: 3,
        },
      },
      // {
      //   render: {
      //     componentType: "checkbox",
      //   },
      //   name: "ENABLE_PAGINATION",
      //   label: "Pagination",
      //   defaultValue: false,
      //   GridProps: {
      //     xs: 12,
      //     md: 2,
      //     sm: 3,
      //   },
      // },
      {
        render: {
          componentType: "select",
        },
        name: "RETRIEVAL_TYPE",
        label: "RetrievalType",
        placeholder: "",
        type: "text",
        fullWidth: true,
        defaultValue: "CUSTOM",
        required: true,
        dependentFields: ["ENABLE_PAGINATION"],
        shouldExclude: (_, dependentFieldsValues, __) => {
          const { value } = dependentFieldsValues?.ENABLE_PAGINATION;
          return Boolean(value);
        },
        options: [
          {
            label: "From And TO Date",
            value: "DATE",
          },
          {
            label: "Date And Customer List",
            value: "CUSTOMERLIMIT",
          },
          {
            label: "Date And Login ID",
            value: "DATEUSERNM",
          },
          {
            label: "Date & Service List",
            value: "DATESERVICE",
          },
          {
            label: "From/To Date & Service List",
            value: "RANGEDATESERVICE",
          },
          {
            label: "Month & Service List",
            value: "MONTHSERVICE",
          },
          {
            label: "From/To Month & Service List",
            value: "RANGEMONTHSERVICE",
          },
          {
            label: "Date, Channel & Service List",
            value: "DATESERVICECHANNEL",
          },
          {
            label: "Custom As Per Query",
            value: "CUSTOM",
          },
        ],
        schemaValidation: {
          type: "string",
          rules: [
            { name: "required", params: ["Retrieval Type is required."] },
            {
              name: "RETRIEVAL_TYPE",
              params: ["Please enter Retrieval Type."],
            },
          ],
        },
        GridProps: {
          xs: 12,
          md: 3,
          sm: 4,
        },
      },
    ],
  },
  detailsGrid: {
    gridConfig: {
      dense: true,
      gridLabel: "Details",
      rowIdColumn: "NEW_SR_CD",
      defaultColumnConfig: { width: 150, maxWidth: 250, minWidth: 100 },
      allowColumnReordering: true,
      hideHeader: true,
      disableGroupBy: true,
      enablePagination: false,
      containerHeight: { min: "61vh", max: "61vh" },
      allowRowSelection: false,
      hiddenFlag: "_hidden",
      disableLoader: true,
    },
    columns: [
      {
        accessor: "NEW_SR_CD",
        columnName: "SrNo",
        componentType: "default",
        sequence: 1,
        alignment: "right",
        isAutoSequence: true,
        width: 86,
        maxWidth: 120,
        minWidth: 70,
      },
      {
        accessor: "SR_CD",
        columnName: "SrNo",
        componentType: "default",
        isVisible: false,
        sequence: 1,
      },
      {
        accessor: "COLUMN_ACCESSOR",
        columnName: "ColumnAccessor",
        componentType: "default",
        required: true,
        validation: (value, data) => {
          if (!Boolean(value)) {
            return t("ThisFieldisrequired");
          }
          return "";
        },
        sequence: 2,
        width: 160,
        maxWidth: 300,
        minWidth: 120,
      },
      {
        accessor: "COLUMN_NAME",
        columnName: "ColumnName",
        componentType: "editableTextField",
        placeholder: "EnterColumnName",
        required: true,
        validation: (value, data) => {
          if (!Boolean(value)) {
            return t("ThisFieldisrequired");
          }
          return "";
        },
        sequence: 2,
        width: 200,
        maxWidth: 300,
        minWidth: 150,
      },
      {
        accessor: "COLUMN_WIDTH",
        columnName: "ColumnWidth",
        componentType: "editableTextField",
        required: true,
        placeholder: "EnterColumnWidth",
        validation: (value, data) => {
          if (!Boolean(value)) {
            return t("ThisFieldisrequired");
          }
          return "";
        },
        alignment: "right",
        sequence: 2,
        width: 120,
        maxWidth: 180,
        minWidth: 80,
      },
      {
        accessor: "COLUMN_TYPE",
        columnName: "ColumnType",
        componentType: "editableSelect",
        defaultOptionLabel: "EnterColumnType",
        options: [
          { label: "Default", value: "default" },
          { label: "Date", value: "DATE" },
          { label: "DateTime", value: "DATETIME" },
          { label: "Amount", value: "AMOUNT" },
          { label: "Number", value: "NUMBER" },
        ],
        required: true,
        validation: (value, data) => {
          if (!Boolean(value)) {
            return t("ThisFieldisrequired");
          }
          return "";
        },
        sequence: 2,
        width: 200,
        maxWidth: 350,
        minWidth: 180,
      },
      // {
      //   accessor: "COLUMN_FORMAT",
      //   columnName: "Column Format",
      //   componentType: "editableTextField",
      //   sequence: 2,
      //   width: 160,
      //   maxWidth: 300,
      //   minWidth: 120,
      // },
      {
        accessor: "COLUMN_FILTER_TYPE",
        columnName: "ColumnFilterType",
        componentType: "editableSelect",
        defaultOptionLabel: "Enter Filter Type",
        options: [
          { label: "select", value: "SELECT" },
          { label: "slider", value: "SLIDER" },
          { label: "default", value: "DEFAULT" },
        ],
        sequence: 2,
        width: 160,
        maxWidth: 300,
        minWidth: 120,
      },
      {
        accessor: "IS_VISIBLE",
        columnName: "IsVisible",
        componentType: "editableCheckbox",
        sequence: 6,
        alignment: "left",
        defaultValue: true,
        placeholder: "",
        width: 90,
        minWidth: 50,
        maxWidth: 100,
        setValueFUNC: (checked) => {
          if (typeof checked === "boolean") {
            if (checked) {
              return "Y";
            }
            return "N";
          }
          return checked;
        },
      },
      {
        accessor: "IS_DISP_TOTAL",
        columnName: "IsTotalWithoutCurrency",
        componentType: "editableCheckbox",
        sequence: 7,
        alignment: "left",
        defaultValue: false,
        placeholder: "",
        width: 150,
        minWidth: 100,
        maxWidth: 200,
      },
      {
        accessor: "IS_TOTAL_WITH_CURR",
        columnName: "IsTotalWithCurrency",
        componentType: "editableCheckbox",
        sequence: 7,
        alignment: "left",
        defaultValue: false,
        placeholder: "",
        width: 150,
        minWidth: 100,
        maxWidth: 200,
      },
      {
        accessor: "IS_VISIBLE_CURR_SYMBOL",
        columnName: "IsVisibleCurrencySymbol",
        componentType: "editableCheckbox",
        sequence: 7,
        alignment: "left",
        defaultValue: false,
        placeholder: "",
        width: 150,
        minWidth: 100,
        maxWidth: 200,
      },
      {
        accessor: "IS_CURRENCY_CODE",
        columnName: "IsCurrencyCode",
        componentType: "editableCheckbox",
        sequence: 7,
        alignment: "left",
        defaultValue: false,
        placeholder: "",
        width: 150,
        minWidth: 100,
        maxWidth: 200,
      },
      {
        accessor: "CURRENCY_REF_COLUMN",
        columnName: "CurrencyReferenceColumn",
        componentType: "editableTextField",
        placeholder: "EnterColumnWidth",
        alignment: "right",
        sequence: 8,
        width: 120,
        minWidth: 80,
        maxWidth: 180,
      },
    ],
  },
};

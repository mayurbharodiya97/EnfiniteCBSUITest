import { GridMetaDataType } from "components/dataTableStatic";
import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";
import { GetChargeTemplates } from "../../configurations/serviceWiseConfig/viewEditDetail/api";

export const operatorMasterDetailsMetaData: MasterDetailsMetaData = {
  masterForm: {
    form: {
      name: "addChargeTemp",
      label: "Operator Master",
      resetFieldOnUmnount: false,
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
        render: { componentType: "select" },

        name: "OPERATOR_TYPE",
        label: "Operator Type",
        defaultValue: "M",
        required: true,
        maxLength: 10,
        GridProps: { xs: 4, md: 4, sm: 4 },
        fullWidth: true,
        options: [
          { label: "MOBILE", value: "M" },
          { label: "INTERNET", value: "I" },
        ],
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["This Field is required"] }],
        },
        autoComplete: "off",
        validate: ({ value }) => {
          //@ts-ignore
          if (typeof window?._CHANGE_OPERATOR_TYPE === "function") {
            //@ts-ignore
            window._CHANGE_OPERATOR_TYPE(value);
          }
          return "";
        },
        __EDIT__: { isReadOnly: true },
      },
      {
        render: { componentType: "numberFormat" },
        name: "OPERATOR_ID",
        label: "Operator ID",
        placeholder: "",
        required: true,
        maxLength: 10,
        showMaxLength: false,
        GridProps: { xs: 4, md: 4, sm: 4 },
        fullWidth: true,
        autoComplete: "off",
        FormatProps: {
          allowNegative: false,
          allowLeadingZeros: true,
          decimalScale: 0,
          isAllowed: (values) => {
            if (values?.value?.length > 10) {
              return false;
            }
            if (values.floatValue === 0) {
              return false;
            }
            return true;
          },
        },
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["This Field is required"] }],
        },
      },
      {
        render: { componentType: "formbutton" },
        name: "OPERATOR_IMAGE",
        label: "VIEW Image",
        showMaxLength: false,
        GridProps: { xs: 4, md: 3, sm: 3 },
        fullWidth: true,
      },
      {
        render: { componentType: "textField" },
        name: "OPERATOR_NAME",
        label: "Operator Name",
        placeholder: "Enter Operator Name",
        required: true,
        maxLength: 300,
        showMaxLength: false,
        GridProps: { xs: 12, md: 11, sm: 11 },
        fullWidth: true,
        validate: "getValidateValue",
        autoComplete: "off",
      },

      {
        render: { componentType: "hidden" },
        name: "TRAN_CD",
      },
    ],
  },
  detailsGrid: {
    gridConfig: {
      dense: true,
      gridLabel: "Service Charge Details",
      rowIdColumn: "SR_CD",
      defaultColumnConfig: { width: 150, maxWidth: 250, minWidth: 100 },
      allowColumnReordering: true,
      hideHeader: true,
      disableGroupBy: true,
      enablePagination: true,
      containerHeight: { min: "40vh", max: "40vh" },
      allowRowSelection: false,
      hiddenFlag: "_hidden",
      disableLoader: true,
    },
    columns: [
      {
        accessor: "SR_CD",
        columnName: "Sr. No",
        componentType: "default",
        sequence: 1,
        alignment: "right",
        width: 70,
        maxWidth: 150,
        minWidth: 60,
      },
      {
        accessor: "OPTION_TYPE",
        columnName: "Option Type",
        componentType: "editableSelect",
        sequence: 2,
        alignment: "left",
        width: 120,
        maxWidth: 200,
        minWidth: 100,
        options: () => {
          return [
            { value: "PREPAID", label: "PREPAID" },
            { value: "POSTPAID", label: "POSTPAID" },
            { value: "INTERNET", label: "INTERNET" },
          ];
        },
        disableCachingOptions: true,
        validation: (value, data, prev) => {
          if (!Boolean(value)) {
            return "This field is required";
          }
          if (Array.isArray(prev)) {
            let lb_error = false;
            let ls_msg = "";
            prev.forEach((item, index) => {
              if (value === item?.OPTION_TYPE) {
                lb_error = true;
                ls_msg = "Option is Already entered at Line " + (index + 1);
                return ls_msg;
              }
            });
            if (lb_error) {
              return ls_msg;
            }
          }
          return "";
        },
      },
      {
        accessor: "ACTIVE",
        columnName: "Active",
        componentType: "editableCheckbox",
        sequence: 3,
        alignment: "center",
        width: 80,
        maxWidth: 150,
        minWidth: 70,
        defaultValue: true,
      },
      {
        accessor: "MIN_AMT",
        columnName: "Minimum Amount",
        componentType: "editableNumberFormat",
        placeholder: "0.00",
        className: "textInputFromRight",
        sequence: 4,
        FormatProps: {
          thousandSeparator: true,
          thousandsGroupStyle: "lakh",
          allowNegative: false,
          allowLeadingZeros: false,
          decimalScale: 2,
          isAllowed: (values) => {
            if (values?.value?.length > 14) {
              return false;
            }
            if (values.floatValue === 0) {
              return false;
            }
            return true;
          },
        },
        validation: (value, data) => {
          if (!Boolean(value) || !Boolean(data["MAX_AMT"])) {
            return "";
          }
          if (Number.parseFloat(value) > Number.parseFloat(data["MAX_AMT"])) {
            return "Minimum Amount should be Less than or equal To Maximum Amount.";
          }
          return "";
        },
        alignment: "right",
        width: 150,
        maxWidth: 250,
        minWidth: 130,
      },
      {
        accessor: "MAX_AMT",
        columnName: "Maximum Amount",
        componentType: "editableNumberFormat",
        placeholder: "0.00",
        className: "textInputFromRight",
        FormatProps: {
          thousandSeparator: true,
          thousandsGroupStyle: "lakh",
          allowNegative: false,
          allowLeadingZeros: false,
          decimalScale: 2,
          isAllowed: (values) => {
            if (values?.value?.length > 14) {
              return false;
            }
            if (values.floatValue === 0) {
              return false;
            }
            return true;
          },
        },
        validation: (value, data) => {
          if (!Boolean(value) || !Boolean(data["MIN_AMT"])) {
            return "";
          }
          if (Number.parseFloat(value) < Number.parseFloat(data["MIN_AMT"])) {
            return "Maximum Amount should be Greater than or equal to Minimum Amount.";
          }
          return "";
        },
        alignment: "right",
        sequence: 5,
        width: 150,
        maxWidth: 250,
        minWidth: 130,
      },
      {
        accessor: "ACCT_CD",
        columnName: "Account Number",
        componentType: "editableNumberFormat",
        placeholder: "",
        FormatProps: {
          allowNegative: false,
          allowLeadingZeros: true,
          decimalScale: 0,
          isAllowed: (values) => {
            if (values?.value?.length > 13) {
              return false;
            }
            if (values.floatValue === 0) {
              return false;
            }
            return true;
          },
        },
        sequence: 6,
        alignment: "left",
        width: 150,
        maxWidth: 250,
        minWidth: 130,
      },
      {
        accessor: "TRN_PERTICULERS",
        columnName: "Trn. Perticulers",
        componentType: "editableTextField",
        sequence: 7,
        alignment: "left",
        width: 200,
        maxWidth: 300,
        minWidth: 150,
        maxLength: 100,
      },
      {
        accessor: "TRN_PERTICULERS2",
        columnName: "Trn. Perticulers2",
        componentType: "editableTextField",
        sequence: 8,
        alignment: "left",
        width: 200,
        maxWidth: 300,
        minWidth: 150,
        maxLength: 100,
      },
      {
        accessor: "CHRG_TEMP_TRAN_CD",
        columnName: "Charge Template",
        componentType: "editableSelect",
        sequence: 9,
        alignment: "center",
        width: 180,
        maxWidth: 250,
        minWidth: 120,
        options: () => GetChargeTemplates(),
        _optionsKey: "GetChargeTemplates",
      },
      {
        accessor: "CHARGE_ALLOW",
        columnName: "Charge",
        componentType: "editableCheckbox",
        sequence: 10,
        alignment: "center",
        width: 100,
        maxWidth: 150,
        minWidth: 70,
        defaultValue: true,
      },
      {
        columnName: "",
        componentType: "buttonRowCell",
        accessor: "SPECIAL_AMOUNT",
        sequence: 11,
        buttonLabel: "Special Amount",
        isVisible: false,
        __EDIT__: { isVisible: true },
      },
      {
        columnName: "Action",
        componentType: "deleteRowCell",
        accessor: "_hidden",
        sequence: 12,
      },
    ],
  },
};

export const AmountLabelsGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Special Amount",
    rowIdColumn: "LINE_ID",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: true,
    disableGroupBy: true,
    enablePagination: false,
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    containerHeight: {
      min: "40vh",
      max: "50vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
    hiddenFlag: "_hidden",
    disableLoader: true,
  },
  filters: [],
  columns: [
    {
      accessor: "_displaySequence",
      columnName: "Sr. No.",
      sequence: 1,
      alignment: "right",
      componentType: "default",
      width: 100,
      minWidth: 80,
      maxWidth: 120,
      isAutoSequence: true,
    },
    {
      accessor: "SPECIAL_AMT",
      columnName: "Amount Label",
      sequence: 6,
      alignment: "right",
      componentType: "editableNumberFormat",
      placeholder: "0.00",
      width: 200,
      minWidth: 180,
      maxWidth: 250,
      className: "textInputFromRight",
      FormatProps: {
        thousandSeparator: true,
        thousandsGroupStyle: "lakh",
        allowNegative: false,
        allowLeadingZeros: false,
        decimalScale: 0,
        isAllowed: (values) => {
          if (values?.value?.length > 14) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["This field is required"] }],
      },
    },
    {
      columnName: "Action",
      componentType: "deleteRowCell",
      accessor: "_hidden",
      sequence: 11,
      width: 120,
      minWidth: 120,
      maxWidth: 120,
    },
  ],
};

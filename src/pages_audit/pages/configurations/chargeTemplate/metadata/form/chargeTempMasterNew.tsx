import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";

export const chargeTempMasterDetailsMetaData: MasterDetailsMetaData = {
  masterForm: {
    form: {
      name: "addChargeTemp",
      label: "Service Charge Template Confirmation",
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
        render: { componentType: "datePicker" },

        name: "EFFECTIVE_DT",
        label: "Effective Date",
        format: "dd/MM/yyyy",
        placeholder: "DD/MM/YYYY",
        defaultValue: new Date(),
        required: true,
        maxLength: 150,
        GridProps: { xs: 12, md: 3, sm: 3 },
        fullWidth: true,
        schemaValidation: {
          type: "date",
          rules: [
            { name: "required", params: ["This Field is required"] },
            { name: "typeError", params: ["Must be a valid date"] },
          ],
        },
        autoComplete: "off",
      },
      {
        render: { componentType: "textField" },
        name: "DESCRIPTION",
        label: "Description",
        placeholder: "Enter Description",
        required: true,
        maxLength: 300,
        showMaxLength: false,
        GridProps: { xs: 12, md: 3, sm: 9 },
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
      containerHeight: { min: "45vh", max: "45vh" },
      allowRowSelection: false,
      hiddenFlag: "_hidden",
      disableLoader: true,
    },
    columns: [
      {
        accessor: "SR_CD",
        columnName: "Serial No",
        componentType: "default",
        sequence: 1,
        alignment: "right",
        width: 100,
        maxWidth: 150,
        minWidth: 70,
      },
      {
        accessor: "MIN_AMT",
        columnName: "Minimum Amount",
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
          if (!Boolean(value)) {
            return "This field is required.";
          }
          return "";
        },
        sequence: 2,
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
        alignment: "right",
        sequence: 3,
        width: 150,
        maxWidth: 250,
        minWidth: 130,
      },
      {
        accessor: "FROM_LIMIT",
        columnName: "From Amount",
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
        validation: (value, data, prev, next) => {
          if (!Boolean(value)) {
            return "This field is required.";
          } else if (
            Boolean(data["TO_LIMIT"]) &&
            parseFloat(data["TO_LIMIT"]) < parseFloat(value)
          ) {
            return "From Amount should be less then To Amount.";
          } else if (
            Array.isArray(prev) &&
            prev.length > 0 &&
            Boolean(parseFloat(prev[prev.length - 1]["TO_LIMIT"])) &&
            parseFloat(prev[prev.length - 1]["TO_LIMIT"]) >= parseFloat(value)
          ) {
            return "From Amount Should Be Greater Than Previous To Amount";
          }
          return "";
        },
        sequence: 4,
        alignment: "right",
        width: 150,
        maxWidth: 250,
        minWidth: 130,
      },
      {
        accessor: "TO_LIMIT",
        columnName: "To Amount",
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
          if (!Boolean(value)) {
            return "This field is required.";
          } else if (
            Boolean(data["FROM_LIMIT"]) &&
            parseFloat(data["FROM_LIMIT"]) > parseFloat(value)
          ) {
            return "To Amount should be greater than From Amount.";
          }
          return "";
        },
        sequence: 5,
        alignment: "right",
        width: 150,
        maxWidth: 250,
        minWidth: 130,
      },
      {
        accessor: "CHARGE_AMT",
        columnName: "Charge Amount",
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
        sequence: 6,
        alignment: "right",
        width: 150,
        maxWidth: 250,
        minWidth: 130,
      },

      {
        accessor: "CHARGE_PERC",
        columnName: "Charge Percent",
        componentType: "editableNumberFormat",
        placeholder: "0.00",
        className: "textInputFromRight",
        FormatProps: {
          allowNegative: false,
          allowLeadingZeros: false,
          decimalScale: 2,
          isAllowed: (values) => {
            if (values?.value?.length > 7) {
              return false;
            }
            if (values.floatValue === 0) {
              return false;
            }
            return true;
          },
        },

        sequence: 7,
        alignment: "right",
        width: 120,
        maxWidth: 250,
        minWidth: 100,
      },
      {
        accessor: "COMPARE_OR_ADD",
        columnName: "Compute",
        componentType: "editableSelect",
        defaultOptionLabel: "",
        options: [
          { label: "COMPARE MAX", value: "M" },
          { label: "COMPARE MIN", value: "N" },
          { label: "ADD", value: "A" },
        ],
        validation: (value, data) => {
          if (!Boolean(value)) {
            return "This field is required.";
          }
          return "";
        },
        sequence: 8,
        alignment: "left",
        width: 150,
        maxWidth: 250,
        minWidth: 150,
      },
      {
        columnName: "Action",
        componentType: "deleteRowCell",
        accessor: "_hidden",
        sequence: 11,
      },
    ],
  },
};

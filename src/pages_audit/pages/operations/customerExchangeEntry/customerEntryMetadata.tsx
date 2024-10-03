import { CustomTableMetadataType } from "../cashierExchangeEntry/tableComponent/type";
import * as API from "./api";
export const CustomerFormMetadata = {
  form: {
    name: "CustomerFormMetadata",
    label: "Exchange Cash (customer) (TRN/043)",
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
  fields: [
    {
      render: {
        componentType: "textField",
      },
      name: "REMARKS",
      defaultValue: "Customer Denomination Exchange",
      label: "Remark",
      GridProps: {
        xs: 12,
        sm: 6,
        md: 6,
        lg: 6,
        xl: 6,
      },
    },
  ],
};

export const CustomerEntryTableMetdata: CustomTableMetadataType = {
  key: "CashierEntryMetaDataArrayField",
  Mainlabel: "Cashier Exchange Entry",
  fields: [
    {
      name: "DENO_LABLE",
      label: "Denomination",
      componentType: "textField",
      isTotalWord: true,
      isExcess: true,
      align: "left",
      isReadOnly: true,
      isCalculation: true,
    },
    {
      name: "DENO_QTY",
      label: "Exchange Quantity",
      componentType: "numberFormat",
      align: "right",
      isReadOnly: false,
      dependentValue: ["DENO_VAL"],
      onChange: async (
        currentFieldValue,
        footerData,
        dependentValues,
        setDependentValue
      ) => {
        const CurrentValue = parseFloat(currentFieldValue || 0);
        const DependentValue = parseFloat(dependentValues?.[0] || 0);
        if (DependentValue > 0 && !isNaN(CurrentValue)) {
          const calculatedAmount = DependentValue * CurrentValue;
          if (!isNaN(calculatedAmount) && calculatedAmount) {
            setDependentValue("DENO_AMOUNT", calculatedAmount.toFixed(2));
          } else {
            setDependentValue("DENO_AMOUNT", "0.00");
          }
        }
      },
      // validation: async (
      //   currentFieldValue,
      //   rowData,
      //   dependentValues,
      //   setDependentValue,
      //   tableState,
      // ) => {
      //   const CurrentValue = parseFloat(currentFieldValue || 0);
      //   const DependentValue = parseFloat(dependentValues?.[0] || 0);
      //    if ( DependentValue > 0 && !isNaN(CurrentValue)) {
      //     const calculatedAmount = DependentValue * CurrentValue;
      //     if (!isNaN(calculatedAmount) && calculatedAmount) {
      //       setDependentValue("DENO_AMOUNT", calculatedAmount.toFixed(2));
      //     } else {
      //       setDependentValue("DENO_AMOUNT", "0.00");
      //     }
      //   }
      // },
    },
    {
      name: "DENO_AMOUNT",
      label: "Exchange Amount",
      componentType: "amountField",
      dependentValue: ["DENO_QTY"],
      align: "right",
      isCurrency: true,
      isExcess: true,
      isCalculation: true,
      isReadOnly: true,
    },
    {
      name: "AVAIL_QTY",
      label: "Available Quantity",
      componentType: "numberFormat",
      align: "right",
      isReadOnly: true,
    },
    {
      name: "AVAIL_VAL",
      label: "Available Amount",
      isCurrency: true,
      isCalculation: true,
      componentType: "amountField",
      isReadOnly: true,
    },
  ],
};

import { CustomTableMetadataType } from "./tableComponent.tsx/type";
export const CashierMetaData: CustomTableMetadataType = {
  key: "CashierEntryMetaDataArrayField",
  Mainlabel: "Cashier Exchange Entry",
  fields: [
    {
      name: "DENO_LABLE",
      label: "Denomination",
      componentType: "textField",
      isReadOnly: true,
      isTotalWord: true,
    },
    {
      name: "AVAIL_QTY",
      label: "Available Quantity",
      componentType: "numberFormat",
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
    {
      name: "DENO_VAL",
      label: "Denomination Value",
      componentType: "amountField",
      isReadOnly: true,
      isCurrency: true,
    },
    {
      name: "DENO_QTY",
      label: "Exchange Quantity",
      componentType: "numberFormat",
      isReadOnly: false,
      dependentValue: ["DENO_VAL", "AVAIL_QTY"],
      validation: async (
        currentFieldValue,
        rowData,
        dependentValues,
        setDependentValue,
        tableState
      ) => {
        const AvailableQty = dependentValues?.[1];
        const CurrentValue = parseFloat(currentFieldValue || 0);
        const DependentValue = parseFloat(dependentValues?.[0] || 0);
        const MessageShow = tableState?.MessageBox;
        if (
          DependentValue > 0 &&
          !isNaN(CurrentValue) &&
          CurrentValue <= AvailableQty
        ) {
          const calculatedAmount = DependentValue * CurrentValue;
          if (!isNaN(calculatedAmount) && calculatedAmount >= 0) {
            setDependentValue("DENO_AMOUNT", calculatedAmount.toFixed(2));
          } else {
            setDependentValue("DENO_AMOUNT", "0.00");
          }
        } else if (CurrentValue > AvailableQty) {
          const CheckValidation = await MessageShow({
            messageTitle: "ValidationFailed",
            message:
              "Denomination should be less than or equals Debit Cashier.",
            buttonNames: ["Ok"],
          });
          if (CheckValidation === "Ok") {
            setDependentValue("DENO_AMOUNT", "0.00");
            setDependentValue("DENO_QTY", "");
          }
        }
      },
    },
    {
      name: "DENO_AMOUNT",
      label: "Exchange Amount",
      componentType: "amountField",
      dependentValue: ["DENO_QTY"],
      isCurrency: true,
      isCalculation: true,
      isReadOnly: true,
    },
  ],
};

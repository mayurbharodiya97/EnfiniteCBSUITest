import { CustomTableMetadataType } from "../../tableComponent.tsx/type";

export const CashierConfirmationMetaData: CustomTableMetadataType = {
  key: "CashierEntryMetaDataArrayField",
  Mainlabel: "Cashier Exchange Entry",
  fields: [
    {
      name: "DENO_VALUE",
      label: "Value",
      componentType: "numberFormat",
      isReadOnly: true,
    },
    {
      name: "DENO_QTY",
      label: "Quantity",
      componentType: "numberFormat",
      isReadOnly: true,
    },
    {
      name: "AMOUNT",
      label: "Amount",
      isCurrency: true,
      isCalculation: true,
      componentType: "amountField",
      isReadOnly: true,
    },
  ],
};

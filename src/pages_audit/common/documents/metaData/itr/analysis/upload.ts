export const ITRUpload = [
  {
    columnName: "Financial Year",
    componentType: "editableNumberFormat",
    accessor: "finYear",
    sequence: 4,
    alignment: "left",
    FormatProps: {
      format: "####",
      placeholder: "YYYY",
      mask: ["Y", "Y", "Y", "Y"],
    },
    schemaValidation: {
      type: "string",
      rules: [{ name: "required", params: ["required"] }],
    },
  },
  {
    columnName: "Document Type",
    componentType: "editableSelect",
    accessor: "docTypeID",
    sequence: 5,
    alignment: "left",
    options: "getITRDocType",
    schemaValidation: {
      type: "string",
      rules: [{ name: "required", params: ["required"] }],
    },
  },
  {
    columnName: "Password",
    componentType: "editableTextField",
    accessor: "password",
    sequence: 6,
    alignment: "left",
    isPassword: true,
  },
  {
    columnName: "Remarks",
    componentType: "editableTextField",
    accessor: "remarks",
    sequence: 6,
    alignment: "left",
    isVisible: false,
  },
];

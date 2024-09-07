export const bankUpload = [
  {
    columnName: "Bank",
    componentType: "editableSelect",
    accessor: "bankLineID",
    sequence: 4,
    alignment: "left",
    options: "getBankListForLeadDocuments",
    schemaValidation: {
      type: "string",
      rules: [{ name: "required", params: ["required"] }],
    },
    disableCachingOptions: true,
  },
  {
    columnName: "Document Type",
    componentType: "editableSelect",
    accessor: "docTypeID",
    sequence: 5,
    alignment: "left",
    options: "getBankDocType",
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

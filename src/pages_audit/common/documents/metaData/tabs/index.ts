export const tabsLegal = [
  {
    label: "KYC",
    sequence: 0,
    docType: [
      {
        label: "Add Documents",
        type: "kyc",
        primary: true,
        categoryCD: "KYC_DOC_TYPE_CO",
      },
    ],
  },
  {
    label: "Bank",
    sequence: 1,
    docType: [
      {
        label: "Add Documents",
        type: "bank",
        primary: true,
        categoryCD: "BANK_DOC_TYPE",
      },
    ],
  },
  {
    label: "Financial",
    sequence: 2,
    docType: [
      { label: "ITR", type: "itr", primary: true, categoryCD: "ITR_DOC_TYPE" },
      {
        label: "Others",
        type: "itrOther",
        primary: false,
        categoryCD: "ITR_DOC_TYPE_O",
      },
    ],
  },
  {
    label: "GST",
    sequence: 3,
    docType: [
      {
        label: "Analysis",
        type: "gst",
        primary: true,
        categoryCD: "GST_DOC_TYPE",
      },
      {
        label: "Others",
        type: "gstOther",
        primary: true,
        categoryCD: "GST_DOC_TYPE_O",
      },
    ],
  },
  {
    label: "Others",
    sequence: 4,
    docType: [
      {
        label: "Add Documents",
        type: "other",
        primary: true,
        categoryCD: "OTHER_DOC_TYPE",
      },
    ],
  },
];

export const tabsManagement = [
  {
    label: "KYC",
    sequence: 0,
    docType: [
      {
        label: "Add Documents",
        type: "kyc",
        primary: true,
        categoryCD: "KYC_DOC_TYPE",
      },
    ],
  },
  {
    label: "Bank",
    sequence: 1,
    docType: [
      {
        label: "Add Documents",
        type: "bank",
        primary: true,
        categoryCD: "BANK_DOC_TYPE",
      },
    ],
  },
  {
    label: "Financial",
    sequence: 2,
    docType: [
      { label: "ITR", type: "itr", primary: true, categoryCD: "ITR_DOC_TYPE" },
      {
        label: "Others",
        type: "itrOther",
        primary: false,
        categoryCD: "ITR_DOC_TYPE_O",
      },
    ],
  },
  {
    label: "Others",
    sequence: 3,
    docType: [
      {
        label: "Add Documents",
        type: "other",
        primary: true,
        categoryCD: "OTHER_DOC_TYPE",
      },
    ],
  },
];

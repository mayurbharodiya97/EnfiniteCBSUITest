import { MetaDataType } from "components/dyanmicForm";
import { isValid } from "date-fns";
import { getMastersGridData, GetMiscValue } from "../api";

export const ClubMasterMetadata: MetaDataType = {
  form: {
    name: "clubMaster",
    label: "Club Master",
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
      render: { componentType: "hidden" },
      name: "TRAN_CD",
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ENTITY_CD",
      label: "Code",
      placeholder: "",
      type: "text",
      fullWidth: true,
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Code is required."] },
          { name: "ENTITY_CD", params: ["Please select Code."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "DESCRIPTION",
      label: "Description",
      placeholder: "",
      type: "text",
      fullWidth: true,
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Description is required."] },
          { name: "DESCRIPTION", params: ["Please select Description."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
      },
    },
    {
      render: {
        componentType: "select",
      },
      name: "TO_SOURCE",
      label: "Account Source",
      placeholder: "Please select Parent Type",
      options: () => GetMiscValue(),
      _optionsKey: "GetMiscValue",
      defaultValue: "",
      fullWidth: true,
      defaultOptionLabel: "Select Account Source",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_CD",
      label: "Account Number",
      placeholder: "",
      type: "text",
      fullWidth: true,
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Account Number is required."] },
          { name: "ACCT_CD", params: ["Please select Account Number."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "TRN_PERTICULERS",
      label: "Transaction Particulars",
      placeholder: "",
      type: "text",
      fullWidth: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "TRN_PERTICULERS2",
      label: "Transaction Particulars2",
      placeholder: "",
      type: "text",
      fullWidth: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REMARKS",
      label: "Remark",
      placeholder: "",
      type: "text",
      fullWidth: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 6,
      },
    },
    {
      render: { componentType: "hidden" },
      name: "POLICY_LABEL_EN",
      label: "Policy Label(English)",
      placeholder: "",
      type: "text",
      fullWidth: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 6,
      },
    },
    {
      render: { componentType: "hidden" },
      name: "POLICY_LABEL_BN",
      label: "Policy Label(English)",
      placeholder: "",
      type: "text",
      fullWidth: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 6,
      },
    },
  ],
};

export const ClubMemberListMetaData = {
  gridConfig: {
    dense: true,
    gridLabel: "Club Member Details",
    rowIdColumn: "SR_CD",
    defaultColumnConfig: { width: 150, maxWidth: 250, minWidth: 100 },
    allowColumnReordering: true,
    hideHeader: false,
    disableGroupBy: true,
    enablePagination: true,
    containerHeight: { min: "50vh", max: "50vh" },
    pageSizes: [15, 20, 30],
    defaultPageSize: 15,
    isCusrsorFocused: true,
  },
  columns: [
    {
      columnName: "ID",
      componentType: "default",
      accessor: "SR_CD",
      sequence: 1,
      alignment: "left",
      width: 70,
      maxWidth: 100,
      minWidth: 50,
    },
    {
      columnName: "Member ID",
      componentType: "default",
      accessor: "MEMBER_ID",
      sequence: 3,
      alignment: "left",
      width: 130,
      maxWidth: 200,
      minWidth: 100,
    },
    {
      columnName: "Member Name",
      componentType: "default",
      accessor: "MEMBER_NAME",
      sequence: 3,
      alignment: "left",
      width: 250,
      maxWidth: 400,
      minWidth: 180,
    },
    {
      accessor: "MEMBER_TYPE",
      columnName: "Member Type",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 130,
      maxWidth: 250,
      minWidth: 100,
    },
    {
      accessor: "MEMBER_SINCE",
      columnName: "Member Since",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 130,
      maxWidth: 250,
      minWidth: 100,
    },
    {
      accessor: "MEMBER_STATUS_VIEW",
      columnName: "Member Status",
      sequence: 7,
      alignment: "center",
      componentType: "default",
      width: 130,
      maxWidth: 250,
      minWidth: 100,
    },
  ],
};

export const ClubMemberMasterMetaData = {
  form: {
    name: "clubMemberDetails",
    label: "Club Member Detail",
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
      name: "TRAN_DT",
      label: "Entry Date",
      placeholder: "",
      type: "text",
      GridProps: {
        xs: 11,
        md: 3,
        sm: 3,
      },
      isReadOnly: true,
    },
    {
      render: {
        componentType: "spacer",
      },
      sequence: 14,
      GridProps: {
        xs: 1,
        md: 9,
        sm: 9,
      },
    },
    {
      render: {
        componentType: "select",
      },
      name: "CLUB_TRAN_CD",
      label: "Club ",
      placeholder: "",
      type: "text",
      required: true,
      options: () => getMastersGridData("C"),
      _optionsKey: "GetClubMemberData",
      disableCaching: false,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Club is required."] }],
      },
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
      },
      isReadOnly: true,
    },
    {
      render: {
        componentType: "textField",
      },
      name: "MEMBER_ID",
      label: "Member ID",
      placeholder: "",
      type: "text",
      required: true,
      maxLength: 50,
      showMaxLength: false,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Member ID is required."] }],
      },
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
      },
      __EDIT__: { isReadOnly: true },
      __NEW__: { isReadOnly: false, isFieldFocused: true },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "MEMBER_NAME",
      label: "Member Name",
      placeholder: "",
      type: "text",
      required: true,
      maxLength: 300,
      showMaxLength: false,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Member Name is required."] }],
      },
      GridProps: {
        xs: 12,
        md: 6,
        sm: 6,
      },
      __EDIT__: { isFieldFocused: true },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "MEMBER_TYPE",
      label: "Member Type",
      placeholder: "",
      maxLength: 50,
      showMaxLength: false,
      type: "text",
      GridProps: {
        xs: 12,
        md: 2,
        sm: 3,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "MEMBER_SINCE",
      label: "Member Since",
      placeholder: "DD/MM/YYYY",
      type: "text",
      GridProps: {
        xs: 12,
        md: 2,
        sm: 3,
      },
      validate: (value) => {
        if (Boolean(value?.value) && !isValid(value?.value)) {
          return "Must be a valid date";
        }
        return "";
      },
      format: "dd/MM/yyyy",
    },
    {
      render: {
        componentType: "select",
      },
      name: "MEMBER_STATUS",
      label: "Member Status",
      placeholder: "",
      type: "text",
      GridProps: {
        xs: 12,
        md: 2,
        sm: 3,
      },
      options: () => [
        { value: "Y", label: "Active" },
        { value: "N", label: "Deactive" },
      ],
      required: true,
      _optionsKey: "getMemberStatus",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Member Status is required."] }],
      },
    },
  ],
};

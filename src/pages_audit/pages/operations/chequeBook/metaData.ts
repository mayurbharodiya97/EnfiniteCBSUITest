// import { AuthContext } from "pages_audit/auth";
import { format } from "date-fns";

import { MetaDataType } from "components/dyanmicForm";
import { useGetDataMutation } from "./chequeBookEntry";

export const ChequeBookIssueEntry: MetaDataType = {
  form: {
    name: "chequeBookForm",
    label: "Cheque Book Issue",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",

    render: {
      ordering: "sequence",
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
      name: "BRANCH_CD",
      // sequence: 1,
      label: "Branch",
      placeholder: "Branch",
      type: "text",
      required: true,
      // maxLength: 16,

      GridProps: {
        xs: 12,
        md: 1,
        sm: 1,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_TYPE",
      // sequence: 1,
      label: "Account Type",
      placeholder: "Enter Account Type",
      type: "text",
      required: true,
      // maxLength: 16,

      GridProps: {
        xs: 12,
        md: 1,
        sm: 1,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_CD",
      // sequence: 1,
      label: "Account No.",
      placeholder: "Enter Account No.",
      type: "text",
      required: true,
      // maxLength: 16,

      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "NO_OF_LEAVE",
      // sequence: 2,
      label: "No of Leaves",
      placeholder: "Select No of Leaves",
      enableDefaultOption: true,
      required: true,
      GridProps: {
        xs: 12,
        md: 1,
        sm: 1,
      },
      dependentFields: ["BRANCH_CD", "ACCT_TYPE", "ACCT_CD"],
      runValidationOnDependentFieldsChange: true,
      // setValueOnDependentFieldsChange: useGetDataMutation,

      // setValueOnDependentFieldsChange: (dependent) => {
      //   if (
      //     typeof dependent["ACTIVE_FLAG"]?.value === "boolean" &&
      //     !Boolean(dependent["ACTIVE_FLAG"]?.value)
      //   ) {
      //     return format(new Date(), "dd/MM/yyyy HH:mm:ss");
      //   }
      //   return null;
      // },
      // shouldExclude: (val1, dependent) => {
      //   if (
      //     typeof dependent["ACTIVE_FLAG"]?.value === "boolean" &&
      //     Boolean(dependent["ACTIVE_FLAG"]?.value)
      //   ) {
      //     return true;
      //   }
      //   return false;
      // },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "NO_OF_CHEQUEBOOK",
      // sequence: 3,
      label: "No of Cheque Book(s)",
      placeholder: "Enter no of Cheque book",
      type: "text",
      required: true,
      // maxLength: 32,
      // schemaValidation: {
      //   type: "string",
      //   rules: [{ name: "required", params: ["User Name is required."] }],
      // },
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CHARACTERISTICS",
      // sequence: 4,
      label: "Characteristics",
      placeholder: "",
      type: "text",
      required: true,
      // options: () => {
      //   return GeneralAPI.GetSecurityGroupingList();
      // },
      // enableDefaultOption: true,
      // _optionsKey: "GetSecurityGroupingList",
      // schemaValidation: {
      //   type: "string",
      //   rules: [{ name: "required", params: ["Group Name is required."] }],
      // },
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "PAYABLE_AT_PAR",
      // sequence: 5,
      label: "Payable At PAR",
      placeholder: "",
      type: "text",
      required: true,
      // maxLength: 11,
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "AMOUNT",
      // sequence: 7,
      label: "Service Charge",
      placeholder: "",
      type: "text",
      required: true,
      // maxLength: 100,

      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "SERVICE_CHARGE",
      // sequence: 8,
      label: "GST",
      placeholder: "",
      type: "text",
      required: true,
      // maxLength: 100,

      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REQUISITION_DATE",
      sequence: 9,
      label: "Requisition Date",
      placeholder: "",
      // options: () => {
      //   return GeneralAPI.GetMiscValue("USER_SUB_TYPE");
      // },
      // enableDefaultOption: true,
      // _optionsKey: "GetSubTypeMiscValue",
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "REMARKS",
      sequence: 10,
      label: "Remark",
      placeholder: "Enter remark.",
      // options: () => {
      //   return GeneralAPI.GetUsersNotificationTemplateList();
      // },
      // enableDefaultOption: true,
      // _optionsKey: "GetUsersNotificationTemplateList",
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "INACTIVE_DATE",
      sequence: 12,
      label: "Inactive Date",
      isReadOnly: true,
      placeholder: "",
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
      },
      dependentFields: ["ACTIVE_FLAG"],
      runValidationOnDependentFieldsChange: true,
      setValueOnDependentFieldsChange: (dependent) => {
        if (
          typeof dependent["ACTIVE_FLAG"]?.value === "boolean" &&
          !Boolean(dependent["ACTIVE_FLAG"]?.value)
        ) {
          return format(new Date(), "dd/MM/yyyy HH:mm:ss");
        }
        return null;
      },
      shouldExclude: (val1, dependent) => {
        if (
          typeof dependent["ACTIVE_FLAG"]?.value === "boolean" &&
          Boolean(dependent["ACTIVE_FLAG"]?.value)
        ) {
          return true;
        }
        return false;
      },
      __EDIT__: { render: { componentType: "textField", group: 0 } },
    },
  ],
};

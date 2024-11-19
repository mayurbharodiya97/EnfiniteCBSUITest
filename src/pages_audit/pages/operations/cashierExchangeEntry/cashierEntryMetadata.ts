import * as API from "./api";
export const cashierEntryFormMetaData = {
  form: {
    name: "CashierEntryMetaDataForm",
    label: "",
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
        componentType: "autocomplete",
      },
      name: "From_User",
      label: "From User",
      options: (dependentValue, formState, _, authState) =>
        API.getFromUserDdw({
          DEF_COMP_CD: authState?.companyID,
          DEF_BRANCH_CD: authState?.user?.branchCode,
          USER_LEVEL: authState?.role,
          FLAG: "FROMUSER",
          A_USER: authState?.user?.id,
        }),
      _optionsKey: "fromUser",
      postValidationSetCrossFieldValues: (
        currentField,
        formState,
        authState,
        dependentFieldValue,
        reqFlag
      ) => {
        formState.setDataOnFieldChange("FROM_USER", currentField);
      },
      defaultValue: "",
      placeholder: "",
      type: "text",
      GridProps: {
        xs: 12,
        sm: 3,
        md: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "To",
      label: "To User",
      options: (dependentValue, formState, _, authState) =>
        API.getFromUserDdw({
          DEF_COMP_CD: authState?.companyID,
          DEF_BRANCH_CD: authState?.user?.branchCode,
          USER_LEVEL: authState?.role,
          FLAG: "TOUSER",
          A_USER: authState?.user?.id,
        }),
      dependentFields: ["From_User"],
      postValidationSetCrossFieldValues: (
        currentField,
        formState,
        authState,
        dependentFieldValue,
        reqFlag
      ) => {
        if (dependentFieldValue?.From_User?.value === currentField?.value) {
          formState.MessageBox({
            messageTitle: "Validation Failed",
            message: "From & To user cannot be same.",
            buttonNames: ["Ok"],
          });
          return {
            To: { value: "", isFieldFocused: true },
          };
        }
      },
      _optionsKey: "toUser",
      defaultValue: "  ",
      placeholder: "",
      type: "text",
      GridProps: {
        xs: 12,
        sm: 3,
        md: 3,
        lg: 3,
        xl: 3,
      },
    },
  ],
};

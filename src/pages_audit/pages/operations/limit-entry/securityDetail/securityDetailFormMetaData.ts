import { getSecurityListData } from "../api";

export const securityDetailMetaData = {
  form: {
    name: "security-detail-form",
    label: "SecurityDetail",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    hideHeader: true,
    render: {
      ordering: "auto",
      // ordering: "sequence",
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
          height: "35vh",
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
      name: "SECURITY_TYPE",
      label: "SecurityType",
      fullWidth: true,
      dependentFields: ["PARENT_TYPE", "BRANCH_CD"],
      options: (dependentValue, formState, _, authState) => {
        if (
          dependentValue?.PARENT_TYPE?.value &&
          dependentValue?.BRANCH_CD?.value
        ) {
          let apiReq = {
            COMP_CD: authState?.companyID,
            BRANCH_CD: dependentValue?.BRANCH_CD?.value,
            A_PARENT_TYPE: dependentValue?.PARENT_TYPE?.value,
          };
          return getSecurityListData(apiReq);
        }
        return [];
      },
      disableCaching: true,
      _optionsKey: "getSecurityListData",
      GridProps: {
        xs: 12,
        md: 3.5,
        sm: 3.5,
        lg: 3.5,
        xl: 3.5,
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "FD_ACCT_CD",
      label: "CertificateNumber",
      isReadOnly: true,
      fullWidth: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "COLLATERAL_NAME",
      label: "CollateralName",
      required: true,
      fullWidth: true,
      placeholder: "EnterCollateralName",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      GridProps: {
        xs: 12,
        md: 3.5,
        sm: 3.5,
        lg: 3.5,
        xl: 3.5,
      },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "LIEN_YEN_NO",
      label: "LienYesNo",
      required: true,
      defaultValue: "Y",
      options: [
        { label: "Yes", value: "Y" },
        { label: "No", value: "N" },
      ],
      fullWidth: true,
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "ISSUE_DATE",
      fullWidth: true,
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      label: "IssueDate",
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },

    {
      render: {
        componentType: "autocomplete",
      },
      name: "PERIOD_CD",
      label: "Period",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      defaultValue: "D",
      options: [
        { label: "DAY(S)", value: "D" },
        { label: "MONTH(S)", value: "M" },
        { label: "YEAR(S)", value: "Y" },
      ],
      fullWidth: true,
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "PERIOD_NO",
      label: "PeriodNumber",
      fullWidth: true,
      dependentFields: ["ISSUE_DATE", "PERIOD_CD"],
      placeholder: "PeriodNumber",
      required: true,
      FormatProps: {
        allowNegative: false,
        decimalScale: 0,
        isAllowed: (values) => {
          if (values?.value?.length > 5 || values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      postValidationSetCrossFieldValues: (
        field,
        formState,
        auth,
        dependentValue
      ) => {
        let date1 = new Date(dependentValue?.ISSUE_DATE?.value);
        let flag = dependentValue?.PERIOD_CD?.value;
        let value = Number(field?.value);

        if (value && date1 && flag) {
          // Function to calculate the new date
          function calculateNewDate(date, flag, value) {
            let newDate = new Date(date);

            switch (flag) {
              case "D":
                newDate.setDate(date.getDate() + value);
                break;
              case "M":
                newDate.setMonth(date.getMonth() + value);
                break;
              case "Y":
                newDate.setFullYear(date.getFullYear() + value);
                break;
              default:
                throw new Error("Invalid flag");
            }
            return newDate;
          }

          let date2 = calculateNewDate(date1, flag, value);

          return {
            EXP_DATE: { value: date2 },
          };
        }
      },
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },

    {
      render: {
        componentType: "datePicker",
      },
      name: "EXP_DATE",
      label: "ExpiryDate",
      isReadOnly: true,
      fullWidth: true,
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "COLLATERAL_AMT",
      label: "CollateralAmount",
      required: true,
      fullWidth: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "MATURED_AMT",
      label: "MaturityAmount",
      fullWidth: true,
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },

    {
      render: {
        componentType: "rateOfInt",
      },
      name: "COLLATERAL_RATE",
      label: "CollateralRate",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      fullWidth: true,
      required: true,
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "ISSUE_COMPANY",
      label: "IssuedBy",
      fullWidth: true,
      placeholder: "IssueCompany",
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "REGISTRATION_NO",
      label: "RegistrationNumber",
      placeholder: "RegistrationNumber",
      fullWidth: true,
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "Remark",
      },
      name: "COLLATERAL_REMARKS",
      fullWidth: true,
      placeholder: "EnterRemarks",
      label: "CollateralRemarks",
      GridProps: {
        xs: 12,
        md: 6,
        sm: 6,
        lg: 6,
        xl: 6,
      },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "BRANCH_CD",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "PARENT_TYPE",
    },
  ],
};

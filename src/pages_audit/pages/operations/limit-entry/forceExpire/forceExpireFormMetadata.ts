import { t } from "i18next";

export const forceExpireMetaData = {
  form: {
    name: "limit-force-expired",
    label: "ForceExpireLimit",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    hideHeader: true,
    formStyle: {
      background: "white",
      height: "calc(100vh - 390px)",
      overflowY: "auto",
      overflowX: "hidden",
    },
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
        componentType: "amountField",
      },
      name: "LIMIT_AMOUNT",
      label: "LimitAmount",
      isReadOnly: true,
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
      name: "SECURITY_CD",
      label: "SecurityCode",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 1.5,
        sm: 1.5,
        lg: 1.5,
        xl: 1.5,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "FD_BRANCH_CD",
      label: "FDBranchCode",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 1.5,
        sm: 1.5,
        lg: 1.5,
        xl: 1.5,
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "FD_TYPE",
      label: "FDType",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 1.5,
        sm: 1.5,
        lg: 1.5,
        xl: 1.5,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "FD_ACCT_CD",
      label: "FDAccountNumber",
      isReadOnly: true,
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
      name: "FD_NO",
      label: "FDNumber",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 1.5,
        sm: 1.5,
        lg: 1.5,
        xl: 1.5,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "SECURITY_VALUE",
      label: "SecurityValue",
      isReadOnly: true,
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
      name: "ENTRY_DT",
      label: "EntryDate",
      isReadOnly: true,
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
      name: "TRAN_DT",
      label: "EffectiveDate",
      isReadOnly: true,
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
      name: "EXPIRY_DT",
      label: "ExpiryDate",
      isReadOnly: true,
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
      name: "MARGIN",
      label: "Margin%",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 1.5,
        sm: 1.5,
        lg: 1.5,
        xl: 1.5,
      },
    },

    {
      render: {
        componentType: "rateOfInt",
      },
      name: "INT_RATE",
      label: "IntRate",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 1.5,
        sm: 1.5,
        lg: 1.5,
        xl: 1.5,
      },
    },
    {
      render: {
        componentType: "rateOfInt",
      },
      name: "PENAL_RATE",
      label: "PenalRate",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 1.5,
        sm: 1.5,
        lg: 1.5,
        xl: 1.5,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "DRAWING_POWER",
      label: "DrawingPower",
      defaultValue: "0",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 1.5,
        sm: 1.5,
        lg: 1.5,
        xl: 1.5,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "SECURITY",
      label: "Description",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
        lg: 4,
        xl: 4,
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "REMARKS",
      label: "Remarks",
      placeholder: "EnterRemarks",

      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
        lg: 4,
        xl: 4,
      },
    },

    {
      render: {
        componentType: "datePicker",
      },
      name: "RESOLUTION_DATE",
      label: "ResolutionDate",
      isReadOnly: true,
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
      name: "FORCE_EXP_DT",
      isWorkingDate: true,
      label: "ForcedExpiredDate",
      placeholder: "ForcedExpiredDate",
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
        componentType: "hidden",
      },
      name: "EXPIRED_FLAG",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "FORCE_EXP_VERIFIED_BY",
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
      name: "TRAN_CD",
    },
  ],
};

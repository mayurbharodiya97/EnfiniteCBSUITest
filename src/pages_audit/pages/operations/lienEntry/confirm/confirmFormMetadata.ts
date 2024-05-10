export const lienconfirmFormMetaData = {
  form: {
    name: "lien-confirmation-form",
    label: "Confirmation Detail",
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
        componentType: "textField",
      },
      name: "LIEN_CD",
      label: "Lien Code",
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },

    {
      render: {
        componentType: "amountField",
      },
      name: "LIEN_AMOUNT",
      label: "Lien Amount",
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "LIEN_STATUS",
      label: "Lien Status",
      options: () => {
        return [
          { value: "A", label: "Active" },
          { value: "E", label: "Expired" },
        ];
      },
      _optionsKey: "LIEN_STATUS",
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "PARENT_CD_NM",
      label: "Parent Code/Name",
      GridProps: {
        xs: 12,
        md: 4.8,
        sm: 4.8,
        lg: 4.8,
        xl: 4.8,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "EFECTIVE_DT",
      label: "Effective Date",
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "REMOVAL_DT",
      label: "Removal Date",
      GridProps: {
        xs: 12,
        md: 2.4,
        sm: 2.4,
        lg: 2.4,
        xl: 2.4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "LIEN_REASON_CD",
      label: "Reason",
      GridProps: {
        xs: 12,
        md: 3.6,
        sm: 3.6,
        lg: 3.6,
        xl: 3.6,
      },
    },

    {
      render: {
        componentType: "Remark",
      },
      name: "REMARKS",
      label: "Remarks",
      GridProps: {
        xs: 12,
        md: 3.6,
        sm: 3.6,
        lg: 3.6,
        xl: 3.6,
      },
    },
  ],
};

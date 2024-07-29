import * as API from "../api/api";
export const UserOnboardform = {
  form: {
    name: "AddSecurityUser",
    label: "User Onboarding",
    resetFieldOnUnmount: false,
    readonly:true,
    validationRun: "onBlur",
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 12,
          md: 12,
          lg: 12,
          xl: 12,
        },
        container: {
          direction: "row",
          spacing: 2,
        },
      },
    },
    componentProps: {
      datePicker: {
        fullWidth: true,
      },
      select: {
        fullWidth: true,
      },
      textField: {
        fullWidth: true,
      },
      numberFormat: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: { componentType: "textField" },
      name: "USER_NAME",
      sequence: 1,
      type: "text",
      label: "User ID",
      placeholder: "User ID",
      autoComplete: "off",
      maxLength: 15,
      isFieldFocused: true,
      __EDIT__: { isReadOnly: true },
      __NEW__: {
        required: true,
        validate: async (columnValue, allField, flag) => {
          const regex = /^[^A-Z]*$/;
          if (!regex.test(columnValue.value)) {
            return "Username should not contain capital letters.";
          }
        },
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFields
        ) => {
          if (currentField?.value !== undefined) {
            return API.checkUsername(currentField, {
              USER_NM: currentField?.value,
            });
          }
        },
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["User ID is required."] }],
        },
      },
      GridProps: {
        xs: 12,
        sm: 2,
        md: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: { componentType: "passwordField" },
      name: "USER_PASSWORD",
      sequence: 2,
      type: "password",
      label: "New Password",
      required: true,
      maxLength: 16,
      placeholder: "Password",
      autoComplete: "off",
      allowToggleVisiblity: true,
      fullWidth: true,
      dependentFields: ["USER_NAME"],
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFields
      ) => {
        let request = {
          USER_ID: dependentFields?.USER_NAME?.value,
          PASSWORD: currentField?.value,
          SCREEN_REF: "MST/131",
        };
        let postData = await API.validatePasswords({ request });
        if (postData.length > 0) {
          if (postData?.[0]?.O_STATUS === "999") {
            let buttonName = await formState.MessageBox({
              messageTitle: "ValidationFailed",
              message: postData?.[0]?.O_MESSAGE,
              buttonNames: ["Ok"],
            });
            if (buttonName === "Ok") {
              return {
                USER_PASSWORD: {
                  value: "",
                  isFieldFocused: true,
                  ignoreUpdate: true,
                },
              };
            }
          }
        }
      },
      __EDIT__: {
        shouldExclude(fieldData, dependentFieldsValues, formState) {
          return true;
        },
      },
      __VIEW__: {
        shouldExclude(fieldData, dependentFieldsValues, formState) {
          return true;
        },
      },
      GridProps: {
        xs: 12,
        sm: 2,
        md: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: { componentType: "passwordField" },
      name: "CNF_PASSWORD",
      sequence: 3,
      type: "password",
      label: "Confirm Password",
      required: true,
      dependentFields: ["USER_PASSWORD"],
      placeholder: "Confirm Password",
      allowToggleVisiblity: true,
      ignoreInSubmit: false,
      fullWidth: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Confirm Password is required."] },
        ],
      },
      validate: (currentField, dependentFields) => {
        if (currentField?.value !== dependentFields?.USER_PASSWORD?.value) {
          return "NewPasswordandConfirmPassworddidnotmatched";
        } else {
          return "";
        }
      },
      __EDIT__: {
        ignoreInSubmit: true,
        shouldExclude(fieldData, dependentFieldsValues, formState) {
          return true;
        },
      },
      __VIEW__: {
        ignoreInSubmit: true,
        shouldExclude(fieldData, dependentFieldsValues, formState) {
          return true;
        },
      },
      GridProps: {
        xs: 12,
        sm: 2,
        md: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: { componentType: "textField" },
      name: "DESCRIPTION",
      sequence: 4,
      type: "text",
      label: "Username",
      txtTransform: "uppercase",
      required: true,
      placeholder: "User Name",
      autoComplete: "off",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["User Name is required."] }],
      },
      __EDIT__: {
        GridProps: {
          xs: 12,
          sm: 2,
          md: 2,
          lg: 2,
          xl: 2,
        },
      },
      GridProps: {
        xs: 12,
        sm: 2,
        md: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "select",
      },
      name: "GROUP_NAME",
      label: "Group Name",
      sequence: 5,
      placeholder: "Select Group",
      type: "text",
      options: () => API.getsecmstgrpdrpdwn(),
      _optionsKey: "GetGroupList",
      disableCaching: true,
      autoComplete: "off",
      GridProps: {
        xs: 12,
        sm: 2,
        md: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: { componentType: "phoneNumberOptional" },
      name: "CONTACT2",
      sequence: 6,
      maxLength: 10,
      type: "text",
      label: "Mobile Number",
      StartAdornment: "+91",
      placeholder: "",
      autoComplete: "off",
      GridProps: {
        xs: 12,
        sm: 2,
        md: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: { componentType: "numberFormat" },
      name: "CUSTOMER_ID",
      sequence: 7,
      type: "text",
      maxLength: 12,
      label: "Customer ID",
      required: false,
      placeholder: "Customer ID",
      schemaValidation: {},
      autoComplete: "off",
      postValidationSetCrossFieldValues: async (
        currentField,
        formState,
        authState,
        dependentFields
      ) => {
        if (currentField?.value.length > 0) {
          return API.getCustomerId(currentField, {
            COMP_CD : authState?.companyID,
            CUSTOMER_ID: currentField?.value,
          });
        }
      },
      GridProps: {
        xs: 12,
        sm: 2,
        md: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: { componentType: "textField" },
      name: "ACCT_NM",
      sequence: 8,
      type: "text",
      label: "Customer id name",
      isReadOnly: true,
      placeholder: "Customer id Name",
      dependentFields: ["CUSTOMER_ID"],
      GridProps: {
        xs: 12,
        sm: 2,
        md: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: { componentType: "textField" },
      name: "REPORTING_NM",
      sequence: 9,
      type: "text",
      maxLength: 20,
      label: "Reporting Name",
      GridProps: {
        xs: 12,
        sm: 2,
        md: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: { componentType: "autocomplete" },
      name: "USER_LEVEL",
      sequence: 10,
      type: "text",
      label: "User Level",
      required: true,
      options: [
        { label: "AUDITOR", value: "-2" },
        { label: "CASHIER", value: "-1" },
        { label: "CLERK", value: "1" },
        { label: "OFFICER", value: "2" },
        { label: "MANAGER", value: "3" },
        { label: "ADMIN", value: "4" },
      ],
      placeholder: "Default Branch",
      __NEW__: { defaultValue: "1" },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["User Level is required."] }],
      },
      GridProps: {
        xs: 12,
        sm: 2,
        md: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "DEF_COMP_CD",
      label: "Default Bank",
      sequence: 11,
      placeholder: "Select Bank",
      type: "text",
      options: API.getSecmstBankcd,
      _optionsKey: "GetBankList",
      defaultValue: "132 ",
      disableCaching: true,
      autoComplete: "off",
      GridProps: {
        xs: 12,
        sm: 2,
        md: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "DEF_BRANCH_CD",
      label: "Default Branch",
      sequence: 12,
      placeholder: "Select Bank",
      type: "text",
      options: API.getSecmstBranchcd,
      _optionsKey: "GetBranchList",
      autoComplete: "off",
      GridProps: {
        xs: 12,
        sm: 2,
        md: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: { componentType: "numberFormat" },
      name: "FROM_SLIP_CD",
      sequence: 13,
      type: "text",
      maxLength: 5,
      label: "Clg.slip.No.Start From",
      placeholder: "",
      autoComplete: "off",
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 5) {
            return false;
          }
          return true;
        },
      },
      __EDIT__: {
        GridProps: {
          xs: 12,
          sm: 2,
          md: 2,
          lg: 2,
          xl: 2,
        },
      },
      GridProps: {
        xs: 12,
        sm: 1.5,
        md: 1.5,
        lg: 1.5,
        xl: 1.5,
      },
    },
    {
      render: { componentType: "numberFormat" },
      name: "EMP_ID",
      sequence: 14,
      maxLength: 14,
      type: "text",
      ignoreInSubmit: true,
      label: "Employee Id",
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 14) {
            return false;
          }
          return true;
        },
      },
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (formState?.sharing) {
          if (formState?.sharing?.[0]?.ACUTE_PAYROLL  === "Y") {
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      },
      __EDIT__: {
        GridProps: {
          xs: 12,
          sm: 2,
          md: 2,
          lg: 2,
          xl: 2,
        },
      },
      GridProps: {
        xs: 12,
        sm: 1.5,
        md: 1.5,
        lg: 1.5,
        xl: 1.5,
      },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "DOC_SIGN_CONFIG",
      label: "Digital Sign Config",
      sequence: 15,
      options: (dependentValue, formState, _, authState) =>
        API.getDigitalSignConfigddw(
          authState?.baseCompanyID,
          authState?.user?.baseBranchCode
        ),
      _optionsKey: "GetDigitalSignConfig",
      placeholder: "",
      type: "text",
      __EDIT__: {
        GridProps: {
          xs: 12,
          sm: 2,
          md: 2,
          lg: 2,
          xl: 2,
        },
      },
      GridProps: {
        xs: 12,
        sm: 1.5,
        md: 1.5,
        lg: 1.5,
        xl: 1.5,
      },
    },
    {
      render: { componentType: "textField" },
      name: "ADUSER_NAME",
      sequence: 16,
      type: "text",
      label: "Ad Username",
      required: true,
      ignoreInSubmit: true,
      placeholder: "username@domain name",
      autoComplete: "off",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Ad User Name is required."] }],
      },
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (formState?.sharing) {
          if (formState?.sharing?.[0]?.AD_PARA === "Y") {
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      },
      GridProps: {
        xs: 12,
        sm: 2,
        md: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: { componentType: "checkbox" },
      name: "SIGN_VIEW",
      sequence: 17,
      label: "View Signature",
      autoComplete: "off",
      __EDIT__: {
        GridProps: {
          xs: 12,
          sm: 2,
          md: 2,
          lg: 2,
          xl: 2,
        },
      },
      GridProps: {
        xs: 12,
        sm: 1.5,
        md: 1.5,
        lg: 1.5,
        xl: 1.5,
      },
    },
    {
      render: { componentType: "checkbox" },
      name: "ALLOW_RELEASE",
      sequence: 18,
      label: " Allow Release",
      autoComplete: "off",
      GridProps: {
        xs: 12,
        sm: 2,
        md: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: { componentType: "checkbox" },
      name: "ALLOW_DOC_SIGN",
      sequence: 19,
      label: "Allow Digital Sign",
      autoComplete: "off",
      GridProps: {
        xs: 12,
        sm: 2,
        md: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: { componentType: "checkbox" },
      name: "ACTIVE_FLAG",
      sequence: 20,
      label: "Active",
      autoComplete: "off",
      __NEW__: {
        shouldExclude(fieldData, dependentFieldsValues, formState) {
          return true;
        },
      },
      GridProps: {
        xs: 12,
        sm: 2,
        md: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: { componentType: "checkbox" },
      name: "MULTI_APP_ACCESS",
      sequence: 21,
      label: "Allow Concurrent",
      autoComplete: "off",
      __EDIT__: {
        GridProps: {
          xs: 12,
          sm: 2,
          md: 2,
          lg: 2,
          xl: 2,
        },
      },
      GridProps: {
        xs: 12,
        sm: 1.5,
        md: 1.5,
        lg: 1.5,
        xl: 1.5,
      },
    },
    {
      render: { componentType: "datePicker" },
      name: "INACTIVE_DATE",
      sequence: 22,
      label: "Inactive Date",
      type: "text",
      __EDIT__:{
        ignoreInSubmit: (dependentFieldsValues) => {
          if (
            dependentFieldsValues?.ACTIVE_FLAG?.value === true ||
            dependentFieldsValues?.ACTIVE_FLAG?.value === "Y"
          ) {
            return true;
          } else {
            return false;
          }
        },
      },
      autoComplete: "off",
      defaultValue: new Date(),
      dependentFields: ["ACTIVE_FLAG"],
      __NEW__: {
        ignoreInSubmit: true,
        shouldExclude(fieldData, dependentFieldsValues, formState) {
          return true;
        },
      },
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (
          dependentFieldsValues?.ACTIVE_FLAG?.value === true ||
          dependentFieldsValues?.ACTIVE_FLAG?.value === "Y"
        ) {
          return true;
        } else {
          return false;
        }
      },
      GridProps: {
        xs: 12,
        sm: 2,
        md: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "typography",
      },
      name: "DIVIDER",
      label: "",
      TypographyProps: {
        style: {
          whiteSpace: "pre-line",
          color: "var(--theme-color1)",
          fontSize: "1.2rem",
          borderBottom: "3px dashed #ccc",
          width: "100%",
          height: "0px",
        },
      },
      GridProps: {
        xs: 12,
        md: 12,
        sm: 12,
        style: { alignSelf: "center" },
      },
    },
    {
      render: { componentType: "amountField" },
      name: "DR_CASH_LIMIT",
      sequence: 23,
      type: "text",
      label: "Debit Cash Limit",
      maxLength: 14,
      autoComplete: "off",
      placeholder: "Debit Cash Limit",
      GridProps: {
        xs: 12,
        sm: 2,
        md: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: { componentType: "amountField" },
      name: "DR_CLG_LIMIT",
      sequence: 24,
      type: "text",
      label: "Debit Clearing Limit",
      maxLength: 14,
      autoComplete: "off",
      placeholder: "",
      GridProps: {
        xs: 12,
        sm: 2,
        md: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: { componentType: "amountField" },
      name: "DR_TRF_LIMIT",
      sequence: 25,
      type: "text",
      label: "Debit Transfer Limit",
      maxLength: 14,
      autoComplete: "off",
      placeholder: "Credit Cash Limit",
      GridProps: {
        xs: 12,
        sm: 2,
        md: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: { componentType: "amountField" },
      name: "CR_CASH_LIMIT",
      sequence: 26,
      type: "text",
      maxLength: 14,
      label: "Credit Cash Limit",
      placeholder: "",
      autoComplete: "off",
      GridProps: {
        xs: 12,
        sm: 2,
        md: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: { componentType: "amountField" },
      name: "CR_CLG_LIMIT",
      sequence: 27,
      type: "text",
      label: "Credit Clearing Limit",
      maxLength: 14,
      autoComplete: "off",
      placeholder: " ",
      GridProps: {
        xs: 12,
        sm: 2,
        md: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: { componentType: "amountField" },
      name: "CR_TRF_LIMIT",
      sequence: 28,
      type: "text",
      label: "Credit Transfer Limit",
      maxLength: 14,
      autoComplete: "off",
      placeholder: "Credit Cash Limit",
      GridProps: {
        xs: 12,
        sm: 2,
        md: 2,
        lg: 2,
        xl: 2,
      },
    },
  ],
};
export const loginShift = {
  form: {
    name: "LoginShift",
    label: "Login Shift",
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
      name: "DEMO",
      label: "Demo",
      placeholder: "",
      isReadOnly: true,
      disableCaching: true,
      ignoreInSubmit: true,
      type: "text",
      GridProps: { xs: 6, sm: 2, md: 2, lg: 2, xl: 2 },
      shouldExclude() {
        return true;
      },
      dependentFields: ["LOGINSHIFT"],
      postValidationSetCrossFieldValues: async (
        currentFieldState,
        formState,
        auth,
        dependentFieldState,
        dependentFields
      ) => {
        const Data: any[] = [];
        const Test = Array.isArray(dependentFieldState?.["LOGINSHIFT"])
          ? dependentFieldState["LOGINSHIFT"].map((item, index) => {
              const values = item.DESCRIPTION?.value;
              if (values) {
                if (Data.includes(values)) {
                  formState.MessageBox({
                    messageTitle: "ValidationFailed",
                    message: `Duplicate value found at row ${index + 1}`,
                    buttonNames: ["Ok"],
                  });
                  return {
                    ["dependentFieldState.LOGINSHIFT.DESCRIPTION"]: {
                      value: "",
                    },
                  };
                } else {
                  Data.push(values);
                }
              }
              return values;
            })
          : [];

        return Test;
      },
    },
    {
      render: {
        componentType: "arrayField",
      },
      name: "LOGINSHIFT",
      enableGrid: true,
      changeRowOrder: true,
      removeRowFn: "deleteFormArrayFieldData",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
        {
          render: {
            componentType: "autocomplete",
          },
          name: "DESCRIPTION",
          label: "Login Shift",
          options: (dependentValue, formState, _, authState) =>
            API.getLoginShiftddw({
              COMP_CD: authState?.companyID,
              BRANCH_CD: authState?.user?.branchCode,
            }),
          disableCaching: true,
          _optionsKey: "GetLoginShift",
          placeholder: "",
          type: "text",
          GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 4 },
          postValidationSetCrossFieldValues: async (
            currentFieldState,
            formState,
            dependentFieldState
          ) => {
            return { DEMO: { value: currentFieldState.value } };
          },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "START_TIME",
          label: "Start Time",
          type: "text",
          fullWidth: true,
          isReadOnly: true,
          format: "HH:mm:ss",
          dependentFields: ["DESCRIPTION"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            let value =
              dependentFields[
                "LOGINSHIFT.DESCRIPTION"
              ].optionData[0]?.rest?.START_TIME?.split(" ")[1];
            return value ? value : "";
          },
          GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 3 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "END_TIME",
          label: "End Time",
          type: "text",
          fullWidth: true,
          isReadOnly: true,
          dependentFields: ["DESCRIPTION"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            let value =
              dependentFields[
                "LOGINSHIFT.DESCRIPTION"
              ].optionData[0]?.rest?.END_TIME?.split(" ")[1];
            return value ? value : "";
          },
          GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 3 },
        },
        {
          render: {
            componentType: "checkbox",
          },
          name: "ACTIVE",
          label: "Active",
          dependentFields: ["DESCRIPTION"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            let value =
              dependentFields["LOGINSHIFT.DESCRIPTION"].optionData[0]?.rest
                ?.ACTIVE === "Y"
                ? true
                : false;
            return value ? value : "";
          },
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
        },
      ],
    },
  ],
};
export const editloginShift = {
  form: {
    name: "EDITLoginShift",
    label: "Edit Login Shift",
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
      name: "DEMO",
      label: "Demo",
      placeholder: "",
      isReadOnly: true,
      disableCaching: true,
      ignoreInSubmit: true,
      type: "text",
      GridProps: { xs: 6, sm: 2, md: 2, lg: 2, xl: 2 },
      shouldExclude() {
        return true;
      },
      dependentFields: ["EDITLOGINSHIFT"],
      postValidationSetCrossFieldValues: async (
        currentFieldState,
        formState,
        auth,
        dependentFieldState,
        dependentFields
      ) => {
        const Data: any[] = [];
        const Test = Array.isArray(dependentFieldState?.["EDITLOGINSHIFT"])
          ? dependentFieldState["EDITLOGINSHIFT"].map((item, index) => {
              const values = item.DESCRIPTION?.value;
              if (values) {
                if (Data.includes(values)) {
                  formState.MessageBox({
                    messageTitle: "ValidationFailed",
                    message: `Duplicate value found at row ${index + 1}`,
                    buttonNames: ["Ok"],
                  });
                  return {
                    ["dependentFieldState.EDITLOGINSHIFT.DESCRIPTION"]: {
                      value: "",
                    },
                  };
                } else {
                  Data.push(values);
                }
              }
              return values;
            })
          : [];

        return Test;
      },
    },
    {
      render: {
        componentType: "arrayField",
      },
      name: "EDITLOGINSHIFT",
      enableGrid: true,
      changeRowOrder: true,
      removeRowFn: "deleteFormArrayFieldData",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
        {
          render: {
            componentType: "hidden",
          },
          name: "SR_CD",
        },
        {
          render: {
            componentType: "autocomplete",
          },
          name: "DESCRIPTION",
          label: "Login Shift",
          options: (dependentValue, formState, _, authState) =>
            API.getLoginShiftddw({
              COMP_CD: authState?.companyID,
              BRANCH_CD: authState?.user?.branchCode,
            }),
          _optionsKey: "GetLoginShift",
          placeholder: "",
          type: "text",
          GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 4 },
          postValidationSetCrossFieldValues: async (
            currentFieldState,
            formState,
            dependentFieldState
          ) => {
            return { DEMO: { value: currentFieldState.value } };
          },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "START_TIME",
          label: "Start Time",
          type: "text",
          fullWidth: true,
          isReadOnly: true,
          format: "HH:mm:ss",
          dependentFields: ["DESCRIPTION"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            let value =
              dependentFields[
                "EDITLOGINSHIFT.DESCRIPTION"
              ].optionData[0]?.rest?.START_TIME?.split(" ")[1];
            return value ? value : "";
          },
          GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 3 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "END_TIME",
          label: "End Time",
          type: "text",
          fullWidth: true,
          isReadOnly: true,
          dependentFields: ["DESCRIPTION"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            let value =
              dependentFields[
                "EDITLOGINSHIFT.DESCRIPTION"
              ].optionData[0]?.rest?.END_TIME?.split(" ")[1];
            return value ? value : "";
          },
          GridProps: { xs: 12, sm: 3, md: 3, lg: 3, xl: 3 },
        },
        {
          render: {
            componentType: "checkbox",
          },
          name: "ACTIVE",
          label: "Active",
          dependentFields: ["DESCRIPTION"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            let value =
              dependentFields["EDITLOGINSHIFT.DESCRIPTION"].optionData[0]?.rest
                ?.ACTIVE === "Y"
                ? true
                : false;
            return value ? value : "";
          },
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
        },
      ],
    },
  ],
};

export const LoginBiometricForm = {
  form: {
    name: "LoginBoimetrics",
    label: "Login Biometric",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          xl: 6,
          md: 6,
          sm: 6,
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
      name: "USER_NAME",
      label: "User Name:",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        xl: 12,
        md: 12,
        sm: 12,
        lg: 12,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "FINGER_NM",
      label: "Finger",
      placeholder: "",
      txtTransform: "uppercase",
      type: "text",
      GridProps: {
        xs: 12,
        xl: 12,
        md: 12,
        sm: 12,
        lg: 12,
      },
    },
  ],
};
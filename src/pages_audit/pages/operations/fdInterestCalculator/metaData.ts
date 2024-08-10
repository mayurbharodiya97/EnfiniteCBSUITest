import * as API from "./api";
export const metaData = {
    form: {
      name: "",
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
            sm: 12,
            md: 12,
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
          componentType: "radio",
        },
        name: "CALCSWITCH",
        label: "WhetherAssessedToIncomeTaxAct",
        RadioGroupProps: { row: true },
        defaultValue: "N",
        options: [
          {
            label: "Date",
            value: "D",
          },
          {
            label: "Period",
            value: "P",
          },
          {
            label: "Compare Sheet",
            value: "S",
          },
          {
            label: "Recurring To FD",
            value: "R",
          },
        ],
        GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      },
      // ------------Date-----------------//
      {
        render: { componentType: "autocomplete" },
        name: "PRE_INT_FLG_D",
        label: "normalPremature",
        _optionsKey: "getFDtype",
        options: (dependentValue, formState, _, authState) => {
          return API.getFDtype({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
          });
        },
        defaultValue: "I",
        fullWidth: true,
        dependentFields: ["CALCSWITCH"],
        shouldExclude: (val1, dependent) => {
          if (dependent?.CALCSWITCH?.value === "D") {
            return false;
          }
          return true;
        },
        GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
      },
      {
        render: { componentType: "autocomplete" },
        name: "ACCT_TYPE_D",
        label: "Type",
        _optionsKey: "gettypeDDWdata",
        options: (dependentValue, formState, _, authState) => {
          return API.gettypeDDWdata({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
          });
        },
        fullWidth: true,
        dependentFields: ["CALCSWITCH"],
        shouldExclude: (val1, dependent) => {
          if (dependent?.CALCSWITCH?.value === "D") {
            return false;
          }
          return true;
        },
        GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
      },
     
      {
        render: { componentType: "autocomplete" },
        name: "CATEG_CD_D",
        label: "Category",
        _optionsKey: "getCategoryDDWdata",
        options: (dependentValue, formState, _, authState) => {
          return API.getCategoryDDWdata({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
          });
        },
        fullWidth: true,
        GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
        dependentFields: ["CALCSWITCH"],
        shouldExclude: (val1, dependent) => {
          if (dependent?.CALCSWITCH?.value === "D") {
            return false;
          }
          return true;
        },
      },
      {
        render: {
          componentType: "datePicker",
        },
        name: "TRAN_DT_ D",
        label: "asonDate",
        defaultValue: new Date(),
        fullWidth: true,
        format: "dd/MM/yyyy",
        GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
        dependentFields: ["CALCSWITCH"],
        shouldExclude: (val1, dependent) => {
          if (dependent?.CALCSWITCH?.value === "D") {
            return false;
          }
          return true;
        },
      },
      {
        render: { componentType: "autocomplete" },
        name: "PERIOD_CD_D",
        label: "Period",
        options: [
          { label: "Daily(s", value: "D" },
          { label: "Month(s)", value: "M" },
          { label: "Year(s)", value: "Y" },
         
        ],
        defaultValue: "D",
        fullWidth: true,
        GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
        dependentFields: ["CALCSWITCH"],
        shouldExclude: (val1, dependent) => {
          if (dependent?.CALCSWITCH?.value === "D") {
            return false;
          }
          return true;
        },
      },
      {
        render: {
          componentType: "textField",
        },
        name: "PERIOD_NO_DISP_D",
        label: "",
        isReadOnly:true,
        defaultValue: "Day(s)",
        maxLength: 4,
        type: "text",
        GridProps: { xs: 1.5, sm: 1.5, md: 1.5, lg: 1, xl: 1 },
        dependentFields: ["CALCSWITCH"],
        shouldExclude: (val1, dependent) => {
          if (dependent?.CALCSWITCH?.value === "D") {
            return false;
          }
          return true;
        },
      },
      {
        render: {
          componentType: "textField",
        },
        name: "PERIOD_NO_D",
        label: "",
        isReadOnly:true,
        GridProps: { xs: 1.5, sm: 1.5, md: 1.5, lg: 1, xl: 1 },
        dependentFields: ["CALCSWITCH"],
        shouldExclude: (val1, dependent) => {
          if (dependent?.CALCSWITCH?.value === "D") {
            return false;
          }
          return true;
        },
      },
      {
        render: {
          componentType: "amountField",
        },
        name: "PRINCIPAL_AMT_D",
        label: "PrincipalAmount ",
        GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
        dependentFields: ["CALCSWITCH"],
        shouldExclude: (val1, dependent) => {
          if (dependent?.CALCSWITCH?.value === "D") {
            return false;
          }
          return true;
        },
      },
      {
        render: {
          componentType: "rateOfInt",
        },
        name: "INT_RATE_D",
        label: "Rate ",
        GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
        dependentFields: ["CALCSWITCH"],
        shouldExclude: (val1, dependent) => {
          if (dependent?.CALCSWITCH?.value === "D") {
            return false;
          }
          return true;
        },
      },
      {
        render: { componentType: "textField" },
        name: "TERM_CD_LABEL_D",
        label: "term",
        fullWidth: true,
        GridProps: { xs: 1.5, sm: 1.5, md: 1.5, lg: 1, xl: 1 },
        dependentFields: ["CALCSWITCH"],
        shouldExclude: (val1, dependent) => {
          if (dependent?.CALCSWITCH?.value === "D") {
            return false;
          }
          return true;
        },
      },
      {
        render: { componentType: "autocomplete" },
        name: "TERM_CD_D",
        label: "",
        options: [
          { label: "Monthly", value: "M" },
          { label: "Quarterly", value: "Q" },
          { label: "Half-Yearly", value: "H" },
          { label: "Yearly", value: "Y" },
        ],
        defaultValue: "M",
        fullWidth: true,
        GridProps: { xs: 1.5, sm: 1.5, md: 1.5, lg: 1, xl: 1 },
        dependentFields: ["CALCSWITCH"],
        shouldExclude: (val1, dependent) => {
          if (dependent?.CALCSWITCH?.value === "D") {
            return false;
          }
          return true;
        },
      },
      {
        render: {
          componentType: "datePicker",
        },
        name: "MATURITY_DT_D",
        label: "maturityDate",
        defaultValue: new Date(),
        fullWidth: true,
        format: "dd/MM/yyyy",
        GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
        dependentFields: ["CALCSWITCH"],
        shouldExclude: (val1, dependent) => {
          if (dependent?.CALCSWITCH?.value === "D") {
            return false;
          }
          return true;
        },
      },
      {
        render: {
          componentType: "amountField",
        },
        name: "INTEREST_RUPEES_D",
        label: "interestRs ",
        GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
        dependentFields: ["CALCSWITCH"],
        shouldExclude: (val1, dependent) => {
          if (dependent?.CALCSWITCH?.value === "D") {
            return false;
          }
          return true;
        },
      },
     
      {
        render: {
          componentType: "amountField",
        },
        name: "MATURITY_AMT_D",
        label: "MaturityAmount ",
        GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
        dependentFields: ["CALCSWITCH"],
        shouldExclude: (val1, dependent) => {
          if (dependent?.CALCSWITCH?.value === "D") {
            return false;
          }
          return true;
        },
      },
      // ------------Period---------------//
      {
        render: { componentType: "autocomplete" },
        name: "PRE_INT_FLG_P",
        label: "normalPremature",
        _optionsKey: "getFDtype",
        options: (dependentValue, formState, _, authState) => {
          return API.getFDtype({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
          });
        },
        defaultValue: "I",
        fullWidth: true,
        dependentFields: ["CALCSWITCH"],
        shouldExclude: (val1, dependent) => {
          if (dependent?.CALCSWITCH?.value === "P") {
            return false;
          }
          return true;
        },
        GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
      },
      {
        render: { componentType: "autocomplete" },
        name: "ACCT_TYPE_P",
        label: "Type",
        _optionsKey: "gettypeDDWdata",
        options: (dependentValue, formState, _, authState) => {
          return API.gettypeDDWdata({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
          });
        },
        fullWidth: true,
        dependentFields: ["CALCSWITCH"],
        shouldExclude: (val1, dependent) => {
          if (dependent?.CALCSWITCH?.value === "P") {
            return false;
          }
          return true;
        },
        GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
      },
     
      {
        render: { componentType: "autocomplete" },
        name: "CATEG_CD_P",
        label: "Category",
        _optionsKey: "getCategoryDDWdata",
        options: (dependentValue, formState, _, authState) => {
          return API.getCategoryDDWdata({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
          });
        },
        fullWidth: true,
        GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
        dependentFields: ["CALCSWITCH"],
        shouldExclude: (val1, dependent) => {
          if (dependent?.CALCSWITCH?.value === "P") {
            return false;
          }
          return true;
        },
      },
      {
        render: {
          componentType: "datePicker",
        },
        name: "TRAN_DT_P",
        label: "asonDate",
        defaultValue: new Date(),
        fullWidth: true,
        format: "dd/MM/yyyy",
        GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
        dependentFields: ["CALCSWITCH"],
        shouldExclude: (val1, dependent) => {
          if (dependent?.CALCSWITCH?.value === "P") {
            return false;
          }
          return true;
        },
      },
      {
        render: {
          componentType: "datePicker",
        },
        name: "MATURITY_DT_P",
        label: "maturityDate",
        defaultValue: new Date(),
        fullWidth: true,
        format: "dd/MM/yyyy",
        GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
        dependentFields: ["CALCSWITCH"],
        shouldExclude: (val1, dependent) => {
          if (dependent?.CALCSWITCH?.value === "P") {
            return false;
          }
          return true;
        },
      },
      {
        render: { componentType: "autocomplete" },
        name: "PERIOD_CD_P",
        label: "Period",
        options: [
          { label: "Daily(s", value: "D" },
          { label: "Month(s)", value: "M" },
          { label: "Year(s)", value: "Y" },
         
        ],
        defaultValue: "D",
        fullWidth: true,
        GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
        dependentFields: ["CALCSWITCH"],
        shouldExclude: (val1, dependent) => {
          if (dependent?.CALCSWITCH?.value === "P") {
            return false;
          }
          return true;
        },
      },
      {
        render: {
          componentType: "textField",
        },
        name: "PERIOD_NO_DISP_P",
        label: "",
        isReadOnly:true,
        placeholder: "No of Days",
        maxLength: 4,
        type: "text",
        GridProps: { xs: 1.5, sm: 1.5, md: 1.5, lg: 1, xl: 1 },
        dependentFields: ["CALCSWITCH"],
        shouldExclude: (val1, dependent) => {
          if (dependent?.CALCSWITCH?.value === "P") {
            return false;
          }
          return true;
        },
      },
      {
        render: {
          componentType: "textField",
        },
        name: "PERIOD_NO_P",
        label: "",
        isReadOnly:true,
        GridProps: { xs: 1.5, sm: 1.5, md: 1.5, lg: 1, xl: 1 },
        dependentFields: ["CALCSWITCH"],
        shouldExclude: (val1, dependent) => {
          if (dependent?.CALCSWITCH?.value === "P") {
            return false;
          }
          return true;
        },
      },
      {
        render: {
          componentType: "amountField",
        },
        name: "PRINCIPAL_AMT_P",
        label: "PrincipalAmount ",
        GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
        dependentFields: ["CALCSWITCH"],
        shouldExclude: (val1, dependent) => {
          if (dependent?.CALCSWITCH?.value === "P") {
            return false;
          }
          return true;
        },
      },
      {
        render: {
          componentType: "rateOfInt",
        },
        name: "INT_RATE_P",
        label: "Rate ",
        GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
        dependentFields: ["CALCSWITCH"],
        shouldExclude: (val1, dependent) => {
          if (dependent?.CALCSWITCH?.value === "P") {
            return false;
          }
          return true;
        },
      },
      {
        render: { componentType: "autocomplete" },
        name: "TERM_CD_P",
        label: "term",
        options: [
          { label: "Monthly", value: "M" },
          { label: "Quarterly", value: "Q" },
          { label: "Half-Yearly", value: "H" },
          { label: "Yearly", value: "Y" },
         
        ],
        defaultValue: "M",
        fullWidth: true,
        GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
        dependentFields: ["CALCSWITCH"],
        shouldExclude: (val1, dependent) => {
          if (dependent?.CALCSWITCH?.value === "P") {
            return false;
          }
          return true;
        },
      },
      {
        render: {
          componentType: "amountField",
        },
        name: "INTEREST_RUPEES_P",
        label: "interestRs ",
        GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
        dependentFields: ["CALCSWITCH"],
        shouldExclude: (val1, dependent) => {
          if (dependent?.CALCSWITCH?.value === "P") {
            return false;
          }
          return true;
        },
      },
     
      {
        render: {
          componentType: "amountField",
        },
        name: "MATURITY_AMT_P",
        label: "MaturityAmount ",
        GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
        dependentFields: ["CALCSWITCH"],
        shouldExclude: (val1, dependent) => {
          if (dependent?.CALCSWITCH?.value === "P") {
            return false;
          }
          return true;
        },
      },
   //---------------Compare Sheet ----------------//
   {
    render: {
      componentType: "datePicker",
    },
    name: "TRAN_DT_ S",
    label: "asonDate",
    defaultValue: new Date(),
    fullWidth: true,
    format: "dd/MM/yyyy",
    GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
    dependentFields: ["CALCSWITCH"],
    shouldExclude: (val1, dependent) => {
      if (dependent?.CALCSWITCH?.value === "S") {
        return false;
      }
      return true;
    },
  },
  {
    render: { componentType: "autocomplete" },
    name: "PERIOD_CD_S",
    label: "Period",
    options: [
      { label: "Daily(s", value: "D" },
      { label: "Month(s)", value: "M" },
      { label: "Year(s)", value: "Y" },
     
    ],
    defaultValue: "D",
    fullWidth: true,
    GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
    dependentFields: ["CALCSWITCH"],
    shouldExclude: (val1, dependent) => {
      if (dependent?.CALCSWITCH?.value === "S") {
        return false;
      }
      return true;
    },
  },
  {
    render: {
      componentType: "textField",
    },
    name: "PERIOD_NO_DISP_S",
    label: "",
    isReadOnly:true,
    defaultValue: "Day(s)",
    maxLength: 4,
    type: "text",
    GridProps: { xs: 1.5, sm: 1.5, md: 1.5, lg: 1, xl: 1 },
    dependentFields: ["CALCSWITCH"],
    shouldExclude: (val1, dependent) => {
      if (dependent?.CALCSWITCH?.value === "S") {
        return false;
      }
      return true;
    },
  },
  {
    render: {
      componentType: "textField",
    },
    name: "PERIOD_NO_S",
    label: "",
    isReadOnly:true,
    GridProps: { xs: 1.5, sm: 1.5, md: 1.5, lg: 1, xl: 1 },
    dependentFields: ["CALCSWITCH"],
    shouldExclude: (val1, dependent) => {
      if (dependent?.CALCSWITCH?.value === "S") {
        return false;
      }
      return true;
    },
  },    
  {
    render: {
      componentType: "amountField",
    },
    name: "PRINCIPAL_AMT_S",
    label: "PrincipalAmount ",
    GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
    dependentFields: ["CALCSWITCH"],
    shouldExclude: (val1, dependent) => {
      if (dependent?.CALCSWITCH?.value === "S") {
        return false;
      }
      return true;
    },
  },
  {
    render: {
      componentType: "datePicker",
    },
    name: "MATURITY_DT_S",
    label: "maturityDate",
    defaultValue: new Date(),
    fullWidth: true,
    format: "dd/MM/yyyy",
    GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
    dependentFields: ["CALCSWITCH"],
    shouldExclude: (val1, dependent) => {
      if (dependent?.CALCSWITCH?.value === "S") {
        return false;
      }
      return true;
    },
  },
  {
    render: {
      componentType: "datePicker",
    },
    name: "RATE_DEFINATION_S",
    label: "rateDefination",
    GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
    dependentFields: ["CALCSWITCH"],
    shouldExclude: (val1, dependent) => {
      if (dependent?.CALCSWITCH?.value === "S") {
        return false;
      }
      return true;
    },
  },
  //-------------- Recurring To FD -----------------//
  {
    render: { componentType: "autocomplete" },
    name: "CATEG_CD_F",
    label: "Category",
    _optionsKey: "getCategoryDDWdata",
    options: (dependentValue, formState, _, authState) => {
      return API.getCategoryDDWdata({
        COMP_CD: authState?.companyID,
        BRANCH_CD: authState?.user?.branchCode,
      });
    },
    fullWidth: true,
    GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
    dependentFields: ["CALCSWITCH"],
    shouldExclude: (val1, dependent) => {
      if (dependent?.CALCSWITCH?.value === "F") {
        return false;
      }
      return true;
    },
  },
  {
    render: {
      componentType: "datePicker",
    },
    name: "TRAN_DT_F",
    label: "asonDate",
    defaultValue: new Date(),
    fullWidth: true,
    format: "dd/MM/yyyy",
    GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
    dependentFields: ["CALCSWITCH"],
    shouldExclude: (val1, dependent) => {
      if (dependent?.CALCSWITCH?.value === "F") {
        return false;
      }
      return true;
    },
  },
  {
    render: {
      componentType: "textField",
    },
    name: "TRAN_CD_F",
    required:true,
    defaultValue: "Customer",
    label: "Defination",
    GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
    dependentFields: ["CALCSWITCH"],
    shouldExclude: (val1, dependent) => {
      if (dependent?.CALCSWITCH?.value === "F") {
        return false;
      }
      return true;
    },
  },
  {
    render: {
      componentType: "textField",
    },
    name: "REMARK_F",
    required:true,
    defaultValue: "Customer",
    label: "proposedto",
    GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
    dependentFields: ["CALCSWITCH"],
    shouldExclude: (val1, dependent) => {
      if (dependent?.CALCSWITCH?.value === "F") {
        return false;
      }
      return true;
    },
  }
],
  };
  
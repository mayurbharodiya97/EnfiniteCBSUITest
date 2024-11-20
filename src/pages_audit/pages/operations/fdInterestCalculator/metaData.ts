import {
  addDays,
  addMonths,
  addYears,
  differenceInDays,
  format,
  parse,
} from "date-fns";
import * as API from "./api";
import { Label, Placeholder } from "reactstrap";
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
      label: "",
      // defaultValue: "P",
      RadioGroupProps: { row: true },
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
          value: "F",
        },
      ],
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "COMP_CD",
      label: "",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "BRANCH_CD",
      label: "",
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
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["typeRequired"] }],
      },
      options: (dependentValue, formState, _, authState) => {
        return API.gettypeDDWdata({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
          USER_NAME: authState?.user?.id,
        });
      },
      fullWidth: true,
      dependentFields: [
        "CALCSWITCH",
        "PERIOD_CD_D",
        "PERIOD_NO_D",
        "MATURITY_DT_D",
        "CATEG_CD_D",
        "ACCT_TYPE_D",
        "TRAN_DT_D",
        "COMP_CD",
        "BRANCH_CD",
        "PRE_INT_FLG_D",
        "PRINCIPAL_AMT_D",
      ],

      postValidationSetCrossFieldValues: async (
        field,
        formState,
        auth,
        dependentFields
      ) => {
        let duration = dependentFields?.PERIOD_NO_D?.value;
        let period = dependentFields?.PERIOD_CD_D?.value;
        let fdflag = dependentFields?.PRE_INT_FLG_D?.value;
        let principalAmount = dependentFields?.PRINCIPAL_AMT_D?.value;
        let acctType = field?.value;
        let branchCd = dependentFields?.BRANCH_CD?.value;
        let catCd = dependentFields?.CATEG_CD_D?.value;
        let companyCd = dependentFields?.COMP_CD?.value;
        let tranDate = format(
          new Date(dependentFields?.TRAN_DT_D?.value),
          "dd/MMM/yyyy"
        );
        let maturityDate = dependentFields?.MATURITY_DT_D?.value
          ? format(
              new Date(dependentFields?.MATURITY_DT_D?.value),
              "dd/MMM/yyyy"
            )
          : "";
        let reqData = {
          duration,
          period,
          fdflag,
          principalAmount,
          acctType,
          branchCd,
          companyCd,
          tranDate,
          catCd,
          maturityDate,
        };
        const areAllValuesPresent = (values) => {
          return (value) => value !== "" && value != null;
        };
        if (areAllValuesPresent(reqData)) {
          const postData = await API.getFdinterest({
            COMP_CD: companyCd,
            BRANCH_CD: branchCd,
            ACCT_TYPE: acctType,
            CATEG_CD: catCd,
            MATURITY_DT: maturityDate,
            TRAN_DT: tranDate,
            PERIOD_CD: period,
            PERIOD_NO: duration,
            PRE_INT_FLAG: fdflag,
            PRINCIPAL_AMT: principalAmount,
          });

          return {
            INT_RATE_D: {
              value: postData[0]?.INT_RATE,
              isFieldFocused: false,
              ignoreUpdate: true,
            },
          };
        }
      },
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
      dependentFields: [
        "CALCSWITCH",
        "PERIOD_CD_D",
        "PERIOD_NO_D",
        "MATURITY_DT_D",
        "CATEG_CD_D",
        "ACCT_TYPE_D",
        "TRAN_DT_D",
        "COMP_CD",
        "BRANCH_CD",
        "PRE_INT_FLG_D",
        "PRINCIPAL_AMT_D",
      ],
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        auth,
        dependentFields
      ) => {
        let duration = dependentFields?.PERIOD_NO_D?.value;
        let period = dependentFields?.PERIOD_CD_D?.value;
        let fdflag = dependentFields?.PRE_INT_FLG_D?.value;
        let principalAmount = dependentFields?.PRINCIPAL_AMT_D?.value;
        let acctType = dependentFields?.ACCT_TYPE_D?.value;
        let branchCd = dependentFields?.BRANCH_CD?.value;
        let catCd = field?.value;
        let companyCd = dependentFields?.COMP_CD?.value;
        let tranDate = format(
          new Date(dependentFields?.TRAN_DT_D?.value),
          "dd/MMM/yyyy"
        );
        let maturityDate = dependentFields?.MATURITY_DT_D?.value
          ? format(
              new Date(dependentFields?.MATURITY_DT_D?.value),
              "dd/MMM/yyyy"
            )
          : "";
        let reqData = {
          duration,
          period,
          fdflag,
          principalAmount,
          acctType,
          branchCd,
          companyCd,
          tranDate,
          catCd,
          maturityDate,
        };
        const areAllValuesPresent = (values) => {
          return Object.values(values).every(
            (value) => value !== "" && value != null
          );
        };
        if (areAllValuesPresent(reqData)) {
          const postData = await API.getFdinterest({
            COMP_CD: companyCd,
            BRANCH_CD: branchCd,
            ACCT_TYPE: acctType,
            CATEG_CD: catCd,
            MATURITY_DT: maturityDate,
            TRAN_DT: tranDate,
            PERIOD_CD: period,
            PERIOD_NO: duration,
            PRE_INT_FLAG: fdflag,
            PRINCIPAL_AMT: principalAmount,
          });

          return {
            INT_RATE_D: {
              value: postData[0]?.INT_RATE,
              isFieldFocused: false,
              ignoreUpdate: true,
            },
          };
        }
      },
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
      name: "TRAN_DT_D",
      label: "asonDate",
      required: true,
      defaultValue: new Date(),
      fullWidth: true,
      format: "dd/MM/yyyy",
      GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
      dependentFields: [
        "CALCSWITCH",
        "PERIOD_CD_D",
        "PERIOD_NO_D",
        "MATURITY_DT_D",
        "CATEG_CD_D",
        "ACCT_TYPE_D",
        "TRAN_DT_D",
        "COMP_CD",
        "BRANCH_CD",
        "PRE_INT_FLG_D",
        "PRINCIPAL_AMT_D",
      ],
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        auth,
        dependentFields
      ) => {
        let duration = dependentFields?.PERIOD_NO_D?.value;
        let period = dependentFields?.PERIOD_CD_D?.value;
        let fdflag = dependentFields?.PRE_INT_FLG_D?.value;
        let principalAmount = dependentFields?.PRINCIPAL_AMT_D?.value;
        let acctType = dependentFields?.ACCT_TYPE_D?.value;
        let branchCd = dependentFields?.BRANCH_CD?.value;
        let catCd = dependentFields?.CATEG_CD_D?.value;
        let companyCd = dependentFields?.COMP_CD?.value;
        let tranDate = format(new Date(field?.value), "dd/MMM/yyyy");
        let maturityDate = dependentFields?.MATURITY_DT_D?.value
          ? format(
              new Date(dependentFields?.MATURITY_DT_D?.value),
              "dd/MMM/yyyy"
            )
          : "";
        let reqData = {
          duration,
          period,
          fdflag,
          principalAmount,
          acctType,
          branchCd,
          companyCd,
          tranDate,
          catCd,
          maturityDate,
        };
        const areAllValuesPresent = (values) => {
          return Object.values(values).every(
            (value) => value !== "" && value != null
          );
        };
        if (areAllValuesPresent(reqData)) {
          const postData = await API.getFdinterest({
            COMP_CD: companyCd,
            BRANCH_CD: branchCd,
            ACCT_TYPE: acctType,
            CATEG_CD: catCd,
            MATURITY_DT: maturityDate,
            TRAN_DT: tranDate,
            PERIOD_CD: period,
            PERIOD_NO: duration,
            PRE_INT_FLAG: fdflag,
            PRINCIPAL_AMT: principalAmount,
          });

          return {
            INT_RATE_D: {
              value: postData[0]?.INT_RATE,
              isFieldFocused: false,
              ignoreUpdate: true,
            },
          };
        }
      },
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
      required: true,
      label: "Period",
      options: [
        { label: "Day(s)", value: "D" },
        { label: "Month(s)", value: "M" },
        { label: "Year(s)", value: "Y" },
      ],
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      defaultValue: "D",
      fullWidth: true,
      GridProps: { xs: 3, sm: 3, md: 3, lg: 1, xl: 1 },
      dependentFields: [
        "CALCSWITCH",
        "PERIOD_CD_D",
        "PERIOD_NO_D",
        "MATURITY_DT_D",
        "CATEG_CD_D",
        "ACCT_TYPE_D",
        "TRAN_DT_D",
        "COMP_CD",
        "BRANCH_CD",
        "PRE_INT_FLG_D",
        "PRINCIPAL_AMT_D",
      ],
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        auth,
        dependentFields
      ) => {
        let duration = dependentFields?.PERIOD_NO_D?.value;
        let period = field?.value;
        let fdflag = dependentFields?.PRE_INT_FLG_D?.value;
        let principalAmount = dependentFields?.PRINCIPAL_AMT_D?.value;
        let acctType = dependentFields?.ACCT_TYPE_D?.value;
        let branchCd = dependentFields?.BRANCH_CD?.value;
        let catCd = dependentFields?.CATEG_CD_D?.value;
        let companyCd = dependentFields?.COMP_CD?.value;
        let tranDate = format(
          new Date(dependentFields?.TRAN_DT_D?.value),
          "dd/MMM/yyyy"
        );
        let maturityDate = dependentFields?.MATURITY_DT_D?.value
          ? format(
              new Date(dependentFields?.MATURITY_DT_D?.value),
              "dd/MMM/yyyy"
            )
          : "";
        let reqData = {
          duration,
          period,
          fdflag,
          principalAmount,
          acctType,
          branchCd,
          companyCd,
          tranDate,
          catCd,
          maturityDate,
        };
        const areAllValuesPresent = (values) => {
          return Object.values(values).every(
            (value) => value !== "" && value != null
          );
        };
        if (areAllValuesPresent(reqData)) {
          const postData = await API.getFdinterest({
            COMP_CD: companyCd,
            BRANCH_CD: branchCd,
            ACCT_TYPE: acctType,
            CATEG_CD: catCd,
            MATURITY_DT: maturityDate,
            TRAN_DT: tranDate,
            PERIOD_CD: period,
            PERIOD_NO: duration,
            PRE_INT_FLAG: fdflag,
            PRINCIPAL_AMT: principalAmount,
          });

          return {
            INT_RATE_D: {
              value: postData[0]?.INT_RATE,
              isFieldFocused: false,
              ignoreUpdate: true,
            },
          };
        }
      },
      shouldExclude: (val1, dependent) => {
        if (dependent?.CALCSWITCH?.value === "D") {
          return false;
        }
        return true;
      },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "PERIOD_NO_D",
      label: "",
      preventSpecialChars: sessionStorage.getItem("specialChar") || "",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      GridProps: { xs: 1.5, sm: 1.5, md: 1.5, lg: 1, xl: 1 },
      dependentFields: [
        "CALCSWITCH",
        "PERIOD_CD_D",
        "PERIOD_NO_D",
        "MATURITY_DT_D",
        "CATEG_CD_D",
        "ACCT_TYPE_D",
        "TRAN_DT_D",
        "COMP_CD",
        "BRANCH_CD",
        "PRE_INT_FLG_D",
        "PRINCIPAL_AMT_D",
      ],
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        auth,
        dependentFields
      ) => {
        let duration = field?.value;
        let period = dependentFields?.PERIOD_CD_D?.value;
        let fdflag = dependentFields?.PRE_INT_FLG_D?.value;
        let principalAmount = dependentFields?.PRINCIPAL_AMT_D?.value;
        let acctType = dependentFields?.ACCT_TYPE_D?.value;
        let branchCd = dependentFields?.BRANCH_CD?.value;
        let catCd = dependentFields?.CATEG_CD_D?.value;
        let companyCd = dependentFields?.COMP_CD?.value;
        let tranDate = format(
          new Date(dependentFields?.TRAN_DT_D?.value),
          "dd/MMM/yyyy"
        );
        let maturityDate = dependentFields?.MATURITY_DT_D?.value
          ? format(
              new Date(dependentFields?.MATURITY_DT_D?.value),
              "dd/MMM/yyyy"
            )
          : "";
        let reqData = {
          duration,
          period,
          fdflag,
          principalAmount,
          acctType,
          branchCd,
          companyCd,
          tranDate,
          catCd,
          maturityDate,
        };
        const areAllValuesPresent = (values) => {
          return Object.values(values).every(
            (value) => value !== "" && value != null
          );
        };
        if (areAllValuesPresent(reqData)) {
          const postData = await API.getFdinterest({
            COMP_CD: companyCd,
            BRANCH_CD: branchCd,
            ACCT_TYPE: acctType,
            CATEG_CD: catCd,
            MATURITY_DT: maturityDate,
            TRAN_DT: tranDate,
            PERIOD_CD: period,
            PERIOD_NO: duration,
            PRE_INT_FLAG: fdflag,
            PRINCIPAL_AMT: principalAmount,
          });

          return {
            INT_RATE_D: {
              value: postData[0]?.INT_RATE,
              isFieldFocused: false,
              ignoreUpdate: true,
            },
          };
        }
      },
      setFieldLabel: (dependentFields, currVal) => {
        let duration = dependentFields.PERIOD_CD_D?.value;
        console.log(duration);

        return duration === "D"
          ? { label: "Day(s)" }
          : duration === "M"
          ? { label: "Month(s)" }
          : duration === "Y"
          ? { label: "Year(s)" }
          : { label: "Day(s)" };
      },

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
      required: true,
      label: "PrincipalAmount",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["principleAmtrequire"] }],
      },
      GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
      dependentFields: [
        "CALCSWITCH",
        "PERIOD_CD_D",
        "PERIOD_NO_D",
        "MATURITY_DT_D",
        "CATEG_CD_D",
        "ACCT_TYPE_D",
        "TRAN_DT_D",
        "COMP_CD",
        "BRANCH_CD",
        "PRE_INT_FLG_D",
        "PRINCIPAL_AMT_D",
      ],
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        auth,
        dependentFields
      ) => {
        let duration = dependentFields?.PERIOD_NO_D?.value;
        let period = dependentFields?.PERIOD_CD_D?.value;
        let fdflag = dependentFields?.PRE_INT_FLG_D?.value;
        let principalAmount = field?.value;
        let acctType = dependentFields?.ACCT_TYPE_D?.value;
        let branchCd = dependentFields?.BRANCH_CD?.value;
        let catCd = dependentFields?.CATEG_CD_D?.value;
        let companyCd = dependentFields?.COMP_CD?.value;
        let tranDate = format(
          new Date(dependentFields?.TRAN_DT_D?.value),
          "dd/MMM/yyyy"
        );
        let maturityDate = dependentFields?.MATURITY_DT_D?.value
          ? format(
              new Date(dependentFields?.MATURITY_DT_D?.value),
              "dd/MMM/yyyy"
            )
          : "";
        let reqData = {
          duration,
          period,
          fdflag,
          principalAmount,
          acctType,
          branchCd,
          companyCd,
          tranDate,
          catCd,
          maturityDate,
        };
        const areAllValuesPresent = (values) => {
          return Object.values(values).every(
            (value) => value !== "" && value != null
          );
        };
        if (areAllValuesPresent(reqData)) {
          const postData = await API.getFdinterest({
            COMP_CD: companyCd,
            BRANCH_CD: branchCd,
            ACCT_TYPE: acctType,
            CATEG_CD: catCd,
            MATURITY_DT: maturityDate,
            TRAN_DT: tranDate,
            PERIOD_CD: period,
            PERIOD_NO: duration,
            PRE_INT_FLAG: fdflag,
            PRINCIPAL_AMT: principalAmount,
          });

          return {
            INT_RATE_D: {
              value: postData[0]?.INT_RATE,
              isFieldFocused: false,
              ignoreUpdate: true,
            },
          };
        }
      },
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
      label: "Rate",
      defaultValue: "0.00",
      Placeholder: "0.00",
      GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["rateRequired"] }],
      },
      dependentFields: [
        "CALCSWITCH",
        "PERIOD_CD_D",
        "PERIOD_NO_D",
        "MATURITY_DT_D",
        "CATEG_CD_D",
        "ACCT_TYPE_D",
        "TRAN_DT_D",
        "COMP_CD",
        "BRANCH_CD",
        "PRE_INT_FLG_D",
        "PRINCIPAL_AMT_D",
        "INT_RATE_D",
        "TERM_CD_D",
      ],
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        auth,
        dependentFields
      ) => {
        let duration = dependentFields?.PERIOD_NO_D?.value;
        let termcd = dependentFields?.TERM_CD_D?.value;
        let rate = field?.value;
        let period = dependentFields?.PERIOD_CD_D?.value;
        let fdflag = dependentFields?.PRE_INT_FLG_D?.value;
        let principalAmount = dependentFields?.PRINCIPAL_AMT_D?.value;
        let acctType = dependentFields?.ACCT_TYPE_D?.value;
        let branchCd = dependentFields?.BRANCH_CD?.value;
        let catCd = dependentFields?.CATEG_CD_D?.value;
        let companyCd = dependentFields?.COMP_CD?.value;
        let tranDate = dependentFields?.TRAN_DT_D?.value
          ? format(new Date(dependentFields?.TRAN_DT_D?.value), "dd/MMM/yyyy")
          : "";
        let maturityDate = dependentFields?.MATURITY_DT_D?.value
          ? format(
              new Date(dependentFields?.MATURITY_DT_D?.value),
              "dd/MMM/yyyy"
            )
          : "";
        let reqData = {
          duration,
          period,
          fdflag,
          principalAmount,
          acctType,
          branchCd,
          companyCd,
          tranDate,
          catCd,
          termcd,
          rate,
        };
        const areAllValuesPresent = (values) => {
          return Object.values(values).every(
            (value) => value !== "" && value != null
          );
        };
        if (areAllValuesPresent(reqData)) {
          const postData = await API.getFdMaturityAmount({
            COMP_CD: companyCd,
            BRANCH_CD: branchCd,
            ACCT_TYPE: acctType,
            CATEG_CD: catCd,
            MATURITY_DT: maturityDate,
            TRAN_DT: tranDate,
            PERIOD_CD: period,
            PERIOD_NO: duration,
            PRE_INT_FLAG: fdflag,
            PRINCIPAL_AMT: principalAmount,
            INT_RATE: rate,
            TERM_CD: termcd,
          });

          // return postData[0]?.MATURITY_AMT;
          return {
            MATURITY_AMT_D: {
              value: postData[0]?.MATURITY_AMT,
              isFieldFocused: false,
              ignoreUpdate: true,
            },
          };
        }
      },
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
      label: "term",
      options: [
        { label: "Monthly", value: "M" },
        { label: "Quarterly", value: "Q" },
        { label: "Half-Yearly", value: "H" },
        { label: "Yearly", value: "Y" },
      ],
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["termrequire"] }],
      },
      defaultValue: "M",
      fullWidth: true,
      GridProps: { xs: 1.5, sm: 1.5, md: 2, lg: 2, xl: 2 },
      dependentFields: [
        "CALCSWITCH",
        "PERIOD_CD_D",
        "PERIOD_NO_D",
        "MATURITY_DT_D",
        "CATEG_CD_D",
        "ACCT_TYPE_D",
        "TRAN_DT_D",
        "COMP_CD",
        "BRANCH_CD",
        "PRE_INT_FLG_D",
        "PRINCIPAL_AMT_D",
        "INT_RATE_D",
        "TERM_CD_D",
      ],
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        auth,
        dependentFields
      ) => {
        let duration = dependentFields?.PERIOD_NO_D?.value;
        let termcd = field?.value;
        let rate = dependentFields?.INT_RATE_D?.value;
        let period = dependentFields?.PERIOD_CD_D?.value;
        let fdflag = dependentFields?.PRE_INT_FLG_D?.value;
        let principalAmount = dependentFields?.PRINCIPAL_AMT_D?.value;
        let acctType = dependentFields?.ACCT_TYPE_D?.value;
        let branchCd = dependentFields?.BRANCH_CD?.value;
        let catCd = dependentFields?.CATEG_CD_D?.value;
        let companyCd = dependentFields?.COMP_CD?.value;
        let tranDate = dependentFields?.TRAN_DT_D?.value
          ? format(new Date(dependentFields?.TRAN_DT_D?.value), "dd/MMM/yyyy")
          : "";
        let maturityDate = dependentFields?.MATURITY_DT_D?.value
          ? format(
              new Date(dependentFields?.MATURITY_DT_D?.value),
              "dd/MMM/yyyy"
            )
          : "";
        let reqData = {
          duration,
          period,
          fdflag,
          principalAmount,
          acctType,
          branchCd,
          companyCd,
          tranDate,
          catCd,
          termcd,
          rate,
        };
        const areAllValuesPresent = (values) => {
          return Object.values(values).every(
            (value) => value !== "" && value != null
          );
        };
        if (areAllValuesPresent(reqData)) {
          const postData = await API.getFdMaturityAmount({
            COMP_CD: companyCd,
            BRANCH_CD: branchCd,
            ACCT_TYPE: acctType,
            CATEG_CD: catCd,
            MATURITY_DT: maturityDate,
            TRAN_DT: tranDate,
            PERIOD_CD: period,
            PERIOD_NO: duration,
            PRE_INT_FLAG: fdflag,
            PRINCIPAL_AMT: principalAmount,
            INT_RATE: rate,
            TERM_CD: termcd,
          });

          // return postData[0]?.MATURITY_AMT;
          return {
            MATURITY_AMT_D: {
              value: postData[0]?.MATURITY_AMT,
              isFieldFocused: false,
              ignoreUpdate: true,
            },
          };
        }
      },
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
      isReadOnly: true,
      defaultValue: new Date(),
      fullWidth: true,
      GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
      dependentFields: [
        "CALCSWITCH",
        "TRAN_DT_D",
        "PERIOD_CD_D",
        "PERIOD_NO_D",
      ],
      setValueOnDependentFieldsChange: (dependentFields) => {
        let duration = dependentFields.PERIOD_CD_D?.value;
        let periodNumber = parseInt(dependentFields.PERIOD_NO_D?.value, 10);
        let tranDateValue = dependentFields?.TRAN_DT_D?.value;

        let newDate = "";

        try {
          if (tranDateValue) {
            // Convert tranDateValue to a Date object
            const tranDate = new Date(tranDateValue);

            // Check if tranDate is a valid date
            if (!isNaN(tranDate.getTime())) {
              // Adjust the date based on the duration
              switch (duration) {
                case "D":
                  newDate = format(
                    addDays(tranDate, periodNumber),
                    "dd/MMM/yyyy"
                  );
                  break;
                case "M":
                  newDate = format(
                    addMonths(tranDate, periodNumber),
                    "dd/MMM/yyyy"
                  );
                  break;
                case "Y":
                  newDate = format(
                    addYears(tranDate, periodNumber),
                    "dd/MMM/yyyy"
                  );
                  break;
                default:
                  console.error("Invalid duration");
                  break;
              }
            } else {
              console.error("Invalid date value");
            }
          } else {
            console.error("Transaction date value is missing");
          }
        } catch (error) {
          console.error("Error processing date:", error);
        }

        return newDate;
      },

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
      isReadOnly: true,
      label: "interestRs",
      GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
      dependentFields: ["CALCSWITCH", "PRINCIPAL_AMT_D", "MATURITY_AMT_D"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        let principalAmount = dependentFields.PRINCIPAL_AMT_D?.value;
        let maturityAmount = dependentFields.MATURITY_AMT_D?.value;
        let interestRupees;
        if (principalAmount !== "" && maturityAmount !== "") {
          interestRupees = maturityAmount - principalAmount;
          return interestRupees;
        }
      },
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
      isReadOnly: true,
      label: "MaturityAmount",
      GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
      dependentFields: [
        "CALCSWITCH",
        "PERIOD_CD_D",
        "PERIOD_NO_D",
        "MATURITY_DT_D",
        "CATEG_CD_D",
        "ACCT_TYPE_D",
        "TRAN_DT_D",
        "COMP_CD",
        "BRANCH_CD",
        "PRE_INT_FLG_D",
        "PRINCIPAL_AMT_D",
        "INT_RATE_D",
        "TERM_CD_D",
      ],

      shouldExclude: (val1, dependent) => {
        if (dependent?.CALCSWITCH?.value === "D") {
          return false;
        }
        return true;
      },
    },
    {
      render: {
        componentType: "formbutton",
      },
      name: "NEW_DATE_BTN",
      label: "New",
      type: "text",
      GridProps: { lg: 1, xl: 1 },
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
      validationRun: "onBlur",
      required: true,
      _optionsKey: "gettypeDDWdata",
      options: (dependentValue, formState, _, authState) => {
        return API.gettypeDDWdata({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
          USER_NAME: authState?.user?.id ?? "",
        });
      },
      fullWidth: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["typeRequired"] }],
      },
      dependentFields: [
        "CALCSWITCH",
        "PERIOD_CD_P",
        "PERIOD_NO_P",
        "MATURITY_DT_P",
        "CATEG_CD_P",
        "ACCT_TYPE_P",
        "TRAN_DT_P",
        "COMP_CD",
        "BRANCH_CD",
        "PRE_INT_FLG_P",
        "PRINCIPAL_AMT_P",
      ],
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        auth,
        dependentFields
      ) => {
        let period_cd = "D";
        // let period_cd = dependentFields.PERIOD_CD_P?.value;
        let period_no = `${dependentFields?.PERIOD_NO_P?.value}`;
        let maturity_date = format(
          new Date(dependentFields?.MATURITY_DT_P?.value),
          "dd/MMM/yyyy"
        );
        let category_cd = dependentFields?.CATEG_CD_P?.value;
        let acct_cd = field?.value;
        let tran_date = format(
          new Date(dependentFields?.TRAN_DT_P?.value),
          "dd/MMM/yyyy"
        );
        let comp_cd = dependentFields?.COMP_CD?.value;
        let branch_cd = dependentFields?.BRANCH_CD?.value;
        let pre_int_flag = dependentFields?.PRE_INT_FLG_P?.value;
        let principal_amt = dependentFields?.PRINCIPAL_AMT_P?.value;

        const params = {
          comp_cd,
          branch_cd,
          period_cd,
          period_no,
          maturity_date,
          category_cd,
          acct_cd,
          tran_date,
          pre_int_flag,
          principal_amt,
        };

        const areAllValuesPresent = (values) => {
          return Object.values(values).every(
            (value) => value !== "" && value != null
          );
        };
        if (areAllValuesPresent(params)) {
          const postData = await API.getFdinterest({
            COMP_CD: comp_cd,
            BRANCH_CD: branch_cd,
            ACCT_TYPE: acct_cd,
            CATEG_CD: category_cd,
            MATURITY_DT: maturity_date,
            TRAN_DT: tran_date,
            PERIOD_CD: period_cd,
            PERIOD_NO: period_no,
            PRE_INT_FLAG: pre_int_flag,
            PRINCIPAL_AMT: principal_amt,
          });
          return {
            INT_RATE_P: {
              value: postData[0]?.INT_RATE,
              isFieldFocused: false,
              ignoreUpdate: true,
            },
          };
        }
      },
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
      dependentFields: [
        "CALCSWITCH",
        "PERIOD_CD_P",
        "PERIOD_NO_P",
        "MATURITY_DT_P",
        "CATEG_CD_P",
        "ACCT_TYPE_P",
        "TRAN_DT_P",
        "COMP_CD",
        "BRANCH_CD",
        "PRE_INT_FLG_P",
        "PRINCIPAL_AMT_P",
      ],
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        auth,
        dependentFields
      ) => {
        let period_cd = "D";
        // let period_cd = dependentFields.PERIOD_CD_P?.value;
        let period_no = `${dependentFields?.PERIOD_NO_P?.value}`;
        let maturity_date = format(
          new Date(dependentFields?.MATURITY_DT_P?.value),
          "dd/MMM/yyyy"
        );
        let category_cd = field.value;
        let acct_cd = dependentFields?.ACCT_TYPE_P?.value;
        let tran_date = format(
          new Date(dependentFields?.TRAN_DT_P?.value),
          "dd/MMM/yyyy"
        );
        let comp_cd = dependentFields?.COMP_CD?.value;
        let branch_cd = dependentFields?.BRANCH_CD?.value;
        let pre_int_flag = dependentFields?.PRE_INT_FLG_P?.value;
        let principal_amt = dependentFields?.PRINCIPAL_AMT_P?.value;

        const params = {
          comp_cd,
          branch_cd,
          period_cd,
          period_no,
          maturity_date,
          category_cd,
          acct_cd,
          tran_date,
          pre_int_flag,
          principal_amt,
        };

        const areAllValuesPresent = (values) => {
          return Object.values(values).every(
            (value) => value !== "" && value != null
          );
        };
        if (areAllValuesPresent(params)) {
          const postData = await API.getFdinterest({
            COMP_CD: comp_cd,
            BRANCH_CD: branch_cd,
            ACCT_TYPE: acct_cd,
            CATEG_CD: category_cd,
            MATURITY_DT: maturity_date,
            TRAN_DT: tran_date,
            PERIOD_CD: period_cd,
            PERIOD_NO: period_no,
            PRE_INT_FLAG: pre_int_flag,
            PRINCIPAL_AMT: principal_amt,
          });
          return {
            INT_RATE_P: {
              value: postData[0]?.INT_RATE,
              isFieldFocused: false,
              ignoreUpdate: true,
            },
          };
        }
      },
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
      required: true,
      defaultValue: new Date(),
      fullWidth: true,
      format: "dd/MM/yyyy",
      GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
      dependentFields: [
        "CALCSWITCH",
        "PERIOD_CD_P",
        "PERIOD_NO_P",
        "MATURITY_DT_P",
        "CATEG_CD_P",
        "ACCT_TYPE_P",
        "TRAN_DT_P",
        "COMP_CD",
        "BRANCH_CD",
        "PRE_INT_FLG_P",
        "PRINCIPAL_AMT_P",
      ],
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        auth,
        dependentFields
      ) => {
        let period_cd = "D";
        // let period_cd = dependentFields.PERIOD_CD_P?.value;
        let period_no = `${dependentFields?.PERIOD_NO_P?.value}`;
        let maturity_date = format(
          new Date(dependentFields?.MATURITY_DT_P?.value),
          "dd/MMM/yyyy"
        );
        let category_cd = dependentFields?.CATEG_CD_P?.value;
        let acct_cd = dependentFields?.ACCT_TYPE_P?.value;
        let tran_date = format(new Date(field?.value), "dd/MMM/yyyy");
        let comp_cd = dependentFields?.COMP_CD?.value;
        let branch_cd = dependentFields?.BRANCH_CD?.value;
        let pre_int_flag = dependentFields?.PRE_INT_FLG_P?.value;
        let principal_amt = dependentFields?.PRINCIPAL_AMT_P?.value;

        const params = {
          comp_cd,
          branch_cd,
          period_cd,
          period_no,
          maturity_date,
          category_cd,
          acct_cd,
          tran_date,
          pre_int_flag,
          principal_amt,
        };

        const areAllValuesPresent = (values) => {
          return Object.values(values).every(
            (value) => value !== "" && value != null
          );
        };
        if (areAllValuesPresent(params)) {
          const postData = await API.getFdinterest({
            COMP_CD: comp_cd,
            BRANCH_CD: branch_cd,
            ACCT_TYPE: acct_cd,
            CATEG_CD: category_cd,
            MATURITY_DT: maturity_date,
            TRAN_DT: tran_date,
            PERIOD_CD: period_cd,
            PERIOD_NO: period_no,
            PRE_INT_FLAG: pre_int_flag,
            PRINCIPAL_AMT: principal_amt,
          });
          return {
            INT_RATE_P: {
              value: postData[0]?.INT_RATE,
              isFieldFocused: false,
              ignoreUpdate: true,
            },
          };
        }
      },
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
      required: true,
      defaultValue: new Date(),
      fullWidth: true,
      format: "dd/MM/yyyy",
      GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
      dependentFields: [
        "CALCSWITCH",
        "PERIOD_CD_P",
        "PERIOD_NO_P",
        "MATURITY_DT_P",
        "CATEG_CD_P",
        "ACCT_TYPE_P",
        "TRAN_DT_P",
        "COMP_CD",
        "BRANCH_CD",
        "PRE_INT_FLG_P",
        "PRINCIPAL_AMT_P",
      ],
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        auth,
        dependentFields
      ) => {
        let period_cd = "D";
        // let period_cd = dependentFields.PERIOD_CD_P?.value;
        let period_no = `${dependentFields?.PERIOD_NO_P?.value}`;
        let maturity_date = format(new Date(field?.value), "dd/MMM/yyyy");
        console.log(maturity_date);

        let category_cd = dependentFields?.CATEG_CD_P?.value;
        let acct_cd = dependentFields?.ACCT_TYPE_P?.value;
        let tran_date = format(
          new Date(dependentFields?.TRAN_DT_P?.value),
          "dd/MMM/yyyy"
        );
        let comp_cd = dependentFields?.COMP_CD?.value;
        let branch_cd = dependentFields?.BRANCH_CD?.value;
        let pre_int_flag = dependentFields?.PRE_INT_FLG_P?.value;
        let principal_amt = dependentFields?.PRINCIPAL_AMT_P?.value;

        const params = {
          comp_cd,
          branch_cd,
          period_cd,
          period_no,
          maturity_date,
          category_cd,
          acct_cd,
          tran_date,
          pre_int_flag,
          principal_amt,
        };

        const areAllValuesPresent = (values) => {
          return Object.values(values).every(
            (value) => value !== "" && value != null
          );
        };
        if (areAllValuesPresent(params)) {
          const postData = await API.getFdinterest({
            COMP_CD: comp_cd,
            BRANCH_CD: branch_cd,
            ACCT_TYPE: acct_cd,
            CATEG_CD: category_cd,
            MATURITY_DT: maturity_date,
            TRAN_DT: tran_date,
            PERIOD_CD: period_cd,
            PERIOD_NO: period_no,
            PRE_INT_FLAG: pre_int_flag,
            PRINCIPAL_AMT: principal_amt,
          });
          return {
            INT_RATE_P: {
              value: postData[0]?.INT_RATE,
              isFieldFocused: false,
              ignoreUpdate: true,
            },
          };
        }
      },
      validate: (currentField, dependentField) => {
        if (
          new Date(currentField?.value) <
          new Date(dependentField?.TRAN_DT_P?.value)
        ) {
          return "maturityDateValidationMsg";
        }
        return "";
      },

      shouldExclude: (val1, dependent) => {
        if (dependent?.CALCSWITCH?.value === "P") {
          return false;
        }
        return true;
      },
    },
    {
      render: { componentType: "textField" },
      name: "PERIOD_NO_DISP_P",
      label: "Period",
      defaultValue: "Day",
      fullWidth: true,

      isReadOnly: true,
      preventSpecialChars: sessionStorage.getItem("specialChar") || "",
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
      name: "PERIOD_NO_P",
      label: "NoOfDays",
      isReadOnly: true,
      GridProps: { xs: 1.5, sm: 1.5, md: 1.5, lg: 1, xl: 1 },
      dependentFields: [
        "CALCSWITCH",
        "PERIOD_CD_P",
        "PERIOD_NO_P",
        "MATURITY_DT_P",
        "CATEG_CD_P",
        "ACCT_TYPE_P",
        "TRAN_DT_P",
        "COMP_CD",
        "BRANCH_CD",
        "PRE_INT_FLG_P",
        "PRINCIPAL_AMT_P",
      ],
      setValueOnDependentFieldsChange: (dependentFields) => {
        let duration = dependentFields.PERIOD_CD_D?.value;
        let startDate = dependentFields?.TRAN_DT_P?.value;
        let endDate = dependentFields?.MATURITY_DT_P?.value;
        const formattedInitialDate = format(startDate, "yyyy-MM-dd"); // Format to YYYY-MM-DD

        if (startDate && endDate) {
          const start = new Date(formattedInitialDate);
          const end = new Date(endDate);

          const days = differenceInDays(end, start);
          return days;
        }
      },

      postValidationSetCrossFieldValues: async (
        field,
        formState,
        auth,
        dependentFields
      ) => {
        let period_cd = "D";
        // let period_cd = dependentFields.PERIOD_CD_P?.value;
        let period_no = `${field?.value}`;
        let maturity_date = format(
          new Date(dependentFields?.MATURITY_DT_P?.value),
          "dd/MMM/yyyy"
        );
        let category_cd = dependentFields?.CATEG_CD_P?.value;
        let acct_cd = dependentFields?.ACCT_TYPE_P?.value;
        let tran_date = format(
          new Date(dependentFields?.TRAN_DT_P?.value),
          "dd/MMM/yyyy"
        );
        let comp_cd = dependentFields?.COMP_CD?.value;
        let branch_cd = dependentFields?.BRANCH_CD?.value;
        let pre_int_flag = dependentFields?.PRE_INT_FLG_P?.value;
        let principal_amt = dependentFields?.PRINCIPAL_AMT_P?.value;

        const params = {
          comp_cd,
          branch_cd,
          period_cd,
          period_no,
          maturity_date,
          category_cd,
          acct_cd,
          tran_date,
          pre_int_flag,
          principal_amt,
        };

        const areAllValuesPresent = (values) => {
          return Object.values(values).every(
            (value) => value !== "" && value != null
          );
        };
        if (areAllValuesPresent(params)) {
          const postData = await API.getFdinterest({
            COMP_CD: comp_cd,
            BRANCH_CD: branch_cd,
            ACCT_TYPE: acct_cd,
            CATEG_CD: category_cd,
            MATURITY_DT: maturity_date,
            TRAN_DT: tran_date,
            PERIOD_CD: period_cd,
            PERIOD_NO: period_no,
            PRE_INT_FLAG: pre_int_flag,
            PRINCIPAL_AMT: principal_amt,
          });
          return {
            INT_RATE_P: {
              value: postData[0]?.INT_RATE,
              isFieldFocused: false,
              ignoreUpdate: true,
            },
          };
        }
      },
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
      required: true,
      label: "PrincipalAmount",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["principleAmtrequire"] }],
      },
      GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
      dependentFields: [
        "CALCSWITCH",
        "PERIOD_CD_P",
        "PERIOD_NO_P",
        "MATURITY_DT_P",
        "CATEG_CD_P",
        "ACCT_TYPE_P",
        "TRAN_DT_P",
        "COMP_CD",
        "BRANCH_CD",
        "PRE_INT_FLG_P",
        "PRINCIPAL_AMT_P",
      ],
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        auth,
        dependentFields
      ) => {
        let period_cd = "D";
        // let period_cd = dependentFields.PERIOD_CD_P?.value;
        let period_no = `${dependentFields?.PERIOD_NO_P?.value}`;
        let maturity_date = format(
          new Date(dependentFields?.MATURITY_DT_P?.value),
          "dd/MMM/yyyy"
        );
        let category_cd = dependentFields?.CATEG_CD_P?.value;
        let acct_cd = dependentFields?.ACCT_TYPE_P?.value;
        let tran_date = format(
          new Date(dependentFields?.TRAN_DT_P?.value),
          "dd/MMM/yyyy"
        );
        let comp_cd = dependentFields?.COMP_CD?.value;
        let branch_cd = dependentFields?.BRANCH_CD?.value;
        let pre_int_flag = dependentFields?.PRE_INT_FLG_P?.value;
        let principal_amt = field?.value;

        const params = {
          comp_cd,
          branch_cd,
          period_cd,
          period_no,
          maturity_date,
          category_cd,
          acct_cd,
          tran_date,
          pre_int_flag,
          principal_amt,
        };

        const areAllValuesPresent = (values) => {
          return Object.values(values).every(
            (value) => value !== "" && value != null
          );
        };
        if (areAllValuesPresent(params)) {
          const postData = await API.getFdinterest({
            COMP_CD: comp_cd,
            BRANCH_CD: branch_cd,
            ACCT_TYPE: acct_cd,
            CATEG_CD: category_cd,
            MATURITY_DT: maturity_date,
            TRAN_DT: tran_date,
            PERIOD_CD: period_cd,
            PERIOD_NO: period_no,
            PRE_INT_FLAG: pre_int_flag,
            PRINCIPAL_AMT: principal_amt,
          });
          return {
            INT_RATE_P: {
              value: postData[0]?.INT_RATE,
              isFieldFocused: false,
              ignoreUpdate: true,
            },
          };
        }
      },
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
      label: "Rate",
      defaultValue: "0.00",
      Placeholder: "0.00",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["rateRequired"] }],
      },
      GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
      dependentFields: [
        "CALCSWITCH",
        "PERIOD_CD_P",
        "PERIOD_NO_P",
        "MATURITY_DT_P",
        "CATEG_CD_P",
        "ACCT_TYPE_P",
        "TRAN_DT_P",
        "COMP_CD",
        "BRANCH_CD",
        "PRE_INT_FLG_P",
        "PRINCIPAL_AMT_P",
        "INT_RATE_P",
        "TERM_CD_P",
      ],
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        auth,
        dependentFields
      ) => {
        let duration = "D";
        // let duration = dependentFields?.PERIOD_NO_P?.value;
        let termcd = dependentFields?.TERM_CD_P?.value;
        let rate = field?.value;
        let period = `${dependentFields?.PERIOD_NO_P?.value}`;
        let fdflag = dependentFields?.PRE_INT_FLG_P?.value;
        let principalAmount = dependentFields?.PRINCIPAL_AMT_P?.value;
        let acctType = dependentFields?.ACCT_TYPE_P?.value;
        let branchCd = dependentFields?.BRANCH_CD?.value;
        let catCd = dependentFields?.CATEG_CD_P?.value;
        let companyCd = dependentFields?.COMP_CD?.value;
        let tranDate = format(
          new Date(dependentFields?.TRAN_DT_P?.value),
          "dd/MMM/yyyy"
        );
        let maturityDate = format(
          new Date(dependentFields?.MATURITY_DT_P?.value),
          "dd/MMM/yyyy"
        );
        let reqData = {
          duration,
          period,
          fdflag,
          principalAmount,
          acctType,
          branchCd,
          companyCd,
          tranDate,
          catCd,
          termcd,
          rate,
        };

        const areAllValuesPresent = (values) => {
          return Object.values(values).every(
            (value) => value !== "" && value != null
          );
        };
        if (areAllValuesPresent(reqData)) {
          const postData = await API.getFdMaturityAmount({
            COMP_CD: companyCd,
            BRANCH_CD: branchCd,
            ACCT_TYPE: acctType,
            CATEG_CD: catCd,
            MATURITY_DT: maturityDate,
            TRAN_DT: tranDate,
            PERIOD_CD: duration,
            PERIOD_NO: period,
            PRE_INT_FLAG: fdflag,
            PRINCIPAL_AMT: principalAmount,
            INT_RATE: rate,
            TERM_CD: termcd,
          });
          return {
            MATURITY_AMT_P: {
              value: postData[0]?.MATURITY_AMT,
              isFieldFocused: false,
              ignoreUpdate: true,
            },
          };
        }
      },
      // setValueOnDependentFieldsChange: async (dependentFields) => {
      //   let period_cd = "D";
      //   // let period_cd = dependentFields.PERIOD_CD_P?.value;
      //   let period_no = `${dependentFields?.PERIOD_NO_P?.value}`;
      //   let maturity_date = format(
      //     new Date(dependentFields?.MATURITY_DT_P?.value),
      //     "dd/MMM/yyyy"
      //   );
      //   let category_cd = dependentFields?.CATEG_CD_P?.value;
      //   let acct_cd = dependentFields?.ACCT_TYPE_P?.value;
      //   let tran_date = format(
      //     new Date(dependentFields?.TRAN_DT_P?.value),
      //     "dd/MMM/yyyy"
      //   );
      //   let comp_cd = dependentFields?.COMP_CD?.value;
      //   let branch_cd = dependentFields?.BRANCH_CD?.value;
      //   let pre_int_flag = dependentFields?.PRE_INT_FLG_P?.value;
      //   let principal_amt = dependentFields?.PRINCIPAL_AMT_P?.value;

      //   const params = {
      //     comp_cd,
      //     branch_cd,
      //     period_cd,
      //     period_no,
      //     maturity_date,
      //     category_cd,
      //     acct_cd,
      //     tran_date,
      //     pre_int_flag,
      //     principal_amt,
      //   };

      //   const areAllValuesPresent = (values) => {
      //     return Object.values(values).every(
      //       (value) => value !== "" && value != null
      //     );
      //   };
      //   if (areAllValuesPresent(params)) {
      //     const postData = await API.getFdinterest({
      //       COMP_CD: comp_cd,
      //       BRANCH_CD: branch_cd,
      //       ACCT_TYPE: acct_cd,
      //       CATEG_CD: category_cd,
      //       MATURITY_DT: maturity_date,
      //       TRAN_DT: tran_date,
      //       PERIOD_CD: period_cd,
      //       PERIOD_NO: period_no,
      //       PRE_INT_FLAG: pre_int_flag,
      //       PRINCIPAL_AMT: principal_amt,
      //     });

      //     return postData[0]?.INT_RATE;
      //   }
      // },
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
      required: true,
      options: [
        { label: "Monthly", value: "M" },
        { label: "Quarterly", value: "Q" },
        { label: "Half-Yearly", value: "H" },
        { label: "Yearly", value: "Y" },
      ],
      defaultValue: "M",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["termrequire"] }],
      },
      fullWidth: true,
      GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
      dependentFields: [
        "CALCSWITCH",
        "PERIOD_CD_P",
        "PERIOD_NO_P",
        "MATURITY_DT_P",
        "CATEG_CD_P",
        "ACCT_TYPE_P",
        "TRAN_DT_P",
        "COMP_CD",
        "BRANCH_CD",
        "PRE_INT_FLG_P",
        "PRINCIPAL_AMT_P",
        "INT_RATE_P",
        "TERM_CD_P",
      ],
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        auth,
        dependentFields
      ) => {
        let duration = "D";
        // let duration = dependentFields?.PERIOD_NO_P?.value;
        let termcd = field?.value;
        let rate = dependentFields?.INT_RATE_P?.value;
        let period = `${dependentFields?.PERIOD_NO_P?.value}`;
        let fdflag = dependentFields?.PRE_INT_FLG_P?.value;
        let principalAmount = dependentFields?.PRINCIPAL_AMT_P?.value;
        let acctType = dependentFields?.ACCT_TYPE_P?.value;
        let branchCd = dependentFields?.BRANCH_CD?.value;
        let catCd = dependentFields?.CATEG_CD_P?.value;
        let companyCd = dependentFields?.COMP_CD?.value;
        let tranDate = format(
          new Date(dependentFields?.TRAN_DT_P?.value),
          "dd/MMM/yyyy"
        );
        let maturityDate = format(
          new Date(dependentFields?.MATURITY_DT_P?.value),
          "dd/MMM/yyyy"
        );
        let reqData = {
          duration,
          period,
          fdflag,
          principalAmount,
          acctType,
          branchCd,
          companyCd,
          tranDate,
          catCd,
          termcd,
          rate,
        };

        const areAllValuesPresent = (values) => {
          return Object.values(values).every(
            (value) => value !== "" && value != null
          );
        };
        if (areAllValuesPresent(reqData)) {
          const postData = await API.getFdMaturityAmount({
            COMP_CD: companyCd,
            BRANCH_CD: branchCd,
            ACCT_TYPE: acctType,
            CATEG_CD: catCd,
            MATURITY_DT: maturityDate,
            TRAN_DT: tranDate,
            PERIOD_CD: duration,
            PERIOD_NO: period,
            PRE_INT_FLAG: fdflag,
            PRINCIPAL_AMT: principalAmount,
            INT_RATE: rate,
            TERM_CD: termcd,
          });
          return {
            MATURITY_AMT_P: {
              value: postData[0]?.MATURITY_AMT,
              isFieldFocused: false,
              ignoreUpdate: true,
            },
          };
        }
      },
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
      isReadOnly: true,
      label: "interestRs",
      GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
      dependentFields: ["CALCSWITCH", "PRINCIPAL_AMT_P", "MATURITY_AMT_P"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        let principalAmount = dependentFields.PRINCIPAL_AMT_P?.value;
        let maturityAmount = dependentFields.MATURITY_AMT_P?.value;
        let interestRupees;
        if (principalAmount !== "" && maturityAmount !== "") {
          interestRupees = maturityAmount - principalAmount;
          return interestRupees;
        }
      },
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
      isReadOnly: true,
      label: "MaturityAmount",
      GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
      dependentFields: [
        "CALCSWITCH",
        "PERIOD_CD_P",
        "PERIOD_NO_P",
        "MATURITY_DT_P",
        "CATEG_CD_P",
        "ACCT_TYPE_P",
        "TRAN_DT_P",
        "COMP_CD",
        "BRANCH_CD",
        "PRE_INT_FLG_P",
        "PRINCIPAL_AMT_P",
        "INT_RATE_P",
        "TERM_CD_P",
      ],
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        auth,
        dependentFields
      ) => {
        let duration = "D";
        // let duration = dependentFields?.PERIOD_NO_P?.value;
        let termcd = dependentFields?.TERM_CD_P?.value;
        let rate = field?.value;
        let period = `${dependentFields?.PERIOD_NO_P?.value}`;
        let fdflag = dependentFields?.PRE_INT_FLG_P?.value;
        let principalAmount = dependentFields?.PRINCIPAL_AMT_P?.value;
        let acctType = dependentFields?.ACCT_TYPE_P?.value;
        let branchCd = dependentFields?.BRANCH_CD?.value;
        let catCd = dependentFields?.CATEG_CD_P?.value;
        let companyCd = dependentFields?.COMP_CD?.value;
        let tranDate = format(
          new Date(dependentFields?.TRAN_DT_P?.value),
          "dd/MMM/yyyy"
        );
        let maturityDate = format(
          new Date(dependentFields?.MATURITY_DT_P?.value),
          "dd/MMM/yyyy"
        );
        let reqData = {
          duration,
          period,
          fdflag,
          principalAmount,
          acctType,
          branchCd,
          companyCd,
          tranDate,
          catCd,
          termcd,
          rate,
        };

        const areAllValuesPresent = (values) => {
          return Object.values(values).every(
            (value) => value !== "" && value != null
          );
        };
        if (areAllValuesPresent(reqData)) {
          const postData = await API.getFdMaturityAmount({
            COMP_CD: companyCd,
            BRANCH_CD: branchCd,
            ACCT_TYPE: acctType,
            CATEG_CD: catCd,
            MATURITY_DT: maturityDate,
            TRAN_DT: tranDate,
            PERIOD_CD: duration,
            PERIOD_NO: period,
            PRE_INT_FLAG: fdflag,
            PRINCIPAL_AMT: principalAmount,
            INT_RATE: rate,
            TERM_CD: termcd,
          });
          return {
            INT_RATE_P: {
              value: postData[0]?.MATURITY_AMT,
              isFieldFocused: false,
              ignoreUpdate: true,
            },
          };
        }
      },
      // setValueOnDependentFieldsChange: async (dependentFields) => {
      //   let duration = "D";
      //   // let duration = dependentFields?.PERIOD_NO_P?.value;
      //   let termcd = dependentFields?.TERM_CD_P?.value;
      //   let rate = dependentFields?.INT_RATE_P?.value;
      //   let period = `${dependentFields?.PERIOD_NO_P?.value}`;
      //   let fdflag = dependentFields?.PRE_INT_FLG_P?.value;
      //   let principalAmount = dependentFields?.PRINCIPAL_AMT_P?.value;
      //   let acctType = dependentFields?.ACCT_TYPE_P?.value;
      //   let branchCd = dependentFields?.BRANCH_CD?.value;
      //   let catCd = dependentFields?.CATEG_CD_P?.value;
      //   let companyCd = dependentFields?.COMP_CD?.value;
      //   let tranDate = format(
      //     new Date(dependentFields?.TRAN_DT_P?.value),
      //     "dd/MMM/yyyy"
      //   );
      //   let maturityDate = format(
      //     new Date(dependentFields?.MATURITY_DT_P?.value),
      //     "dd/MMM/yyyy"
      //   );
      //   let reqData = {
      //     duration,
      //     period,
      //     fdflag,
      //     principalAmount,
      //     acctType,
      //     branchCd,
      //     companyCd,
      //     tranDate,
      //     catCd,
      //     termcd,
      //     rate,
      //   };

      //   const areAllValuesPresent = (values) => {
      //     return Object.values(values).every(
      //       (value) => value !== "" && value != null
      //     );
      //   };
      //   if (areAllValuesPresent(reqData)) {
      //     const postData = await API.getFdMaturityAmount({
      //       COMP_CD: companyCd,
      //       BRANCH_CD: branchCd,
      //       ACCT_TYPE: acctType,
      //       CATEG_CD: catCd,
      //       MATURITY_DT: maturityDate,
      //       TRAN_DT: tranDate,
      //       PERIOD_CD: duration,
      //       PERIOD_NO: period,
      //       PRE_INT_FLAG: fdflag,
      //       PRINCIPAL_AMT: principalAmount,
      //       INT_RATE: rate,
      //       TERM_CD: termcd,
      //     });

      //     return postData[0]?.MATURITY_AMT;
      //   }
      // },
      shouldExclude: (val1, dependent) => {
        if (dependent?.CALCSWITCH?.value === "P") {
          return false;
        }
        return true;
      },
    },
    {
      render: {
        componentType: "formbutton",
      },
      name: "NEW_PERIOD_BTN",
      label: "New",
      type: "text",
      GridProps: { lg: 1, xl: 1 },
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
      name: "TRAN_DT_S",
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
      name: "PERIOD_NO_DISP_S",
      label: "Period",
      options: [
        { label: "Day(s)", value: "D" },
        { label: "Month(s)", value: "M" },
        { label: "Year(s)", value: "Y" },
      ],
      defaultValue: "D",
      fullWidth: true,
      GridProps: { xs: 3, sm: 3, md: 2, lg: 2, xl: 2 },
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
        componentType: "numberFormat",
      },
      name: "PERIOD_NO_S",
      label: "",
      GridProps: { xs: 1.5, sm: 1.5, md: 1.5, lg: 1, xl: 1 },
      preventSpecialChars: sessionStorage.getItem("specialChar") || "",
      dependentFields: ["CALCSWITCH", "PERIOD_NO_DISP_S"],
      setFieldLabel: (dependentFields, currVal) => {
        let duration = dependentFields.PERIOD_NO_DISP_S?.value;
        console.log(duration);

        return duration === "D"
          ? { label: "Day(s)" }
          : duration === "M"
          ? { label: "Month(s)" }
          : duration === "Y"
          ? { label: "Year(s)" }
          : { label: "Day(s)" };
      },
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
      label: "PrincipalAmount",
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
      isReadOnly: true,
      defaultValue: new Date(),
      fullWidth: true,
      GridProps: { xs: 3, sm: 3, md: 3, lg: 2, xl: 2 },
      dependentFields: [
        "CALCSWITCH",
        "TRAN_DT_S",
        "PERIOD_NO_DISP_S",
        "PERIOD_NO_S",
      ],
      setValueOnDependentFieldsChange: (dependentFields) => {
        let duration = dependentFields.PERIOD_NO_DISP_S?.value;
        let periodNumber = parseInt(dependentFields.PERIOD_NO_S?.value, 10);
        let tranDateValue = dependentFields?.TRAN_DT_S?.value;

        let newDate = "";

        try {
          if (tranDateValue) {
            // Convert tranDateValue to a Date object
            const tranDate = new Date(tranDateValue);

            // Check if tranDate is a valid date
            if (!isNaN(tranDate.getTime())) {
              // Adjust the date based on the duration
              switch (duration) {
                case "D":
                  newDate = format(
                    addDays(tranDate, periodNumber),
                    "dd/MMM/yyyy"
                  );
                  break;
                case "M":
                  newDate = format(
                    addMonths(tranDate, periodNumber),
                    "dd/MMM/yyyy"
                  );
                  break;
                case "Y":
                  newDate = format(
                    addYears(tranDate, periodNumber),
                    "dd/MMM/yyyy"
                  );
                  break;
                default:
                  console.error("Invalid duration");
                  break;
              }
            } else {
              console.error("Invalid date value");
            }
          } else {
            console.error("Transaction date value is missing");
          }
        } catch (error) {
          console.error("Error processing date:", error);
        }
        console.log(newDate);

        return newDate;
      },

      shouldExclude: (val1, dependent) => {
        if (dependent?.CALCSWITCH?.value === "S") {
          return false;
        }
        return true;
      },
    },

    {
      render: {
        componentType: "autocomplete",
      },
      name: "RATE_DEFINATION_S",
      label: "rateDefination",
      _optionsKey: "getFdRateDefination",
      options: (dependentValue, formState, _, authState) => {
        return API.getFdRateDefination({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
          BASE_BRANCH: authState?.user?.baseBranchCode,
        });
      },
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
        componentType: "formbutton",
      },
      name: "CAL_FD_REPORT__BTN",
      label: "Calculate",
      type: "text",
      GridProps: { xs: 2, sm: 2, md: 1, lg: 1, xl: 1 },
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
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["categCdRequired"] }],
      },
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
        componentType: "autocomplete",
      },
      name: "RATE_DEFINATION_F",
      label: "Defination",
      _optionsKey: "getFdDefinationDdw",
      options: (dependentValue, formState, _, authState) => {
        return API.getFdDefinationDdw({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        });
      },
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["definationRequired"] }],
      },
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
    },
    {
      render: {
        componentType: "formbutton",
      },
      name: "CAL_COMPARE_SHEET_BTN",
      label: "Calculate",
      type: "text",
      GridProps: { xs: 2, sm: 2, md: 1, lg: 1, xl: 1 },
      dependentFields: ["CALCSWITCH"],
      shouldExclude: (val1, dependent) => {
        if (dependent?.CALCSWITCH?.value === "F") {
          return false;
        }
        return true;
      },
    },
  ],
};

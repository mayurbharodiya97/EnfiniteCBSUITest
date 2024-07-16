import { GeneralAPI } from "registry/fns/functions";

export const acctMSTHeaderFormMetadata = {
  form: {
    name: "acctHeaderForm",
    label: "",
    resetFieldOnUnmount: true,
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
        componentType: "textField",
      },
      name: "REQ_ID",
      label: "Request ID",
      isReadOnly: true,
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
      name: "ACCT_TYPE",
      label: "Acct Type",
      isFieldFocused: false,
      required: true,
      // options: API.GetDynamicSalutationData("Salutation")
      options: (dependentValue, formState, _, authState) => {
        // console.log("<<<<fnef", dependentValue, formState, _, authState);
        return GeneralAPI.get_Account_Type({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
          USER_NAME: authState?.user?.id,
          DOC_CD: "MST/002",
        });
      },
      _optionsKey: "acctTypesOp",
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["ThisFieldisrequired"] },
        ],
      },
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
        componentType: "formbutton",
      },
      name: "BUTTON_CLICK",
      label: "Submit",
      // endsIcon: "YoutubeSearchedFor",
      // rotateIcon: "scale(1.5)",
      placeholder: "",
      type: "text",
      GridProps: {
        xs: 12,
        sm: 2,
        md: 1,
        lg: 1,
        xl: 1,
      },
      shouldExclude: () => {
        return true;
      },
      __EDIT__: {
        shouldExclude: () => {
          return false;
        },
      },
      __NEW__: {
        shouldExclude: () => {
          return false;
        },
      }
    }
  ],
};

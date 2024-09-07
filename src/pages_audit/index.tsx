import { Fragment, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { PagesAudit } from "./pages_audit";
import {
  AuthLoginController,
  AuthProvider,
  ForgotPasswordController,
  ProtectedRoutes,
} from "./auth";
import {
  CustomPropertiesConfigurationProvider,
  ExtendedFieldMetaDataTypeOptional,
} from "@acuteinfo/common-base";
import { BranchSelectionGrid } from "./auth/branchSelection/branchSelectionGrid";
import { GeneralAPI } from "registry/fns/functions";

const meta: ExtendedFieldMetaDataTypeOptional = {
  branchCode: {
    render: {
      componentType: "autocomplete",
    },
    schemaValidation: {
      type: "string",
      rules: [{ name: "required", params: ["Branch Code is required"] }],
    },
    required: true,
    name: "BRANCH_CD",
    label: "Branch Code",
    placeholder: "Select branch code",
    // options: [
    //   { label: "1 branch", value: "1" },
    //   { label: "2 branch", value: "2" },
    //   { label: "3 branch", value: "3" },
    // ],
    options: GeneralAPI.getBranchCodeList,
    _optionsKey: "getBranchCodeList",
    GridProps: {
      xs: 3,
      md: 3,
      sm: 3,
      lg: 3,
      xl: 3,
    },
    // NOTE : this props only for set default brranch and only use in branchCode component do not use this key any other place or any component
    defaultBranchTrue: true,
  },

  accountType: {
    render: {
      componentType: "autocomplete",
    },
    required: true,
    schemaValidation: {
      type: "string",
      rules: [{ name: "required", params: ["AccountTypeReqired"] }],
    },
    name: "ACCT_TYPE",
    label: "AccountType",
    placeholder: "AccountTypePlaceHolder",
    options: (dependentValue, formState, _, authState) => {
      return GeneralAPI.get_Account_Type({
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: authState?.user?.branchCode ?? "",
        USER_NAME: authState?.user?.id ?? "",
        DOC_CD: formState?.docCD ?? "",
      });
    },
    _optionsKey: "get_Account_Type",
    defaultAcctTypeTrue: true,
    defaultValue: "",
    GridProps: {
      xs: 3,
      md: 3,
      sm: 3,
      lg: 3,
      xl: 3,
    },
  },

  accountCode: {
    render: {
      componentType: "numberFormat",
    },
    label: "Account Number",
    name: "ACCT_CD",
    placeholder: "Enter account number",
    required: true,
    // maxLength: 8,
    dependentFields: ["ACCT_TYPE", "BRANCH_CD"],
    postValidationSetCrossFieldValues: "retrieveStatementDtlAcctCd",
    // setValueOnDependentFieldsChange: (dependentFields) => {
    //   return "";
    // },
    schemaValidation: {
      type: "string",
      rules: [
        { name: "required", params: ["Account code is required"] },
        {
          name: "max",
          params: [20, "Account code should not exceed 20 digits"],
        },
      ],
    },
    GridProps: {
      xs: 3,
      md: 3,
      sm: 3,
      lg: 3,
      xl: 3,
    },
    FormatProps: {
      // format: "###########",
      allowNegative: false,
      allowLeadingZeros: true,
      // isNumericString: true,

      isAllowed: (values) => {
        if (values?.value?.length > 8) {
          return false;
        }
        return true;
      },
    },
  },

  phoneNumberOptional: {
    render: {
      componentType: "inputMask",
    },
    MaskProps: {
      mask: "0000000000",
      lazy: true,
    },
  },
};

const EntryPoint = () => (
  <Fragment>
    <CustomPropertiesConfigurationProvider
      config={{ customExtendedTypes: meta }}
    >
      <AuthProvider>
        <Routes>
          <Route path="login" element={<AuthLoginController />} />
          <Route
            path="forgotpassword"
            element={<ForgotPasswordController screenFlag="password" />}
          />
          <Route
            path="forgot-totp"
            element={<ForgotPasswordController screenFlag="totp" />}
          />
          <Route
            path="branch-selection/*"
            element={<BranchSelectionGrid selectionMode={"S"} />}
          />
          <Route
            path="change-branch/*"
            element={<BranchSelectionGrid selectionMode={"C"} />}
          />
          <Route
            path="*"
            element={
              <ProtectedRoutes>
                <PagesAudit />
              </ProtectedRoutes>
            }
          />
        </Routes>
      </AuthProvider>
    </CustomPropertiesConfigurationProvider>
  </Fragment>
);

export default EntryPoint;

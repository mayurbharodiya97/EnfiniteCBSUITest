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
import TotpEnbaledDisabled from "./pages/profile/totp/totp-enabled-disable";

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
    placeholder: "BranchCodePlaceHolder",
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
      componentType: "textField",
    },
    label: "Account Number",
    name: "ACCT_CD",
    placeholder: "EnterAccountNumber",
    required: true,
    dependentFields: ["ACCT_TYPE", "BRANCH_CD"],
    postValidationSetCrossFieldValues: "retrieveStatementDtlAcctCd",
    schemaValidation: {
      type: "string",
      rules: [
        { name: "required", params: ["AccountNumberRequired"] },
        {
          name: "max",
          params: [20, "Account code should not exceed 20 digits"],
        },
      ],
    },
    inputProps: {
      maxLength: 20,
      onInput: (event) => {
        event.target.value = event.target.value.replace(/[^0-9\s]/g, "");
      },
    },
    GridProps: {
      xs: 3,
      md: 3,
      sm: 3,
      lg: 3,
      xl: 3,
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

  fullAccountNumber: {
    render: {
      componentType: "textField",
    },
    name: "FULL_ACCT_NO",
    label: "Full Account Number",
    postValidationSetCrossFieldValues: "retrieveStatementDtlFullAcctNo",
    schemaValidation: {
      type: "string",
      rules: [{ name: "required", params: ["Full account No is required"] }],
    },
    GridProps: {
      xs: 12,
      md: 12,
      sm: 12,
      lg: 12,
      xl: 12,
    },
    maxLength: 20,
    FormatProps: {
      allowNegative: false,
      allowLeadingZeros: true,
      isAllowed: (values) => {
        if (values?.value?.length > 20) {
          return false;
        }
        return true;
      },
    },
  },
  Remark: {
    render: {
      componentType: "textField",
    },
    maxLength: 100,
  },
};

const EntryPoint = () => (
  <Fragment>
    <CustomPropertiesConfigurationProvider
      config={{
        customExtendedTypes: meta,
        denoTableType: "dual",
        defaultGridConfig: {
          variant: "contained",
          isContainedActionButton: true,
        },
      }}
    >
      <AuthProvider>
        <Routes>
          <Route path="login" element={<AuthLoginController />} />

          <Route path="totp-enable" element={<TotpEnbaledDisabled />} />
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

import { singletonFunctionRegisrationFactory } from "components/utils";
import { GeneralAPI } from "./functions";
const { registerFn } = singletonFunctionRegisrationFactory;

registerFn("GetMiscValue", GeneralAPI.GetMiscValue);
registerFn("getValidateValue", GeneralAPI.getValidateValue);
registerFn("getCustType", GeneralAPI.getCustType);
registerFn("getAccountTypeList", GeneralAPI.getAccountTypeList);
registerFn("getCustomerIdValidate", GeneralAPI.getCustomerIdValidate);
registerFn(
  "retrieveStatementDtlFullAcctNo",
  GeneralAPI.retrieveStatementDtlFullAcctNo
);
registerFn("retrieveStatementDtlAcctCd", GeneralAPI.retrieveStatementDtlAcctCd);

registerFn("getBranchCodeList", GeneralAPI.getBranchCodeList);
registerFn("retrieveStatementDetails", GeneralAPI.retrieveStatementDetails);
registerFn("getReportAccountType", GeneralAPI.getReportAccountType);
registerFn("getTbgDocMstData", GeneralAPI.getTbgDocMstData);
registerFn("getActionDetailsData", GeneralAPI.getActionDetailsData);
registerFn("getquickViewList", GeneralAPI.getquickViewList);
registerFn("getMetadataList", GeneralAPI.getMetadataList);
registerFn("getKYCDocTypes", GeneralAPI.getKYCDocTypes);
registerFn("getTabelListData", GeneralAPI.getTabelListData);
registerFn("getChequeLeavesList", GeneralAPI.getChequeLeavesList);
registerFn("getDynDropdownData", GeneralAPI.getDynDropdownData);
registerFn("getDependentFieldList", GeneralAPI.getDependentFieldList);
registerFn("getProMiscData", GeneralAPI.getProMiscData);
registerFn("getZoneListData", GeneralAPI.getZoneListData);
registerFn("getSlipNoData", GeneralAPI.getSlipNoData);
registerFn("getBankCodeData", GeneralAPI.getBankCodeData);

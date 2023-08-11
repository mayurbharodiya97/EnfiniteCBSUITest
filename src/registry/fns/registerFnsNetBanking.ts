import { singletonFunctionRegisrationFactory } from "components/utils";
import { GeneralAPI } from "./functions";
const { registerFn } = singletonFunctionRegisrationFactory;

registerFn("GetMiscValue", GeneralAPI.GetMiscValue);
registerFn("getValidateValue", GeneralAPI.getValidateValue);
registerFn("getCustType", GeneralAPI.getCustType);
registerFn("getAccountTypeList", GeneralAPI.getAccountTypeList);
registerFn("getCustomerIdValidate", GeneralAPI.getCustomerIdValidate);
registerFn("retrieveStatementDetails", GeneralAPI.retrieveStatementDetails);
registerFn("getBranchCodeList", GeneralAPI.getBranchCodeList);
registerFn("getReportAccountType", GeneralAPI.getReportAccountType);
registerFn("getquickViewList", GeneralAPI.getquickViewList);

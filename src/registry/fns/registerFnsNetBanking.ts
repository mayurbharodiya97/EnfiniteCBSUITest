import { singletonFunctionRegisrationFactory } from "components/utils";
import { GetEmailAcctConfigDD } from "pages_audit/pages/configurations/emailSMSTemplate/emailSMSTemplateForm/api";
import { GeneralAPI } from "./functions";
const { registerFn } = singletonFunctionRegisrationFactory;

registerFn("GetMiscValue", GeneralAPI.GetMiscValue);
registerFn("getValidateValue", GeneralAPI.getValidateValue);
registerFn("GetChargeTemplates", GeneralAPI.GetChargeTemplates);
registerFn("GetEmailAcctConfigDD", GetEmailAcctConfigDD);

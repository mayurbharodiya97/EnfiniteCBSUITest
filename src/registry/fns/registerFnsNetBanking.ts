import { singletonFunctionRegisrationFactory } from "components/utils";
import { GeneralAPI } from "./functions";
const { registerFn } = singletonFunctionRegisrationFactory;

registerFn("GetMiscValue", GeneralAPI.GetMiscValue);
registerFn("getValidateValue", GeneralAPI.getValidateValue);
registerFn("getAcctDetails", GeneralAPI.getAcctDetails);

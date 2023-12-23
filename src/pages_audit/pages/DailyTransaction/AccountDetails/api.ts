import {
  AddIDinResponseData,
  DefaultErrorObject,
  utilFunction,
} from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getAccInfo = async (...reqData) => {
  return {
    data: {
      personalInfo: {},
      balanceInfo: {},
      loanInfo: {},
    },
  };
};

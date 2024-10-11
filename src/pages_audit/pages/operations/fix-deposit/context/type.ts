export interface FDStateType {
  activeStep: number;
  isBackButton: boolean;
  disableButton: boolean;
  fdDetailFormData: object;
  sourceAcctFormData: object;
  retrieveFormData: object;
  fdParaDetailData: object;
  acctNoData: object;
  viewDtlGridData: object;
  fdPaymentData: object;
  checkAllowFDPayApiData: object;
  prematureRateData: object;
  fdSavedPaymentData: object;
  renewTrnsFormData: object;
}

export interface ActionType {
  type: string;
  payload: any;
}

export interface FDContextType {
  userState: FDStateType;
  setActiveStep: any;
}
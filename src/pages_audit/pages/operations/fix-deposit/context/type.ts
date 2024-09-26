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
}

export interface ActionType {
  type: string;
  payload: any;
}

export interface FDContextType {
  userState: FDStateType;
  setActiveStep: any;
}

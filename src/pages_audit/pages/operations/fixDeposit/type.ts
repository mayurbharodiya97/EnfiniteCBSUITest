export interface FDStateType {
  activeStep: number;
  fdParaFormData: object;
  isOpendfdAcctForm: boolean;
  fdAcctFormData: object;
  fdDetailFormData: object;
  sourceAcctFormData: object;
  isBackButton: boolean;
}

export interface ActionType {
  type: string;
  payload: any;
}

export interface FDContextType {
  fdState: FDStateType;
  setActiveStep: any;
}

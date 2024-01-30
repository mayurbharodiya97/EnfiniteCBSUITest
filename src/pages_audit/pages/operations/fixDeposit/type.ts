export interface FDStateType {
  activeStep: number;
  fdParaFormData: object;
  isOpendfdAcctForm: boolean;
  fdAcctFormData: object;
}

export interface ActionType {
  type: string;
  payload: any;
}

export interface FDContextType {
  fdState: FDStateType;
  setActiveStep: any;
}

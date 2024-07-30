export interface StateType {
  activeStep: number;
  form1Data: object;
  oldformData: object;
  formData: object;
  grid1: object[];
  grid2: object[];
  grid3: object[];
  grid4: object;
  grid5: object[];
  oldData: object[];
  oldData1: object[];
  oldData2: object[];
  oldData3: object[];
  oldData4: object;
  saveData:object;
  initPopulateData: object[];
  initPopulateData1: object[];
  initPopulateData2: object[];
  isBackButton: boolean;
}

export interface ActionType {
  type: string;
  payload: any;
}

export interface ContextType {
  userState: StateType;
  setActiveStep: any;
}

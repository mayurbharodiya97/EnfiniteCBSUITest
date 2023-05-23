export interface AuthStateType {
  access_token: any;
  isLoggedIn: any;
  role: string;
  roleName: string;
  access: any;
  companyName: string;
  workingDate: string;
  companyID: string;
  menulistdata: any;
  user: {
    branch: string;
    branchCode: string;
    lastLogin: string;
    name: string;
    //type: string;
    id: string;
    employeeID: any;
  };
}

export interface ActionType {
  type: string;
  payload: any;
}

export interface AuthContextType {
  authState: AuthStateType;
  login: any;
  logout: any;
  isLoggedIn: any;
}

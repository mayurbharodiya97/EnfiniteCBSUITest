import { useContext } from "react";
import branchSelectionSideImage from "assets/images/sideImage.png";
import * as API from "./api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "pages_audit/auth";
import Logo from "assets/images/easy_bankcore_Logo.png";
import useLogoPics from "components/logoPics/logoPics";
import { BranchSelectionGridWrapper } from "@acuteinfo/common-screens";

export const BranchSelectionGrid = ({ selectionMode }) => {
  const { authState, isBranchSelected, branchSelect, isLoggedIn, logout } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const logos = useLogoPics();

  return (
    <>
      <BranchSelectionGridWrapper
        BranchSelectionGridDataApiFn={API.BranchSelectionGridData}
        GetMenuDataApiFn={API.GetMenuData}
        authState={authState}
        branchSelectFn={branchSelect}
        isBranchSelectedFn={isBranchSelected}
        isLoggedInFn={isLoggedIn}
        logoutFn={logout}
        dashboardUrl="/cbsenfinity/dashboard"
        loginUrl="/cbsenfinity/login"
        logos={logos}
        navigate={navigate}
        selectionMode={selectionMode}
        sideImage={branchSelectionSideImage}
        logo={Logo}
        appTranCd="51"
      />
    </>
  );
};

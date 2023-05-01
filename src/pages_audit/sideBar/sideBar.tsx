import { FC, useContext, useMemo, useState } from "react";
import { reportMetaData } from "./reportMetaData";
import { SideBarNav } from "components/navigation/sideBarNavigation";
import { SearchViewNavigation } from "components/navigation/searchViewNavigation";
import { AuthContext } from "pages_audit/auth";
import "./icons";
import { transformMetaDataAsPerRole } from "./transformer";

/* eslint-disable react-hooks/exhaustive-deps */
export const MySideBar: FC<{
  handleDrawerOpen: Function;
  open: boolean;
}> = ({ handleDrawerOpen, open }) => {
  const { authState } = useContext(AuthContext);
  const [view, setView] = useState("/");
  const [NewFilterView, setNewFilterView] = useState<any>({});
  const [NewFilterData, setNewFilterData] = useState([]);

  const branches = useMemo(() => {
    let myBranches = authState?.access?.entities?.Branch ?? [];
    if (Array.isArray(myBranches) && myBranches.length >= 0) {
      return myBranches.map((one) => one.branchCode);
    } else {
      return [];
    }
  }, []);

  const products = useMemo(() => {
    let myProducts = authState?.access?.products ?? [];
    if (Array.isArray(myProducts) && myProducts.length >= 0) {
      return myProducts.map((one) => one.categoryCode);
    } else {
      return [];
    }
  }, []);
  let newMetaData = { navItems: authState.menulistdata };
  let filteredMetaDataSideBar = transformMetaDataAsPerRole(
    newMetaData,
    Number(authState.role),
    branches,
    authState.companyID,
    authState.access,
    products
  );

  let filteredReportsMetaData = transformMetaDataAsPerRole(
    {
      config: { rel: "", target: "_blank" },
      navItems: reportMetaData,
    },
    Number(authState.role),
    branches,
    authState.companyID,
    authState.access,
    products
  );

  return view === "report" ? (
    <SearchViewNavigation
      metaData={filteredReportsMetaData}
      handleDrawerOpen={handleDrawerOpen}
      drawerOpen={open}
      setView={setView}
      label="Reports"
      icon="table"
    />
  ) : view === "newfilterview" ? (
    <SearchViewNavigation
      metaData={{
        config: { rel: "", target: "_blank" },
        navItems: NewFilterData,
      }}
      handleDrawerOpen={handleDrawerOpen}
      drawerOpen={open}
      setView={setView}
      label={NewFilterView?.label ?? "Reports"}
      icon="table"
      placeholder={NewFilterView?.placeholder}
    />
  ) : (
    <SideBarNav
      metaData={filteredMetaDataSideBar}
      handleDrawerOpen={handleDrawerOpen}
      drawerOpen={open}
      setView={setView}
      slimSize={true}
      setNewFilterData={setNewFilterData}
      setNewFilterView={setNewFilterView}
    />
  );
};

import { Fragment, useContext, useEffect, useState } from "react";
import { useCallback } from "react";
import { searchButttonGridMetaData } from "./gridMetaData";
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { AuthContext } from "pages_audit/auth";
import * as API from "./api";
import { useQuery } from "react-query";
import { Dialog } from "@mui/material";
import { ActionTypes } from "components/dataTable";
import { queryClient } from "cache";

const actions: ActionTypes[] = [
  {
    actionName: "view-all",
    actionLabel: "View All",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "close",
    actionLabel: "Close",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
];

const SearchGrid = ({ open, onClose }) => {
  const authController = useContext(AuthContext);
  const [actionMenu, setActionMenu] = useState(actions)
  const [activeSiFlag, setActiveSiFlag] = useState("Y");


  const setCurrentAction = useCallback(
    async (data) => {
      if (data?.name === "Delete") {

      } else if (data?.name === "view-all" || data?.name === "view-active") {
        setActiveSiFlag(prevActiveSiFlag => {
          const newActiveSiFlag = prevActiveSiFlag === "Y" ? "N" : "Y";
          setActionMenu(prevActions => {
            const newActions = [...prevActions];
            newActions[0].actionLabel = newActiveSiFlag === "Y" ? "View All" : "View Active";
            newActions[0].actionName = newActiveSiFlag === "Y" ? "view-all" : "view-active";
            return newActions;
          });
          return newActiveSiFlag;
        });
      }
      if (data?.name === "close") {
        onClose();
      }
    },
    [setActiveSiFlag, setActionMenu]
  );


  const { data: apidata, isLoading, isFetching, isError, error, refetch } = useQuery(
    ["getSearchActiveSi", activeSiFlag],
    () => {
      return API.getSearchActiveSi({
        companyID: authController?.authState?.companyID,
        branchCode: authController?.authState?.user?.branchCode,
        activeSiFlag: activeSiFlag,
      });
    }
  );
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getSearchActiveSi"]);
    };
  }, []);

  return (
    <Fragment>
      <Dialog open={open} PaperProps={{ style: { width: "100%", overflow: "auto" } }} maxWidth="lg">
        <GridWrapper
          key={"searchButttonGridMetaData"}
          finalMetaData={searchButttonGridMetaData as GridMetaDataType}
          loading={isLoading || isFetching}
          data={apidata ?? []}
          setData={() => null}
          actions={actions}
          setAction={setCurrentAction}
          refetchData={() => refetch()}
        />

      </Dialog>
    </Fragment>
  );
};

export default SearchGrid;

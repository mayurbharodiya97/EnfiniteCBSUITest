import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { useCallback } from "react";
import { searchButttonGridMetaData } from "./metaData/gridMetaData";
import { AuthContext } from "pages_audit/auth";
import * as API from "./api";
import { useQuery } from "react-query";
import { Dialog, Paper, Typography } from "@mui/material";
import SiExecuteDetailView from "./siExecuteDetailView";
import { DeleteDialog } from "./deleteDialog";
import {
  ActionTypes,
  GridWrapper,
  queryClient,
  GridMetaDataType,
  LoaderPaperComponent,
} from "@acuteinfo/common-base";
import { t } from "i18next";
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
  {
    actionName: "view-details",
    actionLabel: "ViewDetails",
    multiple: false,
    rowDoubleClick: true,
  },
];

const SearchGrid = ({ open, onClose, mainRefetch }) => {
  const authController = useContext(AuthContext);
  const [actionMenu, setActionMenu] = useState(actions);
  const [activeSiFlag, setActiveSiFlag] = useState("Y");
  const [deleteopen, setDeleteOpen] = useState(false);
  const [currentRowData, setCurrentRowData] = useState<any>({});
  const [opens, setOpens] = useState(false);
  const [uniqueData, setUniqueData] = useState({});
  const isDeleteDataRef = useRef<any>(null);

  const Line_id = currentRowData?.data?.LINE_ID;
  const sr_Cd = currentRowData?.data?.SR_CD;
  const tran_cd = currentRowData?.data?.TRAN_CD;
  const setCurrentAction = useCallback(
    async (data) => {
      isDeleteDataRef.current = data?.rows?.[0];
      const { name, rows } = data;
      if (data?.name === "Delete") {
      } else if (data?.name === "view-all" || data?.name === "view-active") {
        setActiveSiFlag((prevActiveSiFlag) => {
          const newActiveSiFlag = prevActiveSiFlag === "Y" ? "N" : "Y";
          setActionMenu((prevActions) => {
            const newActions = [...prevActions];
            newActions[0].actionLabel =
              newActiveSiFlag === "Y" ? "View All" : "View Active";
            newActions[0].actionName =
              newActiveSiFlag === "Y" ? "view-all" : "view-active";

            return newActions;
          });
          return newActiveSiFlag;
        });
      } else if (data?.name === "view-details") {
        setOpens(true);
        setCurrentRowData(rows[0]);
      }
      if (data?.name === "close") {
        onClose();
      }
    },
    [setActiveSiFlag, setActionMenu]
  );

  const {
    data: apidata,
    isLoading,
    isFetching,
    isError,
    error,
    refetch: sirefetch,
  } = useQuery(["getSearchActiveSi", activeSiFlag], () => {
    return API.getSearchActiveSi({
      companyID: authController?.authState?.companyID,
      branchCode: authController?.authState?.user?.branchCode,
      activeSiFlag: activeSiFlag,
    });
  });

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getSearchActiveSi"]);
    };
  }, []);
  useEffect(() => {
    if (apidata) {
      const updatedGridData = apidata.map((item, index) => ({
        ...item,
        INDEX: `${index}`,
      }));
      setUniqueData(updatedGridData);
    }
  }, [apidata]);
  return (
    <Fragment>
      <Dialog
        open={open}
        PaperProps={{ style: { width: "100%", overflow: "auto" } }}
        maxWidth="lg"
      >
        {apidata ? (
          <>
            <GridWrapper
              key={"searchButttonGridMetaData"}
              finalMetaData={searchButttonGridMetaData as GridMetaDataType}
              loading={isLoading || isFetching}
              data={uniqueData ?? []}
              setData={() => null}
              actions={actions}
              setAction={setCurrentAction}
              refetchData={() => sirefetch()}
              onClickActionEvent={(index, id, currentData) => {
                if (id === "delete") {
                  setDeleteOpen(true);
                  setCurrentRowData(currentData);
                }
              }}
            />
            <Paper>
              <Typography
                color="inherit"
                variant={"h4"}
                component="div"
              ></Typography>
            </Paper>
          </>
        ) : (
          <LoaderPaperComponent />
        )}
      </Dialog>
      <DeleteDialog
        open={deleteopen}
        onClose={() => setDeleteOpen(false)}
        rowData={currentRowData}
        siRefetch={sirefetch}
        mainRefetch={mainRefetch}
      />

      <SiExecuteDetailView
        open={opens}
        onClose={() => setOpens(false)}
        lineId={Line_id}
        srCd={sr_Cd}
        tran_cd={tran_cd}
      />
    </Fragment>
  );
};

export default SearchGrid;
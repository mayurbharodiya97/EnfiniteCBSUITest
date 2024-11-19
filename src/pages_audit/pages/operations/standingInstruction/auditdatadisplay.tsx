import { Fragment, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuditgridMetaData } from "./metaData/gridMetaData";
import * as API from "./api";
import { useQuery } from "react-query";
import { Dialog } from "@mui/material";
import {
  ActionTypes,
  GridWrapper,
  queryClient,
  GridMetaDataType,
} from "@acuteinfo/common-base";

const actions: ActionTypes[] = [
  {
    actionName: "close",
    actionLabel: "Close",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "edit",
    actionLabel: "Edit",
    rowDoubleClick: true,
    alwaysAvailable: false,
    multiple: undefined,
  },
];

const AuditData = ({ griddata, open, onClose }) => {
  const navigate = useNavigate();
  const setCurrentAction = useCallback(
    async (actionData) => {
      const { name, rows } = actionData;
      if (name === "close") {
        onClose();
      } else {
        navigate(name, {
          state: rows,
        });
      }
    },
    [navigate, onClose]
  );

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(
    ["AuditDataDetail"],
    () =>
      API.AuditDataDetail({
        execute_date: griddata.EXECUTE_DT,
        companyID: griddata.COMP_CD,
        branchCode: griddata.ENT_BRANCH_CD,
        Tran_cd: griddata.TRAN_CD,
        Sr_cd: griddata.SR_CD,
        Lien_id: griddata.LINE_ID,
        sub_lineid: griddata.SUB_LINE_ID,
      }),
    {
      enabled: open === true ? true : false,
    }
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["AuditDataDetail"]);
    };
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  AuditgridMetaData.gridConfig.gridLabel = `SI Audit Trail Execute Date : ${formatDate(
    griddata.EXECUTE_DT
  )}`;
  return (
    <Fragment>
      <Dialog
        open={open}
        PaperProps={{ style: { width: "100%", overflow: "auto" } }}
        maxWidth="md"
      >
        <GridWrapper
          key={"AuditgridMetaData"}
          finalMetaData={AuditgridMetaData as GridMetaDataType}
          loading={isLoading || isFetching}
          data={data ?? []}
          refetchData={() => refetch()}
          setData={() => null}
          actions={actions}
          setAction={setCurrentAction}
        />
      </Dialog>
    </Fragment>
  );
};

export default AuditData;

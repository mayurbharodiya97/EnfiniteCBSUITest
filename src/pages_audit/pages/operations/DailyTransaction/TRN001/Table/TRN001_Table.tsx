import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation } from "react-query";
import { TRN001_TableMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import * as trn1Api from "../api";
import * as CommonApi from "../../TRNCommon/api";
import { useSnackbar } from "notistack";

import { AuthContext } from "pages_audit/auth";
import { AccDetailContext } from "pages_audit/auth";
import { useContext } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import {
  PopupMessageAPIWrapper,
  PopupRequestWrapper,
} from "components/custom/popupMessage";
const actions: ActionTypes[] = [
  {
    actionName: "view-detail",
    actionLabel: "View Detail",
    multiple: false,
    rowDoubleClick: true,
  },
  {
    actionName: "Delete",
    actionLabel: "Delete",
    multiple: false,
    rowDoubleClick: false,
    // alwaysAvailable: true,
  },
];

export const TRN001_Table = ({ updatedRows }) => {
  const { enqueueSnackbar } = useSnackbar();
  const myGridRef = useRef<any>(null);

  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AccDetailContext);

  const [rows, setRows] = useState<any>([]);
  const [dataRow, setDataRow] = useState<any>({});
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);

  let objData = {
    COMP_CD: authState?.companyID,
    BRANCH_CD: authState?.user?.branchCode,
  };

  useEffect(() => {
    console.log(rows, "trn1 table rows");
  }, [rows]);

  useEffect(() => {
    if (updatedRows?.length > 0) {
      setRows(updatedRows);
    } else {
      console.log("trn1 refresh");
      getTRN001List.mutate(objData);
    }
  }, [updatedRows, tempStore?.refresh]);

  // api define=============================================
  const getTRN001List = useMutation(trn1Api.getTRN001List, {
    onSuccess: (data) => {
      setRows(data);
    },
    onError: (error) => {},
  });

  const getAccInfo = useMutation(CommonApi.getAccDetails, {
    onSuccess: (data) => {
      setTempStore({ ...tempStore, accInfo: data });
    },
    onError: (error) => {},
  });
  const deleteScrollByVoucher = useMutation(CommonApi.deleteScrollByVoucherNo, {
    onSuccess: (data) => {
      setDeleteDialog(false);
      getTRN001List.mutate(objData);
      enqueueSnackbar("Scroll Deleted", {
        variant: "success",
      });
    },
    onError: (error: any) => {
      setDeleteDialog(false);
      enqueueSnackbar(error?.error_msg, {
        variant: "error",
      });
    },
  });
  //-----------------------------

  const setCurrentAction = useCallback((data) => {
    let row = data.rows[0]?.data;
    setDataRow(row);

    console.log(row, "row setCurrentAction");
    if (data.name === "view-detail") {
      let obj = {
        COMP_CD: row?.COMP_CD,
        BRANCH_CD: row?.BRANCH_CD,
        ACCT_TYPE: row?.ACCT_TYPE,
        ACCT_CD: row?.ACCT_CD,
        authState: authState,
      };
      getAccInfo.mutate(obj);
    }

    if (data.name === "Delete") {
      setDeleteDialog(true);
    }
  }, []);

  const handleDelete = () => {
    let obj = {
      TRAN_CD: dataRow?.TRAN_CD,
      ENTERED_COMP_CD: dataRow?.COMP_CD,
      ENTERED_BRANCH_CD: dataRow?.BRANCH_CD,
    };
    deleteScrollByVoucher.mutate(obj);
  };

  return (
    <>
      <GridWrapper
        key={`TRN001_TableMetaData`}
        finalMetaData={TRN001_TableMetaData as GridMetaDataType}
        data={rows}
        setData={() => null}
        loading={getTRN001List.isLoading || getAccInfo.isLoading}
        refetchData={() => {}}
        ref={myGridRef}
        actions={actions}
        setAction={setCurrentAction}
      />

      {Boolean(deleteDialog) ? (
        <PopupMessageAPIWrapper
          MessageTitle="Scroll Delete"
          Message="Do you wish to Delete this scroll?"
          onActionYes={() => handleDelete()}
          onActionNo={() => setDeleteDialog(false)}
          rows={[]}
          open={deleteDialog}
          loading={deleteScrollByVoucher.isLoading}
        />
      ) : null}
    </>
  );
};

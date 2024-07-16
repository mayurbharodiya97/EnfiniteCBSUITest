import { AddBranchGridMetaData } from "./gridMetaData";
import GridWrapper from "components/dataTableStatic";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import { Dialog } from "@mui/material";
import { Alert } from "components/common/alert";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import * as API from "./api";
import { ClearCacheContext, queryClient } from "cache";
import { useMutation, useQuery } from "react-query";
import { AuthContext } from "pages_audit/auth";
import { useLocation } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { usePopupContext } from "components/custom/popupContext";

const actions: ActionTypes[] = [
  {
    actionName: "ok",
    actionLabel: "Ok",
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

export const AddBranchGrid = ({ handleDialogClose }) => {
  const { getEntries } = useContext(ClearCacheContext);
  const { state: rows }: any = useLocation();
  const { authState } = useContext(AuthContext);
  const [updatedData, setUpdatedData] = useState([]);
  const myref = useRef<any>(null);
  const { MessageBox, CloseMessageBox } = usePopupContext();

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getAddBranchData"], () =>
    API.getAddBranchData({
      bankCd: rows?.[0]?.data?.BANK_CD,
    })
  );

  useEffect(() => {
    setUpdatedData(data);
  }, [data]);

  const mutation = useMutation(API.updateAddBranchData, {
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
      handleDialogClose();
    },
    onSuccess: (data) => {
      enqueueSnackbar(data, {
        variant: "success",
      });
      CloseMessageBox();
      handleDialogClose();
    },
  });

  const setCurrentAction = useCallback(async (data) => {
    if (data?.name === "close") {
      handleDialogClose();
    } else if (data?.name === "ok") {
      const cleanedData = myref.current?.cleanData?.();
      const gridData = cleanedData?.filter((row) => {
        return (
          row?._isTouchedCol?.CHECK_BOX === true &&
          row?._oldData?.CHECK_BOX === false &&
          row?.CHECK_BOX === true
        );
      });
      if (gridData?.length > 0) {
        const gridId = gridData.map((item) => item?.BRANCH_CD.trim()).join();
        let res = await MessageBox({
          messageTitle: "confirmation",
          message: "AreYouSureToProceed",
          buttonNames: ["Yes", "No"],
          loadingBtnName: ["Yes"],
        });
        if (res === "Yes") {
          mutation.mutate({
            FLAG: "I",
            FOR: "I",
            TABLE_NM: "BANK_MST",
            BRANCH_CD: authState?.user?.branchCode?.trim(),
            COLUMN: cleanedData[0]?.KEY_COL?.trim(),
            VALUE: cleanedData[0]?.KEY_VAL?.trim(),
            TYPE: cleanedData[0]?.KEY_TYPE?.trim(),
            ENTER_IN: gridId,
          });
        }
      } else {
        await MessageBox({
          messageTitle: "Alert",
          message: "AtleastOneBranchShouldBeSelected",
          buttonNames: ["Ok"],
        });
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      let entries = getEntries() as any[];
      if (Array.isArray(entries) && entries.length > 0) {
        entries.forEach((one) => {
          queryClient.removeQueries(one);
        });
      }
      queryClient.removeQueries(["getAddBranchData"]);
    };
  }, [getEntries]);

  return (
    <>
      {isError && (
        <Alert
          severity="error"
          errorMsg={error?.error_msg ?? "Something went to wrong.."}
          errorDetail={error?.error_detail}
          color="error"
        />
      )}
      <Dialog
        maxWidth="lg"
        open={true}
        PaperProps={{
          style: {
            width: "auto",
            overflow: "auto",
            padding: "10px",
          },
        }}
      >
        <GridWrapper
          key={`addBranchGrid`}
          finalMetaData={AddBranchGridMetaData as GridMetaDataType}
          data={updatedData ?? []}
          setData={setUpdatedData}
          loading={isLoading || isFetching}
          actions={actions}
          setAction={setCurrentAction}
          refetchData={() => refetch()}
          ref={myref}
        />
      </Dialog>
    </>
  );
};

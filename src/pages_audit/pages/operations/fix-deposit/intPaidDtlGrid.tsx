import { useCallback, useContext, useEffect, useRef } from "react";
import { FDContext } from "./context/fdContext";
import { AuthContext } from "pages_audit/auth";
import * as API from "./api";
import { useQuery } from "react-query";
import { useTranslation } from "react-i18next";
import { IntPaidDtlGridMetaData } from "./intPaidDtlGridMetaData";
import { Dialog, Paper } from "@mui/material";
import Draggable from "react-draggable";
import {
  Alert,
  GridWrapper,
  queryClient,
  ActionTypes,
  GridMetaDataType,
} from "@acuteinfo/common-base";

const actions: ActionTypes[] = [
  {
    actionName: "close",
    actionLabel: "Close",
    multiple: undefined,
    alwaysAvailable: true,
  },
];

export const IntPaidDtlGrid = ({ closeDialog }) => {
  const { t } = useTranslation();
  const { FDState } = useContext(FDContext);
  const { authState } = useContext(AuthContext);
  const setCurrentAction = useCallback((data) => {
    if (data?.name === "close") {
      closeDialog();
    }
  }, []);

  //Api for get INT Paid Detail data
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getFDIntDetail", authState?.user?.branchCode], () =>
    API.getFDIntDetail({
      COMP_CD: authState?.companyID ?? "",
      BRANCH_CD: FDState?.retrieveFormData?.BRANCH_CD ?? "",
      ACCT_TYPE: FDState?.retrieveFormData?.ACCT_TYPE ?? "",
      ACCT_CD: FDState?.retrieveFormData?.ACCT_CD ?? "",
    })
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries([
        "getFDIntDetail",
        authState?.user?.branchCode,
      ]);
    };
  }, []);

  useEffect(() => {
    const label2 = `Int Paid Detail of A/c No.: ${
      FDState?.retrieveFormData?.BRANCH_CD?.trim() ?? ""
    }-${FDState?.retrieveFormData?.ACCT_TYPE?.trim() ?? ""}-${
      FDState?.retrieveFormData?.ACCT_CD?.trim() ?? ""
    } ${FDState?.retrieveFormData?.ACCT_NM?.trim() ?? ""}`;
    IntPaidDtlGridMetaData.gridConfig.gridLabel = label2;
  }, []);

  return (
    <Dialog
      open={true}
      fullWidth={true}
      PaperProps={{
        style: {
          width: "100%",
        },
      }}
      maxWidth="lg"
      PaperComponent={(props) => (
        <Draggable
          handle="#draggable-dialog-title"
          cancel={'[class*="MuiDialogContent-root"]'}
        >
          <Paper {...props} />
        </Draggable>
      )}
    >
      <div id="draggable-dialog-title">
        {error && (
          <Alert
            severity="error"
            errorMsg={error?.error_msg ?? t("Somethingwenttowrong")}
            errorDetail={error?.error_detail}
            color="error"
          />
        )}
        <GridWrapper
          key={"IntPaidDtlGrid"}
          finalMetaData={IntPaidDtlGridMetaData as GridMetaDataType}
          data={data ?? []}
          setData={() => null}
          actions={actions}
          loading={isLoading || isFetching}
          setAction={setCurrentAction}
          enableExport={true}
        />
      </div>
    </Dialog>
  );
};

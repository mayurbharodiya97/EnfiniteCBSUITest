import { Dialog } from "@mui/material";
import { queryClient } from "cache";
import { Alert } from "components/common/alert";
import { usePopupContext } from "components/custom/popupContext";
import { ActionTypes } from "components/dataTable";
import { GridMetaDataType } from "components/dataTableStatic";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { AuthContext } from "pages_audit/auth";
import { Transition } from "pages_audit/common";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import * as API from "./api";
import { FdInterestPaymentConfDetail } from "./FdInterestPaymentconfForm";
import { FdInterestPaymentConfmGridMetaData } from "./FdInterestPaymentConfmMetaData";
const actions: ActionTypes[] = [
  {
    actionName: "view-details",
    actionLabel: "ViewDetails",
    multiple: false,
    rowDoubleClick: true,
  },
];

export const FDInterestPaymentConfm = () => {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const [fDDetailsData, setFDDetailsData] = useState({});
  const [isFDDetailOpen, setIsFDDetailOpen] = useState(false);
  const [rowsData, setRowsData] = useState([]);

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getFDPaymentInstruConfAcctDtl", authState?.user?.branchCode ?? ""], () =>
    API.getFDPaymentInstruConfAcctDtl({
      USER_LEVEL: authState?.role ?? "",
      A_USER: authState?.user?.id ?? "",
      ENT_COMP_CD: authState?.companyID ?? "",
      ENT_BRANCH_CD: authState?.user?.branchCode ?? "",
      FLAG: "FD",
    })
  );

  const getFDPaymentInstruDetail: any = useMutation(
    "fetchFDPaymentConfAcct",
    API.fetchFDPaymentConfAcct,
    {
      onSuccess: async (data) => {
        setFDDetailsData(data);
      },
      onError: async (error: any) => {
        const btnName = await MessageBox({
          messageTitle: "ValidationFailed",
          message: error?.error_msg ?? "",
          icon: "ERROR",
        });
        CloseMessageBox();
      },
    }
  );

  const setCurrentAction = useCallback(
    async (data) => {
      if (data?.name === "view-details") {
        getFDPaymentInstruDetail.mutate({
          COMP_CD: data?.rows?.[0]?.data?.COMP_CD ?? "",
          BRANCH_CD: data?.rows?.[0]?.data?.BRANCH_CD ?? "",
          ACCT_TYPE: data?.rows?.[0]?.data?.ACCT_TYPE ?? "",
          ACCT_CD: data?.rows?.[0]?.data?.ACCT_CD ?? "",
          A_CONFIRMED: data?.rows?.[0]?.data?.CONFIRMED ?? "",
          A_LAST_ENT_BY: data?.rows?.[0]?.data?.LAST_ENTERED_BY ?? "",
          A_PARM: "FD",
        });
        setIsFDDetailOpen(true);
        setRowsData(data?.rows);
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );
  const handleFDDetailClose = () => setIsFDDetailOpen(false);
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getFDPaymentInstruConfAcctDtl"]);
      queryClient.removeQueries(["fetchFDPaymentConfAcct"]);
    };
  }, []);

  return (
    <Fragment>
      {isError && (
        <Alert
          severity="error"
          errorMsg={error?.error_msg ?? "Something went to wrong.."}
          errorDetail={error?.error_detail ?? ""}
          color="error"
        />
      )}
      <GridWrapper
        key={"FdInterestPaymentConfm"}
        finalMetaData={FdInterestPaymentConfmGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={isLoading || isFetching}
        ReportExportButton={data?.length > 0 ? true : false}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
      />

      <Dialog
        open={isFDDetailOpen}
        // @ts-ignore
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            width: "100%",
            overflow: "auto",
          },
        }}
        maxWidth="lg"
      >
        <FdInterestPaymentConfDetail
          closeDialog={handleFDDetailClose}
          fdDetails={fDDetailsData}
          loader={getFDPaymentInstruDetail.isLoading ? true : false}
          rowsData={rowsData}
        />
      </Dialog>
    </Fragment>
  );
};

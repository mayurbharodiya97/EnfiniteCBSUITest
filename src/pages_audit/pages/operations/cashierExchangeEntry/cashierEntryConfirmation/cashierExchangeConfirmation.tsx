import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "pages_audit/auth";
import { CashierExchangeCnfMetaData } from "./cashierExchangeCnfMetadata";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import CashierEntryViewDetail from "./viewDetail/viewDetail";
import {
  ActionTypes,
  Alert,
  GridMetaDataType,
  GridWrapper,
} from "@acuteinfo/common-base";
const actions: ActionTypes[] = [
  {
    actionName: "viewall",
    actionLabel: "View All",
    multiple: undefined,
    alwaysAvailable: true,
  },
  {
    actionName: "viewDetail",
    actionLabel: "View Detail",
    multiple: false,
    rowDoubleClick: true,
  },
];
const CashierExchangeConfirmation = () => {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const [openDialog, setDialog] = useState(false);
  const [rowsData, setRowsData] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [isData, setIsData] = useState<any>({
    fromData: [],
    toData: [],
  });
  const {
    data: MainData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery<any, any>(["getCashierExchangeRetrieve"], () =>
    API.getCashierExchangeRetrieve({
      comp_cd: authState?.companyID,
      branch_cd: authState?.user?.branchCode,
      doc_cd: "TRN/368",
      acct_type: "",
      acct_cd: "",
      flag: "",
    })
  );
  const viewAllGridData = useMutation(API.getCashierExchangeRetrieve, {
    onError: async (error: any) => {
      let errorMsg = "Unknown Error occurred";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
    },
    onSuccess: async (data) => {
      setGridData(data);
    },
  });
  const From = useMutation(API.getCashierViewDetail, {
    onError: async (error: any) => {
      let errorMsg = "Unknown Error occurred";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
    },
    onSuccess: async (data: any, variables: any) => {
      if (variables?.type_cd === "5") {
        setIsData((pre) => ({
          ...pre,
          fromData: data,
        }));
      } else if (variables?.type_cd === "2") {
        setIsData((pre) => ({
          ...pre,
          toData: data,
        }));
      } else {
        setIsData({
          fromData: [],
          toData: [],
        });
      }
    },
  });

  const CurrentAction = useCallback(
    async (data) => {
      if (data.name === "viewall") {
        viewAllGridData.mutate({
          comp_cd: authState?.companyID,
          branch_cd: authState?.user?.branchCode,
          doc_cd: "TRN/368",
          acct_type: "",
          acct_cd: "",
          flag: "A",
        });
      } else if (data.name === "viewDetail") {
        From.mutate({
          comp_cd: authState?.companyID,
          branch_cd: authState?.user?.branchCode,
          scroll1: data?.rows?.[0]?.data?.SCROLL1,
          type_cd: "5",
        });
        From.mutate({
          comp_cd: authState?.companyID,
          branch_cd: authState?.user?.branchCode,
          scroll1: data?.rows?.[0]?.data?.SCROLL1,
          type_cd: "2",
        });
        setRowsData(data?.rows);
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (isData?.fromData?.length > 0 && isData?.toData?.length > 0) {
      setDialog(true);
    } else {
      setDialog(false);
    }
  }, [isData]);
  const handleCloseDialog = () => {
    setIsData({ fromData: [], toData: [] });
    setDialog(false);
  };
  useEffect(() => {
    if (MainData) {
      setGridData(MainData); // Set initial gridData to MainData
    }
  }, [MainData]);
  useEffect(() => {
    if (isFetching) {
      setGridData(MainData);
    }
  }, [isFetching, MainData]);
  return (
    <>
      <Fragment>
        {isError && (
          <Alert
            severity="error"
            errorMsg={error?.error_msg ?? "Somethingwenttowrong"}
            errorDetail={error?.error_detail}
            color="error"
          />
        )}
        <GridWrapper
          key={`retrieveGridMetaData${isLoading}${gridData}`}
          finalMetaData={CashierExchangeCnfMetaData as GridMetaDataType}
          data={gridData ?? []}
          setData={() => null}
          actions={actions}
          loading={
            isLoading ||
            isFetching ||
            viewAllGridData?.isLoading ||
            From?.isLoading
          }
          setAction={CurrentAction}
          refetchData={refetch}
        />
      </Fragment>
      <CashierEntryViewDetail
        open={openDialog}
        onClose={handleCloseDialog}
        stateData={isData}
        rowsData={rowsData}
        refetch={refetch}
      />
    </>
  );
};
export default CashierExchangeConfirmation;

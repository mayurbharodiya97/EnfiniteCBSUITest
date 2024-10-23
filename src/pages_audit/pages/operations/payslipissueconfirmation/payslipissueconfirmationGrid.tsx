import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { RetrievedinfoGridMetaData } from "./RetrivalInfoGridMetadata";
import { AuthContext } from "pages_audit/auth";
import { Route, Routes, useNavigate } from "react-router-dom";
import * as API from "./api";
import { useMutation, useQuery } from "react-query";
import { DataRetrival } from "./RetriveData";
import { PayslipConfirmationFormDetails } from "./payslipConfirmationForm";
import { enqueueSnackbar } from "notistack";
import {
  Alert,
  GridWrapper,
  ActionTypes,
  queryClient,
  ClearCacheProvider,
  GridMetaDataType,
} from "@acuteinfo/common-base";
const actions: ActionTypes[] = [
  {
    actionName: "view-all",
    actionLabel: "View All",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "retrive",
    actionLabel: "Retrival",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "close",
    actionLabel: "close",
    multiple: undefined,
    alwaysAvailable: true,
  },
  {
    actionName: "view-details",
    actionLabel: "View Details",
    multiple: false,
    rowDoubleClick: true,
  },
];

interface PayslipData {
  TRAN_CD: string;
  AMOUNT: string;
  TOTAL_AMT?: number; // Optional because it's calculated
}

const PayslipissueconfirmationGrid = ({ onClose }) => {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dateDialog, setDateDialog] = useState(true); // Changed to false to not show dialog initially
  const [actionMenu, setActionMenu] = useState(actions);
  const [activeSiFlag, setActiveSiFlag] = useState("Y");
  const isDataChangedRef = useRef(false);
  const retrievalParaRef = useRef<any>(null);
  const [gridData, setGridData] = useState<any[]>([]);
  const [isDataRetrieved, setIsDataRetrieved] = useState(false);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch: slipdataRefetch,
  } = useQuery<PayslipData[]>(
    ["getPayslipCnfRetrieveData", activeSiFlag],
    () =>
      API.getPayslipCnfRetrieveData({
        A_LANG: "en",
        ENT_COMP_CD: authState?.companyID ?? "",
        ENT_BRANCH_CD: authState?.user?.branchCode ?? "",
        GD_DATE: authState?.workingDate ?? "",
        FROM_DT: authState?.workingDate,
        TO_DT: authState?.workingDate,
        FLAG: activeSiFlag === "Y" ? "P" : "A",
      }),
    {
      enabled: activeSiFlag === "Y" || activeSiFlag === "N",
    }
  );

  const retrieveDataMutation = useMutation(API.getPayslipCnfRetrieveData, {
    onError: (error: any) => {
      setGridData([]);
      let errorMsg = "Unknown error occurred";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
    },
    onSuccess: (data) => {
      setGridData(data);
    },
  });

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getPayslipCnfRetrieveData"]);
    };
  }, []);

  const setCurrentAction = useCallback(
    async (data: { name: string; rows?: any[] }) => {
      const { name, rows } = data;
      if (name === "retrive") {
        setDateDialog(true);
        retrievalParaRef.current = null;
        setGridData([]);
      } else if (name === "close") {
        onClose();
      } else if (name === "view-all" || name === "view-pending") {
        setActiveSiFlag((prevActiveSiFlag) => {
          const newActiveSiFlag = prevActiveSiFlag === "Y" ? "N" : "Y";
          setActionMenu((prevActions) => {
            const newActions = [...prevActions];
            newActions[0].actionLabel =
              newActiveSiFlag === "Y" ? "View All" : "View Pending";
            newActions[0].actionName =
              newActiveSiFlag === "Y" ? "view-all" : "view-pending";

            return newActions;
          });
          return newActiveSiFlag;
        });
      } else if (name === "view-details") {
        navigate(name, {
          state: rows,
        });
      }
    },
    [navigate]
  );

  const selectedDatas = (dataObj: PayslipData[] | null) => {
    setDateDialog(false);
    if (dataObj) retrievalParaRef.current = dataObj;
    retrieveDataMutation.mutate(retrievalParaRef.current);
  };

  useEffect(() => {
    if (data && !isLoading && !isFetching) {
      setGridData(data);
      setIsDataRetrieved(false);
    }
  }, [data, isLoading, isFetching]);

  const handleDialogClose = useCallback(() => {
    navigate(".");
    if (isDataChangedRef.current === true) {
      isDataRetrieved
        ? retrieveDataMutation.mutate(retrievalParaRef.current)
        : slipdataRefetch();
    }
    isDataChangedRef.current = false;
  }, [navigate, slipdataRefetch, isDataRetrieved]);

  return (
    <Fragment>
      {isError && (
        <Alert
          severity="error"
          //@ts-ignore
          errorMsg={error?.message ?? "Something went wrong"}
          //@ts-ignore
          errorDetail={error?.message}
          color="error"
        />
      )}
      <GridWrapper
        key={"PayslipCnfRetrieveDataGrid"}
        finalMetaData={RetrievedinfoGridMetaData as GridMetaDataType}
        data={gridData}
        setData={setGridData}
        actions={actionMenu}
        loading={isLoading || isFetching || retrieveDataMutation?.isLoading}
        setAction={setCurrentAction}
        refetchData={() => {
          slipdataRefetch();
        }}
      />
      <Routes>
        <Route
          path="view-details/*"
          element={
            <PayslipConfirmationFormDetails
              defaultView={"view"}
              closeDialog={handleDialogClose}
              slipdataRefetch={slipdataRefetch}
            />
          }
        />
      </Routes>
      <DataRetrival
        closeDialog={() => setDateDialog(false)}
        open={dateDialog}
        onUpload={(data) => {
          selectedDatas(data);
        }}
      />
    </Fragment>
  );
};

export const Payslipissueconfirmation = ({ onClose }) => {
  return (
    <ClearCacheProvider>
      <PayslipissueconfirmationGrid onClose={onClose} />
    </ClearCacheProvider>
  );
};

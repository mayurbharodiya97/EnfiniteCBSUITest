import { useCallback, useContext, useEffect, useRef, useState } from "react";
import GridWrapper from "components/dataTableStatic";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { PositivePayEntryGridMetaData } from "./gridMetadata";
import { PositivePayEntryFormWrapper } from "./form/positivePayEntry";
import { ResponseParametersFormWrapper } from "./form/responseParaForm";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import { Alert } from "components/common/alert";
import { format } from "date-fns";
import ImportData from "./form/importData";
import { queryClient } from "cache";
import { isValidDate } from "components/utils/utilFunctions/function";
import { enqueueSnackbar } from "notistack";
import { t } from "i18next";
import { usePopupContext } from "components/custom/popupContext";

const actions: ActionTypes[] = [
  {
    actionName: "add",
    actionLabel: "Add",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "import",
    actionLabel: "Import",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "retrieve",
    actionLabel: "Retrieve",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "view-details",
    actionLabel: "ViewDetail",
    multiple: false,
    rowDoubleClick: true,
  },
];

export const PositivePayEntryGrid = () => {
  const isDataChangedRef = useRef(false);
  const [gridData, setGridData] = useState([]);
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const initialRender = useRef(true);
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const retrievalParaRef = useRef<any>(null);
  const [retrieveData, setRetrieveData] = useState<any>({});
  const [isDataRetrieved, setIsDataRetrieved] = useState(false);
  const { MessageBox } = usePopupContext();

  const {
    data: initialData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery<any, any>(
    ["getPositivePayGridData", authState?.user?.branchCode],
    () =>
      API.getPositivePayGridData({
        FLAG: "D",
        ENT_COMP_CD: authState?.companyID ?? "",
        ENT_BRANCH_CD: authState?.user?.branchCode ?? "",
        FROM_DATE: authState?.workingDate ?? "",
        TO_DATE: authState?.workingDate ?? "",
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: "",
        ACCT_TYPE: "",
        ACCT_CD: "",
      })
  );

  const retrieveDataMutation = useMutation(API.getPositivePayGridData, {
    onError: (error: any) => {
      setGridData([]);
      let errorMsg = t("Unknownerroroccured");
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
      handleDialogClose();
    },
    onSuccess: (data) => {
      setGridData([]);
      if (data.length === 1) {
        setRetrieveData(data[0]);
        navigate("view-details", {
          state: { retrieveData: data[0] },
        });
        setIsDataRetrieved(true);
      } else if (data.length > 1) {
        setGridData(data);
        setIsDataRetrieved(true);
      } else {
        MessageBox({
          messageTitle: "Alert",
          message: "NoRecordFound",
          buttonNames: ["Ok"],
        });
        handleDialogClose();
      }
    },
  });

  useEffect(() => {
    return () => {
      queryClient.removeQueries([
        "getPositivePayGridData",
        authState?.user?.branchCode,
      ]);
    };
  }, []);

  const setCurrentAction = useCallback(
    async (data) => {
      if (data?.name === "add") {
        navigate(data?.name, {
          state: [],
        });
        if (Boolean(retrievalParaRef.current)) {
          retrievalParaRef.current = null;
          setIsDataRetrieved(false);
          refetch();
        }
      } else if (data?.name === "retrieve") {
        setOpen(true);
        setGridData([]);
      } else if (data?.name === "import") {
        navigate(data?.name);
        if (Boolean(retrievalParaRef.current)) {
          retrievalParaRef.current = null;
          refetch();
        }
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      if (location.pathname === "/cbsenfinity/operation/positivepay-entry") {
        navigate("add");
      }
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (initialData && !isLoading && !isFetching) {
      setGridData(initialData);
      setIsDataRetrieved(false);
    }
  }, [initialData, isLoading, isFetching]);

  const handleDialogClose = useCallback(() => {
    navigate(".");
    if (isDataChangedRef.current === true) {
      isDataRetrieved
        ? retrieveDataMutation.mutate({
            FLAG: retrievalParaRef?.current?.FLAG ?? "",
            ENT_COMP_CD: authState?.companyID ?? "",
            ENT_BRANCH_CD: authState?.user?.branchCode ?? "",
            FROM_DATE:
              retrievalParaRef?.current?.FLAG === "A"
                ? ""
                : retrievalParaRef?.current?.FLAG === "D" &&
                  isValidDate(retrievalParaRef.current?.FROM_DATE)
                ? format(
                    new Date(retrievalParaRef?.current?.FROM_DATE),
                    "dd/MMM/yyyy"
                  ) ?? ""
                : authState?.workingDate ?? "",
            TO_DATE:
              retrievalParaRef?.current?.FLAG === "A"
                ? ""
                : retrievalParaRef?.current?.FLAG === "D" &&
                  isValidDate(retrievalParaRef.current?.TO_DATE)
                ? format(
                    new Date(retrievalParaRef?.current?.TO_DATE),
                    "dd/MMM/yyyy"
                  ) ?? ""
                : authState?.workingDate ?? "",
            COMP_CD: authState?.companyID ?? "",
            BRANCH_CD: retrievalParaRef.current?.BRANCH_CD ?? "",
            ACCT_TYPE: retrievalParaRef.current?.ACCT_TYPE ?? "",
            ACCT_CD: retrievalParaRef.current?.ACCT_CD ?? "",
          })
        : refetch();
    }
    isDataChangedRef.current = false;
  }, [navigate, initialData, refetch]);

  const handleClose = () => {
    setOpen(false);
    if (!isDataRetrieved) {
      refetch();
    }
  };

  const selectedDatas = (dataObj) => {
    setOpen(false);
    if (dataObj) retrievalParaRef.current = dataObj;
    const retrieveData: any = {
      FLAG: retrievalParaRef?.current?.FLAG ?? "",
      ENT_COMP_CD: authState?.companyID ?? "",
      ENT_BRANCH_CD: authState?.user?.branchCode ?? "",
      FROM_DATE:
        retrievalParaRef?.current?.FLAG === "A"
          ? ""
          : retrievalParaRef?.current?.FLAG === "D" &&
            retrievalParaRef.current?.FROM_DATE
          ? format(
              new Date(retrievalParaRef?.current?.FROM_DATE),
              "dd/MMM/yyyy"
            ) ?? ""
          : authState?.workingDate ?? "",
      TO_DATE:
        retrievalParaRef?.current?.FLAG === "A"
          ? ""
          : retrievalParaRef?.current?.FLAG === "D" &&
            retrievalParaRef.current?.TO_DATE
          ? format(
              new Date(retrievalParaRef?.current?.TO_DATE),
              "dd/MMM/yyyy"
            ) ?? ""
          : authState?.workingDate ?? "",
      COMP_CD: authState?.companyID ?? "",
      BRANCH_CD: retrievalParaRef.current?.BRANCH_CD ?? "",
      ACCT_TYPE: retrievalParaRef.current?.ACCT_TYPE ?? "",
      ACCT_CD: retrievalParaRef.current?.ACCT_CD ?? "",
    };
    retrieveDataMutation.mutate(retrieveData);
  };

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
      <GridWrapper
        key={`positivePayEntryGrid` + gridData}
        finalMetaData={PositivePayEntryGridMetaData as GridMetaDataType}
        data={gridData ?? []}
        setData={setGridData}
        loading={isLoading || isFetching || retrieveDataMutation?.isLoading}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
      />
      <Routes>
        <Route
          path="view-details/*"
          element={
            <PositivePayEntryFormWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={handleDialogClose}
              defaultView={"view"}
            />
          }
        />
        <Route
          path="add/*"
          element={
            <PositivePayEntryFormWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={handleDialogClose}
              defaultView={"new"}
            />
          }
        />
        <Route
          path="import/*"
          element={
            <ImportData
              CloseFileUpload={handleDialogClose}
              refetchData={refetch}
            />
          }
        />
      </Routes>
      {open && (
        <ResponseParametersFormWrapper
          closeDialog={handleClose}
          retrievalParaValues={selectedDatas}
        />
      )}
    </>
  );
};

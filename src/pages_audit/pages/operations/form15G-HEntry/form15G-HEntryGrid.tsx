import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "pages_audit/auth";
import { useMutation, useQuery } from "react-query";
import { Form15GHEntryGridMetaData } from "./gridMetaData";
import { Form15GHEntryWrapper } from "./form/form15G-HEntry";
import * as API from "./api";
import { RetrievalParametersFormWrapper } from "./form/retrieveDataForm";
import { enqueueSnackbar } from "notistack";
import { t } from "i18next";
import { format } from "date-fns";
import { isValidDate } from "components/utils/utilFunctions/function";
import { usePopupContext } from "components/custom/popupContext";
import {
  Alert,
  GridWrapper,
  GridMetaDataType,
  ActionTypes,
  queryClient,
} from "@acuteinfo/common-base";

const Actions: ActionTypes[] = [
  {
    actionName: "add",
    actionLabel: "Add",
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
    actionLabel: "ViewDetails",
    multiple: false,
    rowDoubleClick: true,
  },
];

export const Form15GHEntryGrid = ({ screenFlag }) => {
  const isDataChangedRef = useRef(false);
  const { authState } = useContext(AuthContext);
  const [gridData, setGridData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const initialRender = useRef(true);
  const [isDataRetrieved, setIsDataRetrieved] = useState(false);
  const [open, setOpen] = useState(false);
  const retrievalParaRef = useRef<any>(null);
  const { MessageBox } = usePopupContext();
  const [retrieveData, setRetrieveData] = useState<any>({});

  const {
    data: initialData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery<any, any>(
    ["getForm15GHDetail", authState?.user?.branchCode],
    () =>
      API.getForm15GHDetail({
        workingDate: authState?.workingDate ?? "",
        enterCompanyID: authState?.companyID ?? "",
        enterBranchCode: authState?.user?.branchCode ?? "",
      })
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries([
        "getForm15GHDetail",
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
      if (location.pathname === "/cbsenfinity/operation/form-15g-h-entry") {
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

  const handleClose = () => {
    setOpen(false);
    if (!isDataRetrieved) {
      refetch();
    }
  };

  const retrieveDataMutation = useMutation(API.getEntry15GHRetrieveData, {
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
    onSuccess: (data, variables) => {
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

  const handleDialogClose = useCallback(() => {
    navigate(".");
    if (isDataChangedRef.current === true) {
      isDataRetrieved
        ? retrieveDataMutation.mutate({
            COMP_CD: authState?.companyID ?? "",
            BRANCH_CD: authState?.user?.branchCode ?? "",
            TRAN_TYPE: retrievalParaRef?.current?.TRAN_TYPE ?? "",
            CUSTOMER_ID: retrievalParaRef?.current?.A_CUSTOM_USER_NM ?? "",
            FROM_DT: isValidDate(retrievalParaRef?.current?.FROM_DT)
              ? format(
                  new Date(retrievalParaRef?.current?.FROM_DT),
                  "dd/MMM/yyyy"
                )
              : format(new Date(), "dd/MMM/yyyy") ?? "",
            TO_DT: isValidDate(retrievalParaRef?.current?.TO_DT)
              ? format(
                  new Date(retrievalParaRef?.current?.TO_DT),
                  "dd/MMM/yyyy"
                )
              : format(new Date(), "dd/MMM/yyyy") ?? "",
          })
        : refetch();
    }
    isDataChangedRef.current = false;
  }, [navigate, initialData, refetch]);

  const selectedDatas = (dataObj) => {
    setOpen(false);
    if (dataObj) retrievalParaRef.current = dataObj;
    const retrieveData: any = {
      COMP_CD: authState?.companyID ?? "",
      BRANCH_CD: authState?.user?.branchCode ?? "",
      TRAN_TYPE: retrievalParaRef?.current?.TRAN_TYPE ?? "",
      CUSTOMER_ID: retrievalParaRef?.current?.A_CUSTOM_USER_NM ?? "",
      FROM_DT: isValidDate(retrievalParaRef?.current?.FROM_DT)
        ? format(new Date(retrievalParaRef?.current?.FROM_DT), "dd/MMM/yyyy")
        : format(new Date(), "dd/MMM/yyyy") ?? "",
      TO_DT: isValidDate(retrievalParaRef?.current?.TO_DT)
        ? format(new Date(retrievalParaRef?.current?.TO_DT), "dd/MMM/yyyy")
        : format(new Date(), "dd/MMM/yyyy") ?? "",
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
        key={`form15GHEntryGrid` + gridData}
        finalMetaData={Form15GHEntryGridMetaData as GridMetaDataType}
        data={gridData ?? []}
        setData={setGridData}
        loading={isLoading || isFetching || retrieveDataMutation?.isLoading}
        actions={Actions}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
      />
      <Routes>
        <Route
          path="view-details/*"
          element={
            <Form15GHEntryWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={handleDialogClose}
              defaultView={"view"}
              screenFlag={screenFlag}
            />
          }
        />
        <Route
          path="add/*"
          element={
            <Form15GHEntryWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={handleDialogClose}
              defaultView={"new"}
              screenFlag={screenFlag}
            />
          }
        />
      </Routes>
      {open && (
        <RetrievalParametersFormWrapper
          closeDialog={handleClose}
          retrievalParaValues={selectedDatas}
        />
      )}
    </>
  );
};

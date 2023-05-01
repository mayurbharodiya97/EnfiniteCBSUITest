import { ClearCacheProvider, ClearCacheContext, queryClient } from "cache";
import { useMutation, useQuery } from "react-query";
import {
  Fragment,
  useEffect,
  useContext,
  useRef,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { GridMetaDataType } from "components/dataTable/types";
import { ActionTypes } from "components/dataTable";
import * as API from "./api";
import { MerchantMasterGridMetaData } from "./gridMetadata";
import { MerchantMasterGridUpdate } from "./merchantMasterEdit";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { useSnackbar } from "notistack";
import { AuthContext } from "pages_audit/auth";

const actions: ActionTypes[] = [
  {
    actionName: "Add",
    actionLabel: "Add",
    multiple: false,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "save",
    actionLabel: "Save",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
];

const transformData = (data: any) => {
  if (Array.isArray(data)) {
    return data.map((one, index) => ({
      ...one,
      id: index,
      _hidden: false,
      _isNewRow: false,
    }));
  } else {
    return data;
  }
};
export const MerchantMasterGrid = () => {
  const { enqueueSnackbar } = useSnackbar();
  const isDataChangedRef = useRef(false);
  const isSubmitDataRef = useRef<any>(null);
  const { getEntries } = useContext(ClearCacheContext);
  const [isOpenSave, setIsOpenSave] = useState(false);
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getMerchantMasterGridData"], () => API.getMerchantMasterGridData());
  const mutation = useMutation(API.updMerchantMasterGridData, {
    onError: (error: any, { setServerError }) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      setServerError(errorMsg);
      // if (isErrorFuncRef.current == null) {
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });

      onActionCancel();
    },
    onSuccess: (data) => {
      enqueueSnackbar(data, {
        variant: "success",
      });
      isDataChangedRef.current = true;
      setIsOpenSave(false);
      refetch();
    },
  });

  useEffect(() => {
    return () => {
      let entries = getEntries() as any[];
      entries.forEach((one) => {
        queryClient.removeQueries(one);
      });
      queryClient.removeQueries(["getMerchantMasterGridData"]);
    };
  }, [getEntries]);
  const ClosedEventCall = useCallback(() => {
    navigate(".");
    if (isDataChangedRef.current === true) {
      isDataChangedRef.current = false;
    }
  }, [navigate]);
  const GidData = useMemo(() => transformData(data), [data]);
  const submitHandel = ({ data, mode, setServerError }) => {
    if (
      data?.isDeleteRow?.length === 0 &&
      data?.isUpdatedRow?.length === 0 &&
      data?.isNewRow?.length === 0
    ) {
    } else {
      let RedData = {
        DETAILS_DATA: data,
        COMP_CD: authState.companyID,
      };
      isSubmitDataRef.current = { data: RedData, mode, setServerError };
      setIsOpenSave(true);
    }
  };
  const onActionCancel = () => {
    setIsOpenSave(false);
  };
  const onPopupYes = (rows) => {
    mutation.mutate({
      ...isSubmitDataRef.current,
    });
  };
  return (
    <>
      <Fragment>
        {isLoading || isFetching ? (
          <MerchantMasterGridUpdate
            key={"Loading-MerchantMasterUpdate"}
            metadata={MerchantMasterGridMetaData as GridMetaDataType}
            ClosedEventCall={ClosedEventCall}
            data={[]}
            isEditableForm={true}
            isLoading={isLoading || isFetching}
          >
            {({ handelCloseEvent, handleSubmit, classes }) => <></>}
          </MerchantMasterGridUpdate>
        ) : isError ? (
          <MerchantMasterGridUpdate
            key={"Error-MerchantMasterUpdate"}
            metadata={MerchantMasterGridMetaData as GridMetaDataType}
            ClosedEventCall={ClosedEventCall}
            data={[]}
            isEditableForm={true}
            isError={isError}
            ErrorMessage={error?.error_msg ?? "Error"}
          >
            {({ handelCloseEvent, handleSubmit, classes }) => <></>}
          </MerchantMasterGridUpdate>
        ) : (
          <MerchantMasterGridUpdate
            key={"edit"}
            metadata={MerchantMasterGridMetaData as GridMetaDataType}
            ClosedEventCall={ClosedEventCall}
            data={GidData}
            // actions={actions}
            isEditableForm={true}
            mode={"edit"}
            //@ts-ignore
            actions={actions}
            refetch={refetch}
            onSubmit={submitHandel}
          >
            {({
              handelCloseEvent,
              handleSubmit,
              classes,
              handelActionEvent,
            }) => <></>}
          </MerchantMasterGridUpdate>
        )}
        {/* <Routes>
          <Route
            path="view-details"
            element={<MerchantMasterConfigDetail trnType={""} configType={""} />}
          />
        </Routes> */}
        {isOpenSave ? (
          <PopupMessageAPIWrapper
            MessageTitle="Confirmation"
            Message="Do you want to save this Request?"
            onActionYes={(rowVal) => onPopupYes(rowVal)}
            onActionNo={() => onActionCancel()}
            rows={{}}
            open={isOpenSave}
            loading={mutation.isLoading}
          />
        ) : null}
      </Fragment>
    </>
  );
};

export const MerchantMasterGridWrapper = () => {
  return (
    <ClearCacheProvider>
      <MerchantMasterGrid />
    </ClearCacheProvider>
  );
};

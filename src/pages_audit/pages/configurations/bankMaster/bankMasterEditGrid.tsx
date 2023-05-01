import { ClearCacheProvider, ClearCacheContext, queryClient } from "cache";
import { useQuery } from "react-query";
import {
  Fragment,
  useEffect,
  useContext,
  useRef,
  useCallback,
  useMemo,
  Suspense,
  useState,
} from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { GridMetaDataType } from "components/dataTable/types";
import { ActionTypes } from "components/dataTable";
import { BankMasterGridMetaData } from "./gridMetadata";
import { useDialogStyles } from "pages_audit/common/dialogStyles";
import { BankMasterGridUpdate } from "./bankMasterEdit";
import { FullScreenLoader } from "components/common/loaderPaper";
import { CRUDBankMaster } from "./crud";
import * as API from "./api";
import { DeleteBankMaster } from "./crud/deleteBankMaster";
import { SampleFileDownload } from "./fileUpload/sampleFIleDownload";
import { UploadFileData } from "./fileUpload/fileUpload";
import { format } from "date-fns";

const actions: ActionTypes[] = [
  {
    actionName: "add",
    actionLabel: "Add",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "sample-file-download",
    actionLabel: "Sample File Download",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "upload-file-data",
    actionLabel: "Upload File",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "edit",
    actionLabel: "Edit",
    multiple: false,
    rowDoubleClick: true,
    alwaysAvailable: false,
  },
  {
    actionName: "delete",
    actionLabel: "Delete",
    multiple: true,
    rowDoubleClick: false,
    alwaysAvailable: false,
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

export const BankMasterGrid = () => {
  const isDataChangedRef = useRef(false);
  const myGridRef = useRef<any>(null);
  const { getEntries } = useContext(ClearCacheContext);
  const [isSampleFileDownload, setSampleFileDownload] = useState(false);
  const navigate = useNavigate();

  const setCurrentAction = useCallback(
    (data) => {
      if (data?.name === "sample-file-download") {
        setSampleFileDownload(true);
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getBankMasterGridData"], () => API.getBankMasterGridData());
  useEffect(() => {
    return () => {
      let entries = getEntries() as any[];
      entries.forEach((one) => {
        queryClient.removeQueries(one);
      });
      queryClient.removeQueries(["getBankMasterGridData"]);
    };
  }, [getEntries]);
  const ClosedEventCall = useCallback(() => {
    navigate(".");
    if (isDataChangedRef.current === true) {
      refetch();
      isDataChangedRef.current = false;
    }
  }, [navigate]);

  const GidData = useMemo(() => transformData(data), [data]);
  const DownloadGidData = useMemo(() => {
    if (Array.isArray(data)) {
      return data.map((one, index) => ({
        ROUTING_NO: String(one?.ROUTING_NO ?? ""),
        BANK_CD: String(one?.BANK_CD ?? ""),
        BANK_NM: one?.BANK_NM,
        NEW_DIST_CD: String(one?.NEW_DIST_CD ?? ""),
        BRANCH_CD: String(one?.BRANCH_CD ?? ""),
        BRANCH_NM: one?.BRANCH_NM,
        BEFTN_ENABLED: one?.BEFTN_ENABLED === true ? "Y" : "N",
        NPSB_ENABLED: one?.NPSB_ENABLED === true ? "Y" : "N",
        RTGS_ENABLED: one?.RTGS_ENABLED === true ? "Y" : "N",
      }));
    } else {
      return data;
    }
  }, [data]);
  return (
    <>
      <Fragment>
        {isLoading || isFetching ? (
          <BankMasterGridUpdate
            key={"Loading-BankMasterUpdate"}
            metadata={BankMasterGridMetaData as GridMetaDataType}
            ClosedEventCall={ClosedEventCall}
            data={[]}
            isEditableForm={true}
            isLoading={isLoading}
          >
            {({ handelCloseEvent, handleSubmit, classes }) => <></>}
          </BankMasterGridUpdate>
        ) : isError ? (
          <BankMasterGridUpdate
            key={"Error-BankMasterUpdate"}
            metadata={BankMasterGridMetaData as GridMetaDataType}
            ClosedEventCall={ClosedEventCall}
            data={[]}
            isEditableForm={true}
            isError={isError}
            ErrorMessage={error?.error_msg ?? "Error"}
            isLoading={false}
            mode={"error"}
          >
            {({ handelCloseEvent, handleSubmit, classes }) => <></>}
          </BankMasterGridUpdate>
        ) : (
          <Suspense fallback={<FullScreenLoader />}>
            <BankMasterGridUpdate
              key={"BankMasteredit"}
              metadata={BankMasterGridMetaData as GridMetaDataType}
              ClosedEventCall={ClosedEventCall}
              data={GidData}
              // actions={actions}
              isEditableForm={true}
              mode={"edit"}
              actions={actions}
              setCurrentAction={setCurrentAction}
              myGridRef={myGridRef}
            >
              {(props) => {
                return <></>;
              }}
            </BankMasterGridUpdate>
            <Routes>
              <Route
                path="edit/*"
                element={
                  <CRUDBankMaster
                    ClosedEventCall={ClosedEventCall}
                    isDataChangedRef={isDataChangedRef}
                    defaultmode={"view"}
                  />
                }
              />
              <Route
                path="add/*"
                element={
                  <CRUDBankMaster
                    ClosedEventCall={ClosedEventCall}
                    isDataChangedRef={isDataChangedRef}
                    defaultmode={"new"}
                  />
                }
              />
              <Route
                path="delete/*"
                element={
                  <DeleteBankMaster
                    isOpen={true}
                    closeDialog={ClosedEventCall}
                    isDataChangedRef={isDataChangedRef}
                  />
                }
              />
              <Route
                path="upload-file-data/*"
                element={
                  <UploadFileData
                    CloseFileUpload={ClosedEventCall}
                    data={GidData}
                    isDataChangedRef={isDataChangedRef}
                  />
                }
              />
            </Routes>
          </Suspense>
        )}
        {isSampleFileDownload ? (
          <SampleFileDownload
            isOpen={isSampleFileDownload}
            closeDialog={() => {
              setSampleFileDownload(false);
            }}
            fileData={DownloadGidData}
            filename={
              "Bank-Master-" +
                format(new Date(), "yyyyMMddHH") +
                "-" +
                DownloadGidData?.length ?? 0
            }
          />
        ) : null}
      </Fragment>
    </>
  );
};

export const BankMasterGridWrapper = () => {
  const classes = useDialogStyles();
  return (
    <ClearCacheProvider>
      <BankMasterGrid />
    </ClearCacheProvider>
  );
};

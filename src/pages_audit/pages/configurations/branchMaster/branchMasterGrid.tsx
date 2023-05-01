import { ClearCacheProvider, ClearCacheContext, queryClient } from "cache";
import { useMutation, useQuery } from "react-query";
import {
  Fragment,
  useEffect,
  useContext,
  useRef,
  useCallback,
  useState,
  useMemo,
} from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Alert } from "components/common/alert";
import GridWrapper from "components/dataTableStatic";
import { GridMetaDataType } from "components/dataTable/types";
import { ActionTypes } from "components/dataTable";
import * as API from "./api";
import { BranchMasterGridMetaData } from "./gridMetadata";
import { useSnackbar } from "notistack";
import { SampleFileDownload } from "../bankMaster/fileUpload/sampleFIleDownload";
import { BranchMasterFormWrapper } from "./branchMasterForm";
import { format } from "date-fns";
import { UploadFileData } from "./fileUpload/fileUpload";
//import { ReleaseUsersAPIWrapper } from "../releaseUsers";
const actions: ActionTypes[] = [
  {
    actionName: "add",
    actionLabel: "Add",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "download",
    actionLabel: "File Download",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "upload",
    actionLabel: "Upload File",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "edit-detail",
    actionLabel: "Edit Detail",
    multiple: false,
    rowDoubleClick: true,
  },
];

export const BranchMaster = () => {
  const isDataChangedRef = useRef(false);
  const myGridRef = useRef<any>(null);
  const { getEntries } = useContext(ClearCacheContext);
  const navigate = useNavigate();
  const [isSampleFileDownload, setSampleFileDownload] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const setCurrentAction = useCallback(
    (data) => {
      if (data?.name === "download") {
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
  >(["getBranchMasterGridData"], () => API.getBranchMasterGridData());
  useEffect(() => {
    return () => {
      let entries = getEntries() as any[];
      entries.forEach((one) => {
        queryClient.removeQueries(one);
      });
      queryClient.removeQueries(["getBranchMasterGridData"]);
      queryClient.removeQueries(["GetDistrictList"]);
    };
  }, [getEntries]);

  const ClosedEventCall = useCallback(() => {
    navigate(".");
    if (isDataChangedRef.current === true) {
      refetch();
      isDataChangedRef.current = false;
    }
  }, [navigate]);
  const DownloadGidData = useMemo(() => {
    if (Array.isArray(data)) {
      return data.map((one, index) => ({
        BRANCH_CD: String(one?.BRANCH_CD ?? ""),
        BRANCH_NM: one?.BRANCH_NM,
        BR_OPEN_DT: Boolean(one?.BR_OPEN_DT)
          ? format(new Date(one?.BR_OPEN_DT), "dd/MM/yyyy")
          : "",
        ADD1: one?.ADD1,
        DIST_CD: String(one?.DIST_CD ?? ""),
        CONTACT1: String(one?.CONTACT1 ?? ""),
        CONTACT2: String(one?.CONTACT2 ?? ""),
        E_MAIL_ID: String(one?.E_MAIL_ID ?? ""),
        LATITUDE: String(one?.LATITUDE ?? ""),
        LONGITUDE: String(one?.LONGITUDE ?? ""),
        CONTACT_PERSON: one?.CONTACT_PERSON,
        MOBILE_NO: String(one?.MOBILE_NO ?? ""),
      }));
    } else {
      return data;
    }
  }, [data]);
  return (
    <Fragment>
      {isError && (
        <Alert
          severity="error"
          errorMsg={error?.error_msg ?? "Something went to wrong.."}
          errorDetail={error?.error_detail}
          color="error"
        />
      )}
      <GridWrapper
        key={`BranchMasterGrid`}
        finalMetaData={BranchMasterGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={isLoading || isFetching}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
        ref={myGridRef}
      />
      <Routes>
        <Route
          path="edit-detail/*"
          element={
            <BranchMasterFormWrapper
              handleDialogClose={ClosedEventCall}
              isDataChangedRef={isDataChangedRef}
              formView="edit"
            />
          }
        />
      </Routes>
      <Routes>
        <Route
          path="add/*"
          element={
            <BranchMasterFormWrapper
              handleDialogClose={ClosedEventCall}
              isDataChangedRef={isDataChangedRef}
              formView="add"
            />
          }
        />
        <Route
          path="upload/*"
          element={
            <UploadFileData
              CloseFileUpload={ClosedEventCall}
              data={data}
              isDataChangedRef={isDataChangedRef}
            />
          }
        />
      </Routes>
      {isSampleFileDownload ? (
        <SampleFileDownload
          isOpen={isSampleFileDownload}
          closeDialog={() => {
            setSampleFileDownload(false);
          }}
          fileData={DownloadGidData}
          filename={
            "Branch-Master-" +
              format(new Date(), "yyyyMMddHH") +
              "-" +
              DownloadGidData?.length ?? 0
          }
        />
      ) : null}
    </Fragment>
  );
};

export const BranchMasterGridWrapper = () => {
  return (
    <ClearCacheProvider>
      <BranchMaster />
    </ClearCacheProvider>
  );
};

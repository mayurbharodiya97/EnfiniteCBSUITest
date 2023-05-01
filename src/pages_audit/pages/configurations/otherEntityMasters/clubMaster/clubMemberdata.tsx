import { ClearCacheProvider, ClearCacheContext, queryClient } from "cache";
import Dialog from "@mui/material/Dialog";
import { useLocation, useNavigate } from "react-router-dom";
import { Transition } from "pages_audit/common";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ClubMemberListMetaData, ClubMemberMasterMetaData } from "./metaData";
import { GridMetaDataType } from "components/dataTableStatic";
import { useQuery } from "react-query";
import * as API from "../api";
import { Alert } from "components/common/alert";
import { AppBar, CircularProgress } from "@mui/material";
import { ActionTypes } from "components/dataTable";
import FormWrapper from "components/dyanmicForm";
import Button from "@mui/material/Button";
import { extractMetaData, utilFunction } from "components/utils";
import { format, parse } from "date-fns";
import { clone } from "lodash";
import { SubmitFnType } from "packages/form";
import { SampleFileDownload } from "../../bankMaster/fileUpload/sampleFIleDownload";

const actions: ActionTypes[] = [
  {
    actionName: "download",
    actionLabel: "Download Sample",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "add",
    actionLabel: "Add",
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
  {
    actionName: "edit",
    actionLabel: "Edit",
    multiple: false,
    rowDoubleClick: true,
  },
];
const ClubMemberListMaster = ({ isDataChangedRef, handleDialogClose }) => {
  const myGridRef = useRef<any>(null);
  const myMemberDataRef = useRef<any>({});
  const myEntryTypeRef = useRef<any>("edit");
  const myrefreshNeedRef = useRef(false);
  const [isClubEntry, SetClubEntry] = useState(false);
  const { state: rows }: any = useLocation();
  const { getEntries } = useContext(ClearCacheContext);
  const [isSampleFileDownload, setSampleFileDownload] = useState(false);
  const navigate = useNavigate();
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getClubMemberDetailsList", rows?.[0]?.data?.TRAN_CD], () =>
    API.GetClubMemberDetailsList(rows?.[0]?.data?.TRAN_CD)
  );
  const setCurrentAction = useCallback(
    (data) => {
      if (data?.name === "close") {
        handleDialogClose();
      } else if (data?.name === "edit") {
        myMemberDataRef.current = data?.rows?.[0]?.data ?? {};
        myEntryTypeRef.current = "edit";
        SetClubEntry(true);
      } else if (data?.name === "add") {
        myMemberDataRef.current = {
          TRAN_DT: format(new Date(), "dd/MM/yyyy"),
          CLUB_TRAN_CD: rows?.[0]?.data?.TRAN_CD,
        };
        myEntryTypeRef.current = "new";
        SetClubEntry(true);
      } else if (data?.name === "download") {
        setSampleFileDownload(true);
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );
  useEffect(() => {
    return () => {
      let entries = getEntries() as any[];
      if (Array.isArray(entries) && entries.length > 0) {
        entries.forEach((one) => {
          queryClient.removeQueries(one);
        });
      }
      queryClient.removeQueries([
        "getClubMemberDetailsList",
        rows?.[0]?.data?.TRAN_CD,
      ]);
    };
  }, [getEntries]);
  const DownloadGidData = useMemo(() => {
    if (Array.isArray(data)) {
      return data.map((one, index) => ({
        MEMBER_ID: String(one?.MEMBER_ID ?? ""),
        MEMBER_NAME: one?.MEMBER_NAME,
        MEMBER_TYPE: one?.MEMBER_TYPE,
        MEMBER_SINCE: String(one?.MEMBER_SINCE ?? ""),
        MEMBER_STATUS: String(one?.MEMBER_STATUS ?? ""),
      }));
    } else {
      return data;
    }
  }, [data]);
  return (
    <>
      <Dialog
        open={true}
        //@ts-ignore
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            width: "100%",
          },
        }}
        maxWidth="md"
      >
        <div style={{ padding: "10px" }}>
          {isError === true ? (
            <div style={{ paddingBottom: "5px" }}>
              <AppBar position="relative">
                <Alert
                  severity={error?.severity ?? "error"}
                  errorMsg={error?.error_msg ?? "Error"}
                  errorDetail={error?.error_detail ?? ""}
                />
              </AppBar>
            </div>
          ) : null}
          <GridWrapper
            key={"clubMemberDetailsList"}
            finalMetaData={ClubMemberListMetaData as GridMetaDataType}
            data={data || []}
            setData={() => {}}
            loading={isLoading || isFetching}
            actions={actions}
            setAction={setCurrentAction}
            refetchData={refetch}
            ref={myGridRef}
          />
          {isClubEntry ? (
            <ClubMemberMasterData
              onClose={() => {
                if (myrefreshNeedRef.current === true) {
                  refetch();
                  myrefreshNeedRef.current = false;
                }
                SetClubEntry(false);
              }}
              initialValues={myMemberDataRef.current}
              mode={myEntryTypeRef.current}
              myrefreshNeedRef={myrefreshNeedRef}
            />
          ) : null}
          {isSampleFileDownload ? (
            <SampleFileDownload
              isOpen={isSampleFileDownload}
              closeDialog={() => {
                setSampleFileDownload(false);
              }}
              fileData={DownloadGidData}
              filename={
                "Club-Member-" +
                  rows?.[0]?.data?.TRAN_CD +
                  "-" +
                  format(new Date(), "yyyyMMddHH") +
                  "-" +
                  DownloadGidData?.length ?? 0
              }
            />
          ) : null}
        </div>
      </Dialog>
    </>
  );
};
const ClubMemberMasterData = ({
  onClose,
  initialValues,
  mode,
  myrefreshNeedRef,
}) => {
  const metaData = useMemo(() => {
    return extractMetaData(ClubMemberMasterMetaData, mode);
  }, [mode]);
  const intit = useMemo(() => {
    let localinit = clone(initialValues);
    if (mode === "edit") {
      let initSince = localinit["MEMBER_SINCE"];
      try {
        initSince = parse(initSince, "dd/MM/yyyy", new Date());
        initSince = format(initSince, "dd/MMM/yyyy");
      } catch (error) {
        console.log(error);
      }
      localinit.MEMBER_SINCE = initSince;
    }
    return localinit;
  }, [initialValues, mode]);
  const onSubmitHandler: SubmitFnType = (
    data,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    //@ts-ignore
    endSubmit(true);
    if (Boolean(data["MEMBER_SINCE"])) {
      data["MEMBER_SINCE"] = format(
        new Date(data["MEMBER_SINCE"]),
        "dd/MMM/yyyy"
      );
    }
    let reqData = data;
    if (mode === "edit") {
      let updCol = utilFunction.transformDetailsData(data, intit);
      if (updCol._UPDATEDCOLUMNS.length === 0) {
        onClose();
        return;
      } else {
        reqData = { ...reqData, ...updCol, _isNewRow: false };
      }
    } else {
      reqData = { ...reqData, _isNewRow: true };
    }
    console.log(reqData);
  };
  return (
    <Dialog
      open={true}
      //@ts-ignore
      TransitionComponent={Transition}
      PaperProps={{
        style: {
          width: "100%",
        },
      }}
      maxWidth="md"
    >
      <FormWrapper
        key={"clubMemberDetail-Master"}
        metaData={metaData}
        initialValues={intit}
        //@ts-ignore
        displayMode={mode}
        formStyle={{
          background: "white",
          height: "40vh",
          overflowY: "auto",
          overflowX: "hidden",
        }}
        onSubmitHandler={onSubmitHandler}
      >
        {({ isSubmitting, handleSubmit }) => (
          <>
            <Button
              onClick={(event) => {
                handleSubmit(event, "Save");
              }}
              disabled={isSubmitting}
              endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              color={"primary"}
            >
              Save
            </Button>
            <Button onClick={onClose} color={"primary"} disabled={isSubmitting}>
              Close
            </Button>
          </>
        )}
      </FormWrapper>
    </Dialog>
  );
};
export const ClubMemberListMasterWrapper = ({
  isDataChangedRef,
  handleDialogClose,
}) => {
  return (
    <ClearCacheProvider>
      <ClubMemberListMaster
        isDataChangedRef={isDataChangedRef}
        handleDialogClose={handleDialogClose}
      />
    </ClearCacheProvider>
  );
};

import { ClearCacheProvider, ClearCacheContext, queryClient } from "cache";
import { useMutation, useQuery } from "react-query";
import {
  Fragment,
  useEffect,
  useContext,
  useRef,
  useCallback,
  useState,
} from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Alert } from "components/common/alert";
import GridWrapper from "components/dataTableStatic";
import { GridMetaDataType } from "components/dataTable/types";
import { ActionTypes } from "components/dataTable";
import * as API from "./api";
import { EmailSMSTemplateGridMetaData } from "./gridMetadata";
import { useSnackbar } from "notistack";
import { EmailSMSTemplateFormWrapper } from "./emailSMSTemplateForm";

const actions: ActionTypes[] = [
  {
    actionName: "edit-detail",
    actionLabel: "Edit Detail",
    multiple: false,
    rowDoubleClick: true,
  },
];
const initlanguageData: { isOpen: boolean; rowdata: any } = {
  isOpen: false,
  rowdata: [],
};
export const EMailSMSTemplate = () => {
  const isDataChangedRef = useRef(false);
  const myGridRef = useRef<any>(null);
  const { getEntries } = useContext(ClearCacheContext);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const setCurrentAction = useCallback(
    (data) => {
      navigate(data?.name, {
        state: data?.rows,
      });
    },
    [navigate]
  );
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getEmailSMSTemplateGridData"], () => API.getEmailSMSTemplateGridData());
  useEffect(() => {
    return () => {
      let entries = getEntries() as any[];
      entries.forEach((one) => {
        queryClient.removeQueries(one);
      });
      queryClient.removeQueries(["getEmailSMSTemplateGridData"]);
      queryClient.removeQueries(["GetEmailAcctConfigDD"]);
    };
  }, [getEntries]);
  const result = useMutation(API.updateEngLocalMsgGridData, {
    onSuccess: (response: any) => {
      refetch();
      enqueueSnackbar(response, {
        variant: "success",
      });
    },
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
    },
  });

  const ClosedEventCall = useCallback(() => {
    navigate(".");
    if (isDataChangedRef.current === true) {
      myGridRef.current?.refetch?.();
      isDataChangedRef.current = false;
    }
  }, [navigate]);
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
        key={`EmailSMSTemplateGrid`}
        finalMetaData={EmailSMSTemplateGridMetaData as GridMetaDataType}
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
            <EmailSMSTemplateFormWrapper
              handleDialogClose={ClosedEventCall}
              isDataChangedRef={isDataChangedRef}
            />
          }
        />
      </Routes>
    </Fragment>
  );
};

export const EMailSMSTemplateGridWrapper = () => {
  return (
    <ClearCacheProvider>
      <EMailSMSTemplate />
    </ClearCacheProvider>
  );
};

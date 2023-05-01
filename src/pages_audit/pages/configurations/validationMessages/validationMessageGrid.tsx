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
import { useNavigate } from "react-router-dom";
import { Alert } from "components/common/alert";
import GridWrapper from "components/dataTableStatic";
import { GridMetaDataType } from "components/dataTable/types";
import { ActionTypes } from "components/dataTable";
import * as API from "./api";
import { ValidationMessagesGridMetaData } from "./gridMetadata";
import { EngLocalMsgAPIWrapper } from "./engLocalMsg/engLocalMsg";
import { useSnackbar } from "notistack";
//import { ReleaseUsersAPIWrapper } from "../releaseUsers";
const actions: ActionTypes[] = [
  {
    actionName: "view-details",
    actionLabel: "Edit Detail",
    multiple: false,
    rowDoubleClick: true,
  },
];
const initlanguageData: { isOpen: boolean; rowdata: any } = {
  isOpen: false,
  rowdata: [],
};
export const ValidationMessages = () => {
  //const isDataChangedRef = useRef(false);
  const myGridRef = useRef<any>(null);
  const { getEntries } = useContext(ClearCacheContext);
  const navigate = useNavigate();
  const [languageData, setLanguageData] = useState(initlanguageData);
  const { enqueueSnackbar } = useSnackbar();
  const setCurrentAction = useCallback(
    (data) => {
      setLanguageData({ isOpen: true, rowdata: data?.rows });
    },
    [navigate]
  );
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getValidationMessageData"], () => API.getValidationMessagesGridData());
  useEffect(() => {
    return () => {
      let entries = getEntries() as any[];
      entries.forEach((one) => {
        queryClient.removeQueries(one);
      });
      queryClient.removeQueries(["getValidationMessageData"]);
    };
  }, [getEntries]);
  const result = useMutation(API.updateEngLocalMsgGridData, {
    onSuccess: (response: any) => {
      refetch();
      enqueueSnackbar(response, {
        variant: "success",
      });
      onActionCancel();
    },
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
      onActionCancel();
    },
  });

  const onSubmitData = (engMsg, localMsg, rows) => {
    result.mutate({
      msgID: rows[0]?.data?.MSG_ID ?? "",
      msgTextEn: engMsg,
      msgTextBn: localMsg,
    });
  };
  const onActionCancel = () => {
    setLanguageData({ isOpen: false, rowdata: [] });
  };

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
        key={`validationMessageGrid`}
        finalMetaData={ValidationMessagesGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={isLoading || isFetching}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
        ref={myGridRef}
      />
      {languageData.isOpen ? (
        <EngLocalMsgAPIWrapper
          TitleText={"Messages"}
          onActionNo={onActionCancel}
          onActionYes={onSubmitData}
          isLoading={result.isLoading}
          AcceptbuttonLabelText="Save"
          CanceltbuttonLabelText="Cancel"
          EngValue={languageData.rowdata[0]?.data?.MSG_TEXT}
          LocalValue={languageData.rowdata[0]?.data?.MSG_TEXT_BN}
          isOpen={languageData.isOpen}
          rows={languageData.rowdata}
        />
      ) : null}
    </Fragment>
  );
};

export const ValidationMessagesGridWrapper = () => {
  return (
    <ClearCacheProvider>
      <ValidationMessages />
    </ClearCacheProvider>
  );
};

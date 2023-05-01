import {
  FC,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { queryClient } from "cache";
import { useSnackbar } from "notistack";
import { cloneDeep } from "lodash-es";
import { useMutation, useQueries } from "react-query";
import { useLocation } from "react-router-dom";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { Alert } from "components/common/alert";
import { SubmitFnType } from "packages/form";
import * as API from "../api";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";
import { MasterDetailsForm } from "components/formcomponent";
import { format } from "date-fns";
import { AuthContext } from "pages_audit/auth";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { cardCategoryMasterDetailsMetaData } from "./cardCategoryMasterMetaData";
import { GeneralAPI } from "registry/fns/functions";
import { Button, CircularProgress, Dialog, IconButton } from "@mui/material";
interface updateMasterDataType {
  data: object;
  displayData?: object;
  endSubmit?: any;
  setFieldError?: any;
}

const updateMasterDataWrapperFn =
  (updateMasterData) =>
  async ({ data }: updateMasterDataType) => {
    return updateMasterData(data);
  };

const ViewEditCardCategoryMaster: FC<{
  isDataChangedRef: any;
  closeDialog?: any;
  defaultView?: "view" | "edit";
  readOnly?: boolean;
  transactionID: number;
  data: any;
}> = ({
  isDataChangedRef,
  closeDialog,
  defaultView = "view",
  readOnly = false,
  transactionID,
  data: reqData,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [formMode, setFormMode] = useState(defaultView);
  const [openAccept, setOpenAccept] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const moveToViewMode = useCallback(() => setFormMode("view"), [setFormMode]);
  const moveToEditMode = useCallback(() => setFormMode("edit"), [setFormMode]);
  const { authState } = useContext(AuthContext);
  const myRef = useRef<any>(null);
  const mutation = useMutation(
    updateMasterDataWrapperFn(API.updateMastersData()),
    {
      onError: (error: any, { endSubmit }) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        endSubmit(false, errorMsg, error?.error_detail ?? "");
      },
      onSuccess: (data, { endSubmit }) => {
        // queryClient.refetchQueries(["getFormData", transactionID]);
        endSubmit(true, "");
        enqueueSnackbar(data, {
          variant: "success",
        });
        isDataChangedRef.current = true;
        moveToViewMode();
        if (typeof closeDialog === "function") {
          closeDialog();
        }
      },
    }
  );
  const mutationConfirm = useMutation(
    updateMasterDataWrapperFn(API.updateMastersData()),
    {
      onError: (error: any) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
      },
      onSuccess: (data) => {
        enqueueSnackbar(data, {
          variant: "success",
        });
        isDataChangedRef.current = true;
        if (typeof closeDialog === "function") {
          closeDialog();
        }
      },
      onSettled: () => {
        onActionCancel();
      },
    }
  );
  const onSubmitHandler = ({ data, displayData, endSubmit, setFieldError }) => {
    //@ts-ignore
    if (Boolean(data["EFFECTIVE_DT"])) {
      data["EFFECTIVE_DT"] = format(
        new Date(data["EFFECTIVE_DT"]),
        "dd/MMM/yyyy"
      );
    }
    data["COMP_CD"] = authState.companyID;
    data["BRANCH_CD"] = authState.user.branchCode;
    if (Boolean(data?._OLDROWVALUE?.EFFECTIVE_DT)) {
      data._OLDROWVALUE.EFFECTIVE_DT = format(
        new Date(data._OLDROWVALUE.EFFECTIVE_DT),
        "dd/MMM/yyyy"
      );
    }
    if (
      Array.isArray(data?._UPDATEDCOLUMNS) &&
      data._UPDATEDCOLUMNS.length === 0 &&
      Array.isArray(data?.DETAILS_DATA?.isDeleteRow) &&
      data?.DETAILS_DATA?.isDeleteRow?.length === 0 &&
      Array.isArray(data?.DETAILS_DATA?.isNewRow) &&
      data?.DETAILS_DATA?.isNewRow?.length === 0 &&
      Array.isArray(data?.DETAILS_DATA?.isUpdatedRow) &&
      data?.DETAILS_DATA?.isUpdatedRow?.length === 0
    ) {
      endSubmit(true);
      moveToViewMode();
    } else {
      mutation.mutate({ data, endSubmit, displayData, setFieldError });
      //endSubmit(true);
    }
    // console.log(data);

    //mutation.mutate({ data, displayData, endSubmit, setFieldError });
  };

  const result = useQueries([
    {
      queryKey: ["getDetailsGridData", transactionID],
      queryFn: () => API.getDetailsGridData(transactionID),
    },
    {
      queryKey: ["GetMiscValue"],
      queryFn: () => API.GetMiscValue(),
    },
  ]);
  //const getMiscData = useQueries(API.GetMiscValue, ["GetMiscValue"]);
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getDetailsGridData", transactionID]);
      queryClient.removeQueries(["GetMiscValue"]);
    };
  }, [transactionID]);

  const dataUniqueKey = `${result[0].dataUpdatedAt}`;
  const loading = result[0].isLoading || result[0].isFetching;
  let isError = result[0].isError;
  //@ts-ignore
  let errorMsg = `${result[0].error?.error_msg}`;
  errorMsg = Boolean(errorMsg.trim()) ? errorMsg : "Unknown error occured";

  //@ts-ignore
  let error_detail = `${result[0]?.error?.error_detail}`;

  let metadata: MasterDetailsMetaData = {} as MasterDetailsMetaData;
  metadata = cloneDeep(
    cardCategoryMasterDetailsMetaData
  ) as MasterDetailsMetaData;
  const metaData = useMemo(() => {
    let myColumns = metadata.detailsGrid.columns;
    if (formMode === "view") {
      myColumns = metadata.detailsGrid.columns.filter(
        (one) => one.accessor !== "_hidden"
      );
    }
    return {
      ...metadata,
      detailsGrid: { ...metadata.detailsGrid, columns: myColumns },
    };
  }, [formMode, metadata]);

  const AddNewRow = () => {
    myRef.current?.addNewRow(true);
  };
  const onPopupYesAccept = (rows) => {
    onActionCancel();
    // result.mutate({
    //   UserName: rows[0]?.data?.CUSTOMER_ID ?? "",
    //   Confirmed: "Y",
    // });
  };
  const onPopupYesReject = (rows) => {
    onActionCancel();
    // result.mutate({
    //   UserName: rows[0]?.data?.CUSTOMER_ID ?? "",
    //   Confirmed: "R",
    // });
  };
  const onActionCancel = () => {
    setOpenAccept(false);
    setOpenReject(false);
  };
  const renderResult = loading ? (
    <div style={{ margin: "2rem" }}>
      <LoaderPaperComponent />
      {typeof closeDialog === "function" ? (
        <div style={{ position: "absolute", right: 0, top: 0 }}>
          <IconButton onClick={closeDialog}>
            <HighlightOffOutlinedIcon />
          </IconButton>
        </div>
      ) : null}
    </div>
  ) : isError === true ? (
    <>
      <div style={{ margin: "1.2rem" }}>
        <Alert
          severity="error"
          errorMsg={errorMsg}
          errorDetail={error_detail ?? ""}
        />
      </div>
      {typeof closeDialog === "function" ? (
        <div style={{ position: "absolute", right: 0, top: 0 }}>
          <IconButton onClick={closeDialog}>
            <HighlightOffOutlinedIcon />
          </IconButton>
        </div>
      ) : null}
    </>
  ) : formMode === "view" ? (
    <MasterDetailsForm
      key={"cardCategoryMaster" + formMode}
      metaData={metaData}
      ref={myRef}
      initialData={{
        _isNewRow: false,
        ...reqData[0].data,
        DETAILS_DATA: result[0].data,
      }}
      displayMode={formMode}
      isLoading={true}
      onSubmitData={onSubmitHandler}
      isNewRow={false}
      formStyle={{
        background: "white",
        height: "15vh",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {({ isSubmitting, handleSubmit }) => {
        //console.log(formMode, isSubmitting);
        return (
          <>
            <Button
              onClick={moveToEditMode}
              //disabled={isSubmitting}
              //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              color={"primary"}
            >
              Edit
            </Button>
            <Button
              onClick={closeDialog}
              //disabled={isSubmitting}
              color={"primary"}
            >
              Close
            </Button>
          </>
        );
      }}
    </MasterDetailsForm>
  ) : formMode === "edit" ? (
    <MasterDetailsForm
      key={"cardCategoryMaster" + formMode}
      metaData={metaData}
      ref={myRef}
      initialData={{
        _isNewRow: false,
        ...reqData[0].data,
        DETAILS_DATA: result[0].data,
      }}
      displayMode={formMode}
      isLoading={false}
      onSubmitData={onSubmitHandler}
      isNewRow={false}
      formStyle={{
        background: "white",
        height: "15vh",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {({ isSubmitting, handleSubmit }) => {
        return (
          <>
            <Button
              onClick={AddNewRow}
              disabled={isSubmitting}
              //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              color={"primary"}
            >
              Add Row
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              color={"primary"}
            >
              Save
            </Button>
            <Button
              onClick={moveToViewMode}
              disabled={isSubmitting}
              color={"primary"}
            >
              Cancel
            </Button>
          </>
        );
      }}
    </MasterDetailsForm>
  ) : formMode === "confirm" ? (
    <>
      <MasterDetailsForm
        key={"cardCategoryMaster" + formMode}
        metaData={metaData}
        ref={myRef}
        initialData={{
          _isNewRow: false,
          ...reqData[0].data,
          DETAILS_DATA: result[0].data,
        }}
        displayMode={"view"}
        isLoading={true}
        onSubmitData={onSubmitHandler}
        isNewRow={false}
        formStyle={{
          background: "white",
          height: "15vh",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {({ isSubmitting, handleSubmit }) => {
          //console.log(formMode, isSubmitting);
          return (
            <>
              <Button
                //disabled={isSubmitting}
                //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                color={"primary"}
                onClick={(event) => {
                  if (reqData[0].data?.LAST_ENTERED_BY === authState.user.id) {
                    enqueueSnackbar("You can not confirm your own Entry.", {
                      variant: "warning",
                    });
                  } else {
                    setOpenAccept(true);
                  }
                }}
              >
                Accept
              </Button>
              <Button
                //disabled={isSubmitting}
                //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                color={"primary"}
                onClick={(event) => {
                  if (reqData[0].data?.LAST_ENTERED_BY === authState.user.id) {
                    enqueueSnackbar("You can not reject your own Entry.", {
                      variant: "warning",
                    });
                  } else {
                    setOpenReject(true);
                  }
                }}
              >
                Reject
              </Button>
              <Button
                onClick={closeDialog}
                //disabled={isSubmitting}
                color={"primary"}
              >
                Close
              </Button>
            </>
          );
        }}
      </MasterDetailsForm>
      {openAccept ? (
        <PopupMessageAPIWrapper
          MessageTitle="Confirmation"
          Message="Do You want to accept this Request?"
          onActionYes={onPopupYesAccept}
          onActionNo={() => onActionCancel()}
          rows={reqData[0].data}
          open={openAccept}
          loading={mutationConfirm.isLoading}
        />
      ) : null}
      {openReject ? (
        <PopupMessageAPIWrapper
          MessageTitle="Confirmation"
          Message="Do You want to reject this Request?"
          onActionYes={onPopupYesReject}
          onActionNo={() => onActionCancel()}
          rows={reqData[0].data}
          open={openReject}
          loading={mutationConfirm.isLoading}
        />
      ) : null}
    </>
  ) : null;
  return renderResult;
};

export const ViewEditCardCategoryMasterWrapper = ({
  isDataChangedRef,
  closeDialog,
  defaultView,
}) => {
  const { state: data }: any = useLocation();
  return (
    <Fragment>
      <Dialog
        open={true}
        onClose={closeDialog}
        PaperProps={{
          style: {
            width: "65%",
          },
        }}
        maxWidth="md"
      >
        <ViewEditCardCategoryMaster
          transactionID={data?.[0]?.data?.TRAN_CD}
          isDataChangedRef={isDataChangedRef}
          closeDialog={closeDialog}
          data={data}
          defaultView={defaultView}
        />
      </Dialog>
    </Fragment>
  );
};

import { useRef, useEffect, useContext, useState, useMemo } from "react";
import { makeStyles, styled } from "@mui/styles";
import { ClearCacheContext, queryClient } from "cache";
import { useMutation, useQuery } from "react-query";
import * as API from "../../api";
import {
  AppBar,
  Button,
  Dialog,
  Theme,
  Toolbar,
  Typography,
} from "@mui/material";
import { useDialogStyles } from "components/detailPopupGridData";
import { GradientButton } from "components/styledComponent/button";
import { FormWrapper } from "components/dyanmicForm/formWrapper";
import { MessageDescriptionMetadata } from "./metadata";
import {
  ImageViewer,
  NoPreview,
  PDFViewer,
} from "components/fileUpload/preView";
import { lowerCase } from "lodash";
import { utilFunction } from "components/utils";
import { AuthContext } from "pages_audit/auth";
import { InitialValuesType, SubmitFnType } from "packages/form";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { useSnackbar } from "notistack";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
const useHeaderStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    background: "var(--theme-color5)",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--white)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
}));

export const ListPopupMessageWrapper = ({
  open,
  closeDialog,
  dialogLabel,
  transactionID,
  formView,
}) => {
  const myGridRef = useRef<any>(null);
  const { getEntries } = useContext(ClearCacheContext);
  const classes = useDialogStyles();
  const headerClasses = useHeaderStyles();
  const { authState } = useContext(AuthContext);
  const lastFileData = useRef<any>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [isOpenSave, setIsOpenSave] = useState(false);
  const isErrorFuncRef = useRef<any>(null);
  const {
    data: mainData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery<any, any>(["getMessageBoxListData"], () =>
    API.getAnnouncementListData({
      userID: authState?.user?.id ?? "",
      transactionID,
    })
  );
  const mutation = useMutation(API.updateAnnouncementDetailsData, {
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      //endSubmit(false, errorMsg, error?.error_detail ?? "");
      if (isErrorFuncRef.current == null) {
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
      } else {
        isErrorFuncRef.current?.endSubmit(
          false,
          errorMsg,
          error?.error_detail ?? ""
        );
      }
      onActionCancel();
    },
    onSuccess: (data) => {
      enqueueSnackbar(data, {
        variant: "success",
      });
      // isDataChangedRef.current = true;
      closeDialog();
    },
  });

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getMessageBoxListData"]);
    };
  }, []);
  const onPopupYes = (rows) => {
    mutation.mutate(rows);
  };
  const onActionCancel = () => {
    setIsOpenSave(false);
  };

  const onSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    // @ts-ignore
    endSubmit(true);

    let newData = {
      IS_VIEW_NEXT: Boolean(data?.IS_VIEW_NEXT) ? "Y" : "N" ?? "",
    };

    let oldData = {
      IS_VIEW_NEXT: mainData?.[0]?.IS_VIEW_NEXT ?? "",
    };
    console.log("newData", newData);
    console.log("oldData", oldData);
    let upd: any = utilFunction.transformDetailsData(newData, oldData ?? {});

    if (upd?._UPDATEDCOLUMNS?.length > 0) {
      isErrorFuncRef.current = {
        data: {
          ...newData,
          ...upd,
          CIRCULAR_TRAN_CD: mainData?.[0]?.TRAN_CD ?? "",
          USER_NM: authState?.user?.id ?? "",
        },
        displayData,
        endSubmit,
        setFieldError,
      };
      setIsOpenSave(true);
    }
  };

  const fileData = useMemo(() => {
    if (mainData?.[0]?.DOC_BLOB) {
      lastFileData.current = {
        DOC_BLOB: utilFunction.blobToFile(
          utilFunction.base64toBlob(
            mainData?.[0]?.DOC_BLOB,
            mainData?.[0]?.FILE_TYPE === "pdf"
              ? "application/pdf"
              : "image/" + mainData?.[0]?.FILE_TYPE
          ),
          mainData?.[0].FILE_NM
        ),
        FILE_TYPE: mainData?.[0].FILE_TYPE,
        FILE_NM: mainData?.[0].FILE_NM,
      };
    }
    return lastFileData.current;
  }, [mainData?.[0]?.DOC_BLOB]);

  return (
    <>
      {isLoading || isFetching ? (
        <LoaderPaperComponent />
      ) : (
        <Dialog
          fullWidth
          maxWidth="lg"
          open={true}
          PaperProps={{
            style: {
              width: "100%",
              height: "100%",
            },
          }}
          key="filepreviewDialog"
        >
          {/* <AppBar
            position="relative"
            color="secondary"
            style={{
              // marginBottom: "5px",
              padding: "8px",
              background: "none",
              boxShadow: "none",
            }}
          >
            <Toolbar className={headerClasses.root} variant={"dense"}>
              <Typography
                className={headerClasses.title}
                color="inherit"
                variant={"h6"}
                component="div"
              >
                {dialogLabel}
                {dialogLabel.charAt(0).toUpperCase() +
                  dialogLabel.slice(1).toLowerCase()}
              </Typography>
              <GradientButton
                onClick={(e) => {
                  setIsOpenSave(true);
                }}
                style={{
                  backgroundColor: "var(--theme-color5)",
                  height: "32px",
                  width: "20px",
                  borderRadius: "05px",
                  color: "var(--theme-color2)",
                }}
              >
                Save
              </GradientButton>
              <GradientButton
                onClick={closeDialog}
                style={{
                  backgroundColor: "var(--theme-color5)",
                  height: "32px",
                  // width: "20px",
                  minWidth: "0px",
                  borderRadius: "05px",
                  color: "var(--theme-color2)",
                }}
              >
                Close
              </GradientButton>
            </Toolbar>
          </AppBar> */}

          <FormWrapper
            key={`MessageDescriptionMetadata`}
            metaData={MessageDescriptionMetadata}
            onSubmitHandler={onSubmitHandler}
            initialValues={mainData?.[0] as InitialValuesType}
            // hideHeader={true}
            formStyle={{
              background: "white",
            }}
          >
            {({ isSubmitting, handleSubmit }) => (
              <>
                <Button
                  onClick={(event) => {
                    handleSubmit(event, "Save");
                  }}
                  disabled={isSubmitting}
                  //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                  color={"primary"}
                >
                  Save
                </Button>
                <Button
                  onClick={closeDialog}
                  color={"primary"}
                  disabled={isSubmitting}
                >
                  Close
                </Button>
              </>
            )}
          </FormWrapper>

          {isOpenSave ? (
            <PopupMessageAPIWrapper
              MessageTitle="Confirmation"
              Message="Do you want to save this Request?"
              onActionYes={(rowVal) => onPopupYes(rowVal)}
              onActionNo={() => onActionCancel()}
              rows={isErrorFuncRef.current?.data}
              open={isOpenSave}
              loading={mutation.isLoading}
            />
          ) : null}
          {lastFileData.current?.FILE_TYPE?.includes("pdf") ? (
            <PDFViewer
              blob={lastFileData.current?.DOC_BLOB ?? null}
              fileName={lastFileData.current?.FILE_NM ?? ""}
            />
          ) : lastFileData.current?.FILE_TYPE?.includes("png") ||
            lastFileData.current?.FILE_TYPE?.includes("jpg") ||
            lastFileData.current?.FILE_TYPE?.includes("jpeg") ? (
            <>
              <ImageViewer
                blob={lastFileData.current?.DOC_BLOB ?? null}
                fileName={lastFileData.current?.FILE_NM ?? ""}
              />
            </>
          ) : (
            <NoPreview fileName={lastFileData.current?.FILE_NM ?? ""} />
          )}
        </Dialog>
      )}
    </>
  );
};

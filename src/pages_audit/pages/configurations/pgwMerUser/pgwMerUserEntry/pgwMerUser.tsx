import { FC, useEffect, useState, useRef, useContext } from "react";
import { useMutation } from "react-query";
import { InitialValuesType, SubmitFnType } from "packages/form";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useSnackbar } from "notistack";
import { useLocation } from "react-router-dom";
import { useDialogStyles } from "pages_audit/common/dialogStyles";
import { Transition } from "pages_audit/common/transition";
import * as API from "../api";
import { PgwMerUserEntryMetaData } from "./metaData";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import {
  Grid,
  makeStyles,
  Tooltip,
  Typography,
  Button,
  Dialog,
} from "@material-ui/core";
import { utilFunction } from "components/utils";
import { useStyles } from "../../../profile/profilePhotoUpload/style";
import { transformFileObject } from "components/fileUpload/utils";
import { AuthContext } from "pages_audit/auth";

const useTypeStyles = makeStyles((theme) => ({
  title: {
    flex: "1 1 100%",
    color: "var(--theme-color1)",
    textAlign: "center",
  },
  refreshiconhover: {},
}));

interface updateMasterDataType {
  data: object;
  displayData?: object;
  endSubmit?: any;
  setFieldError?: any;
}

const updateMasterDataWrapperFn =
  (updateMasterData) =>
  async ({ data }: updateMasterDataType) => {
    return updateMasterData({ data });
  };

const PgwMerUserEntry: FC<{
  isDataChangedRef: any;
  closeDialog?: any;
  defaultmode: string;
}> = ({ isDataChangedRef, closeDialog, defaultmode }) => {
  const { authState } = useContext(AuthContext);

  const headerClasses = useTypeStyles();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [formMode, setFormMode] = useState(defaultmode);
  const isErrorFuncRef = useRef<any>(null);
  const [isOpenSave, setIsOpenSave] = useState(false);
  const { state: rows }: any = useLocation();

  const mutation = useMutation(
    updateMasterDataWrapperFn(API.updatePgwMerUserEntry),
    {
      onError: (error: any, { endSubmit }) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        endSubmit(false, errorMsg, error?.error_detail ?? "");
      },
      onSuccess: (data, { endSubmit }) => {
        endSubmit(true, "");
        enqueueSnackbar(data, {
          variant: "success",
        });
        isDataChangedRef.current = true;
        if (typeof closeDialog === "function") {
          closeDialog();
        }
      },
    }
  );

  const onSubmitHandler: SubmitFnType = (
    data,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    //@ts-ignore
    endSubmit(true);

    data = {
      ...data,
    };
    let newReqData = data;
    newReqData["CONFIRMED"] = Boolean(newReqData["CONFIRMED"]) ? "Y" : "N";

    let upd = utilFunction.transformDetailsData(data, rows?.[0]?.data ?? {});
    if (upd._UPDATEDCOLUMNS.length > 0) {
      isErrorFuncRef.current = {
        data: {
          ...newReqData,
          ...upd,
          DETAILS_DATA: { isDeleteRow: [], isNewRow: [], isUpdatedRow: [] },
          _isNewRow: formMode === "add" ? true : false,
          isDeleteRow: false,
        },
        displayData,
        endSubmit,
        setFieldError,
      };
      setIsOpenSave(true);
    } else {
      setFormMode("view");
    }
  };

  const onPopupYes = (rows) => {
    mutation.mutate(isErrorFuncRef.current);
  };

  const onActionCancel = () => {
    setIsOpenSave(false);
  };

  return (
    <>
      <Grid container>
        <Grid item xs={12} sm={12} md={12}>
          <FormWrapper
            key={"PgwMerUser" + formMode}
            metaData={PgwMerUserEntryMetaData as MetaDataType}
            initialValues={rows?.[0]?.data as InitialValuesType}
            onSubmitHandler={onSubmitHandler}
            //@ts-ignore
            displayMode={formMode}
            formStyle={{
              background: "white",
              // height: "55vh",
              // overflowY: "auto",
              // overflowX: "hidden",
            }}
          >
            {({ isSubmitting, handleSubmit }) => (
              <>
                {formMode === "edit" ? (
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
                      onClick={() => {
                        setFormMode("view");
                      }}
                      color={"primary"}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </>
                ) : formMode === "add" ? (
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
                      //disabled={isSubmitting}
                      color={"primary"}
                    >
                      Close
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => {
                        setFormMode("edit");
                      }}
                      //disabled={isSubmitting}
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
                )}
              </>
            )}
          </FormWrapper>
        </Grid>
      </Grid>
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
    </>
  );
};

export const PgwMerUserEntryWrapper = ({
  handleDialogClose,
  isDataChangedRef,
  defaultmode,
}) => {
  const classes = useDialogStyles();

  return (
    <>
      <Dialog
        open={true}
        //@ts-ignore
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            width: "65%",
            // minHeight: "48vh",
            // height: "62vh",
          },
        }}
        maxWidth="md"
        classes={{
          scrollPaper: classes.topScrollPaper,
          paperScrollBody: classes.topPaperScrollBody,
        }}
      >
        <PgwMerUserEntry
          isDataChangedRef={isDataChangedRef}
          closeDialog={handleDialogClose}
          defaultmode={defaultmode}
        />
      </Dialog>
    </>
  );
};

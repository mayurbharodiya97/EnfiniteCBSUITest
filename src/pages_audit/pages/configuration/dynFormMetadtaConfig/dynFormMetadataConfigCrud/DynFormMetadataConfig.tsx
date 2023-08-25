import { useMutation, useQuery } from "react-query";
import { useSnackbar } from "notistack";
import { cloneDeep } from "lodash-es";
// import * as API from "./api";
import {
  DynamicFormConfigGridMetaData,
  DynamicFormConfigMetaData,
} from "./metaData";
import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AppBar,
  Grid,
  Toolbar,
  Typography,
  Theme,
  Dialog,
} from "@mui/material";
import { GradientButton } from "components/styledComponent/button";
import { MasterDetailsForm } from "components/formcomponent";
import { makeStyles } from "@mui/styles";
import { useStyles } from "pages_audit/appBar/style";
import { useLocation } from "react-router-dom";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { AuthContext } from "pages_audit/auth";
import * as API from "../api";
import { queryClient } from "cache";
import { InitialValuesType, SubmitFnType } from "packages/form";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { Alert } from "components/common/alert";
import { FieldComponentGrid } from "./fieldComponentGrid";
const useTypeStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    background: "var(--theme-color1)",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--white)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
  refreshiconhover: {},
}));
interface InsertFormDataFnType {
  data: object;
  displayData?: object;
  endSubmit?: any;
  setFieldError?: any;
}
const insertFormDataFnWrapper =
  (insertFormData) =>
  async ({ data }: InsertFormDataFnType) => {
    return insertFormData(data);
  };
const DynamicFormMetadataConfig: FC<{
  isDataChangedRef: any;
  closeDialog?: any;
  defaultView?: "view" | "edit" | "add";
  fieldRowData: any;
}> = ({
  isDataChangedRef,
  closeDialog,
  defaultView = "view",
  fieldRowData,
}) => {
  const headerClasses = useTypeStyles();
  const { enqueueSnackbar } = useSnackbar();
  const myRef = useRef<any>(null);
  const [formName, setformName] = useState("");
  const [formMode, setFormMode] = useState(defaultView);
  const { authState } = useContext(AuthContext);
  const [isOpenSave, setIsOpenSave] = useState(false);
  const isErrorFuncRef = useRef<any>(null);
  const formRef = useRef<any>(null);
  const mysubdtlRef = useRef<any>({});
  const myGridRef = useRef<any>(null);
  const [isFieldComponentGrid, setFieldComponentGrid] = useState(false);

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getDynFieldListData"], () =>
    API.getDynFieldListData({
      COMP_CD: authState?.companyID ?? "",
      BRANCH_CD: authState?.user?.branchCode ?? "",
      docCD: fieldRowData?.[0]?.data?.DOC_CD ?? "",
      srcd: fieldRowData?.[0]?.data?.SR_CD ?? "",
    })
  );

  // const mutation = useMutation(
  //   updateAUTHDetailDataWrapperFn(API.getDynFormPopulateData),
  //   {
  //     onError: (error: any) => {},
  //     onSuccess: (data) => {},
  //   }
  // );
  const mutation: any = useMutation(API.getDynFormPopulateData, {
    onSuccess: (data) => {},
    onError: (error: any) => {},
  });

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getDynFieldListData"]);
    };
  }, []);

  const onPopupYes = (rows) => {
    // mutation.mutate({
    //   data: rows,
    //   formMode: "",
    // });
  };
  const onActionCancel = () => {
    setIsOpenSave(false);
  };
  const onSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError
  ) => {
    data["COMP_CD"] = authState.companyID.trim();
    data["BRANCH_CD"] = authState.user.branchCode.trim();

    endSubmit(true);
    mutation.mutate(data);
  };

  return (
    <>
      {isLoading || isFetching ? (
        <LoaderPaperComponent />
      ) : isError ? (
        <Alert
          severity="error"
          errorMsg={error?.error_msg ?? "Error"}
          errorDetail={""}
          color="error"
        />
      ) : (
        <>
          <FormWrapper
            key={`dynFormMetadataConfig`}
            metaData={DynamicFormConfigMetaData as unknown as MetaDataType}
            initialValues={data as InitialValuesType}
            onSubmitHandler={onSubmitHandler}
            formStyle={{
              background: "white",
            }}
            onFormButtonClickHandel={() => {
              let event: any = { preventDefault: () => {} };
              formRef?.current?.handleSubmit(event, "PID_DESCRIPTION");
            }}
            // onFormButtonCicular={mutation.isLoading}
            ref={formRef}
          >
            {({ isSubmitting, handleSubmit }) => (
              <>
                {formMode === "edit" ? (
                  <>
                    <GradientButton
                      // onClick={(event) => {
                      //   handleSubmit(event, "Save");
                      // }}
                      disabled={isSubmitting}
                      //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                      color={"primary"}
                    >
                      Save
                    </GradientButton>
                    <GradientButton
                      onClick={() => {
                        setFormMode("view");
                      }}
                      color={"primary"}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </GradientButton>
                  </>
                ) : formMode === "add" ? (
                  <>
                    <GradientButton
                      // onClick={(event) => {
                      //   handleSubmit(event, "Save");
                      // }}
                      disabled={isSubmitting}
                      //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                      color={"primary"}
                    >
                      Save
                    </GradientButton>

                    <GradientButton
                      onClick={closeDialog}
                      //disabled={isSubmitting}
                      color={"primary"}
                    >
                      Close
                    </GradientButton>
                  </>
                ) : (
                  <>
                    <GradientButton
                      onClick={() => {
                        setFormMode("edit");
                      }}
                      //disabled={isSubmitting}
                      color={"primary"}
                    >
                      Edit
                    </GradientButton>
                    <GradientButton
                      onClick={closeDialog}
                      //disabled={isSubmitting}
                      color={"primary"}
                    >
                      Close
                    </GradientButton>
                  </>
                )}
              </>
            )}
          </FormWrapper>
          <GridWrapper
            key={
              `DynamicFormConfigGridMetaData` +
              formMode +
              mutation?.data?.length
            }
            finalMetaData={DynamicFormConfigGridMetaData as GridMetaDataType}
            data={mutation.data ?? []}
            setData={() => null}
            loading={mutation.isLoading}
            actions={[]}
            setAction={[]}
            refetchData={() => refetch()}
            onClickActionEvent={(index, id, data) => {
              console.log("mysubdtlRef.current", data, index, id);
              mysubdtlRef.current = {
                COMP_CD: data?.COMP_CD,
                BRANCH_CD: data?.BRANCH_CD,
                DOC_CD: data?.DOC_CD.trim(),
                LINE_ID: data?.LINE_ID,
                COMPONENT_TYPE: data?.COMPONENT_TYPE,
                SR_CD: data?.SR_CD,
              };

              setFieldComponentGrid(true);
            }}
            ref={myGridRef}
          />
          {/* )} */}

          {isOpenSave ? (
            <PopupMessageAPIWrapper
              MessageTitle="Confirmation"
              Message="Do you want to save this Request?"
              onActionYes={(rowVal) => onPopupYes(rowVal)}
              onActionNo={() => onActionCancel()}
              rows={isErrorFuncRef.current?.data}
              open={isOpenSave}
              // loading={mutation.isLoading}
            />
          ) : null}
          {isFieldComponentGrid ? (
            <FieldComponentGrid
              isOpen={isFieldComponentGrid}
              formMode={formMode}
              onClose={() => {
                setFieldComponentGrid(false);
              }}
              reqDataRef={mysubdtlRef}
            />
          ) : null}
        </>
      )}
    </>
  );
};

export const DynamicFormMetadataWrapper = ({
  isDataChangedRef,
  closeDialog,
  defaultView,
}) => {
  const { state: data }: any = useLocation();

  return (
    <Dialog
      open={true}
      PaperProps={{
        style: {
          width: "100%",
        },
      }}
      maxWidth="lg"
    >
      <DynamicFormMetadataConfig
        isDataChangedRef={isDataChangedRef}
        closeDialog={closeDialog}
        defaultView={defaultView}
        fieldRowData={data}
      />
    </Dialog>
  );
};

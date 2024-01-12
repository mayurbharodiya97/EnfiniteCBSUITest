import {
  FC,
  useEffect,
  useRef,
  useCallback,
  useState,
  useContext,
  Fragment,
} from "react";
import { useMutation } from "react-query";
import * as API from "./api";
import { ClearCacheContext, ClearCacheProvider } from "cache";
import { useSnackbar } from "notistack";
import {
  RetrieveFormConfigMetaData,
  RetrieveGridMetaData,
  SlipDetailFormMetaData,
  SlipJoinDetailGridMetaData,
} from "./metaData";
import { makeStyles } from "@mui/styles";
import { Theme, Dialog, Grid } from "@mui/material";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { SubmitFnType } from "packages/form";
import { AuthContext } from "pages_audit/auth";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import GridWrapper from "components/dataTableStatic";
// import { getRetrievalClearingData, getSlipJoinDetail } from "./api";
import { MyFullScreenAppBar } from "pages_audit/appBar/fullScreenAppbar";
import { Toolbar, Typography, AppBar } from "@mui/material";
import { SlipDetailForm } from "./slipDetailForm";
import { GradientButton } from "components/styledComponent/button";
import { format } from "date-fns";
import { Alert } from "components/common/alert";
import {
  FilterFormMetaType,
  FormComponentView,
} from "components/formcomponent";
import { RetrieveDataFilterForm } from "../c-kyc/metadata";
import { ActionTypes } from "components/dataTable";
import { CtsOutwardClearingForm } from "./ctsOutwardClearing";
const useTypeStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    background: "var(--theme-color5)",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--theme-color2)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
  refreshiconhover: {},
}));
const actions: ActionTypes[] = [
  {
    actionName: "view-details",
    actionLabel: "Edit Detail",
    multiple: false,
    rowDoubleClick: true,
  },
];
export const RetrieveClearing: FC<{
  onClose?: any;
  setFormMode;
  zoneTranType?: any;
}> = ({ onClose, setFormMode, zoneTranType }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { authState } = useContext(AuthContext);
  const formRef = useRef<any>(null);
  const navigate = useNavigate();
  const headerClasses = useTypeStyles();
  const setCurrentAction = useCallback(
    (data) => {
      navigate("/cbsenfinity/operation/cts-outward-clearing", {
        state: { rows: data?.rows, formMode: "view" },
      });
    },
    [navigate]
  );

  const mutation: any = useMutation(
    "getRetrievalClearingData",
    API.getRetrievalClearingData,
    {
      onSuccess: (data) => {},
      onError: (error: any) => {},
    }
  );

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    delete data["RETRIEVE"];
    if (actionFlag === "RETRIEVE") {
      data["COMP_CD"] = authState.companyID;
      data["BRANCH_CD"] = authState.user.branchCode;
      if (Boolean(data["FROM_TRAN_DT"])) {
        data["FROM_TRAN_DT"] = format(
          new Date(data["FROM_TRAN_DT"]),
          "dd/MMM/yyyy"
        );
      }
      if (Boolean(data["TO_TRAN_DT"])) {
        data["TO_TRAN_DT"] = format(
          new Date(data["TO_TRAN_DT"]),
          "dd/MMM/yyyy"
        );
      }
      // data["ZONE"] = data["ZONE"].trim();
      data = {
        ...data,
        // AMOUNT: "0",
        // SLIP_CD: "0",
        // CHEQUE_NO: "0",
        TRAN_TYPE: zoneTranType,
        CONFIRMED: "0",
      };
      mutation.mutate(data);
      endSubmit(true);
    }
  };

  if (RetrieveFormConfigMetaData?.fields?.[2]) {
    RetrieveFormConfigMetaData.fields[2].requestProps = zoneTranType ?? "";
  }
  return (
    <>
      <>
        <Dialog
          open={true}
          PaperProps={{
            style: {
              overflow: "hidden",
              // width: "60%",
              // minHeight: "35vh",
              // height: "42vh",
            },
          }}
          maxWidth="lg"
        >
          <FormWrapper
            key={`retrieveFormMetadataConfig`}
            metaData={RetrieveFormConfigMetaData as unknown as MetaDataType}
            initialValues={{}}
            onSubmitHandler={onSubmitHandler}
            formStyle={{
              background: "white",
            }}
            onFormButtonClickHandel={() => {
              let event: any = { preventDefault: () => {} };
              // if (mutation?.isLoading) {
              formRef?.current?.handleSubmit(event, "RETRIEVE");
              // }
            }}
            ref={formRef}
          >
            {({ isSubmitting, handleSubmit }) => (
              <>
                <GradientButton
                  onClick={() => {
                    onClose();
                    setFormMode("new");
                  }}
                >
                  Close
                </GradientButton>
              </>
            )}
          </FormWrapper>
          <Fragment>
            {mutation.isError && (
              <Alert
                severity="error"
                errorMsg={
                  mutation.error?.error_msg ?? "Something went to wrong.."
                }
                errorDetail={mutation.error?.error_detail}
                color="error"
              />
            )}
            {/* {mutation?.data ? ( */}
            <GridWrapper
              key={"RetrieveGridMetaData"}
              finalMetaData={RetrieveGridMetaData}
              data={mutation?.data ?? []}
              setData={() => null}
              loading={mutation.isLoading || mutation.isFetching}
              actions={actions}
              setAction={setCurrentAction}
              // refetchData={() => refetch()}
              // ref={myGridRef}
              // defaultSortOrder={[{ id: "TRAN_CD", desc: false }]}
            />
            {/* ) : null} */}
          </Fragment>
        </Dialog>
      </>
    </>
  );
};

export const RetrieveClearingForm = ({
  zoneTranType,
  onClose,
  setFormMode,
}) => {
  return (
    <ClearCacheProvider>
      <RetrieveClearing
        zoneTranType={zoneTranType}
        onClose={onClose}
        setFormMode={setFormMode}
      />
    </ClearCacheProvider>
  );
};
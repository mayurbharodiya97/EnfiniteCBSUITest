import {
  FC,
  useRef,
  useCallback,
  useContext,
  Fragment,
  useState,
  useEffect,
} from "react";
import { QueryClient, useMutation, useQueryClient } from "react-query";
import * as API from "./api";
import { RetrieveFormConfigMetaData, RetrieveGridMetaData } from "./metaData";
import { AppBar, Dialog, Toolbar, Typography } from "@mui/material";
import { AuthContext } from "pages_audit/auth";
import { format } from "date-fns";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import {
  ActionTypes,
  Alert,
  GridWrapper,
  GradientButton,
  SubmitFnType,
  FormWrapper,
  MetaDataType,
  ClearCacheProvider,
} from "@acuteinfo/common-base";
import { Route, Routes, useNavigate } from "react-router-dom";
import i18n from "components/multiLanguage/languagesConfiguration";
import { Theme } from "@mui/system";
import { makeStyles } from "@mui/styles";
import { PaySlipIssueEntry } from "../paySlipIssueEntryGrid";
import { EntryForm } from "./entryForm";
import { Payslipissueconfirmation } from "../../payslipissueconfirmation/payslipissueconfirmationGrid";
const actions: ActionTypes[] = [
  {
    actionName: "view-detail",
    actionLabel: t("ViewDetails"),
    multiple: false,
    rowDoubleClick: true,
  },
];
const useTypeStyles: any = makeStyles((theme: Theme) => ({
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
export const RetriveGridForm: FC<{
  screenFlag: string;
  headerLabel: string;
  opem: boolean;
  apiReqFlag: string;
  close(): void;
  trans_type: string;
}> = ({ screenFlag, opem, close, headerLabel, apiReqFlag, trans_type }) => {
  const headerClasses = useTypeStyles();
  const { authState } = useContext(AuthContext);
  const formRef = useRef<any>(null);
  const indexRef = useRef(0);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const retrievalParaRef = useRef<any>(null);
  const setCurrentAction = useCallback((data) => {
    if (data?.name === "view-detail") {
      indexRef.current = Number(data?.rows?.[0].id);
      navigate("view-detail", {
        state: {
          gridData: data?.rows?.[0]?.data,
          index: indexRef.current,
          formMode: "view",
        },
      });
    }
  }, []);
  const mutation: any = useMutation(
    "getRtgsRetrieveData",
    API.retRiveGridData,
    {
      onSuccess: (data) => {},
      onError: (error: any) => {},
    }
  );
  const handlePrev = useCallback(() => {
    navigate(".");
    let index = (indexRef.current -= 1);
    setTimeout(() => {
      setCurrentAction({
        name: "view-detail",
        rows: [
          {
            data: mutation?.data[index],
            id: String(index),
          },
        ],
      });
    }, 0);
    // queryClient.clear();
  }, [mutation?.data]);
  const handleNext = useCallback(() => {
    navigate(".");
    let index = indexRef.current;
    setTimeout(() => {
      setCurrentAction({
        name: "view-detail",
        rows: [
          {
            data: mutation?.data[index + 1],
            id: String(index + 1),
          },
        ],
      });
    }, 0);
    // queryClient.clear();
  }, [mutation?.data]);

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    delete data["RETRIEVE"];

    data = {
      ...data,
      A_COMP_CD: authState.companyID,
      A_ENT_BRANCH_CD: authState?.user?.branchCode,
      A_BRANCH_CD: data?.BRANCH_CD,
      A_PAYSLIP_NO: data?.PAYSLIP_NO,
      A_DEF_TRAN_CD: data?.DEF_TRAN_CD,
      A_ENTRY_MODE:
        screenFlag === "REALIZEENTRY"
          ? data?.REALIZE
          : screenFlag === "CANCELENTRY"
          ? data?.CANCEL
          : screenFlag === "STOPPAYMENT"
          ? data?.STOPPAYMENT
          : screenFlag === "CANCELCONFIRM"
          ? data?.CANCELCONFRM
          : screenFlag === "REALIZECONFIRM"
          ? data?.REALIZECONF
          : "",
      ALL_BRANCH: "Y",
      A_TRAN_TYPE: trans_type,
      A_GD_DATE: authState?.workingDate,
      A_USER: authState?.user?.id,
      A_USER_LEVEL: authState?.role,
      A_SCREEN_REF: apiReqFlag,
      A_LANG: i18n.resolvedLanguage,
    };
    mutation.mutate(data);
    endSubmit(true);
  };

  RetrieveFormConfigMetaData.form.label = headerLabel;
  RetrieveGridMetaData.gridConfig.gridLabel = "Enter Retrival Parameters";
  const handleDialogClose = () => {
    navigate(".");
    let event: any = { preventDefault: () => {} };
    formRef?.current?.handleSubmit(event, "RETRIEVE");
  };

  return (
    <>
      <>
        {apiReqFlag === "RPT/15" ? (
          <Dialog
            open={opem}
            PaperProps={{
              style: {
                overflow: "hidden",
                height: "100vh",
              },
            }}
            fullScreen
            maxWidth="xl"
          >
            <AppBar position="relative" color="secondary">
              <Toolbar
                className={headerClasses.root}
                variant="dense"
                sx={{ display: "flex", justifyContent: "end" }}
              >
                <GradientButton
                  onClick={(event) => {
                    close();
                  }}
                  color={"primary"}
                >
                  {t("close")}
                </GradientButton>
              </Toolbar>
            </AppBar>
            {<Payslipissueconfirmation />}
          </Dialog>
        ) : apiReqFlag === "RPT/14" ? (
          <Dialog
            open={opem}
            PaperProps={{
              style: {
                overflow: "hidden",
                height: "100vh",
              },
            }}
            fullScreen
            maxWidth="xl"
          >
            <AppBar position="relative" color="secondary">
              <Toolbar
                className={headerClasses.root}
                variant="dense"
                sx={{ display: "flex", justifyContent: "end" }}
              >
                <GradientButton
                  onClick={(event) => {
                    close();
                  }}
                  color={"primary"}
                >
                  {t("close")}
                </GradientButton>
              </Toolbar>
            </AppBar>
            {<PaySlipIssueEntry />}
          </Dialog>
        ) : (
          <Dialog
            open={opem}
            PaperProps={{
              style: {
                overflow: "hidden",
                height: "100vh",
              },
            }}
            fullScreen
            maxWidth="xl"
          >
            <FormWrapper
              key={`retrieveForm`}
              metaData={RetrieveFormConfigMetaData as unknown as MetaDataType}
              initialValues={{
                SCREEN_REF: screenFlag ?? "",
              }}
              onSubmitHandler={onSubmitHandler}
              formStyle={{
                background: "white",
              }}
              onFormButtonClickHandel={(id) => {
                let event: any = { preventDefault: () => {} };
                if (id === "RETRIEVE") {
                  formRef?.current?.handleSubmit(event, "RETRIEVE");
                } else if (id === "VIEW_ALL") {
                  formRef?.current?.handleSubmit(event, "VIEW_ALL");
                }
              }}
              ref={formRef}
            >
              {({ isSubmitting, handleSubmit }) => (
                <>
                  <GradientButton
                    onClick={() => {
                      close();
                    }}
                  >
                    {t("Close")}
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
              <GridWrapper
                key={"RetrieveGridMetaData"}
                finalMetaData={RetrieveGridMetaData}
                data={mutation?.data ?? []}
                hideHeader={false}
                setData={() => null}
                loading={mutation.isLoading || mutation.isFetching}
                actions={actions}
                setAction={setCurrentAction}
              />
            </Fragment>
            <Routes>
              <Route
                path="view-detail/*"
                element={
                  <EntryForm
                    onClose={handleDialogClose}
                    gridData={mutation?.data}
                    currentIndexRef={indexRef}
                    handlePrev={handlePrev}
                    handleNext={handleNext}
                    headerLabel={headerLabel}
                    screenFlag={screenFlag}
                    trans_type={trans_type}
                  />
                }
              />
            </Routes>
          </Dialog>
        )}
      </>
    </>
  );
};

export const RetrieveEntryGrid = ({
  screenFlag,
  open,
  close,
  headerLabel,
  apiReqFlag,
  trans_type,
}) => {
  return (
    <ClearCacheProvider>
      <RetriveGridForm
        opem={open}
        close={close}
        screenFlag={screenFlag}
        headerLabel={headerLabel}
        apiReqFlag={apiReqFlag}
        trans_type={trans_type}
      />
    </ClearCacheProvider>
  );
};
